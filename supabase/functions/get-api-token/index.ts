import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'ok' })
    return
  }

  try {
    const supabaseClient = createClient(
      'https://lanlhnmmimdvdxmqzzzy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhbmxobm1taW1kdmR4bXF6enp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NzU3ODMsImV4cCI6MjA1MjM1MTc4M30.fJIXQ8jJujfocwSH8NItEOku8JGRa9e4923QALQeO34'
    )

    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('No user found')
    }

    // Hardcoded API token
    const apiToken = 'bnb_api_fserkjgsewnrupigiopvfghp9845ysut98guys93ur0945yu3ur0945yu4we90u509tuabuoiewjhgnriteugh'

    console.log('Successfully retrieved API token')

    res.status(200)
       .set(corsHeaders)
       .json({ secret: apiToken })
  } catch (error) {
    console.error('Error in get-api-token function:', error.message)
    res.status(400)
       .set(corsHeaders)
       .json({ error: error.message })
  }
}
