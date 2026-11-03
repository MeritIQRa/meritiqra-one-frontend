type YearRow={id:string;[key:string]:any};
export function resolveReportYear(rows:Record<string,YearRow[]>,studentId:string,selectedYear:string):string{
 if(!selectedYear)throw Error('Choose one academic year before downloading the performance PDF.');
 const student=rows.students?.find(s=>s.id===studentId);
 if(!student)throw Error('Select a student before downloading.');
 const years=rows.years||[];
 const ids=new Set((rows['exam-results']||[]).filter(r=>r.studentId===studentId&&r.schoolId===student.schoolId&&(r.academicYear||years.find(y=>y.id===r.yearId)?.name)===selectedYear).map(r=>r.yearId));
 const candidates=years.filter(y=>y.schoolId===student.schoolId&&ids.has(y.id));
 if(candidates.length!==1)throw Error('Results do not identify a single academic year. Ask the examination administrator to review the year links.');
 return candidates[0].id;
}
