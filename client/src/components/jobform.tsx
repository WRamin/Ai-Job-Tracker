import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// This form lets the authenticated user submit a new job application
export default function JobForm({ user }: { user: any }) {
  // Form fields for job application details
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('Applied'); // Default value
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');

  // For success or error messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Insert data into 'job_applications' table
    const { error } = await supabase.from('job_applications').insert([
      {
        user_id: user.id,              // Links the record to the user
        company: company,
        job_title: jobTitle,
        job_description: jobDescription,
        status: status,
        applied_date: appliedDate,     // Format: 'YYYY-MM-DD'
        notes: notes,
      },
    ]);

    // Show result feedback
    if (error) {
      setError(error.message);
      setSuccess(null);
    } else {
      setSuccess('Application submitted!');
      setError(null);
      // Reset form fields
      setCompany('');
      setJobTitle('');
      setJobDescription('');
      setStatus('Applied');
      setAppliedDate('');
      setNotes('');
    }
  };

  // Render the form UI
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Job Application</h2>

      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input
        type="date"
        value={appliedDate}
        onChange={(e) => setAppliedDate(e.target.value)}
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Submit</button>

      {/* Feedback messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
