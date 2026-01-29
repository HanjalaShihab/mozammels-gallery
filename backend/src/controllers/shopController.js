const ShopItem = require('../models/ShopItem');

// Get all shop items
exports.getAllItems = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption.price = 1;
    } else if (sort === 'price-desc') {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1;
    }
    
    const items = await ShopItem.find(query).sort(sortOption);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await ShopItem.find({ featured: true }).limit(4);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single shop item
exports.getItem = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create shop item
exports.createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body
    };
    
    const item = new ShopItem(itemData);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Shop item creation error:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

// Update shop item
exports.updateItem = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.file && { imageUrl: req.file.path })
    };
    
    const item = await ShopItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete shop item
exports.deleteItem = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
