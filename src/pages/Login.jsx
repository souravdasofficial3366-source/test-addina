import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';

// Admin email(s) — add your admin email addresses here
const ADMIN_EMAILS = [
  'souravdasofficial3366@gmail.com',
  // Add more admin emails as needed
];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // login or signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user came from /admin page (redirect=admin)
  const redirectTarget = searchParams.get('redirect');

  // Determine where to send user after login
  const getRedirectPath = (userEmail) => {
    // If user was trying to access admin and is an admin, send to admin
    if (redirectTarget === 'admin' && ADMIN_EMAILS.includes(userEmail?.toLowerCase())) {
      return '/admin';
    }
    // If user is admin and logging in normally, send to admin
    if (ADMIN_EMAILS.includes(userEmail?.toLowerCase())) {
      return '/admin';
    }
    // Regular users go to profile
    return '/profile';
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(getRedirectPath(data.user?.email));
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // Default name
            }
          }
        });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // Use the current origin (works for both localhost and Vercel)
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign Up</button>
        </div>

        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{mode === 'login' ? 'Login to manage your orders' : 'Join us for a better experience'}</p>

        {error && <div className="error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleAction}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="login-divider">OR CONTINUE WITH</div>

        <div className="social-btns">
          <button 
            className="social-btn google" 
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <FcGoogle className="btn-icon" />
            <span>Google</span>
          </button>

          <button 
            className="social-btn github" 
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <FaGithub className="btn-icon" />
            <span>GitHub</span>
          </button>
        </div>

        <div className="login-footer" style={{ marginTop: '30px' }}>
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
          <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); }}>
            {mode === 'login' ? ' Sign Up' : ' Login'}
          </a>
        </div>
      </div>
    </div>
  );
}
