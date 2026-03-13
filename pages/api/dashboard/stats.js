import { supabaseAdmin } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { org_id } = req.query
  if (!org_id) return res.status(400).json({ error: 'org_id required' })
  const [projects, bids] = await Promise.all([
    supabaseAdmin.from('projects').select('id,status').eq('org_id', org_id),
    supabaseAdmin.from('bids').select('id').eq('org_id', org_id)
  ])
  return res.json({ activeProjects: projects.data?.length||0, bidsReceived: bids.data?.length||0 })
}