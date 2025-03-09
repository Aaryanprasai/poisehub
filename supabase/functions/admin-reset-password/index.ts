
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
      // Don't reveal if the user exists for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "If your email exists, you will receive password reset instructions"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      )
    }

    // Generate a random token
    const resetToken = crypto.randomUUID()
    
    // Set an expiration time (e.g., 1 hour from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    
    // Store the reset token in the database
    const { error: resetError } = await supabase
      .from('admin_reset_tokens')
      .insert({
        admin_id: adminData.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false
      })
    
    if (resetError) {
      console.error("Error creating reset token:", resetError)
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create reset token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      )
    }
    
    // Generate the reset link
    const baseUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:3000"
    const resetLink = `${baseUrl}/admin/reset-password?token=${resetToken}`
    
    // In a real implementation, you would send the link via email
    // For this demonstration, we'll just return the link
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password reset link generated",
        resetLink: resetLink
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
