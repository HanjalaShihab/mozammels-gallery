import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';

const ArtworkGrid = ({ artworks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No artworks found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <Link to={`/gallery/${artwork._id}`}>
            <div className="relative overflow-hidden aspect-[4/5]">
              <img
                src={artwork.imageUrl || artwork.image || 'https://via.placeholder.com/400x500/eee?text=Artwork'}
                alt={artwork.title}
                onLoad={(e) => e.target.setAttribute('loaded', '')}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x500/eee?text=Artwork';
                  e.currentTarget.setAttribute('loaded', '');
                }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{artwork.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {artwork.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={16} />
                      {artwork.likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{artwork.category}</span>
              {artwork.featured && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                  Featured
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
