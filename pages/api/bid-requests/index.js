import { supabaseAdmin } from '../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
export default async function handler(req, res) {
  const org_id = req.headers['x-org-id'] || 'default'
  if (req.method === 'GET') {
    const { project_id } = req.query
    let query = supabaseAdmin.from('bid_requests').select('*, projects(name)').eq('org_id', org_id)
    if (project_id) query = query.eq('project_id', project_id)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    const { project_id, title, description, due_date, vendor_ids } = req.body
    const { data: br, error: brErr } = await supabaseAdmin.from('bid_requests').insert([{ project_id, title, description, due_date, org_id, status: 'draft' }]).select()
    if (brErr) return res.status(500).json({ error: brErr.message })
    if (vendor_ids && vendor_ids.length > 0) {
      const assignments = vendor_ids.map(vid => ({ bid_request_id: br[0].id, vendor_id: vid, token: uuidv4(), status: 'pending' }))
      await supabaseAdmin.from('bid_request_vendors').insert(assignments)
    }
    return res.status(201).json(br[0])
  }
  res.status(405).json({ error: 'Method not allowed' })
}