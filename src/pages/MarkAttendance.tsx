import { useState, useEffect } from "react";
import { Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storageService } from "@/lib/storage";
import { Student } from "@/types/attendance";
import { toast } from "sonner";

const MarkAttendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadAttendanceForDate();
  }, [selectedDate, students]);

  const loadStudents = () => {
    setStudents(storageService.getStudents());
  };

  const loadAttendanceForDate = () => {
    const records = storageService.getAttendanceForDate(selectedDate);
    const attendanceMap: Record<string, 'present' | 'absent'> = {};
    
    records.forEach(record => {
      attendanceMap[record.studentId] = record.status;
    });
    
    setAttendance(attendanceMap);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSaveAttendance = () => {
    Object.entries(attendance).forEach(([studentId, status]) => {
      storageService.markAttendance(studentId, selectedDate, status);
    });
    
    toast.success("Attendance saved successfully");
  };

  const handleMarkAllPresent = () => {
    const allPresent: Record<string, 'present' | 'absent'> = {};
    students.forEach(student => {
      allPresent[student.id] = 'present';
    });
    setAttendance(allPresent);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mark Attendance</h2>
        <p className="text-muted-foreground">Record daily attendance for your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button onClick={handleMarkAllPresent} variant="secondary">
              Mark All Present
            </Button>
            <Button onClick={handleSaveAttendance} className="gap-2">
              <Save className="h-4 w-4" />
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No students found. Please add students first.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAttendance(student.id)}
                      className={attendance[student.id] === 'present' ? 'bg-success hover:bg-success/90' : ''}
                    >
                      Present
                    </Button>
                    <Button
                      variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setAttendance(prev => ({
                          ...prev,
                          [student.id]: 'absent',
                        }));
                      }}
                      className={attendance[student.id] === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkAttendance;
