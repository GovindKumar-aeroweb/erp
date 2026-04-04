import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

export function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState("teacher");

  const canManage = user?.role === "super_admin" || user?.role === "school_admin";

  useEffect(() => {
    if (user?.school_id && canManage) void fetchUsers();
  }, [user?.school_id, user?.role]);

  const fetchUsers = async () => {
    if (!user?.school_id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("school_id", user.school_id)
        .order("created_at", { ascending: false });
      console.log("create-user response data:", data);
      console.log("create-user response error:", error);
      if (error) throw error;
      setUsers((data || []) as User[]);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: newEmail.trim().toLowerCase(),
          password: "TempPassword@123",
          full_name: newFullName.trim(),
          role: newRole,
        },
      });
      console.log("create-user response data:", data);
      console.log("create-user response error:", error);
      if (error) throw error;
      toast.success(data?.message || "User created successfully. Temporary password: TempPassword@123");
      setNewEmail("");
      setNewFullName("");
      setNewRole("teacher");
      setIsCreateModalOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error?.context?.json?.error || error?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = useMemo(
    () => users.filter((u) => u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase())),
    [users, searchQuery],
  );

  if (!canManage) {
    return <div className="flex flex-col items-center justify-center h-[60vh] text-center"><ShieldAlert className="w-16 h-16 text-red-500 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2><p className="text-gray-500 max-w-md">Only school admins can manage users.</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1><p className="text-sm text-gray-500 mt-1">Create and manage school users.</p></div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Create User</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Create New User</DialogTitle><DialogDescription>Add a new teacher, student, or staff member.</DialogDescription></DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="John Doe" required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="john@school.edu" required /></div>
              <div className="space-y-2"><Label htmlFor="role">Role</Label><Select value={newRole} onValueChange={setNewRole}><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger><SelectContent><SelectItem value="teacher">Teacher</SelectItem><SelectItem value="student">Student</SelectItem><SelectItem value="parent">Parent</SelectItem><SelectItem value="accountant">Accountant</SelectItem><SelectItem value="librarian">Librarian</SelectItem>{user?.role === "super_admin" && <SelectItem value="school_admin">School Admin</SelectItem>}</SelectContent></Select></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button><Button type="submit" disabled={creating}>{creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Create User</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><Input placeholder="Search users by name, email, or role" className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading users...</TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No users found.</TableCell></TableRow>
            ) : (
              filteredUsers.map((row) => <TableRow key={row.id}><TableCell>{row.full_name}</TableCell><TableCell>{row.email}</TableCell><TableCell className="capitalize">{row.role.replace("_", " ")}</TableCell><TableCell>{row.is_active ? "Active" : "Inactive"}</TableCell></TableRow>)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
