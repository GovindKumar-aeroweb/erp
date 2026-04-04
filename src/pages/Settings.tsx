import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Users,
  CreditCard,
  Mail,
  Smartphone,
} from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your school profile and system preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto gap-2 bg-transparent">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="school"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">School</span>
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Bell className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Shield className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger
            value="sms"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200"
          >
            <Mail className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general" className="m-0">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="asia-kolkata">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia-kolkata">
                          Asia/Kolkata (IST)
                        </SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">System Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="school" className="m-0">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle>School Profile</CardTitle>
                <CardDescription>
                  Update school details, logo, and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="school-name">School Name</Label>
                    <Input
                      id="school-name"
                      defaultValue="Delhi Public School"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-code">
                      School Code / Affiliation No.
                    </Label>
                    <Input id="school-code" defaultValue="CBSE-123456" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      defaultValue="Sector 12, RK Puram, New Delhi, 110022"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 11 2345 6789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="info@dpsrkp.edu.in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="www.dpsrkp.edu.in" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principal">Principal Name</Label>
                    <Input id="principal" defaultValue="Dr. R.K. Sharma" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button>Save Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="m-0">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle>Academic Settings</CardTitle>
                <CardDescription>
                  Configure academic year, terms, and grading systems.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Current Academic Year</Label>
                    <Select defaultValue="2023-2024">
                      <SelectTrigger id="academic-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board">Affiliated Board</Label>
                    <Select defaultValue="cbse">
                      <SelectTrigger id="board">
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cbse">CBSE</SelectItem>
                        <SelectItem value="icse">ICSE / CISCE</SelectItem>
                        <SelectItem value="state">State Board</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grading">Grading System</Label>
                    <Select defaultValue="cgpa">
                      <SelectTrigger id="grading">
                        <SelectValue placeholder="Select grading" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cgpa">CGPA (10 Point)</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="grades">
                          Letter Grades (A, B, C...)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Features
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Online Admissions</Label>
                        <p className="text-sm text-gray-500">
                          Allow parents to submit admission forms online.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Student Portal</Label>
                        <p className="text-sm text-gray-500">
                          Allow students to log in and view their dashboard.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Parent Portal</Label>
                        <p className="text-sm text-gray-500">
                          Allow parents to log in and track student progress.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholders for other tabs */}
          <TabsContent value="notifications" className="m-0">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when alerts are sent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 py-8 text-center">
                  Notification settings coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="m-0">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage password policies and access controls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 py-8 text-center">
                  Security settings coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
