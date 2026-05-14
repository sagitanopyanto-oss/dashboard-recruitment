export interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Assessment' | 'Offer' | 'Medical' | 'Hired' | 'Rejected';
  avatar: string;
  appliedDate: string;
  rating: number;
  interviewDate: string;
  assessmentDate: string;
  offerDate: string;
  medicalDate: string;
  hiredDate: string;
  cvData: string;
  cvFileName: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  postedDate: string;
  status: 'Active' | 'Closed' | 'Draft';
  minSalary: number;
  maxSalary: number;
  hiddenSalary: boolean;
}

export interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'Phone Screen' | 'Technical' | 'HR' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  interviewer: string;
}

export interface SLAConfig {
  stage: string;
  slaDays: number;
  color: string;
}

export const slaConfig: SLAConfig[] = [
  { stage: 'Applied',     slaDays: 3,  color: '#6366f1' },
  { stage: 'Screening',   slaDays: 5,  color: '#8b5cf6' },
  { stage: 'Interview',   slaDays: 7,  color: '#a78bfa' },
  { stage: 'Assessment',  slaDays: 5,  color: '#f59e0b' },
  { stage: 'Offer',       slaDays: 3,  color: '#22c55e' },
  { stage: 'Medical',     slaDays: 5,  color: '#06b6d4' },
  { stage: 'Hired',       slaDays: 0,  color: '#10b981' },
];

const dummyPdfBase64 = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSPj4Kc3RyZWFtCkJUCjEyIDAgMCAxMiAxMCA3NTAgVG0KL0YxIDEgVGYKKEN1cnJpY3VsdW0gVml0YWUpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMyAwIG9iago0OAplbmRvYmoKMSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDQgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4vTWVkaWFCb3hbMCAwIDU5NSA4NDJdL0NvbnRlbnRzIDIgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9QYWdlcy9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+L01lZGlhQm94WzAgMCA1OTUgODQyXS9LaWRzWzEgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCjcgMCBvYmoKPDwvUHJvZHVjZXIoanNQREYgMS4wKS9DcmVhdGlvbkRhdGUoRDoyMDI0MDExNTEwMDAwMFopPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDEzNCAwMDAwMCBuIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI1MSAwMDAwMCBuIAowMDAwMDAwMzU5IDAwMDAwIG4gCjAwMDAwMDA0MjcgMDAwMDAgbiAKMDAwMDAwMDQ3NSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgOC9Sb290IDYgMCBSL0luZm8gNyAwIFI+PgpzdGFydHhyZWYKNTUxCiUlRU9G';

