import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiCheckCircle,
  FiGrid, FiBox, FiDollarSign, FiFileText, FiShoppingBag,
  FiUsers, FiTrendingUp, FiLogOut, FiSearch, FiMenu,
  FiUploadCloud, FiDownload, FiEye, FiFilter, FiArrowUp,
  FiArrowDown, FiCalendar, FiMail, FiUser, FiPackage
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Admin.css';

const SALES_DATA = [
  { name: 'Jan', sales: 4000, revenue: 2400, orders: 120 },
  { name: 'Feb', sales: 3000, revenue: 1398, orders: 98 },
  { name: 'Mar', sales: 5000, revenue: 9800, orders: 200 },
  { name: 'Apr', sales: 2780, revenue: 3908, orders: 140 },
  { name: 'May', sales: 1890, revenue: 4800, orders: 110 },
  { name: 'Jun', sales: 2390, revenue: 3800, orders: 95 },
  { name: 'Jul', sales: 3490, revenue: 4300, orders: 155 },
  { name: 'Aug', sales: 4100, revenue: 5200, orders: 170 },
];

const INVOICES_DATA = [
  { id: 'INV-001', date: '2026-04-12', customer: 'Emma Watson', email: 'emma@example.com', amount: 899.00, status: 'Paid', items: 3 },
  { id: 'INV-002', date: '2026-04-14', customer: 'John Doe', email: 'john@example.com', amount: 150.00, status: 'Pending', items: 1 },
  { id: 'INV-003', date: '2026-04-15', customer: 'Sarah Connor', email: 'sarah@example.com', amount: 1300.00, status: 'Paid', items: 5 },
  { id: 'INV-004', date: '2026-04-16', customer: 'Mike Johnson', email: 'mike@example.com', amount: 475.00, status: 'Overdue', items: 2 },
  { id: 'INV-005', date: '2026-04-17', customer: 'Lisa Park', email: 'lisa@example.com', amount: 2100.00, status: 'Paid', items: 4 },
  { id: 'INV-006', date: '2026-04-18', customer: 'David Smith', email: 'david@example.com', amount: 350.00, status: 'Pending', items: 2 },
];

const USERS_DATA = [
  { id: '1', name: 'Emma Watson', email: 'emma@example.com', joined: '2026-01-12', orders: 5, totalSpent: 2450.00, status: 'Active' },
  { id: '2', name: 'John Doe', email: 'john@example.com', joined: '2026-02-14', orders: 2, totalSpent: 450.00, status: 'Active' },
  { id: '3', name: 'Sarah Connor', email: 'sarah@example.com', joined: '2026-03-20', orders: 8, totalSpent: 3800.00, status: 'Active' },
  { id: '4', name: 'Mike Johnson', email: 'mike@example.com', joined: '2026-03-25', orders: 1, totalSpent: 190.00, status: 'Suspended' },
  { id: '5', name: 'Lisa Park', email: 'lisa@example.com', joined: '2026-04-01', orders: 3, totalSpent: 1220.00, status: 'Active' },
];

const RECENT_ORDERS = [
  { id: 'ORD-2041', customer: 'Emma Watson', date: 'Today', amount: 349.00 },
  { id: 'ORD-2040', customer: 'John Doe', date: 'Today', amount: 150.00 },
  { id: 'ORD-2039', customer: 'Lisa Park', date: 'Yesterday', amount: 890.00 },
  { id: 'ORD-2038', customer: 'Sarah Connor', date: 'Yesterday', amount: 220.00 },
  { id: 'ORD-2037', customer: 'David Smith', date: '2 days ago', amount: 475.00 },
];

