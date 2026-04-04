import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, GraduationCap, Calendar } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View your personal and academic information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-0 shadow-sm ring-1 ring-gray-200">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>123, School Road, City</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-sm ring-1 ring-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold">Academic Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Number
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900">ADM2023001</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900">1</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class & Section
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900">Class 10 - A</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Admission
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900">15 Apr 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
