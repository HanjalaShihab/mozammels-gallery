const Blog = require('../models/Blog');

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await Blog.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest blog posts
exports.getLatestPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const posts = await Blog.find().sort({ createdAt: -1 }).limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog post
exports.getPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create blog post
exports.createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      coverImage: req.body.coverImage || (req.file ? req.file.path : null)
    };
    
    // Generate slug if not provided
    if (!postData.slug && postData.title) {
      postData.slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    
    const post = new Blog(postData);
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

// Update blog post
exports.updatePost = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.file && { coverImage: req.file.path }),
      ...(req.body.coverImage && { coverImage: req.body.coverImage })
    };
    
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete blog post
exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
