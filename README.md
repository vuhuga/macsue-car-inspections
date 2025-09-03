# Macsue Car Inspections

A modern web application for car inspection services built with Angular and Node.js.

## Features

- User authentication (login/register)
- Inspection booking system
- Admin dashboard
- Contact management
- Service pricing
- Responsive design

## Tech Stack

### Frontend
- Angular 18
- TypeScript
- Bootstrap CSS
- Responsive design

### Backend
- Node.js
- Express.js
- MySQL database
- JWT authentication
- RESTful API

## Project Structure

```
macsue-car-inspections/          # Angular frontend
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── guards/             # Route guards
│   │   └── models/             # TypeScript models
│   └── assets/                 # Static assets

macsue-car-inspections-backend/  # Node.js backend
├── routes/                     # API routes
├── middleware/                 # Custom middleware
├── config/                     # Configuration files
└── scripts/                    # Database scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- Git

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd macsue-car-inspections-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=macsue_car_inspections
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run the database script in MySQL:
   ```bash
   mysql -u root -p < database.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd macsue-car-inspections
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser to `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Inspections
- `GET /api/inspections` - Get user inspections
- `POST /api/inspections` - Book new inspection
- `PUT /api/inspections/:id` - Update inspection
- `DELETE /api/inspections/:id` - Cancel inspection

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin)

### Pricing
- `GET /api/pricing` - Get service pricing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

