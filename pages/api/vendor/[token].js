import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { token } = req.query
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('bid_request_vendors').select('*, vendors(*), bid_requests(*, projects(*))').eq('token', token).single()
    if (error || !data) return res.status(404).json({ error: 'Not found' })
    if (data.status === 'sent') await supabaseAdmin.from('bid_request_vendors').update({ status: 'viewed' }).eq('token', token)
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { line_items, notes } = req.body
    const { data: brv } = await supabaseAdmin.from('bid_request_vendors').select('*, bid_requests(org_id, project_id)').eq('token', token).single()
    if (!brv) return res.status(404).json({ error: 'Invalid token' })
    const { data: bid } = await supabaseAdmin.from('bids').insert({ bid_request_id: brv.bid_request_id, vendor_id: brv.vendor_id, bid_request_vendor_id: brv.id, org_id: brv.bid_requests.org_id, notes, status: 'submitted' }).select().single()
    if (line_items?.length) await supabaseAdmin.from('bid_line_items').insert(line_items.map(i => ({ ...i, bid_id: bid.id })))
    await supabaseAdmin.from('bid_request_vendors').update({ status: 'submitted' }).eq('token', token)
    return res.status(201).json({ success: true })
  }
  res.status(405).end()
}