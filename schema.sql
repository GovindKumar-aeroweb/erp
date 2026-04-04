-- Supabase Schema for Vidya ERP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Schools (Multi-tenant support)
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    board_type VARCHAR(50) DEFAULT 'CBSE', -- CBSE, ICSE, State
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'transport_manager', 'hr_manager', 'admission_counsellor')),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Academic Sessions
CREATE TABLE IF NOT EXISTS academic_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "2023-2024"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "Class 10"
    numeric_value INTEGER, -- For sorting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sections
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "A", "B"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50) DEFAULT 'Theory', -- Theory, Practical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to auth
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    admission_number VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    session_id UUID REFERENCES academic_sessions(id),
    parent_id UUID REFERENCES users(id), -- Link to parent user
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active', -- Active, Transferred, Graduated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Staff / Teachers
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE,
    qualification TEXT,
    experience_years INTEGER,
    basic_salary DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day', 'Leave')),
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 10. Fees
CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Tuition Fee, Transport Fee, etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES academic_sessions(id),
    title VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid' CHECK (status IN ('Unpaid', 'Partial', 'Paid', 'Overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES fee_invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- Cash, Online, Cheque
    transaction_id VARCHAR(255),
    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Exams
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    session_id UUID REFERENCES academic_sessions(id),
    name VARCHAR(255) NOT NULL, -- Half Yearly, Final, Unit Test 1
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    max_marks DECIMAL(5, 2) NOT NULL,
    grade VARCHAR(10),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exam_id, student_id, subject_id)
);

-- 12. Notices / Communication
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50)[] DEFAULT '{all}', -- ['all', 'teachers', 'students', 'parents']
    target_classes UUID[], -- Array of class IDs if specific
    posted_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Admissions (CRM)
CREATE TABLE IF NOT EXISTS admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    enquiry_date DATE DEFAULT CURRENT_DATE,
    student_first_name VARCHAR(100) NOT NULL,
    student_last_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    applied_for_class UUID REFERENCES classes(id),
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Follow-up', 'Interested', 'Test Scheduled', 'Admitted', 'Rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's school_id
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- DROP EXISTING POLICIES TO AVOID CONFLICTS
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 1. Schools
CREATE POLICY "Allow public read access to schools" ON schools
    FOR SELECT USING (true);

CREATE POLICY "Super admins can manage schools" ON schools
    FOR ALL USING (get_user_role() = 'super_admin');

-- 2. Users
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can view users in their school" ON users
    FOR SELECT USING (
        school_id = get_user_school_id() OR get_user_role() = 'super_admin'
    );

CREATE POLICY "School Admins can manage users in their school" ON users
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin') OR get_user_role() = 'super_admin'
    );

-- 3. Academic Sessions
CREATE POLICY "Users can view sessions in their school" ON academic_sessions
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage sessions" ON academic_sessions
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal')) OR get_user_role() = 'super_admin');

-- 4. Classes
CREATE POLICY "Users can view classes in their school" ON classes
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage classes" ON classes
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal')) OR get_user_role() = 'super_admin');

-- 5. Sections
CREATE POLICY "Users can view sections in their school" ON sections
    FOR SELECT USING (
        class_id IN (SELECT id FROM classes WHERE school_id = get_user_school_id()) OR get_user_role() = 'super_admin'
    );
CREATE POLICY "Admins can manage sections" ON sections
    FOR ALL USING (
        (class_id IN (SELECT id FROM classes WHERE school_id = get_user_school_id()) AND get_user_role() IN ('school_admin', 'principal')) OR get_user_role() = 'super_admin'
    );

-- 6. Subjects
CREATE POLICY "Users can view subjects in their school" ON subjects
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage subjects" ON subjects
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal')) OR get_user_role() = 'super_admin');

-- 7. Students
CREATE POLICY "Users can view students in their school" ON students
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage students" ON students
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'admission_counsellor')) OR get_user_role() = 'super_admin');

-- 8. Staff
CREATE POLICY "Users can view staff in their school" ON staff
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage staff" ON staff
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'hr_manager')) OR get_user_role() = 'super_admin');

-- 9. Attendance
CREATE POLICY "Users can view attendance in their school" ON attendance
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Teachers and Admins can manage attendance" ON attendance
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'teacher')) OR get_user_role() = 'super_admin');

-- 10. Fees
CREATE POLICY "Users can view fee types in their school" ON fee_types
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage fee types" ON fee_types
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'accountant')) OR get_user_role() = 'super_admin');

CREATE POLICY "Users can view fee invoices in their school" ON fee_invoices
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage fee invoices" ON fee_invoices
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'accountant')) OR get_user_role() = 'super_admin');

CREATE POLICY "Users can view fee payments in their school" ON fee_payments
    FOR SELECT USING (
        invoice_id IN (SELECT id FROM fee_invoices WHERE school_id = get_user_school_id()) OR get_user_role() = 'super_admin'
    );
CREATE POLICY "Admins can manage fee payments" ON fee_payments
    FOR ALL USING (
        (invoice_id IN (SELECT id FROM fee_invoices WHERE school_id = get_user_school_id()) AND get_user_role() IN ('school_admin', 'principal', 'accountant')) OR get_user_role() = 'super_admin'
    );

-- 11. Exams
CREATE POLICY "Users can view exams in their school" ON exams
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage exams" ON exams
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'teacher')) OR get_user_role() = 'super_admin');

CREATE POLICY "Users can view exam marks in their school" ON exam_marks
    FOR SELECT USING (
        exam_id IN (SELECT id FROM exams WHERE school_id = get_user_school_id()) OR get_user_role() = 'super_admin'
    );
CREATE POLICY "Teachers and Admins can manage exam marks" ON exam_marks
    FOR ALL USING (
        (exam_id IN (SELECT id FROM exams WHERE school_id = get_user_school_id()) AND get_user_role() IN ('school_admin', 'principal', 'teacher')) OR get_user_role() = 'super_admin'
    );

-- 12. Notices
CREATE POLICY "Users can view active notices in their school" ON notices
    FOR SELECT USING (school_id = get_user_school_id() OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage notices" ON notices
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'teacher')) OR get_user_role() = 'super_admin');

-- 13. Admissions
CREATE POLICY "Admins can view admissions in their school" ON admissions
    FOR SELECT USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'admission_counsellor')) OR get_user_role() = 'super_admin');
CREATE POLICY "Admins can manage admissions" ON admissions
    FOR ALL USING ((school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'principal', 'admission_counsellor')) OR get_user_role() = 'super_admin');

-- SEED DATA (Mock data for testing)
-- Note: You need to create auth users first in Supabase, then link them here.
-- For the UI prototype, we will use a mock service layer if Supabase is not connected.
