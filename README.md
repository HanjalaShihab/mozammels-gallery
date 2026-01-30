# Mozammel's Gallery - Artist Portfolio

This is a full-stack artist portfolio application with gallery, shop, courses, and blog functionality.

## Features

- 🎨 **Gallery**: Showcase artworks with detailed views
- 🛍️ **Shop**: Sell art prints and merchandise
- 📚 **Courses**: Offer art courses and tutorials
- ✍️ **Blog**: Share insights and tutorials
- 📧 **Contact**: Get in touch with visitors

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Framer Motion for animations
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Cloudinary for image uploads
- Multer for file handling
- Nodemailer for email
- Helmet & CORS for security

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mozammels-gallary
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   
   - Copy `.env.example` to `.env`
   - Update environment variables with your credentials
   
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/artist_portfolio
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
mozammels-gallary/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.js       # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── App.jsx         # Main app component
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/latest` - Get latest artworks
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create artwork

### Shop
- `GET /api/shop` - Get all shop items
- `GET /api/shop/:id` - Get single item

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course

### Blog
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get single post

### Contact
- `POST /api/contact` - Submit contact form

## License

MIT

## Author

Mozammel - Artist & Developer
