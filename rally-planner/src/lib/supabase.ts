import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcilxpbnfetsargvzqvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaWx4cGJuZmV0c2FyZ3Z6cXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTExMTgsImV4cCI6MjA3MjA2NzExOH0.QwiD15zeENEXTgVXBSYeIZYDeeDdvNBYtRBvb3y4o84'

export const supabase = createClient(supabaseUrl, supabaseKey)
