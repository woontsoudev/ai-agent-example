import { Agent, Task, Team } from 'kaibanjs';
import { DynamicTool } from "@langchain/core/tools";
import { SimpleRAG } from '@kaibanjs/tools';
import { z } from 'zod';

const postTypeEnum = z.enum(['jobPost', 'informativePost']);

const simpleRAGTool = new SimpleRAG({
  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  content: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    postId: z.string(),
  })
});

const scraperTool = new DynamicTool({
  name: 'scraperTool',
  description: 'A tool that automatically scrapes data from the DOM of the LinkedIn feed',
  func: async () => {
    const response = await fetch('/api/linkedin');
    const data = await response.json();
    return data;
  },
});

const scraperAgent = new Agent({
  name: 'Scraper',
  role: 'Scraper',
  goal: 'Scrape data from the DOM of the LinkedIn feed and return {title, description, link, postId}',
  tools: [scraperTool],
});

const scraperDataAnalyzerAgent = new Agent({
  name: 'Scraper Data Analyzer',
  role: 'Analyzer',
  goal: 'Analyze the data scraped from the DOM of the LinkedIn feed and return it as formatted {formattedData}',
  tools: [simpleRAGTool],
});

const scraperTask = new Task({
  name: 'Scrape data from the DOM of the LinkedIn feed',
  description: 'Scrape data from the DOM of the LinkedIn feed and return it as {scrapedData}',
  expectedOutput: z.object({
    scrapedData: z.string(),
  }),
  agent: scraperAgent,
});

const scraperDataAnalyzerTask = new Task({
  name: 'Analyze the data scraped from the DOM of the LinkedIn feed',
  description: 'Analyze the data scraped from the DOM of the LinkedIn feed and analyze the post type (jobPost or informativePost) and return the data as {title, description, link, postId, postType}',
  expectedOutput: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    postId: z.string(),
    postType: postTypeEnum,
  }),
  agent: scraperDataAnalyzerAgent,
});

const scraperTeam = new Team({
  name: 'Scraper Team',
  agents: [scraperAgent, scraperDataAnalyzerAgent],
  tasks: [scraperTask, scraperDataAnalyzerTask],
  env: { OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY }
});

export { scraperTeam };
