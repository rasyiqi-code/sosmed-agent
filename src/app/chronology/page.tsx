import { getContentNodes } from '../actions/chronology';
import ChronologyClient from './ChronologyClient';

export const dynamic = 'force-dynamic';

export default async function ChronologyPage() {
  const nodes = await getContentNodes();
  
  return (
    <ChronologyClient initialNodes={nodes} />
  );
}
