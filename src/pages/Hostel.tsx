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
import { Search, Plus, Home, Users, Bed, AlertCircle } from "lucide-react";

// Mock data
const MOCK_HOSTELS = [
  {
    id: "1",
    name: "Boys Hostel A",
    type: "Boys",
    warden: "Mr. Sharma",
    phone: "+91 9876543210",
    capacity: 100,
    occupied: 95,
    status: "Active",
  },
  {
    id: "2",
    name: "Boys Hostel B",
    type: "Boys",
    warden: "Mr. Verma",
    phone: "+91 9876543211",
    capacity: 120,
    occupied: 110,
    status: "Active",
  },
  {
    id: "3",
    name: "Girls Hostel A",
    type: "Girls",
    warden: "Mrs. Gupta",
    phone: "+91 9876543212",
    capacity: 80,
    occupied: 78,
    status: "Active",
  },
  {
    id: "4",
    name: "Girls Hostel B",
    type: "Girls",
    warden: "Ms. Singh",
    phone: "+91 9876543213",
    capacity: 100,
    occupied: 60,
    status: "Maintenance",
  },
];

export function Hostel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredHostels = MOCK_HOSTELS.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.warden.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      hostel.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Hostel Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage hostels, rooms, and student allocation
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Hostel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Hostels
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">4</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Capacity
                </p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">400</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Bed className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Occupied Beds
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">343</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available Beds
                </p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">57</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
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
                placeholder="Search hostels or wardens..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
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
                  <th className="px-4 py-3 sm:px-6 font-medium">Hostel Name</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Type</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Warden Details
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Occupancy</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Status</th>
                  <th className="px-4 py-3 sm:px-6 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHostels.length > 0 ? (
                  filteredHostels.map((hostel) => (
                    <tr
                      key={hostel.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {hostel.name}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600">
                        {hostel.type}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="text-gray-900">{hostel.warden}</div>
                        <div className="text-gray-500 text-xs">
                          {hostel.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${hostel.occupied >= hostel.capacity ? "bg-red-500" : "bg-green-500"}`}
                              style={{
                                width: `${(hostel.occupied / hostel.capacity) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {hostel.occupied}/{hostel.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            hostel.status === "Active"
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                          }`}
                        >
                          {hostel.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View Rooms
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No hostels found matching your criteria.
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
