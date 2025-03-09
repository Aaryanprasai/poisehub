
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the request body
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Validate that email is a @poisemusic.com email
    if (!email.endsWith('@poisemusic.com')) {
      return new Response(
        JSON.stringify({ success: false, error: "Only @poisemusic.com email addresses are allowed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    // Check if the admin exists
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', email)
      .single()

    if (adminError || !adminData) {
      return new Response(
        JSON.stringify({ success: false, error: "Admin user not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      )
    }

    // In a real implementation, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with an expiration time
    // 3. Send an email with a reset link
    
    // For this demonstration, we'll just return a success message
    // In a production environment, you would integrate with an email service
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "If your email exists in our system, you will receive password reset instructions"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
