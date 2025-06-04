import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import React from 'react';
import Auth from './components/Auth';

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
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