export const candidates: Candidate[] = [
  { id: 1,  name: 'Andi Pratama',      email: 'andi@email.com',   position: 'Frontend Developer', department: 'Engineering',      stage: 'Interview',   avatar: 'AP', appliedDate: '2024-01-15', rating: 4.5, interviewDate: '2024-01-25', assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Andi_Pratama.pdf' },
  { id: 2,  name: 'Siti Rahayu',       email: 'siti@email.com',   position: 'UX Designer',        department: 'Design',           stage: 'Assessment',  avatar: 'SR', appliedDate: '2024-01-18', rating: 4.8, interviewDate: '2024-01-22', assessmentDate: '2024-01-28', offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Siti_Rahayu.pdf' },
  { id: 3,  name: 'Budi Santoso',      email: 'budi@email.com',   position: 'Backend Developer',  department: 'Engineering',      stage: 'Offer',       avatar: 'BS', appliedDate: '2024-01-10', rating: 4.2, interviewDate: '2024-01-16', assessmentDate: '2024-01-20', offerDate: '2024-01-26', medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Budi_Santoso.pdf' },
  { id: 4,  name: 'Dewi Lestari',      email: 'dewi@email.com',   position: 'Product Manager',    department: 'Product',          stage: 'Screening',   avatar: 'DL', appliedDate: '2024-01-20', rating: 4.0, interviewDate: '',           assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Dewi_Lestari.pdf' },
  { id: 5,  name: 'Rizky Firmansyah',  email: 'rizky@email.com',  position: 'DevOps Engineer',    department: 'Engineering',      stage: 'Applied',     avatar: 'RF', appliedDate: '2024-01-22', rating: 3.8, interviewDate: '',           assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Rizky_Firmansyah.pdf' },
  { id: 6,  name: 'Maya Putri',        email: 'maya@email.com',   position: 'Data Analyst',       department: 'Analytics',        stage: 'Interview',   avatar: 'MP', appliedDate: '2024-01-12', rating: 4.6, interviewDate: '2024-01-24', assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Maya_Putri.pdf' },
  { id: 7,  name: 'Fajar Nugroho',     email: 'fajar@email.com',  position: 'Frontend Developer', department: 'Engineering',      stage: 'Hired',       avatar: 'FN', appliedDate: '2024-01-05', rating: 4.9, interviewDate: '2024-01-10', assessmentDate: '2024-01-14', offerDate: '2024-01-18', medicalDate: '2024-01-22', hiredDate: '2024-01-25', cvData: dummyPdfBase64, cvFileName: 'CV_Fajar_Nugroho.pdf' },
  { id: 8,  name: 'Linda Wijaya',      email: 'linda@email.com',  position: 'HR Specialist',      department: 'Human Resources',  stage: 'Screening',   avatar: 'LW', appliedDate: '2024-01-19', rating: 4.1, interviewDate: '',           assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Linda_Wijaya.pdf' },
  { id: 9,  name: 'Ahmad Rizki',       email: 'ahmad@email.com',  position: 'Mobile Developer',   department: 'Engineering',      stage: 'Rejected',    avatar: 'AR', appliedDate: '2024-01-08', rating: 3.2, interviewDate: '2024-01-12', assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Ahmad_Rizki.pdf' },
  { id: 10, name: 'Nadia Kusuma',      email: 'nadia@email.com',  position: 'Marketing Manager',  department: 'Marketing',        stage: 'Assessment',  avatar: 'NK', appliedDate: '2024-01-16', rating: 4.4, interviewDate: '2024-01-21', assessmentDate: '2024-01-27', offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Nadia_Kusuma.pdf' },
  { id: 11, name: 'Dimas Prasetyo',    email: 'dimas@email.com',  position: 'Backend Developer',  department: 'Engineering',      stage: 'Applied',     avatar: 'DP', appliedDate: '2024-01-23', rating: 4.0, interviewDate: '',           assessmentDate: '',           offerDate: '',           medicalDate: '',           hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Dimas_Prasetyo.pdf' },
  { id: 12, name: 'Rina Sari',         email: 'rina@email.com',   position: 'QA Engineer',        department: 'Engineering',      stage: 'Medical',     avatar: 'RS', appliedDate: '2024-01-14', rating: 4.3, interviewDate: '2024-01-18', assessmentDate: '2024-01-22', offerDate: '2024-01-26', medicalDate: '2024-01-29', hiredDate: '', cvData: dummyPdfBase64, cvFileName: 'CV_Rina_Sari.pdf' },
];

export const jobs: Job[] = [
  { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Jakarta',  type: 'Full-time', applicants: 45, postedDate: '2024-01-10', status: 'Active', minSalary: 25000000, maxSalary: 35000000, hiddenSalary: false },
  { id: 2, title: 'UX/UI Designer',            department: 'Design',      location: 'Remote',   type: 'Full-time', applicants: 32, postedDate: '2024-01-12', status: 'Active', minSalary: 20000000, maxSalary: 28000000, hiddenSalary: false },
  { id: 3, title: 'Backend Engineer',           department: 'Engineering', location: 'Jakarta',  type: 'Full-time', applicants: 28, postedDate: '2024-01-08', status: 'Active', minSalary: 28000000, maxSalary: 40000000, hiddenSalary: true },
  { id: 4, title: 'Product Manager',            department: 'Product',     location: 'Jakarta',  type: 'Full-time', applicants: 56, postedDate: '2024-01-05', status: 'Active', minSalary: 30000000, maxSalary: 45000000, hiddenSalary: false },
  { id: 5, title: 'DevOps Engineer',            department: 'Engineering', location: 'Remote',   type: 'Contract',  applicants: 18, postedDate: '2024-01-15', status: 'Active', minSalary: 35000000, maxSalary: 50000000, hiddenSalary: true },
  { id: 6, title: 'Data Scientist',             department: 'Analytics',   location: 'Jakarta',  type: 'Full-time', applicants: 41, postedDate: '2024-01-03', status: 'Closed', minSalary: 30000000, maxSalary: 45000000, hiddenSalary: false },
  { id: 7, title: 'Mobile Developer (iOS)',      department: 'Engineering', location: 'Jakarta',  type: 'Full-time', applicants: 22, postedDate: '2024-01-18', status: 'Active', minSalary: 25000000, maxSalary: 35000000, hiddenSalary: false },
  { id: 8, title: 'Marketing Specialist',       department: 'Marketing',   location: 'Bandung',  type: 'Full-time', applicants: 67, postedDate: '2024-01-01', status: 'Active', minSalary: 15000000, maxSalary: 22000000, hiddenSalary: false },
];

export const interviews: Interview[] = [
  { id: 1, candidateName: 'Andi Pratama',  position: 'Frontend Developer', date: '2024-01-25', time: '10:00', type: 'Technical',    status: 'Scheduled', interviewer: 'Pak Hendra' },
  { id: 2, candidateName: 'Maya Putri',    position: 'Data Analyst',       date: '2024-01-25', time: '14:00', type: 'HR',           status: 'Scheduled', interviewer: 'Bu Sarah' },
  { id: 3, candidateName: 'Rina Sari',     position: 'QA Engineer',        date: '2024-01-26', time: '09:00', type: 'Technical',    status: 'Scheduled', interviewer: 'Pak Agus' },
  { id: 4, candidateName: 'Siti Rahayu',   position: 'UX Designer',        date: '2024-01-24', time: '11:00', type: 'Final',        status: 'Completed', interviewer: 'Bu Diana' },
  { id: 5, candidateName: 'Nadia Kusuma',  position: 'Marketing Manager',  date: '2024-01-26', time: '15:00', type: 'HR',           status: 'Scheduled', interviewer: 'Pak Bambang' },
  { id: 6, candidateName: 'Dewi Lestari',  position: 'Product Manager',    date: '2024-01-27', time: '10:00', type: 'Phone Screen', status: 'Scheduled', interviewer: 'Pak Hendra' },
];

export const monthlyApplications = [
  { month: 'Aug', applications: 120, hires: 8 },
  { month: 'Sep', applications: 145, hires: 12 },
  { month: 'Oct', applications: 132, hires: 10 },
  { month: 'Nov', applications: 168, hires: 14 },
  { month: 'Dec', applications: 155, hires: 11 },
  { month: 'Jan', applications: 189, hires: 16 },
];

export const departmentData = [
  { name: 'Engineering', hires: 45, openings: 12 },
  { name: 'Design',      hires: 12, openings: 4 },
  { name: 'Product',     hires: 8,  openings: 3 },
  { name: 'Marketing',   hires: 15, openings: 6 },
  { name: 'Analytics',   hires: 10, openings: 2 },
  { name: 'HR',          hires: 5,  openings: 2 },
];
