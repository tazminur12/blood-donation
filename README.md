# 🩸 Blood Donation Management System

A comprehensive digital blood donation management platform built with Next.js, MongoDB, and NextAuth. This system enables donors, administrators, and volunteers to efficiently manage the blood donation process.

## 🌐 Live Demo

**🔗 [View Live Application](https://blood-donation-3x3q.vercel.app/)**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 Authentication & Security
- Secure authentication system using NextAuth
- Email/Password login
- Session management
- Password encryption with bcryptjs
- Security settings (max login attempts, session timeout)

### 👥 User Management
- Multi-role system (Admin, Donor, Volunteer)
- User registration and profile management
- Donor search and filtering
- Role-based access control

### 🩸 Blood Request Management
- Create urgent and regular blood requests
- Blood group and location-based filtering
- Request status tracking (Pending, Active, Fulfilled, Cancelled)
- Automatic donor matching
- Patient information management

### 📅 Appointment Management
- Book appointments for blood donation
- Hospital/center selection
- Date and time scheduling
- Appointment status tracking
- Appointment history

### 👤 Donor Profile Management
- Complete profile with personal information
- Blood group, location (Division, District, Upazila)
- Profile photo upload
- Profile visibility settings (Public/Private)
- Profile editing capabilities

### 🎯 Campaign Management
- Create and manage blood donation campaigns
- Campaign status tracking (Active, Upcoming, Completed, Cancelled)
- Location and date-based search
- Campaign participation tracking

### 🚗 Blood Drive Management
- Organize blood donation drives
- Drive scheduling and management
- Participant tracking
- Location-based drive search

### 📦 Inventory Management
- Blood stock tracking by blood group
- Low stock alerts
- Inventory reports
- Stock updates by administrators

### 🏆 Certificate Management
- Automatic certificate generation after donation
- PDF certificate download
- Donation history with certificates
- Digital certificate system

### 🔔 Notification System
- Email notifications
- Real-time notifications
- Notification settings per user
- Admin notification management

### 📊 Statistics & Analytics
- Donor statistics
- Blood request statistics
- Campaign analytics
- Blood inventory statistics
- Role-specific dashboards
- Visual charts and graphs

### ⚙️ Settings Management
- System settings configuration
- Email/SMS settings
- Security settings
- Feature toggles
- User preferences

### 🔍 Advanced Search
- Blood group-based donor search
- Location-based search (Division, District, Upazila)
- Advanced filtering options
- Public donor directory

### 📱 Additional Services
- Ambulance service directory
- Bus service information
- Courier services
- Doctor listings
- Hospital listings
- Fire service directory
- Police service directory
- Restaurant listings
- And many more community services

---

## 🛠 Tech Stack

### Frontend
- **Next.js** 16.0.3 - React framework
- **React** 19.2.0 - UI library
- **Tailwind CSS** 4.0 - Styling
- **Lottie React** 2.4.1 - Animations
- **React Icons** 5.3.0 - Icon library
- **SweetAlert2** 11.26.3 - Notifications

### Backend
- **Next.js API Routes** - Serverless API
- **NextAuth** 4.24.13 - Authentication
- **MongoDB** 7.0.0 - Database
- **bcryptjs** 3.0.3 - Password hashing
- **Nodemailer** 7.0.10 - Email service

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blood-donation
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your_email@gmail.com
   EMAIL_SERVER_PASSWORD=your_email_password
   EMAIL_FROM=your_email@gmail.com
   ```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB database (local or use MongoDB Atlas)
2. Update `MONGODB_URI` in `.env.local` with your connection string

### NextAuth Configuration

1. Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```
2. Add it to `NEXTAUTH_SECRET` in `.env.local`

### Email Configuration

Configure your email service provider settings in `.env.local` for email notifications.

---

## 💻 Usage

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
blood-donation/
├── public/                 # Static assets
│   ├── assets/            # Images, animations, JSON data
│   └── image/             # Public images
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── admin/     # Admin dashboard
│   │   │   └── donor/     # Donor dashboard
│   │   ├── about/         # About pages
│   │   ├── all-service/   # Service pages
│   │   └── ...            # Other pages
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   └── providers/         # Context providers
├── eslint.config.mjs      # ESLint configuration
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## 👤 User Roles

### 🔴 Admin
- Manage all users (donors, volunteers)
- Manage blood requests, campaigns, and drives
- Inventory management
- System settings configuration
- View statistics and reports
- Send notifications
- Manage appointments

### 🟢 Donor
- Manage personal profile
- Create and view blood requests
- Book appointments
- View donation history
- Download certificates
- View campaigns and drives
- View personal statistics
- Manage settings

### 🔵 Volunteer
- Volunteer profile management
- View volunteer statistics
- Participate in campaigns and drives
- View blood requests

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Blood Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create request
- `GET /api/requests/[id]` - Get request details
- `PUT /api/requests/[id]` - Update request
- `DELETE /api/requests/[id]` - Delete request

### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/[id]` - Get donor details

### Appointments
- `GET /api/donor/appointments` - Get appointments
- `POST /api/donor/appointments` - Create appointment

### Campaigns
- `GET /api/donor/campaigns` - Get campaigns
- `POST /api/admin/campaigns` - Create campaign (Admin only)

### And many more...

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact

**Project Maintainer**: Blood Donation System Team

**Live Application**: [https://blood-donation-3x3q.vercel.app/](https://blood-donation-3x3q.vercel.app/)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- All contributors and volunteers
- The open-source community

---

## 🚀 Future Enhancements

- [ ] Mobile App (iOS & Android)
- [ ] Advanced Analytics Dashboard
- [ ] AI-powered Donor Matching
- [ ] Real-time Chat System
- [ ] Social Media Integration
- [ ] Donation Rewards System
- [ ] Blood Bank Integration
- [ ] Advanced Reporting Features
- [ ] Multi-language Support (Extended)
- [ ] SMS Notification Integration

---

## 📊 Project Status

✅ **Active Development** - The project is actively maintained and updated.

**Version**: 1.0.0  
**Last Updated**: 2024

---

<div align="center">

**Made with ❤️ for saving lives**

⭐ Star this repo if you find it helpful!

</div>
