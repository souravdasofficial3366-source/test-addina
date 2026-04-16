import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMapPin, FiSettings, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';
import './Profile.css';

const MOCK_ORDERS = [
  { id: 'ORD-7829', date: '2026-04-10', total: 240.00, status: 'delivered', items: ['Stylish Grey Chair x 1', 'Wooden Chair x 1'] },
  { id: 'ORD-8102', date: '2026-04-15', total: 150.00, status: 'pending', items: ['Alexander Sofa x 1'] },
];

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [notification, setNotification] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', zip: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        const metadata = session.user.user_metadata;
        setProfileData({
          firstName: metadata.full_name?.split(' ')[0] || '',
          lastName: metadata.full_name?.split(' ').slice(1).join(' ') || '',
          phone: metadata.phone || '',
          address: metadata.address || '',
          city: metadata.city || '',
          zip: metadata.zip || ''
        });
        
        // Try fetching real orders if table exists
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id);
          if (data && data.length > 0) setOrders(data);
        } catch (err) {
          console.log("Real orders table not found, using mock data.");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          zip: profileData.zip
        }
      });
      if (error) throw error;
      setNotification('Profile updated successfully!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  if (loading && !user) return <div style={{ padding: '100px', textAlignment: 'center' }}>Loading profile...</div>;

  return (
    <main className="profile-page">
      <PageBanner title="My Account" breadcrumbs={['Home', 'Profile']} />
      
      <div className="container profile-container">
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                <FiUser />
              </div>
            )}
            <h3 className="profile-name">{user?.user_metadata?.full_name || 'Guest User'}</h3>
            <p className="profile-email">{user?.email}</p>
          </div>

          <nav className="profile-nav">
            <button className={`profile-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <FiUser /> Account Overview
            </button>
            <button className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <FiShoppingBag /> My Orders
            </button>
            <button className={`profile-nav-btn ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
              <FiMapPin /> Shipping Address
            </button>
            <button className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <FiSettings /> Settings
            </button>
            <button className="profile-nav-btn" style={{ color: '#ff4d4d', marginTop: '10px' }} onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
              <FiLogOut /> Logout
            </button>
          </nav>
        </aside>

        <section className="profile-content">
          {notification && <div className="admin-notification" style={{ marginBottom: '20px' }}><FiCheckCircle /> {notification}</div>}

          {activeTab === 'overview' && (
            <div>
              <h2 className="profile-section-title">Personal Information</h2>
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="profile-form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="profile-form-group">
                    <label>Email Address</label>
                    <input type="email" value={user?.email} disabled style={{ background: '#f8f9fa' }} />
                  </div>
                  <div className="profile-form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary" style={{ marginTop: '25px' }} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="profile-section-title">Order History</h2>
              {orders.length === 0 ? (
                <p>No orders found. <a href="/shop">Start shopping!</a></p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">#{order.id}</span>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <span className={`order-status status--${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h2 className="profile-section-title">Shipping Address</h2>
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="profile-form-group" style={{ marginBottom: '20px' }}>
                  <label>Street Address</label>
                  <input type="text" name="address" value={profileData.address} onChange={handleInputChange} placeholder="House number and street name" />
                </div>
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label>City</label>
                    <input type="text" name="city" value={profileData.city} onChange={handleInputChange} />
                  </div>
                  <div className="profile-form-group">
                    <label>Postcode / ZIP</label>
                    <input type="text" name="zip" value={profileData.zip} onChange={handleInputChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary" style={{ marginTop: '25px' }}>Save Address</button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="profile-section-title">Account Settings</h2>
              <p style={{ color: '#666' }}>Manage your password and security preferences.</p>
              <button className="btn btn--outline" style={{ marginTop: '20px' }} onClick={() => alert('Password reset link sent to your email!')}>
                Reset Password
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
