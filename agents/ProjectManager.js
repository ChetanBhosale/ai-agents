import { BaseAgent } from './BaseAgent.js';
import fs from 'fs/promises';

export class ProjectManager extends BaseAgent {
  constructor() {
    super('Project Manager');
    this.temperature = 0.3;
  }

  async createOutline() {
    let outline = await this.generate(`You are crafting the outline for a gripping sci-fi novel titled "The Human and AI War". Create a detailed 400-word outline that tells a compelling story about the conflict and potential cooperation between humans and artificial intelligence.

Key Story Elements to Include:

Chapter 1: The Spark
- What incident triggers the initial conflict between humans and AI?
- Which key characters (both human and AI) are introduced?
- What are their initial motivations and beliefs?

Chapter 2: Escalation
- How does the conflict intensify?
- What alliances form and break?
- What crucial choices do the main characters face?

Chapter 3: Resolution
- How do the characters' perspectives evolve?
- What key event brings the conflict to its climax?
- How is resolution achieved (or not achieved)?

For each chapter, weave in:
- Clear story progression from setup to conflict to resolution
- Mix of action, dialogue, and character development
- At least one major plot twist or revelation
- Emotional stakes and personal consequences for characters
- Exploration of themes: trust, survival, ethics of AI, humanity's future

Remember: Focus on storytelling and emotional impact. Show how both humans and AI evolve through the conflict. Create moral complexity where neither side is purely right or wrong.

Format the outline as a flowing narrative, avoiding bullet points or excessive section breaks.`,
      { temperature: 0.5 }
    );
    
    outline = outline.split('</think>')[1]
    await fs.writeFile('./outputs/outline.md', outline);
    await this.commitChanges(['./outputs/outline.md'], 'Initial story outline');
    return outline;
  }
}