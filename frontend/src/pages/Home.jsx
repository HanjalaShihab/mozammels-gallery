import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  animate,
  useInView
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  Sparkles, 
  Palette, 
  Brush, 
  Zap, 
  ChevronRight,
  Globe,
  Target,
  Layers,
  Compass,
  Eye,
  Camera,
  Heart,
  Type,
  PenTool,
  Circle,
  Square,
  Triangle
} from 'lucide-react';
import ArtworkGrid from '../components/ArtworkGrid';
import { fetchLatestArtworks } from '../services/api';

const Home = () => {
  const [latestArtworks, setLatestArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState(null);
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const heroScale = useTransform(springScroll, [0, 0.5], [1, 0.8]);
  const heroOpacity = useTransform(springScroll, [0, 0.3], [1, 0]);
  const titleY = useTransform(springScroll, [0, 0.5], [0, 100]);

  // Particle system canvas
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const data = await fetchLatestArtworks(6);
        setLatestArtworks(data);
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();

    // Initialize particles
    initParticles();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Particle system initialization
  const initParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    particles.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      color: `hsla(${Math.random() * 60 + 200}, 80%, 70%, ${Math.random() * 0.2 + 0.05})`,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
    }));

    // Start animation
    animateParticles();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const animateParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Draw particle based on shape
        ctx.beginPath();
        ctx.fillStyle = p.color;
        
        if (p.shape === 'circle') {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        } else if (p.shape === 'square') {
          ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        } else {
          ctx.moveTo(p.x, p.y - p.radius);
          ctx.lineTo(p.x - p.radius, p.y + p.radius);
          ctx.lineTo(p.x + p.radius, p.y + p.radius);
          ctx.closePath();
        }
        
        ctx.fill();
        
        // Draw connections to nearby particles
        particles.current.forEach((other, j) => {
          if (i < j) {
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = p.color.replace(')', `, ${0.08 * (1 - distance/120)})`);
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(update);
    };
    
    update();
  };

  // Stats data
  const stats = [
    { 
      label: 'Artworks Created', 
      value: '150+', 
      icon: <Brush />, 
      color: 'from-purple-500 via-pink-500 to-rose-500',
      description: 'Masterpieces crafted'
    },
    { 
      label: 'Happy Collectors', 
      value: '200+', 
      icon: <Users />, 
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      description: 'Satisfied clients worldwide'
    },
    { 
      label: 'Years Experience', 
      value: '10+', 
      icon: <Award />, 
      color: 'from-green-500 via-emerald-500 to-lime-500',
      description: 'Of artistic excellence'
    },
    { 
      label: 'Exhibitions', 
      value: '25+', 
      icon: <Globe />, 
      color: 'from-orange-500 via-amber-500 to-yellow-500',
      description: 'International showcases'
    },
  ];

  // Minimal floating geometric shapes
  const GeometricShape = ({ icon, delay = 0, className = '', size = 24 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`absolute ${className}`}
    >
      {icon}
    </motion.div>
  );

  // Interactive card with mouse tilt
  const InteractiveCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    
    const handleMouseLeave = () => {
      animate(mouseX, 0, { duration: 0.5 });
      animate(mouseY, 0, { duration: 0.5 });
    };
    
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
    
    return (
      <motion.div
        ref={cardRef}
        className={`relative ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: 'preserve-3d' 
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-black min-h-screen">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
      
      {/* Hero Section - Minimal Creative Design */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Minimal Geometric Background */}
        <div className="absolute inset-0 bg-black">
          {/* Subtle grid lines */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px),
                               linear-gradient(180deg, #fff 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />
          
          {/* Gradient overlay */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Minimal floating geometric shapes */}
          <GeometricShape 
            icon={<Circle className="w-8 h-8 text-white/10" />}
            delay={0}
            className="top-20 left-20"
          />
          <GeometricShape 
            icon={<Square className="w-6 h-6 text-white/10" />}
            delay={1}
            className="top-40 right-32"
          />
          <GeometricShape 
            icon={<Triangle className="w-10 h-10 text-white/10" />}
            delay={2}
            className="bottom-40 left-32"
          />
          <GeometricShape 
            icon={<Circle className="w-12 h-12 text-white/10" />}
            delay={3}
            className="bottom-20 right-20"
          />
          <GeometricShape 
            icon={<Square className="w-8 h-8 text-white/10" />}
            delay={4}
            className="top-1/3 left-1/4"
          />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity,
            y: titleY 
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Minimal Typography Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-12"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-white/60 text-sm tracking-widest uppercase">DIGITAL ARTISTRY</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/40" />
            </motion.div>
            
            {/* Main Minimal Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <motion.div
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                  />
                  <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white">
                    CREATE
                  </h1>
                </div>
                
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-xl rounded-full"
                  />
                  <h2 className="text-7xl md:text-9xl font-black tracking-tighter relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                      INSPIRE
                    </span>
                  </h2>
                </div>
                
                <div className="relative">
                  <motion.div
                    animate={{ width: ['100%', '0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                    className="absolute -top-2 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                  />
                  <h3 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                    INNOVATE
                  </h3>
                </div>
              </div>
            </motion.div>
            
            {/* Subtle Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-white/50 mb-12 max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
            >
              A digital canvas where creativity meets technology
            </motion.p>
            
            {/* Minimal CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <InteractiveCard>
                <Link
                  to="/gallery"
                  className="group relative block px-8 py-3 bg-transparent border border-white/20 text-white font-light text-lg rounded-full overflow-hidden hover:border-white/40 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    EXPLORE GALLERY
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={false}
                  />
                </Link>
              </InteractiveCard>
              
              <InteractiveCard>
                <Link
                  to="/contact"
                  className="group relative block px-8 py-3 bg-white text-black font-medium text-lg rounded-full overflow-hidden hover:bg-white/90 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <PenTool className="w-4 h-4" />
                    START CREATING
                  </span>
                </Link>
              </InteractiveCard>
            </motion.div>
            
            {/* Minimal Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-white/30 text-xs tracking-widest">SCROLL</div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-px h-8 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Rest of the page remains exactly the same */}
      {/* About Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/uncle.jpg"
                alt="Mozammel"
                className="w-full rounded-2xl shadow-2xl"
                onLoad={(e) => e.target.setAttribute('loaded', '')}
              />
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className='text-blue-600'>About</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Mozammel</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Welcome to my artistic world! I'm Mozammel, a passionate digital artist with over 10 years 
                  of experience creating masterpieces that blend traditional artistry with cutting-edge technology.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  My work explores the intersection of classical techniques and contemporary themes. Each creation 
                  is a reflection of my experiences, observations, and the stories I want to tell through art.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  Beyond creating art, I'm dedicated to sharing my knowledge through courses and workshops, 
                  helping aspiring artists discover their unique creative voice.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pt-4"
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:shadow-lg transition-shadow"
                >
                  Learn More About My Journey
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                BY THE NUMBERS
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              A decade of excellence in digital artistry and innovation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredStat(index)}
                onHoverEnd={() => setHoveredStat(null)}
                className="relative group"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg border border-white/10">
                  <motion.div
                    animate={{ 
                      scale: hoveredStat === index ? 1.2 : 1,
                      rotate: hoveredStat === index ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <div className="text-4xl font-bold mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                  
                  <div className="text-lg text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-white/50 text-sm">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Artworks */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{
            background: 'conic-gradient(from 0deg, transparent, cyan, purple, pink, transparent)'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                LATEST MASTERPIECES
              </span>
            </h2>
            <p className="text-lg text-white/60">
              Fresh from the digital canvas, each piece tells a unique story
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"
                />
              ))}
            </div>
          ) : (
            <ArtworkGrid artworks={latestArtworks} />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <InteractiveCard className="inline-block">
              <Link
                to="/gallery"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg border border-white/10 text-white font-bold text-lg rounded-xl overflow-hidden"
              >
                <span>VIEW ALL ARTWORKS</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </InteractiveCard>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <InteractiveCard className="h-[400px] rounded-2xl overflow-hidden">
                <div className="relative h-full p-8 bg-gradient-to-br from-gray-900/80 to-black/80">
                  <h3 className="text-3xl font-bold text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      IMMERSIVE EXPERIENCES
                    </span>
                  </h3>
                  
                  <p className="text-gray-300 mb-8">
                    Step into our virtual gallery where art comes alive with interactive 3D experiences and real-time creation sessions.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: <Camera />, text: 'Virtual Reality Tours', color: 'text-cyan-400' },
                      { icon: <Layers />, text: '3D Art Interactions', color: 'text-purple-400' },
                      { icon: <Target />, text: 'Live Creation Sessions', color: 'text-pink-400' },
                      { icon: <Compass />, text: 'Interactive Exhibitions', color: 'text-yellow-400' }
                    ].map((feature, i) => (
                      <motion.div
                        key={feature.text}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-white group"
                        whileHover={{ x: 5 }}
                      >
                        <div className={`p-2 rounded-lg bg-white/10 ${feature.color}`}>
                          {feature.icon}
                        </div>
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                WHERE <span className="text-cyan-300">TECHNOLOGY</span> MEETS{' '}
                <span className="text-purple-300">CREATIVITY</span>
              </h3>
              
              <p className="text-gray-400 mb-8">
                Experience art like never before with cutting-edge technology blended with traditional artistry.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: 'Visual Quality', value: 96, color: 'from-cyan-500 to-blue-500' },
                  { label: 'User Experience', value: 94, color: 'from-purple-500 to-pink-500' },
                  { label: 'Innovation', value: 98, color: 'from-emerald-500 to-green-500' }
                ].map((skill, i) => (
                  <div key={skill.label} className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>{skill.label}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <Link
                  to="/experience"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl transition-shadow"
                >
                  <Globe className="w-5 h-5" />
                  EXPLORE NOW
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(45deg, rgba(56,189,248,0.1) 0%, rgba(168,85,247,0.1) 50%, rgba(236,72,153,0.1) 100%)'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <InteractiveCard className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20" />
              
              <div className="relative p-8 md:p-12 text-center">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                >
                  READY TO{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-rose-400 to-cyan-400">
                    BEGIN YOUR JOURNEY?
                  </span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
                >
                  Join thousands of artists and collectors in our vibrant creative community
                </motion.p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block relative"
                >
                  <Link
                    to="/join"
                    className="group relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-yellow-500 via-rose-500 to-cyan-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      GET STARTED NOW
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex justify-center items-center gap-2 mt-8"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="text-yellow-400"
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </motion.div>
                  ))}
                  <span className="text-white/80 ml-4">
                    Rated 4.9/5 by 2,000+ artists
                  </span>
                </motion.div>
              </div>
            </div>
          </InteractiveCard>
        </div>
        
        {/* Footer Wave */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"
        />
      </section>
    </div>
  );
};

export default Home;