import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { bid_id, bid_request_id, org_id } = req.body
  await supabaseAdmin.from('bids').update({ status: 'winner' }).eq('id', bid_id)
  await supabaseAdmin.from('bids').update({ status: 'rejected' }).eq('bid_request_id', bid_request_id).neq('id', bid_id)
  await supabaseAdmin.from('bid_requests').update({ status: 'closed' }).eq('id', bid_request_id)
  await supabaseAdmin.from('activity_log').insert({ org_id, action: 'winner_selected', entity_type: 'bid', entity_id: bid_id, meta: { bid_request_id } })
  return res.json({ success: true })
}