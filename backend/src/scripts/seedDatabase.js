const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('../models/Blog');
const Course = require('../models/Course');
const ShopItem = require('../models/ShopItem');
const Artwork = require('../models/Artwork');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artist_portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB');

    // Create indexes for unique fields
    console.log('\n📝 Creating indexes...');
    
    // Blog indexes
    await Blog.collection.createIndex({ slug: 1 }, { unique: true }).catch(() => {
      console.log('  ✓ Blog slug index already exists');
    });
    console.log('  ✓ Blog indexes created');

    // Seed sample artwork (needed for shop items)
    let artwork = await Artwork.findOne();
    
    if (!artwork) {
      console.log('\n🎨 Creating sample artwork...');
      artwork = await Artwork.create({
        title: 'Sample Artwork',
        description: 'A sample artwork for testing',
        imageUrl: 'https://via.placeholder.com/400x400?text=Sample+Artwork',
        category: 'painting',
        artistName: 'Mozammel',
        featured: false
      });
      console.log('  ✓ Sample artwork created');
    } else {
      console.log('  ✓ Artwork already exists');
    }

    // Seed sample blog post
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('\n📖 Creating sample blog post...');
      await Blog.create({
        title: 'Welcome to My Art Blog',
        slug: 'welcome-to-my-art-blog',
        excerpt: 'My first blog post about art and creativity',
        content: 'This is the full content of my first blog post. I will share insights about my artistic journey, techniques, and inspirations.',
        author: {
          name: 'Mozammel',
          avatar: 'https://via.placeholder.com/100x100?text=Mozammel'
        },
        coverImage: 'https://via.placeholder.com/600x400?text=Art+Blog',
        categories: ['Art', 'Tutorial'],
        tags: ['painting', 'art', 'creativity'],
        readTime: 5,
        featured: true
      });
      console.log('  ✓ Sample blog post created');
    } else {
      console.log('  ✓ Blog posts already exist');
    }

    // Seed sample course
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('\n📚 Creating sample course...');
      await Course.create({
        title: 'Beginner Digital Painting',
        description: 'Learn the fundamentals of digital painting with Procreate and Photoshop',
        instructor: {
          name: 'Mozammel',
          bio: 'Professional artist with 10+ years experience',
          avatar: 'https://via.placeholder.com/100x100?text=Mozammel'
        },
        price: 49.99,
        duration: '6 weeks',
        level: 'beginner',
        category: 'Digital Art',
        thumbnail: 'https://via.placeholder.com/300x200?text=Digital+Painting',
        curriculum: [
          {
            week: 1,
            title: 'Getting Started with Procreate',
            topics: ['Installation', 'Interface Overview', 'Basic Tools'],
            duration: '2 hours'
          }
        ],
        featured: true,
        requirements: ['Drawing tablet', 'Procreate installed']
      });
      console.log('  ✓ Sample course created');
    } else {
      console.log('  ✓ Courses already exist');
    }

    // Seed sample shop item
    const shopCount = await ShopItem.countDocuments();
    if (shopCount === 0) {
      console.log('\n🛍️ Creating sample shop item...');
      await ShopItem.create({
        artwork: artwork._id,
        price: 29.99,
        currency: 'USD',
        availableQuantity: 50,
        isOriginal: false,
        printSizes: [
          { size: 'A4', price: 29.99 },
          { size: 'A3', price: 39.99 },
          { size: 'A2', price: 49.99 }
        ],
        framingOptions: [
          'No Frame',
          'Black Frame',
          'White Frame'
        ],
        shippingInfo: {
          domestic: 5.00,
          international: 15.00,
          estimatedDelivery: '5-7 business days'
        }
      });
      console.log('  ✓ Sample shop item created');
    } else {
      console.log('  ✓ Shop items already exist');
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   • Artworks: ${await Artwork.countDocuments()}`);
    console.log(`   • Blog Posts: ${await Blog.countDocuments()}`);
    console.log(`   • Courses: ${await Course.countDocuments()}`);
    console.log(`   • Shop Items: ${await ShopItem.countDocuments()}`);

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
