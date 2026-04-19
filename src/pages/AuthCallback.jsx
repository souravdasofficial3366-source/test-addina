import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Admin email(s) — must match Login.jsx
const ADMIN_EMAILS = [
  'souravdasofficial3366@gmail.com',
  // Add more admin emails as needed
];

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically picks up the tokens from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
          return;
        }

        if (session) {
          const userEmail = session.user?.email?.toLowerCase();
          // Route admin to admin panel, regular users to profile
          if (ADMIN_EMAILS.includes(userEmail)) {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontFamily: 'var(--ff-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #eee',
          borderTop: '3px solid var(--clr-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <p style={{ color: '#666', fontSize: '16px' }}>Signing you in...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
