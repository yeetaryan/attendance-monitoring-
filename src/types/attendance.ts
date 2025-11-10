export interface Student {
  id: string;
  name: string;
  rollNo: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  averageAttendance: number;
}
