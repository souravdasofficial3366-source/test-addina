import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiCheckCircle,
  FiGrid, FiBox, FiDollarSign, FiFileText, FiShoppingBag, FiUsers, FiTrendingUp, FiLogOut
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Admin.css';

const MOCK_SALES_DATA = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
];

const MOCK_INVOICES = [
  { id: 'INV-001', date: '2026-04-12', customer: 'Emma Watson', amount: 899.00, status: 'Paid' },
  { id: 'INV-002', date: '2026-04-14', customer: 'John Doe', amount: 150.00, status: 'Pending' },
  { id: 'INV-003', date: '2026-04-15', customer: 'Sarah Connor', amount: 300.00, status: 'Paid' },
];

const MOCK_USERS = [
  { id: '1', name: 'Emma Watson', email: 'emma@example.com', joined: '2026-01-12', orders: 5, totalSpent: 2450.00 },
  { id: '2', name: 'John Doe', email: 'john@example.com', joined: '2026-02-14', orders: 2, totalSpent: 450.00 },
  { id: '3', name: 'Sarah Connor', email: 'sarah@example.com', joined: '2026-03-20', orders: 1, totalSpent: 300.00 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, inventory, billing, users
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '', price: '', original_price: '', image: '', badge: '', badge_type: '', rating: 5, category: '', description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setCurrentProduct(prev => ({ ...prev, image: publicUrl }));
      showNotification('Image uploaded successfully!');
    } catch (error) {
      setError('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => setCurrentProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: currentProduct.name, price: parseFloat(currentProduct.price) || 0,
        original_price: parseFloat(currentProduct.original_price) || null, image: currentProduct.image || 'https://via.placeholder.com/400x500',
        badge: currentProduct.badge, badge_type: currentProduct.badge_type,
        rating: parseInt(currentProduct.rating) || 5, category: currentProduct.category, description: currentProduct.description
      };

      if (currentProduct.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', currentProduct.id);
        if (error) throw error;
        showNotification('Product updated!');
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        showNotification('Product added!');
      }
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setCurrentProduct({ ...product, original_price: product.original_price || '', badge: product.badge || '', badge_type: product.badge_type || '', category: product.category || '', description: product.description || '' });
    setIsEditing(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showNotification('Product deleted!');
      fetchProducts();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const renderAnalytics = () => (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card"><div className="admin-stat-icon"><FiDollarSign /></div><div className="admin-stat-info"><h4>Total Revenue</h4><h3>$24,500</h3></div></div>
        <div className="admin-stat-card"><div className="admin-stat-icon"><FiShoppingBag /></div><div className="admin-stat-info"><h4>Total Orders</h4><h3>156</h3></div></div>
        <div className="admin-stat-card"><div className="admin-stat-icon"><FiBox /></div><div className="admin-stat-info"><h4>Products</h4><h3>{products.length}</h3></div></div>
        <div className="admin-stat-card"><div className="admin-stat-icon"><FiTrendingUp /></div><div className="admin-stat-info"><h4>Growth</h4><h3>+12.5%</h3></div></div>
      </div>
      <div className="admin-chart-card">
        <h3>Sales Overview & Revenue Tracking</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={MOCK_SALES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b5876d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#b5876d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#b5876d" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderBilling = () => (
    <div className="admin-table-card">
      <h3>Invoice Management</h3>
      <table className="admin-table">
        <thead>
          <tr><th>Invoice ID</th><th>Date</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {MOCK_INVOICES.map((inv) => (
            <tr key={inv.id}>
              <td><strong>{inv.id}</strong></td>
              <td>{inv.date}</td>
              <td>{inv.customer}</td>
              <td>${inv.amount.toFixed(2)}</td>
              <td><span className={`badge-pill badge--${inv.status === 'Paid' ? 'new' : 'sale'}`}>{inv.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>*Stripe API Integration Recommended to automatically sync real, dynamic invoices here.</p>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-table-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
        <h3>User Management</h3>
        <button className="btn btn--primary" onClick={() => alert('Exporting user data...')}>Export Users (CSV)</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th><th>Spent</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {MOCK_USERS.map((usr) => (
            <tr key={usr.id}>
              <td><strong>{usr.name}</strong></td>
              <td>{usr.email}</td>
              <td>{usr.joined}</td>
              <td>{usr.orders}</td>
              <td>${usr.totalSpent.toFixed(2)}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit" title="View Profile" onClick={() => alert('Viewing user profile...')}>👁️</button>
                  <button className="action-btn delete" title="Suspend User"><FiTrash2 /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInventory = () => (
    isEditing ? (
      <div className="admin-form-card">
        <div className="admin-card-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
          <h3>{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="icon-btn" onClick={() => setIsEditing(false)}><FiX /></button>
        </div>
        <form onSubmit={handleSave} className="admin-form">
          <div className="form-group grid-2">
            <div><label>Product Name</label><input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} required /></div>
            <div>
              <label>Image Upload</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                {uploadingImage && <span>Uploading...</span>}
              </div>
              {currentProduct.image && <img src={currentProduct.image} alt="Preview" style={{ height: '60px', marginTop: '10px', borderRadius: '4px' }} />}
            </div>
          </div>
          <div className="form-group grid-3">
            <div><label>Price</label><input type="number" step="0.01" name="price" value={currentProduct.price} onChange={handleInputChange} required /></div>
            <div><label>Original Price</label><input type="number" step="0.01" name="original_price" value={currentProduct.original_price} onChange={handleInputChange} /></div>
            <div><label>Rating</label><input type="number" min="1" max="5" name="rating" value={currentProduct.rating} onChange={handleInputChange} /></div>
          </div>
          <div className="form-group grid-2">
            <div><label>Category</label><input type="text" name="category" value={currentProduct.category} onChange={handleInputChange} /></div>
            <div><label>Badge</label><input type="text" name="badge" value={currentProduct.badge} onChange={handleInputChange} /></div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={currentProduct.description} onChange={handleInputChange} rows="3" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%', fontFamily: 'inherit' }}></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--outline" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={loading}><FiSave /> Save Product</button>
          </div>
        </form>
      </div>
    ) : (
      <div className="admin-table-card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
          <h3>Product Inventory</h3>
          <button className="btn btn--primary" onClick={() => { setCurrentProduct({ name: '', price: '', original_price: '', image: '', badge: '', badge_type: '', rating: 5, category: '', description: '' }); setIsEditing(true); }}><FiPlus /> New Product</button>
        </div>
        {loading && products.length === 0 ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><img src={p.image} alt={p.name} className="admin-table-img" /></td>
                  <td><strong>{p.name}</strong></td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>{p.category || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => editProduct(p)}><FiEdit2 /></button>
                      <button className="action-btn delete" onClick={() => deleteProduct(p.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          🛍️ ADDINA
        </div>
        <nav className="admin-sidebar__nav">
          <button className={`admin-sidebar__link ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setIsEditing(false); }}>
            <FiGrid /> Product Analytics
          </button>
          <button className={`admin-sidebar__link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <FiBox /> Inventory Management
          </button>
          <button className={`admin-sidebar__link ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => { setActiveTab('billing'); setIsEditing(false); }}>
            <FiFileText /> Invoices & Billing
          </button>
          <button className={`admin-sidebar__link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setIsEditing(false); }}>
            <FiUsers /> Registered Users
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>
            {activeTab === 'analytics' && 'Analytics Overview'}
            {activeTab === 'inventory' && 'Inventory Dashboard'}
            {activeTab === 'billing' && 'Billing & Invoices'}
            {activeTab === 'users' && 'User Management'}
          </h2>
          <div className="admin-header__user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.user_metadata?.full_name || user?.email}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Administrator</div>
            </div>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}><FiUsers /></div>
            )}
            <button 
              onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '20px', display: 'flex' }}
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </header>

        <div className="admin-container">
          {notification && <div className="admin-notification"><FiCheckCircle /> {notification}</div>}
          {error && <div className="admin-error"><strong>Error:</strong> {error}</div>}
          
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </main>
    </div>
  );
}
