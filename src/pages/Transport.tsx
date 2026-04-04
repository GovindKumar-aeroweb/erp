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
import { Search, Plus, Bus, MapPin, Users, AlertCircle } from "lucide-react";

// Mock data
const MOCK_ROUTES = [
  {
    id: "1",
    routeName: "Route A - City Center",
    vehicleNo: "MH 12 AB 1234",
    driver: "Ramesh Kumar",
    phone: "+91 9876543210",
    capacity: 40,
    students: 35,
    status: "Active",
  },
  {
    id: "2",
    routeName: "Route B - North Suburbs",
    vehicleNo: "MH 12 CD 5678",
    driver: "Suresh Patil",
    phone: "+91 9876543211",
    capacity: 40,
    students: 38,
    status: "Active",
  },
  {
    id: "3",
    routeName: "Route C - East End",
    vehicleNo: "MH 12 EF 9012",
    driver: "Vijay Singh",
    phone: "+91 9876543212",
    capacity: 30,
    students: 28,
    status: "Maintenance",
  },
  {
    id: "4",
    routeName: "Route D - West Hills",
    vehicleNo: "MH 12 GH 3456",
    driver: "Anil Sharma",
    phone: "+91 9876543213",
    capacity: 40,
    students: 40,
    status: "Active",
  },
];

export function Transport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRoutes = MOCK_ROUTES.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      route.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Transport Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage routes, vehicles, and student transport
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Route
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Routes
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Vehicles
                </p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">15</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Bus className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Students Opted
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">450</h3>
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
                  Vehicles in Maintenance
                </p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">2</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
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
                placeholder="Search routes or drivers..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
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
                  <th className="px-4 py-3 sm:px-6 font-medium">Route Name</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Vehicle No.</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">
                    Driver Details
                  </th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Capacity</th>
                  <th className="px-4 py-3 sm:px-6 font-medium">Status</th>
                  <th className="px-4 py-3 sm:px-6 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <tr
                      key={route.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                        {route.routeName}
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-gray-600 font-mono">
                        {route.vehicleNo}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="text-gray-900">{route.driver}</div>
                        <div className="text-gray-500 text-xs">
                          {route.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${route.students >= route.capacity ? "bg-red-500" : "bg-green-500"}`}
                              style={{
                                width: `${(route.students / route.capacity) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {route.students}/{route.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            route.status === "Active"
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                          }`}
                        >
                          {route.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View Stops
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
                      No routes found matching your criteria.
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
