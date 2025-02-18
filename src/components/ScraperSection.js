'use client'
import { useState } from 'react';
import { scraperTeam } from '@/agents/scraperTeam';
import ReactMarkdown from 'react-markdown';

export default function ScraperSection() {
  const [scraperResult, setScraperResult] = useState(null);

  const scrapeWeb = async () => {
    setScraperResult(null);
    try {
      const output = await scraperTeam.start();
      if (output.status === 'FINISHED') {
        console.log(output.result);
        setScraperResult(output.result);
      } else if (output.status === 'BLOCKED') {
        console.log(`Scraping is blocked, unable to complete`);
      }
    } catch (error) {
      console.error('Error scraping web:', error);
    }
  };

  return (
    <div className="scraper-result">
      <h2>Scraper</h2>
      <div className="options">
        <button onClick={scrapeWeb}>
          Scrape Web
        </button>
      </div>
      <div className="scraper-result">
        {scraperResult !== null ? (
          <ReactMarkdown>{scraperResult}</ReactMarkdown>
        ) : (
          <p className="scraper-info">
            <span>ℹ️</span>
            <span>Click Scrape Web to start scraping</span>
          </p>
        )}
      </div>
    </div>
  );
}
