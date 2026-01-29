const Course = require('../models/Course');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { level, category } = req.query;
    let query = {};
    
    if (level) {
      query.level = level;
    }
    if (category) {
      query.category = category;
    }
    
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured courses
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ featured: true }).limit(3);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      thumbnail: req.body.thumbnail || (req.file ? req.file.path : null)
    };
    
    const course = new Course(courseData);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.file && { thumbnail: req.file.path }),
      ...(req.body.thumbnail && { thumbnail: req.body.thumbnail })
    };
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
