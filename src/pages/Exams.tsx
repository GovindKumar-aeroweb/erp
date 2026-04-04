import { useState } from "react";
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
import { Search, Plus, MoreVertical, FileText, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const MOCK_EXAMS = [
  {
    id: "1",
    name: "Half Yearly Examination",
    classes: "Class 1 to 10",
    start_date: "2023-11-15",
    end_date: "2023-11-25",
    status: "Upcoming",
  },
  {
    id: "2",
    name: "Unit Test 2",
    classes: "Class 6 to 10",
    start_date: "2023-09-10",
    end_date: "2023-09-15",
    status: "Completed",
  },
  {
    id: "3",
    name: "Unit Test 1",
    classes: "Class 1 to 10",
    start_date: "2023-07-20",
    end_date: "2023-07-25",
    status: "Completed",
  },
];

export function Exams() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExams = MOCK_EXAMS.filter((exam) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Examinations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage exams, marks, and report cards
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <BarChart2 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-gray-200">
        <CardHeader className="p-4 sm:px-6 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search exams..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select defaultValue="2023-2024">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
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
                  <th className="px-4 py-3 sm:px-6 font-medium">Exam Name</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Applicable Classes
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Start Date</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">End Date</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Status</th>
                  <th className="px-4 py-3 sm:px-6 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {exam.name}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {exam.classes}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {exam.start_date}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {exam.end_date}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            exam.status === "Completed"
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : exam.status === "Upcoming"
                                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                          }`}
                        >
                          {exam.status}
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
                              <FileText className="mr-2 h-4 w-4" />
                              Enter Marks
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart2 className="mr-2 h-4 w-4" />
                              Generate Report Cards
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
                      No exams found matching your criteria.
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
