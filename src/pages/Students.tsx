import { useState, useEffect } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageService } from "@/lib/storage";
import { Student } from "@/types/attendance";
import { toast } from "sonner";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(storageService.getStudents());
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudent.name.trim() || !newStudent.rollNo.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name.trim(),
      rollNo: newStudent.rollNo.trim(),
    };

    storageService.addStudent(student);
    setNewStudent({ name: '', rollNo: '' });
    loadStudents();
    toast.success("Student added successfully");
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      storageService.deleteStudent(id);
      loadStudents();
      toast.success("Student deleted successfully");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Student Management</h2>
        <p className="text-muted-foreground">Add and manage your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Student</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStudent} className="flex gap-4 flex-wrap">
            <Input
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="flex-1 min-w-[200px]"
            />
            <Input
              placeholder="Roll Number"
              value={newStudent.rollNo}
              onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
              className="flex-1 min-w-[200px]"
            />
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students added yet. Add your first student above!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
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

export default Students;
