import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, Share2, Calendar, Maximize, Grid, List, Search } from 'lucide-react';
import { fetchAllArtworks, fetchCategories } from '../services/api';

const ArtworkCard = ({ artwork, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative overflow-hidden">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-64 md:h-full object-cover transform transition-transform duration-500 hover:scale-110"
            />
            {artwork.featured && (
              <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/gallery/${artwork._id}`} className="hover:text-primary-600 transition-colors">
                    {artwork.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{artwork.description}</p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  size={20}
                  className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {artwork.category}
              </span>
              {artwork.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(artwork.createdAt)}
                </span>
                <span className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {artwork.views?.toLocaleString() || 0} views
                </span>
              </div>
              <Link
                to={`/gallery/${artwork._id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details
                <Maximize size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        />
        
        {/* Featured Badge */}
        {artwork.featured && (
          <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
        
        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute top-4 right-4 flex space-x-2"
        >
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart
              size={20}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}
            />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 size={20} className="text-gray-700" />
          </button>
        </motion.div>
        
        {/* View Details Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Link
            to={`/gallery/${artwork._id}`}
            className="block w-full py-3 bg-white text-gray-900 font-semibold rounded-xl text-center hover:bg-gray-50 transition-colors"
          >
            View Artwork
          </Link>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            <Link to={`/gallery/${artwork._id}`} className="hover:text-primary-600 transition-colors">
              {artwork.title}
            </Link>
          </h3>
          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
            {artwork.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {artwork.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatDate(artwork.createdAt)}
          </span>
          <span className="flex items-center">
            <Eye size={14} className="mr-1" />
            {artwork.views?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [artworksData, categoriesData] = await Promise.all([
          fetchAllArtworks(),
          fetchCategories()
        ]);
        setArtworks(artworksData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        artwork.title?.toLowerCase().includes(query) ||
        artwork.description?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [artworks, selectedCategory, search]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
            <p className="text-gray-600">
              Explore the full collection of artworks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No artworks found.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredArtworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;