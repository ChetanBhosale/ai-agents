import { BaseAgent } from './BaseAgent.js';
import fs from 'fs/promises';
import PDFDocument from 'pdfkit';

export class Publisher extends BaseAgent {
  constructor() {
    super('Publisher');
    this.temperature = 0.3;
  }

  async compileBook() {
    const chapters = await this.getChapterFiles();
    let finalContent = '';
    
    for (const chapter of chapters) {
      finalContent += await fs.readFile(chapter, 'utf-8') + '\n\n';
    }

    // Save as Markdown
    await fs.writeFile('./outputs/final/book.md', finalContent);
    
    // Create PDF
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream('./outputs/final/book.pdf'));
    pdf.text(finalContent);
    pdf.end();

    await this.commit('./outputs/final/', 'Published final book version');
  }

  async getChapterFiles() {
    const files = await fs.readdir('./outputs/chapters/');
    return files
      .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]))
      .map(f => `./outputs/chapters/${f}`);
  }
}