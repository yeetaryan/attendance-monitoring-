import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageService } from "@/lib/storage";
import { Student } from "@/types/attendance";
import { toast } from "sonner";

interface StudentReport {
  student: Student;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}

const Reports = () => {
  const [reports, setReports] = useState<StudentReport[]>([]);

  useEffect(() => {
    generateReports();
  }, []);

  const generateReports = () => {
    const students = storageService.getStudents();
    const allRecords = storageService.getAttendanceRecords();

    const studentReports: StudentReport[] = students.map(student => {
      const studentRecords = allRecords.filter(r => r.studentId === student.id);
      const presentDays = studentRecords.filter(r => r.status === 'present').length;
      const absentDays = studentRecords.filter(r => r.status === 'absent').length;
      const totalDays = studentRecords.length;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        student,
        totalDays,
        presentDays,
        absentDays,
        percentage,
      };
    });

    setReports(studentReports);
  };

  const handleDownloadReport = () => {
    const csvContent = [
      ['Roll Number', 'Student Name', 'Total Days', 'Present', 'Absent', 'Attendance %'],
      ...reports.map(r => [
        r.student.rollNo,
        r.student.name,
        r.totalDays,
        r.presentDays,
        r.absentDays,
        `${r.percentage}%`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 50) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Attendance Reports</h2>
          <p className="text-muted-foreground">View and download attendance statistics</p>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Student Attendance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found. Start marking attendance to see reports.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Total Days</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.student.id}>
                      <TableCell className="font-medium">{report.student.rollNo}</TableCell>
                      <TableCell>{report.student.name}</TableCell>
                      <TableCell className="text-center">{report.totalDays}</TableCell>
                      <TableCell className="text-center text-success font-semibold">
                        {report.presentDays}
                      </TableCell>
                      <TableCell className="text-center text-destructive font-semibold">
                        {report.absentDays}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getPercentageColor(report.percentage)}`}>
                        {report.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
