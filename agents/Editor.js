import { BaseAgent } from './BaseAgent.js';
import fs from 'fs/promises';

export class Editor extends BaseAgent {
  constructor() {
    super('Editor');
    this.temperature = 0.4;
  }

  async editChapter(chapterNumber) {
    const chapterPath = `./outputs/chapters/chapter-${chapterNumber}.md`;
    const original = await fs.readFile(chapterPath, 'utf-8');
    
    const prompt = `Edit the following chapter for the book. Focus on:

1. **Grammar and Syntax**: Correct any grammatical errors or awkward phrasing.
2. **Flow and Pacing**: Ensure the story flows smoothly and maintains a good pace.
3. **Consistency**: Check for consistency in character behavior, plot details, and tone.
4. **Clarity**: Improve sentence structure and word choice for better readability.
5. **Engagement**: Enhance the narrative to make it more engaging and immersive.

Provide only the edited version of the chapter. Do not add new content or change the core plot. Ensure the final output is polished and ready for publication.

    ${original}

    `;
    
    let edited = await this.generate(prompt);
    edited = edited.split('</think>')[1]
    await fs.writeFile(chapterPath, edited);
    await this.commitChanges([chapterPath], `Edited chapter ${chapterNumber}`);
  }
}