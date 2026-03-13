import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { bid_id, bid_request_id } = req.body
  await supabaseAdmin.from('bids').update({ status: 'rejected' }).eq('bid_request_id', bid_request_id)
  await supabaseAdmin.from('bids').update({ status: 'accepted' }).eq('id', bid_id)
  await supabaseAdmin.from('bid_requests').update({ status: 'awarded' }).eq('id', bid_request_id)
  return res.status(200).json({ success: true })
}