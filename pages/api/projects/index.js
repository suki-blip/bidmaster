import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { org_id } = req.query
  if (!org_id) return res.status(400).json({ error: 'org_id required' })
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('projects').select('*, bid_requests(id,name,status,deadline,bids(id,status))').eq('org_id', org_id).order('created_at',{ascending:false})
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin.from('projects').insert({ ...req.body, org_id }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    await supabaseAdmin.from('activity_log').insert({ org_id, project_id: data.id, action: 'project_created', entity_type: 'project', entity_id: data.id, meta: { name: data.name } })
    return res.status(201).json(data)
  }
  res.status(405).end()
}