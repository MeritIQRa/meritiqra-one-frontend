import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
export type ReportRow = {id:string; [key:string]:any};
export function performanceReport(rows:Record<string,ReportRow[]>,studentId:string,yearId:string){
 const student=rows.students?.find(s=>s.id===studentId),year=rows.years?.find(y=>y.id===yearId);
 if(!student||!year)throw Error('Select a student and an academic year before downloading.');
 const school=rows.schools?.find(s=>s.id===student.schoolId);
 if(year.schoolId!==student.schoolId)throw Error('The academic year must belong to the student school.');
 const exams=new Map((rows['exam-requests']||[]).map(e=>[e.id,e]));
 const subjects=new Map((rows.subjects||[]).map(s=>[s.id,s.name]));
 const results=(rows['exam-results']||[]).filter(r=>r.studentId===studentId&&r.schoolId===student.schoolId&&r.yearId===yearId&&r.publicationStatus==='PUBLISHED');
 if(!results.length)throw Error('No published results for this student and academic year.');
 const doc=new jsPDF();const navy:[number,number,number]=[23,35,59],teal:[number,number,number]=[0,113,120];
 const clean=(v:unknown)=>String(v??'Not recorded').replace(/[–—]/g,'-');
 {
 // A vector dashboard stays sharp when printed and keeps chart values selectable.
 const ink:[number,number,number]=[25,35,65],purple:[number,number,number]=[101,78,221],muted:[number,number,number]=[105,117,140];
 const text=(v:string,x:number,y:number,size=10,color=ink)=>{doc.setTextColor(...color);doc.setFontSize(size);doc.text(v,x,y);};
 const card=(x:number,y:number,w:number,h:number)=>{doc.setFillColor(255,255,255);doc.setDrawColor(229,234,243);doc.roundedRect(x,y,w,h,4,4,'FD');};
 const valid=results.filter(r=>!['ABSENT','WITHHELD'].includes(r.resultStatus)&&Number.isFinite(Number(r.marksObtained))&&Number(r.maximumMarks)>0&&Number(r.marksObtained)>=0&&Number(r.marksObtained)<=Number(r.maximumMarks));
 const pct=(r:ReportRow)=>Number(r.marksObtained)/Number(r.maximumMarks)*100;
 const subjectStats=[...new Set(valid.map(r=>r.subjectId))].map(id=>{const group=valid.filter(r=>r.subjectId===id);return {name:clean(subjects.get(id)),score:group.reduce((n,r)=>n+pct(r),0)/group.length};}).sort((a,b)=>b.score-a.score);
 const cycleStats=[...new Set(valid.map(r=>r.examId))].map(id=>{const group=valid.filter(r=>r.examId===id);return {name:clean(exams.get(id)?.title||group[0].examType),date:exams.get(id)?.examDate,score:group.reduce((n,r)=>n+pct(r),0)/group.length};}).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
 const att=(rows.attendance||[]).filter(a=>a.studentId===studentId&&a.schoolId===student.schoolId&&year.startDate&&year.endDate&&a.date>=year.startDate&&a.date<=year.endDate);
 const present=att.filter(a=>['PRESENT','LATE'].includes(a.status)).length,rate=att.length?present/att.length:0;
 doc.setFillColor(245,247,252);doc.rect(0,0,210,297,'F');doc.setFillColor(...ink);doc.rect(0,0,210,59,'F');
 text('MERITIQRA ONE   /   LEARNING INSIGHTS',14,13,9,[182,195,237]);
 text('Your learning, in focus.',14,29,25,[255,255,255]);text(clean(student.name)+'  /  '+clean(year.name),14,41,13,[255,255,255]);
 text(clean(school?.name),14,51,10,[182,195,237]);
 const mean=valid.length?valid.reduce((n,r)=>n+pct(r),0)/valid.length:0;
 const metrics=[['ASSESSMENT AVERAGE',valid.length?mean.toFixed(1)+'%':'N/A','Unweighted assessment scores'],['SUBJECTS ASSESSED',String(subjectStats.length),`${valid.length} scored subject records`],['RECORDED ATTENDANCE',att.length?(rate*100).toFixed(1)+'%':'N/A',`${present} attended / ${att.length} entries`]];
 metrics.forEach((m,i)=>{const x=14+i*62;card(x,66,58,34);text(m[0],x+5,75,7,muted);text(m[1],x+5,87,23,i===1?purple:teal);text(m[2],x+5,95,7,muted);});
 card(14,107,112,87);text('Subject strengths',20,118,13);text('Mean score (%) across recorded assessments',20,125,8,muted);
 subjectStats.slice(0,6).forEach((s,i)=>{const y=135+i*9; text(s.name.slice(0,22),20,y,8);doc.setFillColor(235,238,246);doc.roundedRect(59,y-3,48,3,1,1,'F');doc.setFillColor(...(i===0?teal:purple));doc.roundedRect(59,y-3,48*s.score/100,3,1,1,'F');text(s.score.toFixed(0)+'%',111,y,8);});
 if(subjectStats.length>6)text('Top 6 shown; all subjects appear in the detailed record.',20,190,7,muted);
 card(132,107,64,87);text('Attendance pulse',138,118,12);
 doc.setLineWidth(5);doc.setDrawColor(232,237,245);doc.circle(164,145,16,'S');
 doc.setDrawColor(...teal);for(let i=0;i<Math.round(rate*100);i++){const a=(-90+i*3.6)*Math.PI/180,b=(-90+(i+1)*3.6)*Math.PI/180;doc.line(164+16*Math.cos(a),145+16*Math.sin(a),164+16*Math.cos(b),145+16*Math.sin(b));}doc.setLineWidth(.2);
 text(att.length?`${(rate*100).toFixed(0)}%`:'N/A',155,148,18);text('Present + late / recorded entries',137,171,7,muted);text('Missing days are not inferred.',137,179,7,muted);text(`Absent: ${att.filter(a=>a.status==='ABSENT').length}   Excused: ${att.filter(a=>a.status==='EXCUSED').length}`,137,187,7);
 card(14,201,112,64);text('Assessment comparison',20,212,12);
 const cycles=cycleStats.slice(0,6);const dated=cycles.every(c=>c.date);
 text(dated?'Exam-date order | different tests may vary in difficulty':'Dates unavailable | comparison, not a chronological trend',20,219,7,muted);
 [0,50,100].forEach(t=>{const y=251-t*.24;doc.setDrawColor(230,234,242);doc.line(29,y,117,y);text(String(t),20,y+1,6,muted);});
 cycles.forEach((c,i)=>{const x=cycles.length===1?72:32+i*80/(cycles.length-1),y=251-c.score*.24;if(i&&dated){const previous=cycles[i-1];doc.setDrawColor(...purple);doc.setLineWidth(.7);doc.line(32+(i-1)*80/(cycles.length-1),251-previous.score*.24,x,y);}doc.setFillColor(...purple);doc.circle(x,y,1.5,'F');text(c.score.toFixed(0)+'%',x-3,y-3,7,purple);text(String(i+1),x-1,256,7,muted);});doc.setLineWidth(.2);
 text('Exam numbers follow the columns in the marks register. First 6 shown.',20,262,6,muted);
 card(132,201,64,64);text('Focus for next term',138,212,11);
 const strongest=subjectStats[0],focus=subjectStats[subjectStats.length-1];
 text('STRONGEST RECORDED SUBJECT',138,222,6,teal);text(strongest?.name||'Not available',138,229,9);
 text('RELATIVE PRACTICE PRIORITY',138,241,6,purple);text(focus?.name||'Not available',138,248,9);
 text('Relative scores; teacher review required.',138,259,6,muted);
 text('Overview is descriptive, not an official grade or promotion decision. Detailed evidence follows.',14,274,7,muted);
 doc.addPage();
 }
 const ink:[number,number,number]=[23,35,59],muted:[number,number,number]=[102,116,136];
 const text=(v:string,x:number,y:number,size=9,color=ink)=>{doc.setTextColor(...color);doc.setFontSize(size);doc.text(v,x,y);};
 const valid=results.filter(r=>!['ABSENT','WITHHELD'].includes(r.resultStatus)&&Number.isFinite(Number(r.marksObtained))&&Number(r.maximumMarks)>0&&Number(r.marksObtained)>=0&&Number(r.marksObtained)<=Number(r.maximumMarks));
 const pct=(r:ReportRow)=>Number(r.marksObtained)/Number(r.maximumMarks)*100;
 const ids=[...new Set(results.map(r=>r.examId))].sort((a,b)=>String(exams.get(a)?.examDate||'').localeCompare(String(exams.get(b)?.examDate||'')));
 const subjectIds=[...new Set(results.map(r=>r.subjectId))];
 const att=(rows.attendance||[]).filter(a=>a.studentId===studentId&&a.schoolId===student.schoolId&&year.startDate&&year.endDate&&a.date>=year.startDate&&a.date<=year.endDate);
 const present=att.filter(a=>['PRESENT','LATE'].includes(a.status)).length;
 const klass=rows.classes?.find(c=>c.id===student.classId);
 doc.setFillColor(...navy);doc.rect(0,0,210,28,'F');text(clean(school?.name),12,11,16,[255,255,255]);text('ANNUAL MARKS REGISTER / SUBJECT x EXAM',12,20,9,[192,215,243]);doc.setTextColor(255,255,255);doc.setFontSize(9);doc.text(clean(year.name),198,20,{align:'right',maxWidth:75});
 autoTable(doc,{startY:31,theme:'plain',body:[[clean(student.name), 'Admission: '+clean(student.admissionNumber),'Class: '+clean(klass?.name)+' / '+clean(klass?.section)],['Guardian: '+clean(student.guardianName),'Academic year: '+clean(year.name),'Published results only']],styles:{fontSize:8,cellPadding:2},margin:{left:12,right:12}});
 let y=(doc as any).lastAutoTable.finalY+7;
 text('01  /  COMPLETE ACADEMIC MARKS REGISTER',12,y,10,teal);y+=4;
 // Split wide academic years into readable blocks rather than dropping exams.
 for(let offset=0;offset<ids.length;offset+=6){const group=ids.slice(offset,offset+6);
 autoTable(doc,{startY:y,head:[['Subject',...group.map(id=>clean(exams.get(id)?.title||results.find(r=>r.examId===id)?.examType)+'\n'+clean(exams.get(id)?.mode))]],body:subjectIds.map(id=>[clean(subjects.get(id)),...group.map(examId=>{const matches=results.filter(r=>r.subjectId===id&&r.examId===examId);return matches.length?matches.map(r=>['ABSENT','WITHHELD'].includes(r.resultStatus)?r.resultStatus:`${r.marksObtained} / ${r.maximumMarks}\n${clean(r.grade)}`).join('\n'):'Not recorded';})]),styles:{fontSize:8,cellPadding:2.5,halign:'center'},columnStyles:{0:{cellWidth:35,halign:'left'}},headStyles:{fillColor:navy},alternateRowStyles:{fillColor:[244,247,252]},margin:{left:12,right:12,top:15,bottom:20}});y=(doc as any).lastAutoTable.finalY+6;}
 const validForFocus=valid;
 const ranked=subjectIds.map(id=>{const values=validForFocus.filter(r=>r.subjectId===id);return {name:clean(subjects.get(id)),score:values.length?values.reduce((n,r)=>n+pct(r),0)/values.length:null};}).filter(s=>s.score!==null).sort((a,b)=>Number(b.score)-Number(a.score));
 if(y>220){doc.addPage();y=18;}
 text('02  /  DEVELOPMENT & TEACHER REVIEW',12,y,10,teal);y+=4;
 autoTable(doc,{startY:y,body:[['Relative strength',ranked[0]?.name||'Not assessed','Practice focus',ranked[ranked.length-1]?.name||'Not assessed'],['Teacher observations',results.map(r=>r.remarks).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')||'Not recorded','',''],['Activities / competencies','Not assessed in current records','Conduct / wellbeing','Not assessed in current records'],['Core assessments','Core online/offline results are not yet consolidated in this report.','','']],styles:{fontSize:7,cellPadding:2.5},columnStyles:{0:{cellWidth:31,textColor:teal},2:{cellWidth:27,textColor:teal}},alternateRowStyles:{fillColor:[244,247,252]},margin:{left:12,right:12,top:15,bottom:20}});
 y=(doc as any).lastAutoTable.finalY+7;if(y>259){doc.addPage();y=20;}
 text('Class teacher: __________________    Principal: __________________    Guardian: __________________',12,y,7);
 text('Grades follow institution policy. Not recorded does not mean zero. No promotion decision is inferred.',12,y+6,6,muted);
 const pages=doc.getNumberOfPages();for(let p=1;p<=pages;p++){doc.setPage(p);doc.setDrawColor(220);doc.line(16,282,194,282);doc.setTextColor(100);doc.setFontSize(8);doc.text(`Confidential student record | Generated ${new Date().toISOString().slice(0,10)}`,16,288);doc.text(`${p} / ${pages}`,194,288,{align:'right'});}
 return doc;
}
