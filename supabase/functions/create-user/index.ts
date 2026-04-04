import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authorization = req.headers.get("Authorization") ?? "";

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      throw new Error(
        "Missing Edge Function secrets. Set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    if (!authorization) {
      throw new Error("Missing Authorization header.");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
    });

    const {
      data: { user },
      error: authUserError,
    } = await supabaseClient.auth.getUser();

    if (authUserError) throw authUserError;
    if (!user) throw new Error("Not authenticated");

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role, school_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw new Error(`Could not read admin profile: ${profileError.message}`);
    }

    if (!profile || !["super_admin", "school_admin"].includes(profile.role)) {
      throw new Error("Not authorized to create users");
    }

    const { email, password, full_name, role, phone } = await req.json();

    if (!email || !password || !full_name || !role) {
      throw new Error("email, password, full_name, and role are required.");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;
    if (!authData.user?.id) throw new Error("Auth user was created without an id.");

    const { error: dbError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      school_id: profile.school_id,
      email,
      full_name,
      role,
      phone: phone ?? null,
      is_active: true,
    });

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Profile insert failed: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ user: authData.user, message: "User created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
