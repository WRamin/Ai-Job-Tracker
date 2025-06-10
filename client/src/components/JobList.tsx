import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Define the structure of a job entry
interface Job {
  id: number;
  company: string;
  position: string;
  status: string;
  applied_at: string;
}

// Functional component that accepts the logged-in user as a prop
export default function JobList({ user }: { user: any }) {
  // Local state to hold job application data
  const [jobs, setJobs] = useState<Job[]>([]);
  // Track loading state while fetching data
  const [loading, setLoading] = useState(true);

  //track which job is being edited 
    const [editingJobId, setEditingJobId] = useState<number | null>(null);
    const [editStatus, setEditStatus] = useState('');

  // useEffect will run once when the component mounts
  useEffect(() => {
    // Async function to fetch job applications from Supabase
    const fetchJobs = async () => {
      setLoading(true); // Set loading state to true before fetching

      // Fetch data from 'job_applications' table where user_id matches current user
      const { data, error } = await supabase
        .from('job_applications')             // Table name
        .select('*')                          // Select all columns
        .eq('user_id', user.id)               // Filter by current user's ID
        .order('applied_at', { ascending: false }); // Sort by newest first

      if (error) {
        console.error('Error fetching jobs:', error.message); // Log any error
      } else {
        setJobs(data as Job[]); // Save the jobs to state if successful
      }

      setLoading(false); // Done loading
    };

    fetchJobs(); // Run the fetch function on mount
  }, [user.id]); // Run again if user ID changes

  // delete a job from Supabase and update local state
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting job: ' + error.message);
    } else {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  // update a job's status
  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: editStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating job: ' + error.message);
    } else {
      // Re-fetch job list after update
      const updatedJobs = jobs.map((job) =>
        job.id === id ? { ...job, status: editStatus } : job
      );
      setJobs(updatedJobs);
      setEditingId(null);
    }
  };

  // Render the list of jobs
  return (
    <div>
      <h2>Your Applications</h2>

      {/* Loading message while fetching */}
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        // If no jobs found
        <p>No job applications found.</p>
      ) : (
        // Otherwise display the jobs in a list
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.position}</strong> at {job.company} — {job.status}
              <br />
              Status: {editingId === job.id ? (
                <>
                  <input
                    type="text"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(job.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {job.status}{' '}
                  <button
                    onClick={() => {
                      setEditingId(job.id);
                      setEditStatus(job.status);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
              <br />
              <small>
                Applied on {new Date(job.applied_at).toLocaleDateString()}
              </small>
              <br />
              <button onClick={() => handleDelete(job.id)} style={{ color: 'red' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
