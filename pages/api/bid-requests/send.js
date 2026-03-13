import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { bid_request_id, org_id } = req.body
  const { data: brv } = await supabaseAdmin.from('bid_request_vendors').select('*, vendors(*), bid_requests(name, deadline, projects(name))').eq('bid_request_id', bid_request_id)
  const results = []
  for (const row of brv) {
    const vendorUrl = process.env.NEXT_PUBLIC_APP_URL + '/vendor/' + row.token
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'BidMaster <bids@bidmaster.app>', to: row.vendors.email, subject: 'Bid Request: ' + row.bid_requests.name, html: '<p>Submit your bid: <a href=' + vendorUrl + '>Click here</a></p>' }) })
    }
    await supabaseAdmin.from('bid_request_vendors').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', row.id)
    results.push(row.vendors.email)
  }
  await supabaseAdmin.from('bid_requests').update({ status: 'sent' }).eq('id', bid_request_id)
  return res.json({ success: true, sent: results })
}