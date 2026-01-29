import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ShoppingBag, BookOpen, MessageSquare, User, Menu, X, LogOut, Shield, Home, Sparkles, Brush, Star, Gem, Crown, ChevronDown, Settings, CreditCard, Heart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} />, color: 'from-blue-500 to-cyan-400' },
    { path: '/gallery', label: 'Gallery', icon: <Palette size={18} />, color: 'from-purple-500 to-pink-500' },
    { path: '/shop', label: 'Shop', icon: <ShoppingBag size={18} />, color: 'from-amber-500 to-orange-500' },
    { path: '/courses', label: 'Courses', icon: <BookOpen size={18} />, color: 'from-emerald-500 to-teal-400' },
    { path: '/blog', label: 'Blog', icon: <MessageSquare size={18} />, color: 'from-rose-500 to-red-400' },
    { path: '/contact', label: 'Contact', icon: <User size={18} />, color: 'from-indigo-500 to-blue-400' },
    { path: '/about', label: 'About', icon: <Brush size={18} />, color: 'from-violet-500 to-purple-400' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  const userMenuItems = [
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
    { icon: <CreditCard size={18} />, label: 'Billing', path: '/billing' },
    { icon: <Heart size={18} />, label: 'Favorites', path: '/favorites' },
    { icon: <Package size={18} />, label: 'Orders', path: '/orders' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 shadow-2xl border-b border-white/10'
          : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
      }`}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Animated Logo with 3D Effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-xl"
            />
            <Link to="/" className="flex items-center space-x-4 relative z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Palette className="text-white" size={28} />
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 border-2 border-primary-400/30 rounded-3xl"
                />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={16} />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-300">MASTERPIECE STUDIO</span>
                <span className="text-2xl font-display font-bold tracking-tight">
                  <span className="text-white">MOZAMMEL'S</span>
                  <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                    GALLERY
                  </span>
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation with Hover Effects */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                className="relative"
                onHoverStart={() => setActiveHover(item.path)}
                onHoverEnd={() => setActiveHover(null)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-md"
                  initial={false}
                  animate={{
                    opacity: activeHover === item.path ? 1 : 0,
                    scale: activeHover === item.path ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'text-white shadow-2xl'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <motion.span
                    animate={{ rotate: location.pathname === item.path ? [0, 360] : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </motion.span>
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <>
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-2xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Star className="text-yellow-400" size={12} fill="currentColor" />
                      </motion.div>
                    </>
                  )}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      location.pathname === item.path ? 'bg-gradient-to-r from-primary-400 to-secondary-400' : ''
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: location.pathname === item.path ? '60%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Section with Dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 hover:border-primary-500/30 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white">{user?.name}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Gem size={10} />
                      {user?.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-gray-400 group-hover:text-primary-400" />
                  </motion.div>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 origin-top-right"
                    >
                      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
                        {/* User Info Header */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                              </div>
                              {user?.role === 'admin' && (
                                <Crown className="absolute -top-2 -right-2 text-yellow-400" size={16} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{user?.name}</h3>
                              <p className="text-xs text-gray-400">{user?.email}</p>
                              <div className="mt-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-300 text-xs inline-block">
                                {user?.role === 'admin' ? '🎨 Gallery Curator' : '✨ Art Enthusiast'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {userMenuItems.map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={item.path}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                              >
                                <span className="text-gray-400 group-hover:text-primary-400 transition-colors">
                                  {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                              </Link>
                            </motion.div>
                          ))}

                          {user?.role === 'admin' && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: userMenuItems.length * 0.05 }}
                            >
                              <Link
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-purple-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200 group mt-1"
                              >
                                <Shield className="group-hover:scale-110 transition-transform" size={18} />
                                <span className="text-sm font-semibold">Admin Dashboard</span>
                              </Link>
                            </motion.div>
                          )}
                        </div>

                        {/* Logout Section */}
                        <div className="p-2 border-t border-white/10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200 group"
                          >
                            <LogOut className="group-hover:rotate-180 transition-transform" size={18} />
                            <span className="text-sm font-semibold">Sign Out</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 rounded-2xl border-2 border-primary-500 text-primary-400 font-semibold hover:bg-primary-500/10 hover:border-primary-400 hover:text-primary-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:from-primary-500 hover:to-secondary-500 transition-all duration-300"
                >
                  Join Gallery
                </motion.button>
              </>
            )}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 relative overflow-hidden group"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="relative z-10"
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>

        {/* Mobile Navigation with Glass Morphism */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mt-4"
            >
              <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-white'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-transform duration-300 group-hover:scale-110 ${
                          location.pathname === item.path ? 'text-primary-400' : 'text-gray-400'
                        }`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {location.pathname === item.path && (
                        <Sparkles className="text-yellow-400" size={16} />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Auth Section */}
                <div className="border-t border-white/10 pt-6 mt-4 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <div className="px-5 py-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            {user?.role === 'admin' && (
                              <Crown className="absolute -top-1 -right-1 text-yellow-400" size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-xs transition-all"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300"
                        >
                          <Shield size={18} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 font-semibold hover:bg-red-500/20 border border-red-500/20 transition-all duration-300"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate('/login');
                          setIsOpen(false);
                        }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-primary-500 text-primary-400 font-semibold hover:bg-primary-500/10 transition-all duration-300"
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate('/register');
                          setIsOpen(false);
                        }}
                        className="w-full px-5 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl text-white font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300"
                      >
                        Create Account
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;