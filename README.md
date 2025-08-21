# Indians in Frankfurt Hub

React frontend application for the Indians in Frankfurt Hub community platform, connecting over 67,000 Indian residents through events, forums, and resources.

> **Backend Repository**: [indians-frankfurt-hub-backend](https://github.com/ravichik/indians-frankfurt-hub-backend)

## Features

### Core Features
- **Homepage & Resources**: Welcoming homepage with essential information sections for Visa Guides, Housing Tips, and Local Job Boards
- **User Authentication**: Complete registration and login system with JWT authentication
- **Discussion Forum**: Community forum with categories like "Settling In" and "Cultural Events"
- **Events Calendar**: Interactive calendar showcasing local Indian festivals and community meetups with RSVP functionality
- **Responsive Design**: Fully responsive UI that works seamlessly on mobile devices and laptops

### Technical Features
- Modern, slick UI with smooth animations and hover effects
- Modular and scalable architecture
- RESTful API backend
- Real-time updates and notifications
- Admin moderation capabilities

## Technology Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Clone the backend repository:
```bash
git clone https://github.com/ravichik/indians-frankfurt-hub-backend.git
cd indians-frankfurt-hub-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration (already created with defaults)

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Setup

1. Clone this repository:
```bash
git clone https://github.com/ravichik/indians-frankfurt-hub.git
cd indians-frankfurt-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Register an Account**: Click on "Register" to create a new account
2. **Browse Resources**: Explore visa guides, housing tips, and job boards
3. **Join Forum Discussions**: Participate in community discussions
4. **RSVP to Events**: View upcoming events and RSVP to attend
5. **Create Content**: Authenticated users can create forum posts and events

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Forum
- `GET /api/forum/posts` - Get all posts
- `GET /api/forum/posts/:id` - Get single post
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/reply` - Reply to post
- `POST /api/forum/posts/:id/like` - Like/unlike post

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `POST /api/events/:id/rsvp` - RSVP to event

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/categories` - Get resource categories
- `GET /api/resources/:category` - Get resources by category

## Project Structure

```
Indians in Frankfurt Hub/
├── backend/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── server.js       # Express server
│   └── package.json
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   ├── App.js      # Main app component
│   │   └── index.js    # Entry point
│   └── package.json
└── README.md
```

## Future Enhancements

- Real-time chat functionality
- Multi-language support (Hindi, German)
- Mobile app development
- Email notifications
- Advanced search and filtering
- User profiles and connections
- Document upload and sharing
- Integration with local services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.