const TAB_CONFIG = {
  analytics: { label: 'Dashboard', icon: FiGrid },
  inventory: { label: 'Products', icon: FiBox },
  billing: { label: 'Invoices', icon: FiFileText },
  users: { label: 'Users', icon: FiUsers },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: 'none', fontSize: '13px' }}>
      <p style={{ fontWeight: 700, color: '#333', marginBottom: '6px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>${p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('All');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [currentProduct, setCurrentProduct] = useState({
    name: '', price: '', original_price: '', image: '', badge: '', badge_type: '', rating: 5, category: '', description: ''
  });

  // Auth check
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

  // Fetch products
  useEffect(() => { fetchProducts(); }, []);

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
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
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
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setCurrentProduct(prev => ({ ...prev, image: publicUrl }));
      showNotification('Image uploaded successfully!');
    } catch (error) {
      setError('Error uploading image: ' + error.message);
    } finally { setUploadingImage(false); }
  };

  const handleInputChange = (e) => setCurrentProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: currentProduct.name, price: parseFloat(currentProduct.price) || 0,
        original_price: parseFloat(currentProduct.original_price) || null,
        image: currentProduct.image || 'https://via.placeholder.com/400x500',
        badge: currentProduct.badge, badge_type: currentProduct.badge_type,
        rating: parseInt(currentProduct.rating) || 5, category: currentProduct.category,
        description: currentProduct.description
      };
      if (currentProduct.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', currentProduct.id);
        if (error) throw error;
        showNotification('Product updated successfully!');
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        showNotification('Product added successfully!');
      }
      setIsEditing(false);
      fetchProducts();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const editProduct = (product) => {
    setCurrentProduct({
      ...product,
      original_price: product.original_price || '',
      badge: product.badge || '', badge_type: product.badge_type || '',
      category: product.category || '', description: product.description || ''
    });
    setIsEditing(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showNotification('Product deleted!');
      fetchProducts();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const openNewProduct = () => {
    setCurrentProduct({ name: '', price: '', original_price: '', image: '', badge: '', badge_type: '', rating: 5, category: '', description: '' });
    setIsEditing(true);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
    setSidebarOpen(false);
  };

  // Filtered data
  const filteredProducts = useMemo(() =>
    products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase())),
    [products, productSearch]
  );

  const filteredInvoices = useMemo(() =>
    INVOICES_DATA.filter(inv => {
      const matchFilter = invoiceFilter === 'All' || inv.status === invoiceFilter;
      const matchSearch = inv.customer.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.id.toLowerCase().includes(invoiceSearch.toLowerCase());
      return matchFilter && matchSearch;
    }),
    [invoiceFilter, invoiceSearch]
  );

  const filteredUsers = useMemo(() =>
    USERS_DATA.filter(usr => {
      const matchFilter = userStatusFilter === 'All' || usr.status === userStatusFilter;
      const matchSearch = usr.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        usr.email.toLowerCase().includes(userSearch.toLowerCase());
      return matchFilter && matchSearch;
    }),
    [userStatusFilter, userSearch]
  );

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const tabTitles = {
    analytics: { title: 'Dashboard', subtitle: 'Overview of your store performance' },
    inventory: { title: 'Products', subtitle: 'Manage your product inventory' },
    billing: { title: 'Invoices & Billing', subtitle: 'Track payments and invoices' },
    users: { title: 'User Management', subtitle: 'Manage registered customers' },
  };

  /* ========== RENDER: ANALYTICS ========== */
  const renderAnalytics = () => (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-label">Total Revenue</div>
            <div className="admin-stat-value">$24,500</div>
            <span className="admin-stat-trend up"><FiArrowUp /> 12.5%</span>
          </div>
          <div className="admin-stat-icon"><FiDollarSign /></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-label">Total Orders</div>
            <div className="admin-stat-value">156</div>
            <span className="admin-stat-trend up"><FiArrowUp /> 8.2%</span>
          </div>
          <div className="admin-stat-icon"><FiShoppingBag /></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-label">Products</div>
            <div className="admin-stat-value">{products.length}</div>
            <span className="admin-stat-trend up"><FiArrowUp /> 3 new</span>
          </div>
          <div className="admin-stat-icon"><FiBox /></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-label">Customers</div>
            <div className="admin-stat-value">{USERS_DATA.length}</div>
            <span className="admin-stat-trend up"><FiArrowUp /> 5.1%</span>
          </div>
          <div className="admin-stat-icon"><FiUsers /></div>
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Revenue Chart */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3>Revenue Overview</h3>
            <div className="filter-pills">
              <button className="filter-pill active">Monthly</button>
              <button className="filter-pill">Weekly</button>
            </div>
          </div>
          <div className="admin-card__body">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b18b5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#b18b5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#aaa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#aaa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#b18b5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="#2196F3" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3>Recent Orders</h3>
            <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => switchTab('billing')}>
              View All
            </button>
          </div>
          <div className="admin-card__body admin-card__body--flush">
            {RECENT_ORDERS.map((order) => (
              <div className="recent-order-item" key={order.id}>
                <div className="recent-order-customer">
                  <div className="recent-order-avatar">{getInitials(order.customer)}</div>
                  <div>
                    <div className="recent-order-name">{order.customer}</div>
                    <div className="recent-order-date">{order.date}</div>
                  </div>
                </div>
                <div className="recent-order-amount">${order.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Top Selling Products</h3>
          <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => switchTab('inventory')}>
            Manage Products
          </button>
        </div>
        <div className="admin-card__body admin-card__body--flush">
          {products.slice(0, 5).map((p, i) => (
            <div className="top-product-item" key={p.id}>
              <div className="top-product-rank">{i + 1}</div>
              <img src={p.image} alt={p.name} className="top-product-img" />
              <div className="top-product-info">
                <div className="top-product-name">{p.name}</div>
                <div className="top-product-category">{p.category || 'Uncategorized'}</div>
              </div>
              <div className="top-product-price">${parseFloat(p.price).toFixed(2)}</div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="admin-empty">
              <FiBox />
              <p>No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  /* ========== RENDER: INVENTORY ========== */
  const renderInventory = () => (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <h3>Product Inventory ({filteredProducts.length})</h3>
        <div className="admin-table-actions">
          <div className="admin-table-search">
            <FiSearch />
            <input
              type="text" placeholder="Search products..."
              value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn--primary" onClick={openNewProduct}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>
      <div className="admin-table-wrap">
        {loading && products.length === 0 ? (
          <div className="admin-empty"><p>Loading products...</p></div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <FiBox />
            <p>{productSearch ? 'No products match your search.' : 'No products found. Add your first product!'}</p>
            {!productSearch && (
              <button className="admin-btn admin-btn--primary" onClick={openNewProduct}>
                <FiPlus /> Add Product
              </button>
            )}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-table-product">
                      <img src={p.image} alt={p.name} className="admin-table-img" />
                      <div>
                        <div className="admin-table-product-name">{p.name}</div>
                        <div className="admin-table-product-id">ID: {String(p.id).slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--clr-primary)' }}>${parseFloat(p.price).toFixed(2)}</strong>
                    {p.original_price && (
                      <span style={{ textDecoration: 'line-through', color: '#bbb', marginLeft: '8px', fontSize: '12px' }}>
                        ${parseFloat(p.original_price).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td><span className="status-badge status-badge--draft">{p.category || 'N/A'}</span></td>
                  <td>{'⭐'.repeat(Math.min(p.rating || 0, 5))}</td>
                  <td>
                    {p.badge ? (
                      <span className={`status-badge status-badge--${p.badge_type === 'sale' ? 'pending' : 'active'}`}>
                        {p.badge}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Edit" onClick={() => editProduct(p)}><FiEdit2 /></button>
                      <button className="action-btn delete" title="Delete" onClick={() => deleteProduct(p.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  /* ========== RENDER: BILLING ========== */
  const renderBilling = () => (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <h3>Invoice Management ({filteredInvoices.length})</h3>
        <div className="admin-table-actions">
          <div className="filter-pills">
            {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
              <button
                key={f}
                className={`filter-pill ${invoiceFilter === f ? 'active' : ''}`}
                onClick={() => setInvoiceFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="admin-table-search">
            <FiSearch />
            <input
              type="text" placeholder="Search invoices..."
              value={invoiceSearch} onChange={(e) => setInvoiceSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td><strong style={{ color: '#333' }}>{inv.id}</strong></td>
                <td>
                  <div className="user-profile-inline">
                    <div className="user-avatar-sm">{getInitials(inv.customer)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{inv.customer}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>{inv.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '13px', color: '#666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCalendar style={{ fontSize: '12px' }} /> {inv.date}
                  </span>
                </td>
                <td>{inv.items} items</td>
                <td><strong style={{ color: '#333' }}>${inv.amount.toFixed(2)}</strong></td>
                <td>
                  <span className={`status-badge status-badge--${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="View Invoice"><FiEye /></button>
                    <button className="action-btn edit" title="Download"><FiDownload /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInvoices.length === 0 && (
          <div className="admin-empty">
            <FiFileText />
            <p>No invoices match your filter.</p>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          💡 <em>Connect Stripe API for real-time invoice sync and automated payment tracking.</em>
        </p>
      </div>
    </div>
  );

  /* ========== RENDER: USERS ========== */
  const renderUsers = () => (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <h3>Registered Users ({filteredUsers.length})</h3>
        <div className="admin-table-actions">
          <div className="filter-pills">
            {['All', 'Active', 'Suspended'].map(f => (
              <button
                key={f}
                className={`filter-pill ${userStatusFilter === f ? 'active' : ''}`}
                onClick={() => setUserStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="admin-table-search">
            <FiSearch />
            <input
              type="text" placeholder="Search users..."
              value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => alert('Exporting user data as CSV...')}>
            <FiDownload /> Export
          </button>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((usr) => (
              <tr key={usr.id}>
                <td>
                  <div className="user-profile-inline">
                    <div className="user-avatar-sm">{getInitials(usr.name)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{usr.name}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>{usr.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '13px', color: '#666' }}>{usr.joined}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <FiPackage style={{ fontSize: '13px', color: '#aaa' }} /> {usr.orders}
                  </span>
                </td>
                <td><strong style={{ color: 'var(--clr-primary)' }}>${usr.totalSpent.toFixed(2)}</strong></td>
                <td>
                  <span className={`status-badge status-badge--${usr.status.toLowerCase()}`}>
                    {usr.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="View Profile"><FiEye /></button>
                    <button className="action-btn edit" title="Edit User"><FiEdit2 /></button>
                    <button className="action-btn delete" title="Suspend User"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="admin-empty">
            <FiUsers />
            <p>No users match your search.</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ========== RENDER: PRODUCT MODAL ========== */
  const renderProductModal = () => (
    <div className="admin-modal-overlay" onClick={() => setIsEditing(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{currentProduct.id ? '✏️ Edit Product' : '➕ New Product'}</h3>
          <button className="admin-modal__close" onClick={() => setIsEditing(false)}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="admin-modal__body">
            <div className="admin-form-row cols-2">
              <div className="admin-form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} required placeholder="e.g. Modern Wooden Chair" />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <input type="text" name="category" value={currentProduct.category} onChange={handleInputChange} placeholder="e.g. Living Room" />
              </div>
            </div>

            <div className="admin-form-row cols-3">
              <div className="admin-form-group">
                <label>Price *</label>
                <input type="number" step="0.01" name="price" value={currentProduct.price} onChange={handleInputChange} required placeholder="0.00" />
              </div>
              <div className="admin-form-group">
                <label>Original Price</label>
                <input type="number" step="0.01" name="original_price" value={currentProduct.original_price} onChange={handleInputChange} placeholder="0.00" />
              </div>
              <div className="admin-form-group">
                <label>Rating (1-5)</label>
                <input type="number" min="1" max="5" name="rating" value={currentProduct.rating} onChange={handleInputChange} />
              </div>
            </div>

            <div className="admin-form-row cols-2">
              <div className="admin-form-group">
                <label>Badge Text</label>
                <input type="text" name="badge" value={currentProduct.badge} onChange={handleInputChange} placeholder="e.g. NEW, 10% OFF" />
              </div>
              <div className="admin-form-group">
                <label>Badge Type</label>
                <select name="badge_type" value={currentProduct.badge_type} onChange={handleInputChange}>
                  <option value="">None</option>
                  <option value="new">New (Dark)</option>
                  <option value="sale">Sale (Gold)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Product Image</label>
                <div className="admin-form-upload">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  <div className="admin-form-upload-label">
                    <FiUploadCloud style={{ display: 'block', margin: '0 auto 8px' }} />
                    {uploadingImage ? 'Uploading...' : 'Click or drag image to upload'}
                  </div>
                </div>
                {currentProduct.image && (
                  <img src={currentProduct.image} alt="Preview" className="admin-form-preview" />
                )}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Description</label>
                <textarea name="description" value={currentProduct.description} onChange={handleInputChange} rows="3" placeholder="Write a brief description of the product..." />
              </div>
            </div>
          </div>
          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--outline" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
              <FiSave /> {currentProduct.id ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  /* ========== MAIN RENDER ========== */
  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon">🛍️</div>
          <div>
            <div className="admin-sidebar__logo-text">ADDINA</div>
            <div className="admin-sidebar__logo-sub">Admin Panel</div>
          </div>
        </div>

        <div className="admin-sidebar__section-label">Main Menu</div>
        <nav className="admin-sidebar__nav">
          {Object.entries(TAB_CONFIG).map(([key, { label, icon: Icon }]) => (
            <button
              key={key}
              className={`admin-sidebar__link ${activeTab === key ? 'active' : ''}`}
              onClick={() => switchTab(key)}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              className="admin-header__hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <div className="admin-header__title">
              <h2>{tabTitles[activeTab].title}</h2>
              <p>{tabTitles[activeTab].subtitle}</p>
            </div>
          </div>

          <div className="admin-header__right">
            <div className="admin-header__search">
              <FiSearch className="admin-header__search-icon" />
              <input type="text" placeholder="Search anything..." />
            </div>
            <div className="admin-header__user">
              <div className="admin-header__user-info">
                <div className="admin-header__user-name">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
                </div>
                <div className="admin-header__user-role">Administrator</div>
              </div>
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="admin-header__avatar" />
              ) : (
                <div className="admin-header__avatar-placeholder">
                  {getInitials(user?.user_metadata?.full_name || user?.email || 'A')}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-container">
          {notification && (
            <div className="admin-notification">
              <FiCheckCircle /> {notification}
            </div>
          )}
          {error && (
            <div className="admin-error">
              <strong>Error:</strong> {error}
              <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', fontWeight: 700 }}>✕</button>
            </div>
          )}

          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </main>

      {/* Product Edit Modal */}
      {isEditing && renderProductModal()}
    </div>
  );
}
