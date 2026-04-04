import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

type NoticeRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_active: boolean;
};

export function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canView = !!user;
  const canManage = !!user && ["super_admin", "school_admin", "principal", "teacher"].includes(user.role);

  useEffect(() => { if (user?.school_id) void loadNotices(); }, [user?.school_id]);

  const loadNotices = async () => {
    if (!user?.school_id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("notices").select("id, title, content, created_at, is_active").eq("school_id", user.school_id).order("created_at", { ascending: false });
      if (error) throw error;
      setNotices((data || []) as NoticeRow[]);
    } catch (error) {
      console.error("Error loading notices:", error);
      toast.error("Could not load notices.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = useMemo(() => notices.filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase())), [notices, searchTerm]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.school_id || !user?.id) return;
    try {
      setSaving(true);
      const { error } = await supabase.from("notices").insert({ school_id: user.school_id, title: title.trim(), content: content.trim(), target_audience: ["all"], posted_by: user.id, is_active: true });
      if (error) throw error;
      toast.success("Notice created.");
      setTitle("");
      setContent("");
      setIsOpen(false);
      await loadNotices();
    } catch (error: any) {
      console.error("Error creating notice:", error);
      toast.error(error?.message || "Could not create notice.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
      toast.success("Notice deleted.");
      await loadNotices();
    } catch (error: any) {
      console.error("Error deleting notice:", error);
      toast.error(error?.message || "Could not delete notice.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!canView) return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><ShieldAlert className="w-8 h-8 text-red-600" /></div><h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2><p className="text-gray-500 max-w-md">You do not have permission to view notices.</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Notices</h1><p className="text-sm text-gray-500 mt-1">Create and manage school-wide notices.</p></div>
        {canManage && <Dialog open={isOpen} onOpenChange={setIsOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />New Notice</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create Notice</DialogTitle><DialogDescription>Share an announcement with the school.</DialogDescription></DialogHeader><form onSubmit={handleCreate} className="space-y-4"><div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} required /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Publish</Button></DialogFooter></form></DialogContent></Dialog>}
      </div>
      <div className="relative"><Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><Input placeholder="Search notices..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      <Card className="border-0 shadow-sm ring-1 ring-gray-200"><CardHeader><CardTitle>Notice Board</CardTitle></CardHeader><CardContent className="space-y-4">{loading ? <div className="py-8 text-center text-gray-500">Loading notices...</div> : filteredNotices.length === 0 ? <div className="py-8 text-center text-gray-500">No notices found.</div> : filteredNotices.map((notice) => <div key={notice.id} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-gray-900">{notice.title}</h3><p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{notice.content}</p><p className="mt-3 text-xs text-gray-400">{new Date(notice.created_at).toLocaleString()}</p></div>{canManage && <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)} disabled={deletingId === notice.id}><Trash2 className="w-4 h-4 text-red-600" /></Button>}</div></div>)}</CardContent></Card>
    </div>
  );
}
