export type ImportStudent={id:string;name:string;admissionNumber:string};
export type ImportRow={studentId:string;admissionNumber:string;name:string;marks:string;status:string;grade:string;remarks:string;row:number};
export function parseCsv(input:string):string[][]{
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<input.length;i++){const c=input[i];if(c==='"'){if(quoted&&input[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('CSV contains an unclosed quoted field.');if(cell||row.length){row.push(cell);rows.push(row);}return rows;
}
export function validateImport(table:string[][],students:ImportStudent[],kind:'marks'|'attendance',maximum:number,limits:Record<string,number>={}){
 const errors:string[]=[],entries:ImportRow[]=[];
 if(table.length>501)return {errors:['Maximum 500 student rows per class import.'],entries};
 const header=(table[0]||[]).map(v=>v.replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[ _-]/g,''));
 for(const required of ['admissionnumber',...(kind==='marks'?['marks']:['status'])])if(!header.includes(required))errors.push(`Missing column: ${required}`);
 if(new Set(header).size!==header.length)errors.push('Duplicate column headings.');
 if(errors.length)return {errors,entries};
 const seen=new Set<string>();
 table.slice(1).forEach((cells,i)=>{if(cells.every(c=>!c.trim()))return;const get=(name:string)=>(cells[header.indexOf(name)]||'').trim();const admission=get('admissionnumber'),matches=students.filter(s=>String(s.admissionNumber).trim()===admission),prefix=`Row ${i+2} (${admission||'missing admission'}): `;
  if(!admission||matches.length!==1){errors.push(prefix+'student is unknown or ambiguous in this class.');return;}
  if(seen.has(admission)){errors.push(prefix+'duplicate student.');return;}seen.add(admission);
  const marks=get('marks'),status=get('status').toUpperCase()||(kind==='marks'?'RECORDED':'');
  if((kind==='marks'?!['RECORDED','PASS','FAIL','ABSENT','WITHHELD'].includes(status):!['PRESENT','ABSENT','LATE','EXCUSED','NOT_MARKED'].includes(status))){errors.push(prefix+'invalid status.');return;}
  const limit=limits[matches[0].id]??maximum;
  if(kind==='marks'&&status!=='ABSENT'&&(marks===''||!Number.isFinite(Number(marks))||Number(marks)<0||Number(marks)>limit)){errors.push(prefix+`marks must be between 0 and ${limit}; blank is not zero.`);return;}
  if(get('remarks').length>500||get('grade').length>20){errors.push(prefix+'remarks or grade is too long.');return;}
  entries.push({studentId:matches[0].id,admissionNumber:admission,name:matches[0].name,marks:status==='ABSENT'?'0':marks,status,grade:get('grade'),remarks:get('remarks'),row:i+2});
 });
 if(!entries.length&&!errors.length)errors.push('No student entries found.');return {entries,errors};
}
// Bound ZIP expansion before ExcelJS parses an uploaded workbook.
export function validateWorkbookSize(buffer:ArrayBuffer){
 const view=new DataView(buffer);let end=-1;
 for(let i=buffer.byteLength-22;i>=Math.max(0,buffer.byteLength-65557);i--)if(view.getUint32(i,true)===0x06054b50){end=i;break;}
 if(end<0)throw Error('Invalid XLSX archive.');
 const count=view.getUint16(end+10,true);let position=view.getUint32(end+16,true),expanded=0;
 if(count>1000||count===65535)throw Error('Workbook has too many internal entries.');
 for(let i=0;i<count;i++){if(position+46>buffer.byteLength||view.getUint32(position,true)!==0x02014b50)throw Error('Invalid XLSX archive directory.');expanded+=view.getUint32(position+24,true);if(expanded>20*1024*1024)throw Error('Expanded workbook exceeds 20 MB. Use the class template.');position+=46+view.getUint16(position+28,true)+view.getUint16(position+30,true)+view.getUint16(position+32,true);}
}
