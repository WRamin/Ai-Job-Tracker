// React hook to manage component state
import { useState } from 'react';

// Supabase client to interact with authentication
import { supabase } from '../supabaseClient';

// Functional component for authentication form
export default function Auth() {
  // Store the email entered by the user
  const [email, setEmail] = useState('');
  // Store the password entered by the user
  const [password, setPassword] = useState('');
  // Toggle between login and signup modes
  const [isLogin, setIsLogin] = useState(true);
  // Track any errors from Supabase
  const [error, setError] = useState<string | null>(null);

  // Function to handle login or signup
  const handleAuth = async () => {
    setError(null); // Clear any previous errors

    // Call Supabase auth method depending on mode
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password }) // Login
      : await supabase.auth.signUp({ email, password }); // Sign up

    if (error) {
      // Show error to user if something went wrong
      setError(error.message);
    } else {
      // Alert success (can later replace with nicer toast/notification)
      alert(isLogin ? 'Logged in!' : 'Signed up successfully!');
    }
  };

  // Return the actual form UI
  return (
    <div className="auth-form">
      {/* Title changes depending on login/signup */}
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input */}
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Display Supabase error if one exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Submit button (either login or signup) */}
      <button onClick={handleAuth}>{isLogin ? 'Login' : 'Sign Up'}</button>

      {/* Toggle link to switch between login/signup */}
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}
