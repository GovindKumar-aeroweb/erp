import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Attendance } from "./pages/Attendance";
import { Fees } from "./pages/Fees";
import { Exams } from "./pages/Exams";
import { Admissions } from "./pages/Admissions";
import { Users } from "./pages/Users";
import { Library } from "./pages/Library";
import { Transport } from "./pages/Transport";
import { Hostel } from "./pages/Hostel";
import { Notices } from "./pages/Notices";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/users" element={<Users />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/library" element={<Library />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/hostel" element={<Hostel />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}
