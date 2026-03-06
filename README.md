# ระบบสำนักทะเบียนมหาวิทยาลัย

ระบบจัดการข้อมูลสำนักทะเบียนมหาวิทยาลัย รองรับ 3 roles: นักศึกษา, อาจารย์, และเจ้าหน้าที่สำนักทะเบียน

## Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + React Router v6
- **Backend**: NestJS + TypeScript + Sequelize ORM
- **Database**: MySQL 8.0 / MariaDB
- **Auth**: JWT (httpOnly cookie) + Google OAuth 2.0 + argon2

## Features

### นักศึกษา
- ดูผลการเรียนและ GPA
- ดูตารางเรียนรายสัปดาห์
- ดูตารางสอบ (Midterm / Final)
- ลงทะเบียน / ถอนรายวิชา

### อาจารย์
- ดูรายวิชาที่สอนในแต่ละภาคการศึกษา
- ดูรายชื่อนักศึกษาในวิชาและกรอกเกรด
- ดูผลการเรียนนักศึกษาในภาควิชา

### เจ้าหน้าที่สำนักทะเบียน
- บันทึก/แก้ไขตารางเรียนประจำภาคการศึกษา
- บันทึกตารางสอบ
- ตรวจสอบผลการเรียนของนักศึกษาประจำคณะ

## Project Structure

```
registrar-system/
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── auth/          # Login, JWT, Google OAuth
│   │   ├── models/        # Sequelize models
│   │   ├── courses/
│   │   ├── enrollments/
│   │   ├── grades/
│   │   ├── sections/
│   │   ├── exam-schedules/
│   │   ├── common/        # Guards, decorators
│   │   └── seed.ts        # Seed script
│   ├── .env
│   └── Dockerfile
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── context/       # AuthContext
│   │   ├── components/    # Layout, ProtectedRoute
│   │   └── pages/         # Pages by role
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | email, password_hash, auth_provider, role |
| `faculties` | คณะ |
| `majors` | สาขาวิชา (1 คณะ : N สาขา) |
| `student_profiles` | ข้อมูลนักศึกษา |
| `instructor_profiles` | ข้อมูลอาจารย์ |
| `courses` | รายวิชา |
| `semesters` | ภาคการศึกษา |
| `sections` | ตอนเรียน (พร้อม schedule_json) |
| `enrollments` | การลงทะเบียน |
| `grades` | เกรด |
| `exam_schedules` | ตารางสอบ |

## Local Development

### Prerequisites

- Node.js 20+
- MySQL 8.0 หรือ Docker

### 1. Clone & Install

```bash
git clone <repo-url>
cd registrar-system

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. ตั้งค่า Environment

```bash
# backend/.env
cp backend/.env.example backend/.env
```

แก้ไขค่าใน `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=registrar_db

JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=8h

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3. รัน Database

```bash
# ใช้ Docker (แนะนำ)
docker run -d \
  --name registrar-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=registrar_db \
  -p 3306:3306 \
  mysql:8.0

# หรือใช้ docker-compose (รัน database อย่างเดียว)
docker-compose up db -d
```

### 4. Migrate & Seed

```bash
cd backend

# Sync schema (auto on start via sequelize sync)
npm run start:dev

# Seed test data (เปิด terminal ใหม่)
npx ts-node src/seed.ts
```

### 5. รัน Dev Servers

```bash
# Terminal 1 — Backend
cd backend
npm run start:dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

เปิด [http://localhost:5173](http://localhost:5173)

## Test Accounts

รหัสผ่าน: `password123`

| Role | Email |
|------|-------|
| เจ้าหน้าที่ | staff@test.com |
| อาจารย์ | instructor@test.com |
| นักศึกษา | student@test.com |

## Google OAuth Setup

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง OAuth 2.0 Client ID (Web application)
3. เพิ่ม Authorized redirect URI: `http://localhost:3001/auth/google/callback`
4. ใส่ `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET` ใน `.env`

> **หมายเหตุ**: account ที่ login ผ่าน Google จะไม่สามารถ login ด้วย password ได้ และในทางกลับกัน (enforce ด้วย `auth_provider` column)

## Docker Compose (Full Stack)

```bash
docker-compose up --build
```

Services:
- `db` — MySQL 8.0 (port 3306)
- `backend` — NestJS (port 3001)
- `frontend` — Nginx serving React build (port 80)

## GPA Calculation

```
Grade Points: A=4.0, B+=3.5, B=3.0, C+=2.5, C=2.0, D+=1.5, D=1.0, F=0
GPA = Σ(grade_point × credits) / Σ(credits)
```
วิชาที่ได้ W (ถอน) หรือ I (ไม่สมบูรณ์) จะไม่นำมาคำนวณ GPA

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Local login |
| GET | `/api/auth/google` | เริ่ม Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/me` | ดูข้อมูล user ปัจจุบัน |
| POST | `/api/auth/logout` | Logout (clear cookie) |

### Student
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/grades/my` | ผลการเรียน + GPA |
| GET | `/api/sections/my-schedule` | ตารางเรียน |
| GET | `/api/exam-schedules/my` | ตารางสอบ |
| GET | `/api/sections/available` | รายวิชาที่เปิดรับลงทะเบียน |
| POST | `/api/enrollments` | ลงทะเบียนวิชา |

### Instructor
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sections/mine` | วิชาที่สอน |
| GET | `/api/sections/:id/students` | รายชื่อนักศึกษาในวิชา |
| POST | `/api/grades` | บันทึกเกรด |
| PUT | `/api/grades/:id` | แก้ไขเกรด |
| GET | `/api/department/results` | ผลการเรียนในภาควิชา |

### Staff
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sections` | สร้างตารางเรียน |
| PUT | `/api/sections/:id` | แก้ไขตาราง |
| POST | `/api/exam-schedules` | บันทึกตารางสอบ |
| GET | `/api/faculty/:id/results` | ผลการเรียนประจำคณะ |
