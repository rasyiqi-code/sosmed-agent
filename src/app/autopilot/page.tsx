import { getAutopilotSettings } from '../actions/autopilot';
import AutopilotClient from './AutopilotClient';

export const dynamic = 'force-dynamic';

export default async function AutopilotPage() {
  const settings = await getAutopilotSettings();
  
  return (
    <AutopilotClient initialData={settings} />
  );
}
