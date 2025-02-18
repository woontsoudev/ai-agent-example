'use client'
import { useState } from 'react';
import { blogTeam } from '@/agents/blogTeam';

export default function AgentInfoSection() {
  const [stats, setStats] = useState(null);

  // Connecting to the KaibanJS Store
  const useTeamStore = blogTeam.useStore();

  const {
    agents,
    tasks,
    teamWorkflowStatus
  } = useTeamStore(state => ({
    agents: state.agents,
    tasks: state.tasks,
    teamWorkflowStatus: state.teamWorkflowStatus
  }));

  return (
    <div>
      <div className="status">Status <span>{teamWorkflowStatus}</span></div>

      <h2 className="title">Agents</h2>
      <ul className="agent-list">
        {agents && agents.map((agent, index) => (
          <li key={index}>
            <img
              src={`https://ui-avatars.com/api/name=${encodeURIComponent(agent.name)}?background=3b82f6&color=fff`}
              alt={`${agent.name}'s avatar`}
            />
            <span>{agent.name}</span>
            <span>{agent.status}</span>
          </li>
        ))}
      </ul>

      <h2 className="title">Tasks</h2>
      <ul className="task-list">
        {tasks && tasks.map((task, index) => (
          <li key={index}>
            <span>{task.title}</span>
            <span>{task.status}</span>
          </li>
        ))}
      </ul>

      <h2 className="title">Stats</h2>
      {stats ? (
        <div className="stats">
          <p>
            <span>Total Tokens: </span>
            <span>{stats.totalTokenCount}</span>
          </p>
          <p>
            <span>Total Cost: </span>
            <span>${stats.totalCost.toFixed(4)}</span>
          </p>
          <p>
            <span>Duration: </span>
            <span>{stats.duration} ms</span>
          </p>
        </div>
      ) : (
        <div className="stats">
          <p className="stats-info">ℹ️ No stats generated yet.</p>
        </div>
      )}
    </div>
  );
}
