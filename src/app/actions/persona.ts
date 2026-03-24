'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getActivePersona() {
  try {
    let persona = await prisma.persona.findFirst();
    
    if (!persona) {
      // Seed initial default persona if database is fresh
      persona = await prisma.persona.create({
        data: {
          whoAmI: "Digital Architect & Minimalist Design Consultant based in Jakarta. Specializing in high-end UI/UX and automation systems.",
          businessProject: "Antigravity Studio",
          socialMediaGoal: "Authority Building & Leads",
          coreValues: "Passion for extreme minimalism, mechanical watches, and the intersection of AI and human creativity. Believes in 'relentless presence' with zero friction.",
          professionalism: 80,
          creativity: 65,
          enthusiasm: 40,
          isAutopilotEnabled: true,
          postsPerDay: 4,
          narrativeFocus: "Focusing on high-end minimalism and AI integration."
        } as any
      });
    }
    
    return persona;
  } catch (error) {
    console.warn("Database unavailable during build or runtime. Returning default persona.");
    return {
      id: "dummy-id",
      whoAmI: "Digital Architect & Minimalist Design Consultant based in Jakarta. Specializing in high-end UI/UX and automation systems.",
      businessProject: "Antigravity Studio",
      socialMediaGoal: "Authority Building & Leads",
      coreValues: "Passion for extreme minimalism, mechanical watches, and the intersection of AI and human creativity. Believes in 'relentless presence' with zero friction.",
      professionalism: 80,
      creativity: 65,
      enthusiasm: 40,
      isAutopilotEnabled: true,
      postsPerDay: 4,
      narrativeFocus: "Focusing on high-end minimalism and AI integration."
    };
  }
}

export async function updatePersona(id: string, formData: any) {
  try {
    const updated = await prisma.persona.update({
      where: { id },
      data: {
        whoAmI: formData.whoAmI,
        businessProject: formData.businessProject,
        socialMediaGoal: formData.socialMediaGoal,
        coreValues: formData.coreValues,
        professionalism: formData.professionalism,
        creativity: formData.creativity,
        enthusiasm: formData.enthusiasm,
        isAutopilotEnabled: formData.isAutopilotEnabled,
        postsPerDay: formData.postsPerDay,
        narrativeFocus: formData.narrativeFocus,
      } as any
    });
    
    revalidatePath('/persona');
    return { success: true, persona: updated };
  } catch (error) {
    console.error("Failed to update Persona:", error);
    return { success: false, error: 'Database update failed.' };
  }
}
