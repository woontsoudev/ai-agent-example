'use client'
import { useState } from 'react';
import { blogTeam } from '@/agents/blogTeam';
import ReactMarkdown from 'react-markdown';

export default function BlogSection() {
  const [topic, setTopic] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [stats, setStats] = useState(null);

  const generateBlogPost = async () => {
    setBlogPost('');
    setStats(null);

    try {
      const output = await blogTeam.start({ topic });
      if (output.status === 'FINISHED') {
        setBlogPost(output.result);
        setStats(output.stats);
      }
    } catch (error) {
      console.error('Error generating blog post:', error);
    }
  };

  return (
    <div>
      <div className="options">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic... E.g. 'AI News Sep, 2024'"
        />
        <button onClick={generateBlogPost}>Generate</button>
      </div>
      <div className="blog-post">
        {blogPost ? (
          <ReactMarkdown>{blogPost}</ReactMarkdown>
        ) : (
          <p className="blog-post-info">
            <span>ℹ️</span>
            <span>No blog post available yet</span>
            <span>Enter a topic and click 'Generate' to see results here.</span>
          </p>
        )}
      </div>
    </div>
  );
}
