import { BaseAgent } from "./BaseAgent.js";
import fs from 'fs/promises'

export class ChapterEndAgent extends BaseAgent {
  constructor() {
    super('ChapterEndAgent');
    this.temperature = 0.3;
  }

  async chapterEnd(chapterNumber) {
    const outline = await fs.readFile('./outputs/outline.md', 'utf-8');
    // let response = await this.generate(
    //   `in the ${outline} if the final chapter is ${chapterNumber} return true else false`,
    //   { temperature: 0.5 }
    // );
    let response = await this.generate(
      `I am going to provide you chapter number and chapter.md file content, now tell me if the chapter is the final chapter or not on basis of chapter number and chapter file
      Chapter Number ${chapterNumber}
      Chapter Content ${outline}
      If the Chapter Number is the final chapter then return true else false nothing else than true and false please`,
      { temperature: 0.5 }
    )
 
    response = response.split('</think>')[1]
    console.log(response,'respponseeeeeee')

    if(response.includes('true')){
        return false
    }else{
        return true
    }
  }
}