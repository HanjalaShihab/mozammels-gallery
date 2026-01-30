import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Heart } from 'lucide-react';
import { subscribeNewsletter } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('Please enter your email.');
      return;
    }
    try {
      setNewsletterStatus('Subscribing...');
      await subscribeNewsletter({ email: newsletterEmail, source: 'footer' });
      setNewsletterStatus('Subscribed successfully!');
      setNewsletterEmail('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Subscription failed.';
      setNewsletterStatus(msg);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold mb-4">Mozammel's Gallery</h3>
            <p className="text-sm leading-relaxed">
              Exploring the beauty of art through colors, emotions, and creativity. 
              Join me on this artistic journey.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@mozammelsgallery.com"
                 className="hover:text-primary-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-primary-400 transition-colors">Gallery</Link></li>
              <li><Link to="/shop" className="hover:text-primary-400 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-primary-400 transition-colors">Courses</Link></li>
              <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to get updates on new artworks and courses.</p>
            <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
                         focus:outline-none focus:border-primary-500 text-sm"
              />
              <button 
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg 
                         hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
              {newsletterStatus && (
                <p className="text-xs text-gray-400">{newsletterStatus}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {currentYear} Mozammel's Gallery. All rights reserved.</p>
            <p className="flex items-center gap-1 mt-2 md:mt-0">
              Made with <Heart size={16} className="text-red-500 fill-current" /> by Hanjala
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
