import ollama from 'ollama';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import { config } from 'dotenv';

config();
const git = simpleGit();

export class BaseAgent {
  constructor(role) {
    this.role = role;
    this.model = process.env.MODEL_NAME || 'deepseek-r1:14b';
    this.temperature = 0.5;
  }

  async generate(prompt, options = {}) {
    try {
      const response = await ollama.generate({
        model: this.model,
        prompt: `${this.role} Instructions: ${prompt}`,
        options: {
          temperature: this.temperature,
          ...options,
        },
        stream: false, // Disable streaming for simplicity
      });
      console.log(response,'ressssposnse is working')
      return response.response.trim();
    } catch (error) {
      await this.log(`Generation error: ${error.message}`);
      return '';
    }
  }

  async chat(messages, options = {}) {
    try {
      const response = await ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: `You are a ${this.role} agent` },
          ...messages,
        ],
        options: {
          temperature: this.temperature,
          ...options,
        },
        stream: false, // Disable streaming for simplicity
      });
      return response.message.content.trim();
    } catch (error) {
      await this.log(`Chat error: ${error.message}`);
      return '';
    }
  }

  async commitChanges(files, message) {
    try {
      await git.add(files);
      await git.commit(message);
      await git.push('origin', 'main');
      await this.log(`Committed: ${message}`);
    } catch (error) {
      await this.handleGitError(error);
    }
  }

  async handleGitError(error) {
    await this.log(`Git error: ${error.message}`);
    await git.reset('hard');
    await git.pull('origin', 'main');
  }

  async log(message) {
    const entry = `[${new Date().toISOString()}] ${this.role}: ${message}\n`;
    await fs.appendFile('./outputs/activity.log', entry);
  }

  
}