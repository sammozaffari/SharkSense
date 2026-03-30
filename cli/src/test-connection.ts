import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_KEY!

async function main() {
  console.log('Connecting to:', url)
  const db = createClient(url, key, { auth: { persistSession: false } })

  const { data, error } = await db.from('beaches').select('id').limit(1)

  if (error && error.code === '42P01') {
    console.log('Table "beaches" does not exist — migration needs to run')
    console.log('Attempting to create tables...')

    // Run migration SQL via Supabase Management API
    // Since we can't run raw SQL via the client library, we need another approach
    console.log('')
    console.log('Please run the migration SQL in the Supabase SQL Editor:')
    console.log('  Dashboard > SQL Editor > New Query > Paste & Run')
    console.log('  File: supabase/migrations/001_initial_schema.sql')
  } else if (error) {
    console.log('Error:', error.message, `(code: ${error.code})`)
  } else {
    console.log('Connected successfully! Beaches table exists.')
    console.log('Data:', data)
  }
}

main().catch(console.error)
