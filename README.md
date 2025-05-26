# 📚 Library Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://reactjs.org/)

A modern, full-stack library management system built with React and Node.js. Features a clean, responsive UI and comprehensive book, author, and loan management capabilities.

## 🌟 Features

- **📚 Complete Book Management**: CRUD operations with image upload and categorization
- **👤 User Management**: Authentication, authorization, and role-based access control  
- **📖 Loan System**: Track book borrowing with due dates and return management
- **🎨 Modern UI**: Clean, responsive design with blue pastel theme
- **🚀 Production Ready**: Deployed on Vercel (frontend) and Render (backend)
- **🔒 Secure**: JWT authentication and input validation
- **📱 Responsive**: Mobile-first design approach

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, Tailwind CSS, Framer Motion  
**Backend**: Node.js, Express.js, JWT Authentication  
**Database**: Turso (SQLite) with MySQL fallback  
**Deployment**: Vercel + Render  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd library-management-system
   npm run install:all
   ```

2. **Configure environment**
   ```bash
   # Backend
   cp server/.env.example server/.env
   # Edit server/.env with your database credentials
   
   # Frontend  
   cp client/.env.example client/.env
   # Edit client/.env with API URL
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Backend (http://localhost:8000)
   npm run dev:server
   
   # Terminal 2 - Frontend (http://localhost:5173)  
   npm run dev:client
   ```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Create new book |
| GET | `/api/loans` | Get loans (admin) |
| POST | `/api/loans` | Create loan |

## 🌐 Production Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variable: `VITE_NODE_ENV=production`
3. Deploy automatically

### Backend (Render)
1. Connect GitHub repo to Render
2. Configure environment variables:
   ```
   DATABASE_URL=your_turso_url
   TURSO_AUTH_TOKEN=your_token
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```

### Database (Turso)
```bash
npm install -g @turso/cli
turso auth login
turso db create library-db
npm run migrate:turso
```

## 🔧 Configuration

### Environment Variables

**Backend (`server/.env`)**
```env
DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_turso_token
JWT_SECRET=your_jwt_secret
PORT=8000
NODE_ENV=development
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:8000
VITE_NODE_ENV=development
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context
│   │   └── config/         # Configuration
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── middlewares/        # Custom middleware
└── scripts/                # Deployment scripts
```

## 🧪 Available Scripts

```bash
npm run dev                 # Start both servers
npm run dev:server         # Start backend only
npm run dev:client         # Start frontend only
npm run build              # Build for production
npm run test               # Run tests
npm install:all            # Install all dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Daniel Buelvas**  
GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ If you find this project helpful, please give it a star!

## 🏗️ Project Structure

```
library-management-system/
├── 📁 client/                 # React frontend application
│   ├── 📁 public/            # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   ├── 📁 pages/         # Application pages/views
│   │   ├── 📁 context/       # React context providers
│   │   ├── 📁 hooks/         # Custom React hooks
│   │   ├── 📁 config/        # Configuration files
│   │   └── 📁 styles/        # CSS and styling files
│   └── 📄 package.json
├── 📁 server/                # Node.js backend API
│   ├── 📁 controllers/       # Route handlers
│   ├── 📁 models/            # Database models
│   ├── 📁 routes/            # API route definitions
│   ├── 📁 middlewares/       # Custom middleware
│   ├── 📁 config/            # Database and app configuration
│   ├── 📁 migrations/        # Database migration scripts
│   └── 📄 package.json
├── 📁 scripts/               # Deployment and utility scripts
├── 📄 vercel.json           # Vercel deployment configuration
├── 📄 render.yaml           # Render deployment configuration
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (both client and server)
   npm run install:all
   
   # Or install separately
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend configuration
   cp server/.env.example server/.env
   # Edit server/.env with your database credentials
   
   # Frontend configuration  
   cp client/.env.example client/.env
   # Edit client/.env with your API URL
   ```

4. **Set up the database**
   ```bash
   # For Turso (recommended for production)
   npm install -g @turso/cli
   turso auth login
   turso db create library-db
   
   # Run migrations
   cd server && npm run migrate
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend (http://localhost:8000)
   npm run dev:server
   
   # Terminal 2 - Frontend (http://localhost:5173)  
   npm run dev:client
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Health: http://localhost:8000/health

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Books Management
- `GET /api/books` - Get all books with pagination and filters
- `GET /api/books/:id` - Get specific book details
- `POST /api/books` - Create new book (requires auth)
- `PUT /api/books/:id` - Update book (requires auth)
- `DELETE /api/books/:id` - Delete book (requires auth)

### Authors & Categories
- `GET /api/authors` - Get all authors
- `GET /api/categories` - Get all categories  
- `GET /api/editorials` - Get all editorials

### Loans Management
- `GET /api/loans` - Get all loans (admin only)
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id/return` - Return borrowed book

## 🌐 Deployment

The application is production-ready and deployed using modern cloud services:

### Live Demo
- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-api.onrender.com](https://your-api.onrender.com)

### Deployment Guide

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables:
   ```
   VITE_NODE_ENV=production
   ```
3. Deploy automatically on every push to main

#### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure environment variables:
   ```
   DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_token
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```
3. Deploy using the included `render.yaml` configuration

For detailed deployment instructions, see [VERCEL_SETUP.md](./VERCEL_SETUP.md).

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests  
cd client && npm test

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:

- Code of Conduct
- Development Process
- Pull Request Guidelines
- Issue Reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
# Database Configuration
DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_turso_token

# Authentication
JWT_SECRET=your_jwt_secret

# Server Configuration  
PORT=8000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5000000
```

### Frontend (`client/.env`)
```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_NODE_ENV=development
```

## 🆘 Support

- 📚 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/library-management-system/issues)
- 💬 [Discussions](https://github.com/yourusername/library-management-system/discussions)

## 👨‍💻 Author

**Daniel Buelvas**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with ❤️ using React and Node.js
- UI inspired by modern design principles
- Icons by [Lucide React](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/) and [Render](https://render.com/)

---

⭐ If you find this project helpful, please consider giving it a star!
