export type Role =
  | "super_admin"
  | "school_admin"
  | "principal"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "librarian"
  | "transport_manager"
  | "hr_manager"
  | "admission_counsellor";

export interface User {
  id: string;
  school_id: string;
  email: string;
  full_name: string;
  role: Role;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  board_type: "CBSE" | "ICSE" | "State";
  logo_url?: string;
  created_at: string;
}

export interface Student {
  id: string;
  user_id?: string;
  school_id: string;
  admission_number: string;
  roll_number?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: "Male" | "Female" | "Other";
  blood_group?: string;
  class_id?: string;
  section_id?: string;
  session_id?: string;
  parent_id?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status: "Active" | "Transferred" | "Graduated";
  created_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  numeric_value?: number;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
}

export interface Attendance {
  id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Half Day" | "Leave";
  remarks?: string;
  marked_by?: string;
}

export interface Notice {
  id: string;
  school_id: string;
  title: string;
  content: string;
  target_audience: string[];
  target_classes?: string[];
  posted_by: string;
  is_active: boolean;
  created_at: string;
}

export interface Admission {
  id: string;
  school_id: string;
  enquiry_date: string;
  student_first_name: string;
  student_last_name: string;
  parent_name: string;
  phone: string;
  email?: string;
  applied_for_class?: string;
  status:
    | "New"
    | "Follow-up"
    | "Interested"
    | "Test Scheduled"
    | "Admitted"
    | "Rejected";
  notes?: string;
  created_at: string;
}

export interface FeeInvoice {
  id: string;
  school_id: string;
  student_id: string;
  session_id: string;
  title: string;
  total_amount: number;
  due_date: string;
  status: "Unpaid" | "Partial" | "Paid" | "Overdue";
  created_at: string;
}
