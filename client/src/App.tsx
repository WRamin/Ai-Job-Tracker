import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import JobForm from './components/Jobform'; 
import JobList from './components/JobList';

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div>
      <h1>Job Application Tracker</h1>

      {session ? (
        <div>
          <p>You're logged in.</p>
          <button onClick={handleLogout}>Logout</button>

          {/* Job submission form shows only if user is logged in */}
          <JobForm user={session.user} />
          <JobList user={session.user} /> 
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
