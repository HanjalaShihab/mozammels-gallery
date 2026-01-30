import React from 'react';
import { motion } from 'framer-motion';
import { Award, Palette, Users, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Years Experience', value: '10+', icon: <Award /> },
    { label: 'Artworks Created', value: '150+', icon: <Palette /> },
    { label: 'Happy Collectors', value: '200+', icon: <Users /> },
    { label: 'Art Exhibitions', value: '25+', icon: <Heart /> },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Mozammel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Artist, Creator, and Passionate Teacher
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}uncle.jpg`}
              alt="Mozammel"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">My Journey</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to my artistic world! I'm Mozammel, a passionate artist with over 10 years 
              of experience in various art forms. My journey began with a simple sketch and has 
              evolved into a lifelong passion for creating meaningful art that speaks to the soul.
            </p>
            <p className="text-gray-600 leading-relaxed">
              My work explores the intersection of traditional techniques and contemporary themes. 
              I believe that art should not only be visually appealing but also thought-provoking 
              and emotionally resonant. Each piece I create is a reflection of my experiences, 
              observations, and the stories I want to tell.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Beyond creating art, I'm dedicated to sharing my knowledge and helping aspiring 
              artists discover their unique voice. Through my courses and workshops, I aim to 
              inspire and guide others on their creative journey.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center text-primary-600 mb-3">
                {React.cloneElement(stat.icon, { size: 32 })}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">My Philosophy</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            "Art is not what you see, but what you make others see. Through colors, shapes, 
            and emotions, I strive to create pieces that resonate with the viewer's soul and 
            spark conversations that transcend the canvas."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
