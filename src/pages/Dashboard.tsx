import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { storageService } from "@/lib/storage";
import { AttendanceStats } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    averageAttendance: 0,
  });

  useEffect(() => {
    const students = storageService.getStudents();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = storageService.getAttendanceForDate(today);
    
    const presentCount = todayRecords.filter(r => r.status === 'present').length;
    const absentCount = todayRecords.filter(r => r.status === 'absent').length;
    
    // Calculate average attendance
    const allRecords = storageService.getAttendanceRecords();
    const totalRecords = allRecords.length;
    const totalPresent = allRecords.filter(r => r.status === 'present').length;
    const avgAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

    setStats({
      totalStudents: students.length,
      presentToday: presentCount,
      absentToday: absentCount,
      averageAttendance: avgAttendance,
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your attendance system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserX}
          variant="warning"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${stats.averageAttendance}%`}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Add Students</h4>
              <p className="text-sm text-muted-foreground">Go to the Students page to add your students to the system.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Mark Attendance</h4>
              <p className="text-sm text-muted-foreground">Use the Mark Attendance page to record daily attendance.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-foreground">View Reports</h4>
              <p className="text-sm text-muted-foreground">Generate and view attendance reports from the Reports page.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
