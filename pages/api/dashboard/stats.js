import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const org_id = req.headers['x-org-id'] || 'default'
  const [projects, vendors, bids, bidRequests] = await Promise.all([
    supabaseAdmin.from('projects').select('id', { count: 'exact' }).eq('org_id', org_id),
    supabaseAdmin.from('vendors').select('id', { count: 'exact' }).eq('org_id', org_id),
    supabaseAdmin.from('bid_requests').select('id', { count: 'exact' }).eq('org_id', org_id),
    supabaseAdmin.from('bids').select('id', { count: 'exact' })
  ])
  return res.status(200).json({ projects: projects.count||0, vendors: vendors.count||0, bid_requests: bids.count||0, bids_received: bidRequests.count||0 })
}