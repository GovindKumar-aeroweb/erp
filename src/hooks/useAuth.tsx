import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type AppUser = {
  id: string;
  school_id: string | null;
  email: string;
  full_name: string;
  role:
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
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type SignInResult = {
  data: unknown | null;
  error: Error | null;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signInWithPassword: (
    schoolCode: string,
    email: string,
    password: string,
  ) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching profile:", error);
      setUser(null);
      return null;
    }

    setUser(data as AppUser);
    return data as AppUser;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        await fetchProfile(session.user.id);
      } catch (err) {
        console.error("Unexpected auth init error:", err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      try {
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithPassword = async (
    schoolCode: string,
    email: string,
    password: string,
  ): Promise<SignInResult> => {
    try {
      setLoading(true);

      const cleanSchoolCode = schoolCode.trim().toUpperCase();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanSchoolCode) {
        return { data: null, error: new Error("School code is required.") };
      }
      if (!cleanEmail) {
        return { data: null, error: new Error("Email is required.") };
      }
      if (!password) {
        return { data: null, error: new Error("Password is required.") };
      }

      const { data: schools, error: schoolError } = await supabase
        .from("schools")
        .select("id, school_code, is_active");

      if (schoolError) {
        return {
          data: null,
          error: new Error(`School lookup failed: ${schoolError.message}`),
        };
      }

      const school = schools?.find(
        (s) => (s.school_code || "").trim().toUpperCase() === cleanSchoolCode,
      );

      if (!school) {
        return { data: null, error: new Error("Invalid school code.") };
      }

      if (!school.is_active) {
        return {
          data: null,
          error: new Error("This school account is inactive."),
        };
      }

      const authResult = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authResult.error || !authResult.data.user) {
        return {
          data: null,
          error: authResult.error ?? new Error("Invalid email or password."),
        };
      }

      const profile = await fetchProfile(authResult.data.user.id);

      if (!profile) {
        await supabase.auth.signOut();
        return {
          data: null,
          error: new Error("User profile not found in database."),
        };
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        return {
          data: null,
          error: new Error("Your account is inactive. Contact school admin."),
        };
      }

      if (profile.school_id !== school.id) {
        await supabase.auth.signOut();
        return {
          data: null,
          error: new Error("User does not belong to this school."),
        };
      }

      return { data: authResult.data, error: null };
    } catch (err) {
      console.error("Unexpected sign-in error:", err);
      return {
        data: null,
        error: err instanceof Error ? err : new Error("Login failed."),
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setUser(null);
      return;
    }

    setLoading(true);
    try {
      await fetchProfile(session.user.id);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInWithPassword,
      signOut,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
