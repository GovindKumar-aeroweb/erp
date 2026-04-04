import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type ClassRow = { id: string; name: string; numeric_value: number | null };
type SectionRow = { id: string; class_id: string; name: string };
type StudentRow = {
  id: string;
  school_id: string;
  admission_number: string;
  roll_number: string | null;
  first_name: string;
  last_name: string;
  parent_name: string | null;
  parent_phone: string | null;
  status: string;
  class_id: string | null;
  section_id: string | null;
  created_at?: string;
};

export function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    admission_number: "",
    roll_number: "",
    first_name: "",
    last_name: "",
    class_id: "",
    section_id: "",
    parent_name: "",
    parent_phone: "",
  });

  const canView = !!user && ["super_admin", "school_admin", "principal", "teacher"].includes(user.role);
  const canManage = !!user && ["super_admin", "school_admin", "principal"].includes(user.role);

  useEffect(() => {
    if (!user?.school_id || !canView) return;
    void loadAll();
  }, [user?.school_id]);

  const loadAll = async () => {
    if (!user?.school_id) return;
    try {
      setLoading(true);
      const [studentsRes, classesRes, sectionsRes] = await Promise.all([
        supabase
          .from("students")
          .select("id, school_id, admission_number, roll_number, first_name, last_name, parent_name, parent_phone, status, class_id, section_id, created_at")
          .eq("school_id", user.school_id)
          .order("created_at", { ascending: false }),
        supabase
          .from("classes")
          .select("id, name, numeric_value")
          .eq("school_id", user.school_id)
          .order("numeric_value", { ascending: true }),
        supabase
          .from("sections")
          .select("id, class_id, name")
          .eq("school_id", user.school_id)
          .order("name", { ascending: true }),
      ]);
      if (studentsRes.error) throw studentsRes.error;
      if (classesRes.error) throw classesRes.error;
      if (sectionsRes.error) throw sectionsRes.error;
      setStudents((studentsRes.data as StudentRow[]) || []);
      setClasses((classesRes.data as ClassRow[]) || []);
      setSections((sectionsRes.data as SectionRow[]) || []);
    } catch (error) {
      console.error("Error loading students page data:", error);
      toast.error("Could not load students.");
    } finally {
      setLoading(false);
    }
  };

  const visibleSections = useMemo(
    () => (newStudent.class_id ? sections.filter((s) => s.class_id === newStudent.class_id) : []),
    [sections, newStudent.class_id],
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.trim().toLowerCase();
      const classRow = classes.find((c) => c.id === student.class_id);
      const className = classRow?.name ?? "";
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        student.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.roll_number || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "all" || student.class_id === classFilter || className === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [students, classes, searchTerm, classFilter]);

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.school_id) return toast.error("School information missing.");
    if (!canManage) return toast.error("You do not have permission to add students.");
    if (!newStudent.class_id || !newStudent.section_id) return toast.error("Please select class and section.");

    try {
      setAdding(true);
      const payload = {
        school_id: user.school_id,
        admission_number: newStudent.admission_number.trim(),
        roll_number: newStudent.roll_number.trim() || null,
        first_name: newStudent.first_name.trim(),
        last_name: newStudent.last_name.trim(),
        class_id: newStudent.class_id,
        section_id: newStudent.section_id,
        parent_name: newStudent.parent_name.trim() || null,
        parent_phone: newStudent.parent_phone.trim() || null,
        status: "Active",
      };
      const { error } = await supabase.from("students").insert(payload);
      if (error) throw error;
      toast.success("Student added successfully.");
      setIsAddModalOpen(false);
      setNewStudent({ admission_number: "", roll_number: "", first_name: "", last_name: "", class_id: "", section_id: "", parent_name: "", parent_phone: "" });
      await loadAll();
    } catch (error: any) {
      console.error("Error adding student:", error);
      toast.error(error?.message || "Could not add student.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!canManage) return toast.error("You do not have permission to delete students.");
    try {
      setDeletingId(studentId);
      const { error } = await supabase.from("students").delete().eq("id", studentId);
      if (error) throw error;
      toast.success("Student deleted.");
      await loadAll();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast.error(error?.message || "Could not delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!canView) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><ShieldAlert className="w-8 h-8 text-red-600" /></div><h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2><p className="text-gray-500 max-w-md">You do not have permission to view the students directory.</p></div>;
  }

  const getClassName = (classId: string | null) => classes.find((c) => c.id === classId)?.name ?? "-";
  const getSectionName = (sectionId: string | null) => sections.find((s) => s.id === sectionId)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student records and information</p>
        </div>
        {canManage && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Add Student</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader><DialogTitle>Add New Student</DialogTitle><DialogDescription>Enter the details of the new student to enroll them.</DialogDescription></DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="admission_number">Admission Number</Label><Input id="admission_number" value={newStudent.admission_number} onChange={(e) => setNewStudent({ ...newStudent, admission_number: e.target.value })} placeholder="ADM2026001" required /></div>
                  <div className="space-y-2"><Label htmlFor="roll_number">Roll Number</Label><Input id="roll_number" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} placeholder="1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="first_name">First Name</Label><Input id="first_name" value={newStudent.first_name} onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })} placeholder="Aarav" required /></div>
                  <div className="space-y-2"><Label htmlFor="last_name">Last Name</Label><Input id="last_name" value={newStudent.last_name} onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })} placeholder="Sharma" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Class</Label><Select value={newStudent.class_id} onValueChange={(val) => setNewStudent({ ...newStudent, class_id: val, section_id: "" })}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map((cls) => <SelectItem key={cls.id} value={cls.id}>Class {cls.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Section</Label><Select value={newStudent.section_id} onValueChange={(val) => setNewStudent({ ...newStudent, section_id: val })} disabled={!newStudent.class_id}><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger><SelectContent>{visibleSections.map((section) => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="space-y-2"><Label htmlFor="parent_name">Parent/Guardian Name</Label><Input id="parent_name" value={newStudent.parent_name} onChange={(e) => setNewStudent({ ...newStudent, parent_name: e.target.value })} placeholder="Rajesh Sharma" /></div>
                <div className="space-y-2"><Label htmlFor="parent_phone">Parent Phone</Label><Input id="parent_phone" value={newStudent.parent_phone} onChange={(e) => setNewStudent({ ...newStudent, parent_phone: e.target.value })} placeholder="+91 9876543210" /></div>
                <DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button><Button type="submit" disabled={adding}>{adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Save Student</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-gray-200">
        <CardHeader><CardTitle className="text-base">Student Directory</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1"><Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><Input placeholder="Search by name, admission no, roll no..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger className="w-full lg:w-[220px]"><SelectValue placeholder="Filter by class" /></SelectTrigger><SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map((cls) => <SelectItem key={cls.id} value={cls.id}>Class {cls.name}</SelectItem>)}</SelectContent></Select>
          </div>
          {loading ? <div className="py-12 text-center text-gray-500">Loading students...</div> : filteredStudents.length === 0 ? <div className="py-12 text-center text-gray-500">No students found.</div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead><tr className="border-b text-left text-sm text-gray-500"><th className="py-3 pr-4">Admission No.</th><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Class</th><th className="py-3 pr-4">Section</th><th className="py-3 pr-4">Roll No.</th><th className="py-3 pr-4">Parent</th><th className="py-3 pr-4">Phone</th><th className="py-3 pr-4">Status</th><th className="py-3 text-right">Actions</th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id} className="border-b last:border-0"><td className="py-4 pr-4 text-sm">{student.admission_number}</td><td className="py-4 pr-4 text-sm font-medium">{student.first_name} {student.last_name}</td><td className="py-4 pr-4 text-sm">Class {getClassName(student.class_id)}</td><td className="py-4 pr-4 text-sm">{getSectionName(student.section_id)}</td><td className="py-4 pr-4 text-sm">{student.roll_number || "-"}</td><td className="py-4 pr-4 text-sm">{student.parent_name || "-"}</td><td className="py-4 pr-4 text-sm">{student.parent_phone || "-"}</td><td className="py-4 pr-4 text-sm">{student.status}</td><td className="py-4 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem><DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem className="text-red-600" onClick={() => handleDeleteStudent(student.id)} disabled={deletingId === student.id}><Trash2 className="w-4 h-4 mr-2" />{deletingId === student.id ? "Deleting..." : "Delete"}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td></tr>)}</tbody></table></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
