import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ClassRow = { id: string; name: string };
type SectionRow = { id: string; class_id: string; name: string };
type StudentRow = { id: string; roll_number: string | null; first_name: string; last_name: string; class_id: string | null; section_id: string | null; school_id: string };
type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "Leave";

export function Attendance() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("all");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user?.school_id) void loadMeta(); }, [user?.school_id]);
  useEffect(() => { if (user?.school_id && selectedClassId) void loadStudentsAndAttendance(); }, [user?.school_id, selectedClassId, selectedSectionId, date]);

  const loadMeta = async () => {
    if (!user?.school_id) return;
    try {
      setLoading(true);
      const [classesRes, sectionsRes] = await Promise.all([
        supabase.from("classes").select("id, name").eq("school_id", user.school_id).order("numeric_value"),
        supabase.from("sections").select("id, class_id, name").eq("school_id", user.school_id).order("name"),
      ]);
      if (classesRes.error) throw classesRes.error;
      if (sectionsRes.error) throw sectionsRes.error;
      const classesData = (classesRes.data || []) as ClassRow[];
      setClasses(classesData);
      setSections((sectionsRes.data || []) as SectionRow[]);
      if (classesData[0]) setSelectedClassId(classesData[0].id);
    } catch (error) {
      console.error(error);
      toast.error("Could not load attendance setup.");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsAndAttendance = async () => {
    if (!user?.school_id || !selectedClassId) return;
    try {
      setLoading(true);
      let query = supabase.from("students").select("id, roll_number, first_name, last_name, class_id, section_id, school_id").eq("school_id", user.school_id).eq("class_id", selectedClassId).order("roll_number");
      if (selectedSectionId !== "all") query = query.eq("section_id", selectedSectionId);
      const dateStr = format(date, "yyyy-MM-dd");
      const [studentsRes, attendanceRes] = await Promise.all([
        query,
        supabase.from("attendance").select("student_id, status").eq("school_id", user.school_id).eq("date", dateStr),
      ]);
      if (studentsRes.error) throw studentsRes.error;
      if (attendanceRes.error) throw attendanceRes.error;
      const studentsData = (studentsRes.data || []) as StudentRow[];
      const map: Record<string, AttendanceStatus> = {};
      studentsData.forEach((student) => { map[student.id] = "Present"; });
      (attendanceRes.data || []).forEach((row: any) => { map[row.student_id] = row.status as AttendanceStatus; });
      setStudents(studentsData);
      setAttendance(map);
    } catch (error) {
      console.error(error);
      toast.error("Could not load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => setAttendance((prev) => ({ ...prev, [studentId]: status }));
  const handleMarkAll = (status: AttendanceStatus) => setAttendance(Object.fromEntries(students.map((student) => [student.id, status])) as Record<string, AttendanceStatus>);

  const visibleSections = useMemo(() => sections.filter((s) => s.class_id === selectedClassId), [sections, selectedClassId]);

  const handleSave = async () => {
    if (!user?.school_id || !user?.id || !selectedClassId) return;
    try {
      setSaving(true);
      const dateStr = format(date, "yyyy-MM-dd");
      const studentIds = students.map((s) => s.id);
      if (studentIds.length === 0) return toast.error("No students found for this class/section.");
      const { error: deleteError } = await supabase.from("attendance").delete().eq("school_id", user.school_id).eq("date", dateStr).in("student_id", studentIds);
      if (deleteError) throw deleteError;
      const payload = students.map((student) => ({ school_id: user.school_id, student_id: student.id, class_id: student.class_id, section_id: student.section_id, date: dateStr, status: attendance[student.id] || "Present", marked_by: user.id }));
      const { error: insertError } = await supabase.from("attendance").insert(payload);
      if (insertError) throw insertError;
      toast.success("Attendance saved successfully.");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Could not save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Attendance</h1><p className="text-sm text-gray-500 mt-1">Mark daily attendance for students</p></div>
        <Button onClick={handleSave} className="w-full sm:w-auto" disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Attendance"}</Button>
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-gray-200">
        <CardHeader className="p-4 sm:px-6 sm:py-4 border-b border-gray-200"><div className="flex flex-col sm:flex-row gap-4"><div className="w-full sm:w-[220px]"><label className="text-xs font-medium text-gray-500 mb-1.5 block">Class</label><Select value={selectedClassId} onValueChange={(val) => { setSelectedClassId(val); setSelectedSectionId("all"); }}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map((cls) => <SelectItem key={cls.id} value={cls.id}>Class {cls.name}</SelectItem>)}</SelectContent></Select></div><div className="w-full sm:w-[220px]"><label className="text-xs font-medium text-gray-500 mb-1.5 block">Section</label><Select value={selectedSectionId} onValueChange={setSelectedSectionId}><SelectTrigger><SelectValue placeholder="All sections" /></SelectTrigger><SelectContent><SelectItem value="all">All Sections</SelectItem>{visibleSections.map((section) => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}</SelectContent></Select></div><div className="w-full sm:w-[250px]"><label className="text-xs font-medium text-gray-500 mb-1.5 block">Date</label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus /></PopoverContent></Popover></div></div></CardHeader>
        <CardContent className="p-0"><div className="p-4 sm:px-6 bg-gray-50/50 border-b border-gray-200 flex flex-wrap gap-2 items-center justify-between"><span className="text-sm font-medium text-gray-700">Quick Mark All:</span><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => handleMarkAll("Present")} className="text-green-600 border-green-200 hover:bg-green-50"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Present</Button><Button size="sm" variant="outline" onClick={() => handleMarkAll("Absent")} className="text-red-600 border-red-200 hover:bg-red-50"><XCircle className="w-4 h-4 mr-1.5" /> Absent</Button><Button size="sm" variant="outline" onClick={() => handleMarkAll("Late")} className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"><Clock className="w-4 h-4 mr-1.5" /> Late</Button></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200"><tr><th className="px-4 py-3 sm:px-6 font-medium w-20">Roll No</th><th className="px-4 py-3 sm:px-6 font-medium">Student Name</th><th className="px-4 py-3 sm:px-6 font-medium">Status</th></tr></thead><tbody className="divide-y divide-gray-200">{loading ? <tr><td className="px-6 py-8 text-gray-500" colSpan={3}>Loading attendance...</td></tr> : students.length === 0 ? <tr><td className="px-6 py-8 text-gray-500" colSpan={3}>No students found for this selection.</td></tr> : students.map((student) => <tr key={student.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-4 py-3 sm:px-6 font-medium text-gray-900">{student.roll_number || "-"}</td><td className="px-4 py-3 sm:px-6 font-medium text-gray-900">{student.first_name} {student.last_name}</td><td className="px-4 py-3 sm:px-6"><div className="flex flex-wrap gap-2">{(["Present", "Absent", "Late", "Half Day"] as const).map((status) => <button key={status} onClick={() => handleStatusChange(student.id, status)} className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors border", attendance[student.id] === status ? status === "Present" ? "bg-green-100 text-green-800 border-green-200" : status === "Absent" ? "bg-red-100 text-red-800 border-red-200" : status === "Late" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}>{status}</button>)}</div></td></tr>)}</tbody></table></div>
        </CardContent>
      </Card>
    </div>
  );
}
