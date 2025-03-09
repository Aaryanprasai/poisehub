
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
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "Token and new password are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Find the reset token
    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_reset_tokens')
      .select('*, admin_users(id, username)')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired reset token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    // Mark the token as used
    await supabase
      .from('admin_reset_tokens')
      .update({ used: true })
      .eq('token', token)

    // Update the admin's password
    // In a real implementation, you would hash the password first
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newPassword })
      .eq('id', tokenData.admin_id)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update password" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password has been reset successfully",
        admin: {
          id: tokenData.admin_users.id,
          username: tokenData.admin_users.username
        }
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
