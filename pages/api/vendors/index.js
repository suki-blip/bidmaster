import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const org_id = req.headers['x-org-id'] || 'default'
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('vendors').select('*').eq('org_id', org_id).order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    const { name, email, phone, trade, address } = req.body
    const { data, error } = await supabaseAdmin.from('vendors').insert([{ name, email, phone, trade, address, org_id, status: 'active' }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }
  res.status(405).json({ error: 'Method not allowed' })
}