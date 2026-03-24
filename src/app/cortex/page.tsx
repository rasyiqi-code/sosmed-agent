import { getKnowledgeAssets } from '../actions/cortex';
import CortexClient from './CortexClient';

export const dynamic = 'force-dynamic';

export default async function CortexPage() {
  const assets = await getKnowledgeAssets();
  
  return (
    <CortexClient initialAssets={assets} />
  );
}
