import { BaseAgent } from './BaseAgent.js';
import fs from 'fs/promises';


export class Researcher extends BaseAgent {
  constructor() {
    super('Researcher');
    this.temperature = 0.7;
  }

  async gatherResearch(chapterNumber) {
    const outline = await fs.readFile('./outputs/outline.md', 'utf-8');
    
    let research = await this.generate(
      `
      Conduct detailed research for only Chapter Number ${chapterNumber} of the book. Use the following outline as a guide but only create research for chapter Number ${chapterNumber}:

1. **Outline**: ${outline}

Focus on:
1. **Historical Context**: Research real-world examples of human-machine conflicts or collaborations.
2. **Technological Insights**: Explore current AI capabilities and future predictions.
3. **Ethical Dilemmas**: Gather information on the ethical implications of AI in warfare.
4. **Character Background**: Provide insights into the psychology of humans and AI in conflict situations.

Ensure the research is comprehensive and well-organized, providing the writer with enough material to create a compelling and realistic chapter. Present the research in a clear and concise manner.
      `,
      { temperature: 0.6 }
    );

    console.log(research,'research generated')

    research = research.split('</think>')[1]

    const filename = `./outputs/research/chapter-${chapterNumber}.md`;
    await fs.writeFile(filename, research);
    await this.commitChanges([filename], `Research for chapter ${chapterNumber}`);
  }
}