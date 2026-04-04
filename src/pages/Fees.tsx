import { useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Download,
  IndianRupee,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Mock data
const MOCK_INVOICES = [
  {
    id: "INV-001",
    student: "Aarav Sharma",
    class: "Class 10 - A",
    amount: 45000,
    due_date: "2023-11-15",
    status: "Paid",
  },
  {
    id: "INV-002",
    student: "Diya Patel",
    class: "Class 10 - A",
    amount: 45000,
    due_date: "2023-11-15",
    status: "Unpaid",
  },
  {
    id: "INV-003",
    student: "Rohan Kumar",
    class: "Class 9 - B",
    amount: 42000,
    due_date: "2023-11-15",
    status: "Partial",
  },
  {
    id: "INV-004",
    student: "Ananya Singh",
    class: "Class 8 - C",
    amount: 38000,
    due_date: "2023-10-15",
    status: "Overdue",
  },
  {
    id: "INV-005",
    student: "Kabir Das",
    class: "Class 10 - B",
    amount: 45000,
    due_date: "2023-11-15",
    status: "Paid",
  },
];

export function Fees() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [processingPayment, setProcessingPayment] = useState(false);

  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    // If student, only show their own invoices (mock logic: check if name matches)
    if (user?.role === "student" && inv.student !== user.full_name) {
      return false;
    }
    
    const matchesSearch =
      inv.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCollectPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.amount.toString());
    setIsPaymentModalOpen(true);
  };

  const submitPayment = (e: FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingPayment(false);
      setIsPaymentModalOpen(false);
      toast.success(`Payment of ₹${paymentAmount} collected successfully for ${selectedInvoice?.student}`);
    }, 1000);
  };

  const handleDownloadReceipt = (invoice: any) => {
    toast.success(`Receipt for ${invoice.id} downloaded successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Fee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage fee collection, invoices, and payments
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Fee Reports
          </Button>
          {user?.role !== "student" && user?.role !== "parent" && (
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Expected
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ₹24.5L
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <IndianRupee className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Collected
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  ₹18.2L
                </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Dues
                </p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">
                  ₹5.1L
                </h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <IndianRupee className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">₹1.2L</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <IndianRupee className="w-6 h-6 text-red-600" />
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
                placeholder="Search invoice or student..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 sm:px-6 font-medium">Invoice ID</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Student Name
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Class</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Amount</th>
                  <th className="px-4 py-3 sm:px-6 font-medium hidden md:table-cell">
                    Due Date
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Status</th>
                  <th className="px-4 py-3 sm:px-6 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {inv.id}
                      </td>
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {inv.student}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {inv.class}
                      </td>
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        ₹{inv.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600 hidden md:table-cell">
                        {inv.due_date}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            inv.status === "Paid"
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : inv.status === "Unpaid"
                                ? "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                : inv.status === "Partial"
                                  ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                  : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                          }`}
                        >
                          {inv.status}
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
                            {user?.role !== "student" && user?.role !== "parent" && (
                              <DropdownMenuItem onClick={() => handleCollectPayment(inv)}>
                                <IndianRupee className="mr-2 h-4 w-4" />
                                Collect Payment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            {(inv.status === "Paid" || inv.status === "Partial") && (
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(inv)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredInvoices.length}</span> of{" "}
              <span className="font-medium">{MOCK_INVOICES.length}</span>{" "}
              results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collect Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>
              Record a fee payment for {selectedInvoice?.student}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPayment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceId">Invoice ID</Label>
              <Input
                id="invoiceId"
                value={selectedInvoice?.id || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">Online / UPI</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processingPayment}>
                {processingPayment ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
