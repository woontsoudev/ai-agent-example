import BlogSection from '@/components/BlogSection';
import ScraperSection from '@/components/ScraperSection';
import MathSection from '@/components/MathSection';
import AgentInfoSection from '@/components/AgentInfoSection';

export default function Home() {
  return (
    <div className="container">
      <h1 className="header">AI Agents News Blogging Team</h1>
      <div className="grid">
        <div className="column">
          <ScraperSection />
          <MathSection />
          <BlogSection />
        </div>
        <div className="column">
          <AgentInfoSection />
        </div>
      </div>
    </div>
  );
}
