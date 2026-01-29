import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Palette, ShoppingBag, BookOpen, FileText, Plus, Edit, Trash2, 
  Users, Mail, BarChart, Shield, UserX, CheckCircle, XCircle,
  Settings, Database, Server, Globe, Cpu, Zap, Activity,
  Eye, EyeOff, Filter, Search, Download, Upload,
  Lock, Unlock, ShieldCheck, AlertTriangle, Star, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchArtworks, fetchShopItems, fetchCourses, fetchBlogs,
  createArtwork, updateArtwork, deleteArtwork,
  createShopItem, updateShopItem, deleteShopItem,
  createCourse, updateCourse, deleteCourse,
  createBlog, updateBlog, deleteBlog,
  getDashboardStats, getAllUsers, updateUserRole, deleteUser,
  getAllContacts, deleteContact, updateContactStatus,
  getAllSubscribers, deleteSubscriber
} from '../services/api';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  
  const containerRef = useRef(null);
  const statsRef = useRef([]);

  // Redirect if not admin
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <BarChart size={20} />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'artworks', 
      label: 'Artworks', 
      icon: <Palette size={20} />,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'shop', 
      label: 'Shop', 
      icon: <ShoppingBag size={20} />,
      color: 'from-emerald-500 to-green-500'
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: <BookOpen size={20} />,
      color: 'from-orange-500 to-yellow-500'
    },
    { 
      id: 'blogs', 
      label: 'Blogs', 
      icon: <FileText size={20} />,
      color: 'from-rose-500 to-red-500'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: <Users size={20} />,
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      icon: <Mail size={20} />,
      color: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 'subscribers', 
      label: 'Subscribers', 
      icon: <Star size={20} />,
      color: 'from-yellow-500 to-amber-500'
    },
  ];

  const loadItems = async () => {
    setLoading(true);
    try {
      let data;
      switch (activeTab) {
        case 'dashboard':
          data = await getDashboardStats();
          setDashboardStats(data.data);
          break;
        case 'users':
          data = await getAllUsers();
          setUsers(data.data);
          break;
        case 'contacts':
          data = await getAllContacts();
          setContacts(data.data);
          break;
        case 'subscribers':
          data = await getAllSubscribers();
          setSubscribers(data.data);
          break;
        case 'artworks':
          data = await fetchArtworks();
          setItems(data);
          break;
        case 'shop':
          data = await fetchShopItems();
          setItems(data);
          break;
        case 'courses':
          data = await fetchCourses();
          setItems(data);
          break;
        case 'blogs':
          data = await fetchBlogs();
          setItems(data);
          break;
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (activeTab) {
        case 'artworks':
          await deleteArtwork(id);
          break;
        case 'shop':
          await deleteShopItem(id);
          break;
        case 'courses':
          await deleteCourse(id);
          break;
        case 'blogs':
          await deleteBlog(id);
          break;
        case 'users':
          await deleteUser(id);
          break;
        case 'contacts':
          await deleteContact(id);
          break;
        case 'subscribers':
          await deleteSubscriber(id);
          break;
      }
      loadItems();
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      loadItems();
      alert('User role updated successfully!');
    } catch (error) {
      alert('Error updating role: ' + error.message);
    }
  };

  const handleContactStatusUpdate = async (contactId, status) => {
    try {
      await updateContactStatus(contactId, status);
      loadItems();
    } catch (error) {
      alert('Error updating contact status: ' + error.message);
    }
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('\n========== FORM SUBMIT ==========');
      console.log('Mode:', modalMode);
      console.log('Tab:', activeTab);
      console.log('Form data:', JSON.stringify(formData, null, 2));
      
      let result;
      if (modalMode === 'add') {
        switch (activeTab) {
          case 'artworks':
            console.log('→ Creating artwork');
            result = await createArtwork(formData);
            break;
          case 'shop':
            console.log('→ Creating shop item');
            result = await createShopItem(formData);
            break;
          case 'courses':
            console.log('→ Creating course');
            result = await createCourse(formData);
            break;
          case 'blogs':
            console.log('→ Creating blog');
            result = await createBlog(formData);
            break;
        }
      } else {
        switch (activeTab) {
          case 'artworks':
            result = await updateArtwork(currentItem._id, formData);
            break;
          case 'shop':
            result = await updateShopItem(currentItem._id, formData);
            break;
          case 'courses':
            result = await updateCourse(currentItem._id, formData);
            break;
          case 'blogs':
            result = await updateBlog(currentItem._id, formData);
            break;
        }
      }
      
      console.log('✓ API call successful!');
      console.log('Result ID:', result._id);
      
      setShowModal(false);
      setFormData({});
      
      console.log('Fetching updated list...');
      await loadItems();
      console.log('✓ List updated');
      console.log('================================\n');
      
      alert('✅ Item saved successfully!');
    } catch (error) {
      console.error('\n========== SUBMIT ERROR ==========');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('==================================\n');
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert('❌ ERROR saving item:\n\n' + errorMessage + '\n\n(Check browser console F12 for details)');
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Interactive Card Component
  const InteractiveCard = ({ children, className = '', onClick }) => {
    return (
      <div
        className={`relative ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

  const renderDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats && Object.entries(dashboardStats.stats).map(([key, value], index) => {
          const statConfig = {
            users: { icon: <Users />, label: 'Total Users', color: 'from-indigo-500 to-blue-500' },
            artworks: { icon: <Palette />, label: 'Artworks', color: 'from-purple-500 to-pink-500' },
            shopItems: { icon: <ShoppingBag />, label: 'Shop Items', color: 'from-emerald-500 to-green-500' },
            courses: { icon: <BookOpen />, label: 'Courses', color: 'from-orange-500 to-yellow-500' },
            blogs: { icon: <FileText />, label: 'Blog Posts', color: 'from-rose-500 to-red-500' },
            contacts: { icon: <Mail />, label: 'Messages', color: 'from-teal-500 to-cyan-500' },
            subscribers: { icon: <Star />, label: 'Subscribers', color: 'from-yellow-500 to-amber-500' }
          }[key];

          if (!statConfig) return null;

          return (
            <motion.div
              key={key}
              variants={statsVariants}
              ref={el => statsRef.current[index] = el}
              className="relative"
            >
              <InteractiveCard>
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${statConfig.color} text-white overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white/80 text-sm">{statConfig.label}</p>
                        <p className="text-3xl font-bold mt-2">{value || 0}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-white/20 rounded-xl"
                      >
                        {statConfig.icon}
                      </motion.div>
                    </div>
                    <motion.div
                      className="h-1 bg-white/30 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full bg-white rounded-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <InteractiveCard>
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users className="text-blue-400" />
                Recent Users
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {dashboardStats?.recentUsers?.length || 0} new
                </span>
              </h3>
              <Activity className="text-cyan-400 animate-pulse" />
            </div>
            <div className="space-y-4">
              {dashboardStats?.recentUsers?.slice(0, 5).map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-white/60">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {user.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveCard>

        {/* Recent Contacts */}
        <InteractiveCard>
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Mail className="text-cyan-400" />
                Recent Messages
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                  {dashboardStats?.recentContacts?.length || 0} unread
                </span>
              </h3>
              <AlertTriangle className="text-yellow-400 animate-pulse" />
            </div>
            <div className="space-y-4">
              {dashboardStats?.recentContacts?.slice(0, 5).map((contact, index) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-sm text-white/60">{contact.email}</p>
                    </div>
                    <span className="text-xs text-white/40">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 truncate">{contact.subject}</p>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">{contact.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* System Status */}
      <InteractiveCard>
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Server className="text-green-400" />
              System Status
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">All Systems Operational</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Database', value: '100%', color: 'from-blue-500 to-cyan-500', icon: <Database /> },
              { label: 'API Server', value: '99.9%', color: 'from-purple-500 to-pink-500', icon: <Server /> },
              { label: 'Storage', value: '85%', color: 'from-emerald-500 to-green-500', icon: <Cpu /> },
              { label: 'Network', value: '100%', color: 'from-orange-500 to-yellow-500', icon: <Globe /> }
            ].map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${service.color} text-center`}
              >
                <div className="text-white/80 text-sm mb-2">{service.label}</div>
                <div className="text-2xl font-bold text-white mb-2">{service.value}</div>
                <div className="text-white/60">{service.icon}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveCard>
    </motion.div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <p className="text-white/60">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10  border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user, index) => (
          <InteractiveCard key={user._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-white/10 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                        <Shield size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-white/60">{user.email}</p>
                    <p className="text-sm text-white/40 mt-1">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="user" className="bg-gray-900">User</option>
                    <option value="admin" className="bg-gray-900">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 rounded-lg border border-red-500/20 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Contact Messages</h2>
          <p className="text-white/60">Manage and respond to user inquiries</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10  border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContacts.map((contact, index) => (
          <InteractiveCard key={contact._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-white/10 shadow-lg"
            >
                <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                    <p className="text-white/60">{contact.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    contact.status === 'replied'
                      ? 'bg-green-500/20 text-green-400'
                      : contact.status === 'read'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {contact.status || 'new'}
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 rounded-lg border border-red-500/20 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/80 font-medium mb-2">{contact.subject}</p>
                  <p className="text-white/60 text-sm">{contact.message}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContactStatusUpdate(contact._id, 'read')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => {
                      handleContactStatusUpdate(contact._id, 'replied');
                      const subject = encodeURIComponent(`Re: ${contact.subject || 'Your message'}`);
                      window.location.href = `mailto:${contact.email}?subject=${subject}`;
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );

  const renderSubscribers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Newsletter Subscribers</h2>
          <p className="text-white/60">View and manage newsletter subscribers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10  border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSubscribers.map((subscriber, index) => (
          <InteractiveCard key={subscriber._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-white/10 shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Star className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{subscriber.email}</h3>
                    <p className="text-white/60 text-sm">Source: {subscriber.source || 'unknown'}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(subscriber._id)}
                    className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 rounded-lg border border-red-500/20 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white capitalize">{activeTab}</h2>
          <p className="text-white/60">Manage your {activeTab} content</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10  border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={() => openModal('add')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item, index) => (
          <InteractiveCard key={item._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-white/10 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {(item.imageUrl || item.image) && (
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.title || item.name}</h3>
                    {item.description && (
                      <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      {item.price && (
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-full text-sm">
                          ${item.price}
                        </span>
                      )}
                      <span className="text-xs text-white/40">
                        ID: {item._id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openModal('edit', item)}
                    className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-lg border border-blue-500/20 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 rounded-lg border border-red-500/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );

  const renderModal = () => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {modalMode === 'add' ? 'Add New' : 'Edit'} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* BLOGS */}
                {activeTab === 'blogs' && (
                  <>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Title *</label>
                      <input
                        type="text"
                        placeholder="Enter blog title"
                        value={formData.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setFormData({ ...formData, title, slug });
                        }}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Slug (URL friendly) - Auto-generated from title</label>
                      <input
                        type="text"
                        placeholder="Auto-generated from title"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Excerpt *</label>
                      <input
                        type="text"
                        placeholder="Brief summary"
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Content *</label>
                      <div className="bg-white rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.content || ''}
                          onChange={(content) => setFormData({ ...formData, content })}
                          modules={{
                            toolbar: [
                              ['bold', 'italic', 'underline', 'strike'],
                              ['blockquote', 'code-block'],
                              [{ 'header': 1 }, { 'header': 2 }],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              [{ 'color': [] }, { 'background': [] }],
                              [{ 'align': [] }],
                              ['link', 'image'],
                              ['clean']
                            ]
                          }}
                          formats={['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'header', 'list', 'color', 'background', 'align', 'link', 'image']}
                          placeholder="Full blog content"
                          style={{ minHeight: '300px' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Cover Image URL *</label>
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Author Name</label>
                      <input
                        type="text"
                        placeholder="Author name"
                        value={formData.author?.name || ''}
                        onChange={(e) => setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g., art, tutorial, drawing"
                        value={formData.tags ? formData.tags.join(', ') : ''}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </>
                )}

                {/* COURSES */}
                {activeTab === 'courses' && (
                  <>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Title *</label>
                      <input
                        type="text"
                        placeholder="Course title"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Description *</label>
                      <textarea
                        placeholder="Course description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Price ($) *</label>
                      <input
                        type="number"
                        placeholder="Course price"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Duration *</label>
                      <input
                        type="text"
                        placeholder="e.g., 4 weeks"
                        value={formData.duration || ''}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Category *</label>
                      <input
                        type="text"
                        placeholder="e.g., Painting, Drawing"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Level</label>
                      <select
                        value={formData.level || 'beginner'}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="beginner" className="bg-gray-900">Beginner</option>
                        <option value="intermediate" className="bg-gray-900">Intermediate</option>
                        <option value="advanced" className="bg-gray-900">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Thumbnail Image URL *</label>
                      <input
                        type="text"
                        placeholder="Course image URL"
                        value={formData.thumbnail || ''}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Instructor Name</label>
                      <input
                        type="text"
                        placeholder="Instructor name"
                        value={formData.instructor?.name || ''}
                        onChange={(e) => setFormData({ ...formData, instructor: { ...formData.instructor, name: e.target.value } })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </>
                )}

                {/* SHOP ITEMS */}
                {activeTab === 'shop' && (
                  <>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Artwork ID (from Artwork) *</label>
                      <input
                        type="text"
                        placeholder="Paste artwork ID here"
                        value={formData.artwork || ''}
                        onChange={(e) => setFormData({ ...formData, artwork: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Price ($) *</label>
                      <input
                        type="number"
                        placeholder="Item price"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Available Quantity *</label>
                      <input
                        type="number"
                        placeholder="Available quantity"
                        value={formData.availableQuantity || ''}
                        onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        required
                        min="0"
                      />
                    </div>
                  </>
                )}

                {/* ARTWORKS */}
                {activeTab === 'artworks' && (
                  <>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Title</label>
                      <input
                        type="text"
                        placeholder="Artwork title"
                        value={formData.title || formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Description</label>
                      <textarea
                        placeholder="Artwork description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Image URL</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.imageUrl || formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, image: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5  border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow"
                >
                  {modalMode === 'add' ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Load items when tab changes
  useEffect(() => {
    loadItems();
  }, [activeTab]);

  // Show loading screen while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/60">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white"
    >
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              scale: 0
            }}
            animate={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 1.5
            }}
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(${200 + i * 10}, 100%, 70%)`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-b border-white/10 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent"
              />
              <div>
                <h1 className="text-xl font-bold">Admin Control Center</h1>
                <p className="text-sm text-white/60">Welcome back, {user?.name}!</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">System Active</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer"
              >
                <span className="font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </motion.div>
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm('');
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-200px)]"
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-white/60">Loading {activeTab}...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'contacts' && renderContacts()}
                {activeTab === 'subscribers' && renderSubscribers()}
                {['artworks', 'shop', 'courses', 'blogs'].includes(activeTab) && renderContentManagement()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {renderModal()}

      {/* Bottom Status Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-t border-white/10 px-6 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-cyan-400" />
              <span className="text-white/60">CPU: 12%</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={14} className="text-emerald-400" />
              <span className="text-white/60">Memory: 45%</span>
            </div>
            <div className="flex items-center gap-2">
              <Server size={14} className="text-purple-400" />
              <span className="text-white/60">Uptime: 99.9%</span>
            </div>
          </div>
          <div className="text-white/40">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Quill Editor Styles */}
        <style>{`
          .ql-editor {
            color: #333 !important;
            font-size: 16px;
            line-height: 1.6;
          }
          .ql-editor.ql-blank::before {
            color: #999 !important;
          }
          .ql-toolbar.ql-snow {
            border-color: #ddd;
          }
          .ql-container.ql-snow {
            border-color: #ddd;
          }
          .ql-editor h1 { font-size: 2em; }
          .ql-editor h2 { font-size: 1.5em; }
          .ql-editor h3 { font-size: 1.25em; }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;