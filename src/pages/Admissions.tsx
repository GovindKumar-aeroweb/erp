import { useState, type FormEvent } from "react";
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
  Search,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data
const MOCK_LEADS = [
  {
    id: "1",
    name: "Vihaan Gupta",
    parent: "Suresh Gupta",
    phone: "+91 9876543215",
    class: "Class 1",
    status: "New",
    date: "2023-10-25",
  },
  {
    id: "2",
    name: "Myra Singh",
    parent: "Rahul Singh",
    phone: "+91 9876543216",
    class: "Class 5",
    status: "Follow-up",
    date: "2023-10-24",
  },
  {
    id: "3",
    name: "Reyansh Kumar",
    parent: "Amit Kumar",
    phone: "+91 9876543217",
    class: "Class 9",
    status: "Test Scheduled",
    date: "2023-10-22",
  },
  {
    id: "4",
    name: "Aadhya Patel",
    parent: "Kiran Patel",
    phone: "+91 9876543218",
    class: "Class 3",
    status: "Admitted",
    date: "2023-10-20",
  },
];

export function Admissions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  
  // Form state
  const [newEnquiry, setNewEnquiry] = useState({
    name: "",
    parent: "",
    phone: "",
    class: "Class 1"
  });

  if (!user || (user.role !== "super_admin" && user.role !== "school_admin" && user.role !== "principal")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have permission to view the admissions module. This area is
          restricted to administrators.
        </p>
      </div>
    );
  }

  const filteredLeads = MOCK_LEADS.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.parent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      lead.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddEnquiry = (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    // Simulate API call
    setTimeout(() => {
      setAdding(false);
      setIsAddModalOpen(false);
      toast.success(`Enquiry for ${newEnquiry.name} added successfully!`);
      setNewEnquiry({
        name: "",
        parent: "",
        phone: "",
        class: "Class 1"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admissions CRM
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage enquiries, leads, and new admissions
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                New Enquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Enquiry</DialogTitle>
                <DialogDescription>
                  Record a new admission enquiry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEnquiry} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={newEnquiry.name}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                    placeholder="e.g. Vihaan Gupta"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent/Guardian Name</Label>
                  <Input
                    id="parent"
                    value={newEnquiry.parent}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, parent: e.target.value })}
                    placeholder="e.g. Suresh Gupta"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Applying For Class</Label>
                  <Select 
                    value={newEnquiry.class} 
                    onValueChange={(val) => setNewEnquiry({ ...newEnquiry, class: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nursery">Nursery</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="Class 1">Class 1</SelectItem>
                      <SelectItem value="Class 2">Class 2</SelectItem>
                      <SelectItem value="Class 3">Class 3</SelectItem>
                      <SelectItem value="Class 4">Class 4</SelectItem>
                      <SelectItem value="Class 5">Class 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={adding}>
                    {adding ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save Enquiry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Enquiries
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">124</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Leads
                </p>
                <h3 className="text-2xl font-bold text-blue-600 mt-1">45</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tests Scheduled
                </p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Admitted</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">67</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-gray-200">
        <CardHeader className="p-4 sm:px-6 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="test scheduled">Test Scheduled</SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Student Name
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Parent Details
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Applied For</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Enquiry Date
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Status</th>
                  <th className="px-4 py-3 sm:px-6 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="text-gray-900">{lead.parent}</div>
                        <div className="text-gray-500 text-xs flex items-center mt-0.5">
                          <Phone className="w-3 h-3 mr-1" /> {lead.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {lead.class}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {lead.date}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            lead.status === "Admitted"
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : lead.status === "New"
                                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                : lead.status === "Test Scheduled"
                                  ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                                  : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Log Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Test
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
