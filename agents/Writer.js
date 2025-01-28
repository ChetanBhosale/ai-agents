import { BaseAgent } from './BaseAgent.js';
import ollama from 'ollama';
import fs from 'fs/promises';

export class Writer extends BaseAgent {
  constructor() {
    super('Writer');
    this.temperature = 0.6;
  }

  async writeChapter(chapterNumber) {
    const [outline, research] = await Promise.all([
      fs.readFile('./outputs/outline.md', 'utf-8'),
      fs.readFile(`./outputs/research/chapter-${chapterNumber}.md`, 'utf-8')
    ]);

    const stream = await ollama.generate({
      model: this.model,
      prompt: `Write Chapter ${chapterNumber} of "The Human and AI War". Use the following research to craft an emotionally resonant and immersive chapter that will captivate readers.

Research Context: ${research}

Story Guidelines:
Immerse the reader in the world through:
- Rich sensory details that bring scenes to life
- Dynamic character interactions that reveal personalities and motivations
- Natural dialogue that advances the plot and reveals character
- Internal thoughts and emotions shown through actions and reactions
- Mounting tension that builds to a meaningful climax
- A compelling hook ending that makes readers eager for the next chapter

Technical Requirements:
- Length: 600-800 words
- Format: Start with "Chapter ${chapterNumber}: [Chapter Title]" then jump directly into the story
- Style: Write in third person, past tense
- Tone: Serious and thought-provoking, exploring the complex relationship between humans and AI

Focus on creating visceral, emotional scenes that make readers feel:
- The tension in every conversation between humans and AI
- The weight of decisions that impact humanity's future
- The personal stakes for each character
- The mounting pressure as the conflict escalates

Remember: Show, don't tell. Let the story unfold through action, dialogue, and character decisions rather than exposition.`,
      options: { temperature: 0.8 },
      stream: true
    });

    let chapterContent = '';
    for await (const chunk of stream) {
      chapterContent += chunk.response;
      process.stdout.write(chunk.response); 
    }

    chapterContent = chapterContent.split('</think>')[1]

    const filename = `./outputs/chapters/chapter-${chapterNumber}.md`;
    await fs.writeFile(filename, chapterContent);
    await this.commitChanges([filename], `Added chapter ${chapterNumber}`);
  }
}