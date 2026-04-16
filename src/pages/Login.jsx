import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import './Login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/admin'
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
        <h2>Welcome Back</h2>
        <p>Login to manage your orders and profile</p>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <div className="social-btns">
          <button 
            className="social-btn google" 
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <FcGoogle className="btn-icon" />
            <span>Continue with Google</span>
          </button>

          <button 
            className="social-btn github" 
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <FaGithub className="btn-icon" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="login-divider">OR</div>

        <p style={{ fontSize: '14px', color: '#888' }}>
          By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </p>

        <div className="login-footer">
          Don't have an account? <a href="/contact">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
