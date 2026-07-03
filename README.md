# 💄 Beautician Management System

A full-stack **Beautician & Salon Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. This application helps salon owners manage employees, clients, appointments, attendance, payroll, payments, reports, and overall business operations efficiently.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure JWT Authentication
* Role-based access control
* Admin and Employee roles
* Protected routes

### 📊 Dashboard

* Business overview dashboard
* Revenue analytics
* Appointment statistics
* Employee performance metrics

### 👩‍💼 Employee Management

* Add, edit, delete employees
* Employee status management
* Staff roles management
* Employee profile management

### 👥 Client Management

* Client registration
* Client history tracking
* Contact management
* Service records

### 📅 Appointment Management

* Create appointments
* Update appointment status
* Schedule management
* Calendar-based booking

### 💳 Payment Management

* Payment processing
* Payment history
* Revenue tracking
* Financial summaries

### 💰 Payroll Management

* Generate payroll
* Commission management
* Bonus calculation
* Mark payroll as paid
* Payroll history

### 🕒 Attendance Management

* Employee attendance tracking
* Check-in/check-out system
* Attendance reports

### 📝 Leave Management

* Leave requests
* Leave approval system
* Leave tracking

### 🎯 Monthly Targets

* Employee targets
* Performance tracking
* Target achievement reports

### 📈 Reports

* Sales reports
* Employee reports
* Revenue analytics
* Export functionality

### 👤 Profile Management

* User profile updates
* Profile image upload
* Personal information management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Material UI (MUI)
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (Image Upload)

### Database

* MongoDB Atlas
* Mongoose ODM

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
Beautician-Management-System/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── utils/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/Beautician-Management-System.git

cd Beautician-Management-System
```

---

### Backend Setup

```bash
cd backend

npm install
```

Create `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Start frontend:

```bash
npm run dev
```

---

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/update-profile
PUT  /api/auth/upload-profile
```

### Employees

```http
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
PATCH  /api/employees/toggle-status/:id
```

### Clients

```http
GET    /api/clients
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Payroll

```http
GET /api/payroll
POST /api/payroll
PUT /api/payroll/pay/:id
```

---

## 🔒 Authentication

This application uses:

* JWT Token Authentication
* Protected Routes
* Role-Based Access Control
* Secure Password Hashing with bcrypt

---

## 📸 Screenshots

Add screenshots here:

* Login Page
* Dashboard
* Employee Management
* Client Management
* Payroll Management
* Reports
* Profile Page

---

## 🚀 Deployment

### Frontend

* Deploy using Vercel

### Backend

* Deploy using Render

### Database

* MongoDB Atlas

---

## 👨‍💻 Author

**Charan**

Beautician Management System — Final Year Full Stack MERN Project

---

## 📄 License

This project is licensed under the MIT License.
