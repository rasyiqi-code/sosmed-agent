import { getActivePersona } from '../actions/persona';
import PersonaClient from './PersonaClient';

export const dynamic = 'force-dynamic';

export default async function PersonaPage() {
  const persona = await getActivePersona();
  
  return (
    <PersonaClient initialData={persona} />
  );
}
