import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://bzdmmfyvufkzusloibad.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZG1tZnl2dWZrenVzbG9pYmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzMwMzEsImV4cCI6MjA3Njg0OTAzMX0.E_0Ln8YJryJPeQOhC99cVsuNfEEoAuQy63z6T9qLkYc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

