# Product Management Dashboard

A full-stack microservices application for managing and browsing products with real-time synchronization.

## Architecture

This project uses a microservices architecture with:

- **Frontend**: React + TypeScript + Vite
- **Admin Service**: Django (Port 8000) - Product CRUD operations
- **Main Service**: Flask (Port 8001) - Product catalog and likes
- **Message Queue**: RabbitMQ - Real-time data synchronization between services
- **Containerization**: Docker

## Features

### Admin Dashboard (`/admin`)
- Create, read, update, and delete products
- View product statistics
- Manage product images and details

### User Catalog (`/catalog`)
- Browse all products
- Like products
- Auto-refresh every 5 seconds
- Real-time like count updates

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn

## Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Start backend services (Docker):**
   ```bash
   docker-compose up -d
   ```

3. **Start frontend development server:**
   ```bash
   npm run dev
   ```

## Running the Application

1. **Backend Services** (Django + Flask + RabbitMQ):
   - Django Admin API: `http://localhost:8000`
   - Flask Main API: `http://localhost:8001`
   - RabbitMQ Management: `http://localhost:15672`

2. **Frontend**:
   - Development server: `http://localhost:5173`
   - Admin Dashboard: `http://localhost:5173/admin`
   - User Catalog: `http://localhost:5173/catalog`

## API Endpoints

### Django Admin Service (Port 8000)

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Flask Main Service (Port 8001)

- `GET /api/products` - Get all products
- `POST /api/products/:id/like` - Like a product

## Data Synchronization

Products created in Django are automatically synced to Flask via RabbitMQ message queue, ensuring both services have consistent data.

## Project Structure

```
Product Management Dashboard/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components (Admin, Catalog)
│   │   └── services/       # API service layer
│   └── styles/             # CSS styles
├── docker-compose.yml      # Docker services configuration
├── package.json            # Node dependencies
└── README.md              # This file
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons
- React Router

### Backend
- Django (Python)
- Flask (Python)
- RabbitMQ
- PostgreSQL/SQLite

## Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
- Django and Flask services run in Docker containers
- Modify backend code and restart containers:
  ```bash
  docker-compose restart
  ```

## Troubleshooting

### Products not showing in catalog
- Ensure both Django and Flask services are running
- Check RabbitMQ is processing messages
- Verify CORS is configured in backend services

### Like button not working
- Check Flask `/like` endpoint returns complete product object
- Verify Flask service is accessible at `http://localhost:8001`
- Check browser console for error messages

### CORS errors
- Ensure backend services allow `http://localhost:5173` origin
- Check Docker network configuration

## License

MIT

<!-- Ready for GitHub -->
