import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const org_id = req.headers['x-org-id'] || 'default'
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('projects').select('*').eq('org_id', org_id).order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    const { name, description, location, budget } = req.body
    const { data, error } = await supabaseAdmin.from('projects').insert([{ name, description, location, budget, org_id, status: 'active' }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }
  res.status(405).json({ error: 'Method not allowed' })
}