import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ebcpnizfljlqihrapyt.supabase.co'
const supabaseAnonKey = 'sb_publishable_lcafV8oqboNAga6C7HJ7Nw_0sirak05'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)