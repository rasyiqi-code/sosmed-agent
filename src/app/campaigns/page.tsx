import { getCampaigns } from '../actions/campaigns';
import CampaignsClient from './CampaignsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  
  return (
    <CampaignsClient initialCampaigns={campaigns} />
  );
}
