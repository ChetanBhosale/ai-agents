import { ChapterEndAgent } from './agents/ChapterEndAgent.js';
import { Editor } from './agents/Editor.js';
import { ProjectManager } from './agents/ProjectManager.js';
import { Publisher } from './agents/Publisher.js';
import { Researcher } from './agents/Researcher.js';
import { Writer } from './agents/Writer.js';
import './config/gitSetup.js';


let currentChapter = 1;

const startOllama = async () => {
    try {
      const { exec } = await import('child_process');
      exec('ollama serve &', (error) => {
        if (error) {
          console.error('Failed to start Ollama:', error.message);
          process.exit(1);
        }
      });
      console.log('Ollama server started.');
    } catch (error) {
      console.error('Error starting Ollama:', error.message);
    }
  };

async function productManagerDecision(){
  const pm = new ProjectManager();
  console.log('yes this is working fine')
  await pm.createOutline();
  console.log('Outline created');

}

let finalValue = true


const scheduleTasks = async() => {
  console.log(finalValue,'final value')
  while(finalValue){
    const finalChapter = new ChapterEndAgent();
    let chapterEnd = await finalChapter.chapterEnd(currentChapter);
    console.log(chapterEnd,'chapter end')
    if(chapterEnd === false){
      finalValue = false
      console.log('final chapter reached')
      break;
    }

    const researcher = new Researcher();
    await researcher.gatherResearch(currentChapter);
    console.log('Research gathered');
  
  
    const writer = new Writer();
    await writer.writeChapter(currentChapter);
    console.log('Chapter written');

    const editor = new Editor()
    await editor.editChapter(currentChapter)
    console.log('chapter edited successfully!')
    currentChapter++;
  }
    
}

async function compileBook(){
    const publisher = new Publisher();
    await publisher.compileBook();
    console.log('Book compiled');
}

  (async () => {
    await startOllama();
    await productManagerDecision()
    await scheduleTasks();
    await compileBook()
  })();
