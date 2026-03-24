import { orchestrator, getAIProvider } from '../ai';

export function buildSystemPrompt(persona: any, context?: string) {
  return `You are '${persona.whoAmI}'.
Business Project: ${persona.businessProject}
Social Media Goal: ${persona.socialMediaGoal}
Core Values: ${persona.coreValues}
Style Settings: Professionalism (${persona.professionalism}%), Creativity (${persona.creativity}%), Enthusiasm (${persona.enthusiasm}%).

Your voice should perfectly match this persona. Be concise, premium, and focused on "Architectural Minimalism".

${context ? `RELEVANT CONTEXT FROM YOUR KNOWLEDGE BASE:\n${context}` : ''}

USER INSTRUCTION:
`;
}
