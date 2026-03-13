import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { org_id } = req.query
  if (!org_id) return res.status(400).json({ error: 'org_id required' })
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('vendors').select('*').eq('org_id', org_id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin.from('vendors').insert({ ...req.body, org_id }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }
  res.status(405).end()
}