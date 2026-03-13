import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { token } = req.query
  const { data: brv, error } = await supabaseAdmin.from('bid_request_vendors').select('*, bid_requests(*, projects(name)), vendors(name, email)').eq('token', token).single()
  if (error || !brv) return res.status(404).json({ error: 'Not found' })
  if (req.method === 'GET') return res.status(200).json(brv)
  if (req.method === 'POST') {
    const { total_price, notes, line_items } = req.body
    const { data: bid, error: bidErr } = await supabaseAdmin.from('bids').insert([{ bid_request_id: brv.bid_request_id, vendor_id: brv.vendor_id, total_price, notes, status: 'submitted' }]).select()
    if (bidErr) return res.status(500).json({ error: bidErr.message })
    if (line_items && line_items.length > 0) {
      await supabaseAdmin.from('bid_line_items').insert(line_items.map(item => ({ ...item, bid_id: bid[0].id })))
    }
    await supabaseAdmin.from('bid_request_vendors').update({ status: 'submitted' }).eq('token', token)
    return res.status(201).json(bid[0])
  }
  res.status(405).json({ error: 'Method not allowed' })
}