# Macsue Car Inspections - Setup Instructions

## Issues Fixed

### 1. Image Display Issues
- **Problem**: Images were not showing due to incorrect asset paths
- **Solution**: 
  - Fixed image paths in CSS files from `/assets/images/` to `assets/images/`
  - Updated `angular.json` to properly include `src/assets` directory in build configuration
  - Images are now properly served from the assets folder

### 2. Login Credentials Added
- **Admin Login**: 
  - Username: `admin`
  - Password: `admin123`
  - Access: Full admin dashboard with all inspection requests

- **User Login**:
  - Username: `user` 
  - Password: `user123`
  - Access: User dashboard with personal inspection requests only

## Setup Instructions

### 1. Backend Setup
```bash
cd macsue-car-inspections/backend
npm install
```

### 2. Database Setup
- Create MySQL database named `macsue_inspections`
- Run the database script:
```bash
mysql -u root -p < database.sql
```

Or use the reset script to create users with correct credentials:
```bash
node scripts/reset-users.js
```

### 3. Environment Configuration
Create `.env` file in backend directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=macsue_inspections
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
PORT=3000
```

### 4. Start Backend Server
```bash
npm start
```

### 5. Frontend Setup
```bash
cd macsue-car-inspections
npm install
ng serve
```

### 6. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Login Credentials

### Admin Dashboard
- **Username**: admin
- **Password**: admin123
- **Features**: 
  - View all inspection requests from all users
  - Admin badge display
  - Action buttons for managing inspections

### User Dashboard  
- **Username**: user
- **Password**: user123
- **Features**:
  - View personal inspection requests only
  - Book new inspections
  - User badge display

## Files Modified

1. **Image Path Fixes**:
   - `macsue-car-inspections/src/styles.css`
   - `macsue-car-inspections/src/app/pages/home/home.css`
   - `macsue-car-inspections/angular.json`

2. **Authentication Updates**:
   - `macsue-car-inspections/backend/database.sql`
   - `macsue-car-inspections/src/app/pages/login/login.html`

3. **Dashboard Enhancements**:
   - `macsue-car-inspections/src/app/pages/dashboard/dashboard.ts`
   - `macsue-car-inspections/src/app/pages/dashboard/dashboard.html`
   - `macsue-car-inspections/src/app/services/inspection.service.ts`

4. **New Scripts**:
   - `macsue-car-inspections/backend/scripts/generate-passwords.js`
   - `macsue-car-inspections/backend/scripts/reset-users.js`

## Testing

1. **Test Image Display**: 
   - Navigate to home page and verify hero background image loads
   - Check that all images in assets folder are accessible

2. **Test Admin Login**:
   - Login with admin/admin123
   - Verify admin dashboard shows all inspections
   - Check admin badge is displayed

3. **Test User Login**:
   - Login with user/user123  
   - Verify user dashboard shows only user's inspections
   - Check user badge is displayed
   - Verify "Book New Inspection" button is available

## Notes

- The application uses mock data in the frontend service for demonstration
- In production, connect the frontend services to the backend API endpoints
- Images are stored in `src/assets/images/` and properly configured for Angular build
- Password hashes are generated using bcrypt with salt rounds of 12