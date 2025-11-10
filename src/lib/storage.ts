import { Student, AttendanceRecord } from '@/types/attendance';

const STORAGE_KEYS = {
  STUDENTS: 'attendance_students',
  RECORDS: 'attendance_records',
};

export const storageService = {
  // Students
  getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  addStudent(student: Student): void {
    const students = this.getStudents();
    students.push(student);
    this.saveStudents(students);
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(students);
    // Also delete associated attendance records
    const records = this.getAttendanceRecords().filter(r => r.studentId !== id);
    this.saveAttendanceRecords(records);
  },

  // Attendance Records
  getAttendanceRecords(): AttendanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveAttendanceRecords(records: AttendanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  markAttendance(studentId: string, date: string, status: 'present' | 'absent'): void {
    const records = this.getAttendanceRecords();
    const existingIndex = records.findIndex(
      r => r.studentId === studentId && r.date === date
    );

    if (existingIndex >= 0) {
      records[existingIndex].status = status;
    } else {
      records.push({
        id: `${studentId}-${date}`,
        studentId,
        date,
        status,
      });
    }

    this.saveAttendanceRecords(records);
  },

  getAttendanceForDate(date: string): AttendanceRecord[] {
    return this.getAttendanceRecords().filter(r => r.date === date);
  },

  getAttendanceForStudent(studentId: string): AttendanceRecord[] {
    return this.getAttendanceRecords().filter(r => r.studentId === studentId);
  },
};
