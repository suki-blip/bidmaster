import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { project_id, org_id, name, description, trade, deadline, vendor_ids } = req.body
    const { data: br, error } = await supabaseAdmin.from('bid_requests').insert({ project_id, org_id, name, description, trade, deadline, status: 'draft' }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    if (vendor_ids && vendor_ids.length > 0) {
      await supabaseAdmin.from('bid_request_vendors').insert(vendor_ids.map(v => ({ bid_request_id: br.id, vendor_id: v })))
    }
    return res.status(201).json(br)
  }
  if (req.method === 'GET') {
    const { project_id } = req.query
    const { data, error } = await supabaseAdmin.from('bid_requests').select('*, bid_request_vendors(*, vendors(*)), bids(*, bid_line_items(*), vendors(*))').eq('project_id', project_id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }
  res.status(405).end()
}