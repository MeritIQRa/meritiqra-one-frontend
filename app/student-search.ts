import type {ReportRow} from './performance-report';
/** Admission numbers stay strings: leading zeros are significant. */
export function matchesStudent(student:ReportRow|undefined,query:string){
 const q=query.trim().toLocaleLowerCase();
 return !q||!!student&&[student.name,student.admissionNumber,student.id,student.coreStudentId,...(student.coreStudentIds||[])].filter(v=>v!=null).some(v=>String(v).toLocaleLowerCase().includes(q));
}
