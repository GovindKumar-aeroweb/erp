import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Bell, UserCheck, TrendingUp } from "lucide-react";

type Stats = {
  students: number;
  staff: number;
  notices: number;
  attendancePercent: number;
};

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ students: 0, staff: 0, notices: 0, attendancePercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.school_id) void loadStats();
  }, [user?.school_id]);

  const loadStats = async () => {
    if (!user?.school_id) return;
    try {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const [studentsRes, staffRes, noticesRes, attendanceRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", user.school_id),
        supabase.from("staff").select("id", { count: "exact", head: true }).eq("school_id", user.school_id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("school_id", user.school_id),
        supabase.from("attendance").select("status").eq("school_id", user.school_id).eq("date", today),
      ]);
      const totalStudents = studentsRes.count || 0;
      const presentCount = (attendanceRes.data || []).filter((row: any) => row.status === "Present").length;
      const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
      setStats({ students: totalStudents, staff: staffRes.count || 0, notices: noticesRes.count || 0, attendancePercent });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Students", value: stats.students, icon: GraduationCap, hint: "Enrolled records" },
    { title: "Total Staff", value: stats.staff, icon: Users, hint: "Staff entries" },
    { title: "Notices", value: stats.notices, icon: Bell, hint: "Published notices" },
    { title: "Today's Attendance", value: `${stats.attendancePercent}%`, icon: UserCheck, hint: "Present rate" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1><p className="text-sm text-gray-500 mt-1">Welcome back, {user?.full_name}</p></div>
        <div className="flex items-center gap-2"><span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Live school data</span></div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, hint }) => (
          <Card key={title} className="border-0 shadow-sm ring-1 ring-gray-200"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">{title}</p><div className="flex items-baseline gap-2 mt-1"><h3 className="text-2xl font-bold text-gray-900">{loading ? "..." : value}</h3><span className="text-sm font-medium text-gray-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />{hint}</span></div></div><div className="p-3 bg-blue-50 rounded-xl"><Icon className="w-6 h-6 text-blue-600" /></div></div></CardContent></Card>
        ))}
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-gray-200"><CardHeader><CardTitle>What is live right now</CardTitle></CardHeader><CardContent className="text-sm text-gray-600 space-y-2"><p>Dashboard cards now read from Supabase instead of hardcoded demo numbers.</p><p>Students, users, and notices are wired to real CRUD. Attendance is included as a working save-by-date module. Fees, exams, admissions, transport, hostel, and library are still UI placeholders for phase 2.</p></CardContent></Card>
    </div>
  );
}
