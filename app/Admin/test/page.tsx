'use client';

import { getProjects } from '@/app/backend/api/supabaseConnection'; // Import your service
import React, { useState } from 'react';

const TestSupabase: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]); // Store the projects in the state
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  // Function to handle the click event and fetch projects
  const handleFetchProjects = async () => {
    setLoading(true);
    setError(null); // Reset the error message
    try {
      const fetchedProjects = await getProjects();
      console.log (fetchedProjects)
      setProjects(fetchedProjects); // Set the fetched projects to state
    } catch (err) {
      setError('Error fetching projects.'); // Set error message
    } finally {
      setLoading(false); // Turn off the loading state
    }
  };

  return (
    <div>
      <h1>Supabase Test</h1>
      <button onClick={handleFetchProjects} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Projects'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project, index) => (
              <li key={index}>
                <strong>{project.ProjName}</strong> - {project.Agency}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default TestSupabase;
