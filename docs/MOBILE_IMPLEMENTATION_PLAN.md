# 📱 Hospital Patient Mobile App - Implementation Plan

> **Project**: Hospital Management Patient App  
> **Tech Stack**: Expo SDK 54 + React Native + Redux Toolkit + NativeWind  
> **Based on**: expo-rapid-boilerplate  
> **Target**: iOS & Android

---

## 📋 Table of Contents

1. [Phase Overview](#phase-overview)
2. [Phase 0: Project Setup](#phase-0-project-setup)
3. [Phase 1: Authentication](#phase-1-authentication)
4. [Phase 2: Core Navigation & Dashboard](#phase-2-core-navigation--dashboard)
5. [Phase 3: Doctor Discovery & Booking](#phase-3-doctor-discovery--booking)
6. [Phase 4: Appointment Management](#phase-4-appointment-management)
7. [Phase 5: Health Records](#phase-5-health-records)
8. [Phase 6: Payments & Transactions](#phase-6-payments--transactions)
9. [Phase 7: Chat & Support](#phase-7-chat--support)
10. [Phase 8: Profile & Settings](#phase-8-profile--settings)
11. [Phase 9: AI Features](#phase-9-ai-features)
12. [Phase 10: Polish & Release](#phase-10-polish--release)

---

## 🎯 Phase Overview

| Phase | Name | Duration | Priority | Dependencies |
|-------|------|----------|----------|--------------|
| 0 | Project Setup | 3 days | 🔴 Critical | None |
| 1 | Authentication | 5 days | 🔴 Critical | Phase 0 |
| 2 | Core Navigation & Dashboard | 5 days | 🔴 Critical | Phase 1 |
| 3 | Doctor Discovery & Booking | 7 days | 🔴 Critical | Phase 2 |
| 4 | Appointment Management | 5 days | 🔴 Critical | Phase 3 |
| 5 | Health Records | 5 days | 🟡 High | Phase 4 |
| 6 | Payments & Transactions | 4 days | 🟡 High | Phase 4 |
| 7 | Chat & Support | 5 days | 🟡 High | Phase 2 |
| 8 | Profile & Settings | 3 days | 🟢 Medium | Phase 1 |
| 9 | AI Features | 5 days | 🟢 Medium | Phase 3 |
| 10 | Polish & Release | 5 days | 🟡 High | All |

**Total Estimated Duration**: ~52 days (10-11 weeks)

---

## 🚀 Phase 0: Project Setup

**Duration**: 3 days  
**Goal**: Chuẩn bị infrastructure, config và base architecture

### Tasks

#### 0.1 Project Configuration
- [ ] Rename app từ `my-expo-app` → `hospital-patient-app`
- [ ] Cấu hình `app.json` (bundle ID, app name, icons, splash)
- [ ] Setup environment variables (`.env`, `expo-constants`)
- [ ] Cấu hình EAS Build cho iOS/Android

#### 0.2 API Layer Setup
```
services/
├── api/
│   ├── client.ts          # Axios instance với interceptors
│   ├── endpoints.ts       # API endpoint constants
│   └── types.ts           # API response types
├── auth/
│   └── authService.ts
├── appointment/
│   └── appointmentService.ts
├── doctor/
│   └── doctorService.ts
├── patient/
│   └── patientService.ts
├── payment/
│   └── paymentService.ts
└── conversation/
    └── conversationService.ts
```

- [ ] Install & config Axios
- [ ] Setup API client với base URL, headers
- [ ] Implement request/response interceptors
- [ ] Token refresh logic
- [ ] Error handling utilities

#### 0.3 Redux Store Structure
```
store/
├── index.ts
├── hooks.ts
└── slices/
    ├── appSlice.ts        # (existing)
    ├── authSlice.ts       # NEW
    ├── userSlice.ts       # NEW
    ├── appointmentSlice.ts # NEW
    ├── doctorSlice.ts     # NEW
    └── chatSlice.ts       # NEW
```

- [ ] Create auth slice (tokens, user info)
- [ ] Create user slice (patient profile)
- [ ] Setup RTK Query (optional, for data fetching)

#### 0.4 Navigation Structure
```
app/
├── _layout.tsx
├── index.tsx              # Entry redirect
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (main)/
│   ├── _layout.tsx        # Tab navigator
│   ├── (home)/
│   │   └── index.tsx
│   ├── (booking)/
│   │   ├── index.tsx
│   │   ├── doctor/[id].tsx
│   │   ├── select-time.tsx
│   │   ├── enter-info.tsx
│   │   └── confirmation.tsx
│   ├── (appointments)/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── (health-records)/
│   │   ├── index.tsx
│   │   └── consultation/[id].tsx
│   ├── (chat)/
│   │   ├── index.tsx
│   │   └── [conversationId].tsx
│   └── (profile)/
│       ├── index.tsx
│       ├── edit.tsx
│       ├── payments.tsx
│       └── settings.tsx
└── +not-found.tsx
```

- [ ] Setup route groups
- [ ] Configure protected routes
- [ ] Setup deep linking

#### 0.5 i18n Setup
- [ ] Add Vietnamese translations (`vi.json`)
- [ ] Add Japanese translations (`ja.json`) - if needed
- [ ] Update language config

#### 0.6 Additional Dependencies
```bash
# Install required packages
yarn add axios @tanstack/react-query socket.io-client
yarn add react-native-date-picker
yarn add @react-native-async-storage/async-storage
yarn add react-native-image-picker
yarn add lottie-react-native
```

### Deliverables
- ✅ Project properly configured
- ✅ API client ready
- ✅ Redux store structure ready
- ✅ Navigation skeleton ready
- ✅ i18n với Vietnamese

---

## 🔐 Phase 1: Authentication

**Duration**: 5 days  
**Goal**: Complete authentication flow

### Tasks

#### 1.1 Auth Screens UI
- [ ] **Login Screen**
  - Email input
  - Password input (with show/hide)
  - "Forgot password" link
  - Login button
  - Register link
  - Social login buttons (optional)

- [ ] **Register Screen**
  - Full name input
  - Email input
  - Phone input
  - Password input
  - Confirm password
  - Terms checkbox
  - Register button

- [ ] **Forgot Password Screen** (optional for MVP)

#### 1.2 Auth Logic
```typescript
// services/auth/authService.ts
interface AuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: RegisterDto): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<TokenResponse>;
  logout(refreshToken: string): Promise<void>;
}
```

- [ ] Implement login API call
- [ ] Implement register API call
- [ ] Implement token storage (MMKV)
- [ ] Implement auto-refresh token
- [ ] Implement logout

#### 1.3 Auth State Management
```typescript
// store/slices/authSlice.ts
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
```

- [ ] Create authSlice
- [ ] Persist tokens with redux-persist
- [ ] Handle auth state changes

#### 1.4 Protected Routes
- [ ] Create auth guard HOC/hook
- [ ] Redirect unauthenticated users to login
- [ ] Redirect authenticated users from auth screens

#### 1.5 Form Validation
- [ ] Email validation
- [ ] Password strength validation
- [ ] Phone number validation
- [ ] Error message display

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |

### Deliverables
- ✅ Login screen functional
- ✅ Register screen functional
- ✅ Token management working
- ✅ Auto-refresh token
- ✅ Protected routes

---

## 🏠 Phase 2: Core Navigation & Dashboard

**Duration**: 5 days  
**Goal**: Main app structure và Patient Dashboard

### Tasks

#### 2.1 Tab Navigation
```typescript
// 4 main tabs
tabs: [
  { name: 'home', icon: 'Home', label: 'Trang chủ' },
  { name: 'appointments', icon: 'Calendar', label: 'Lịch hẹn' },
  { name: 'chat', icon: 'MessageCircle', label: 'Hỗ trợ' },
  { name: 'profile', icon: 'User', label: 'Tài khoản' },
]
```

- [ ] Create custom TabBar component
- [ ] Badge cho unread messages
- [ ] Tab icons với lucide-react-native

#### 2.2 Dashboard Screen
```
┌─────────────────────────────────┐
│  👋 Xin chào, [Tên bệnh nhân]   │
│  ──────────────────────────────  │
│  🔍 [    Tìm bác sĩ...      ]   │
├─────────────────────────────────┤
│  ⚡ Thao tác nhanh               │
│  ┌──────┐ ┌──────┐ ┌──────┐     │
│  │Đặt   │ │AI    │ │Lịch  │     │
│  │lịch  │ │Tư vấn│ │sử    │     │
│  └──────┘ └──────┘ └──────┘     │
├─────────────────────────────────┤
│  📅 Lịch hẹn sắp tới            │
│  ┌─────────────────────────────┐│
│  │ Dr. Nguyễn Văn A            ││
│  │ 15/01/2026 - 09:00          ││
│  │ Tim mạch • Khám trực tiếp   ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  📊 Chỉ số sức khỏe             │
│  Chiều cao: 170cm  Cân nặng: 65kg│
│  BMI: 22.5 (Bình thường)        │
├─────────────────────────────────┤
│  📋 Lịch sử khám gần đây        │
│  • 01/01/2026 - Nội tổng quát   │
│  • 15/12/2025 - Da liễu         │
└─────────────────────────────────┘
```

- [ ] **Header Section**
  - User greeting
  - Notification bell
  - Search bar (navigate to doctor search)

- [ ] **Quick Actions Grid**
  - Book appointment
  - AI consultation
  - View history
  - Support chat

- [ ] **Upcoming Appointments Card**
  - Next appointment info
  - Doctor info
  - Quick actions (Cancel, Reschedule)

- [ ] **Health Metrics Card**
  - Height, Weight, BMI
  - Blood type, Allergies

- [ ] **Recent History List**
  - Last 3 consultations
  - "View all" link

#### 2.3 Fetch User Data
- [ ] Get user profile on app launch
- [ ] Get patient profile (health info)
- [ ] Get upcoming appointments
- [ ] Get recent consultations

#### 2.4 Pull-to-Refresh
- [ ] Implement refresh on dashboard
- [ ] Loading states

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get user profile |
| GET | `/appointments` | Get appointments (with filters) |
| GET | `/patients/me/consultations` | Get consultation history |

### Deliverables
- ✅ Tab navigation working
- ✅ Dashboard với all sections
- ✅ Data fetching từ API
- ✅ Pull-to-refresh

---

## 👨‍⚕️ Phase 3: Doctor Discovery & Booking

**Duration**: 7 days  
**Goal**: Complete booking flow (4 steps)

### Tasks

#### 3.1 Doctor Search & Discovery
```
┌─────────────────────────────────┐
│  🔍 [Tìm theo tên, chuyên khoa] │
├─────────────────────────────────┤
│  Chuyên khoa phổ biến           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │Tim │ │Nội │ │Da  │ │Thần│    │
│  │mạch│ │khoa│ │liễu│ │kinh│    │
│  └────┘ └────┘ └────┘ └────┘    │
├─────────────────────────────────┤
│  Bác sĩ được đề xuất            │
│  ┌─────────────────────────────┐│
│  │ 👤 TS.BS Nguyễn Văn A       ││
│  │ ⭐ Tim mạch • 15 năm KN     ││
│  │ 💰 350,000đ                 ││
│  │ [       Đặt lịch       ]    ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] **Specialty List**
  - Grid of specialties with icons
  - Navigate to filtered doctors

- [ ] **Doctor List**
  - Doctor card component
  - Filter by specialty
  - Search by name
  - Infinite scroll pagination

- [ ] **Doctor Detail Screen**
  - Avatar, name, title
  - Specialty, sub-specialty
  - Years of experience
  - Consultation fee
  - Bio/description
  - Education history
  - Awards & certifications
  - "Book Now" CTA

#### 3.2 Booking Step 1: Select Doctor
- [ ] Doctor selection UI
- [ ] Store selected doctor in Redux/Zustand

#### 3.3 Booking Step 2: Select Date & Time
```
┌─────────────────────────────────┐
│  📅 Chọn ngày khám              │
│  ┌─────────────────────────────┐│
│  │     Tháng 1, 2026           ││
│  │ CN T2 T3 T4 T5 T6 T7        ││
│  │        1  2  3  4  5        ││
│  │  6  7  8  9 10 11 12        ││
│  │ 13 14 [15]16 17 18 19       ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  ⏰ Khung giờ khả dụng          │
│  Sáng:                          │
│  [08:00] [08:30] [09:00] [09:30]│
│  Chiều:                         │
│  [14:00] [14:30] [15:00]        │
├─────────────────────────────────┤
│  🏥 Loại khám                   │
│  ○ Khám trực tiếp               │
│  ○ Khám Online                  │
└─────────────────────────────────┘
```

- [ ] Calendar component (date picker)
- [ ] Fetch available time slots for selected date
- [ ] Time slot selection
- [ ] Examination type selection
- [ ] Disable past dates
- [ ] Show slot availability

#### 3.4 Booking Step 3: Enter Information
```
┌─────────────────────────────────┐
│  📝 Thông tin bệnh nhân         │
│  Họ tên: [____________]         │
│  Ngày sinh: [__/__/____]        │
│  Giới tính: [Nam ▼]             │
│  Số điện thoại: [____________]  │
│  Email: [____________]          │
│  Địa chỉ: [____________]        │
│  Số BHYT: [____________]        │
├─────────────────────────────────┤
│  🩺 Triệu chứng                 │
│  ┌─────────────────────────────┐│
│  │ Mô tả triệu chứng của bạn   ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  📝 Ghi chú thêm                │
│  ┌─────────────────────────────┐│
│  │                             ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] Patient info form (pre-filled from profile)
- [ ] Symptoms text area
- [ ] Notes text area
- [ ] Form validation

#### 3.5 Booking Step 4: Confirmation & Payment
```
┌─────────────────────────────────┐
│  ✅ Xác nhận đặt lịch           │
├─────────────────────────────────┤
│  👨‍⚕️ Bác sĩ                     │
│  TS.BS Nguyễn Văn A - Tim mạch  │
├─────────────────────────────────┤
│  📅 Thời gian                   │
│  15/01/2026 • 09:00 - 09:30     │
│  Khám trực tiếp                 │
├─────────────────────────────────┤
│  💰 Chi phí                     │
│  Phí khám: 350,000đ             │
│  Tổng: 350,000đ                 │
├─────────────────────────────────┤
│  💳 Phương thức thanh toán      │
│  ○ Tiền mặt (tại quầy)          │
│  ○ Chuyển khoản ngân hàng       │
├─────────────────────────────────┤
│  [QR Code thanh toán]           │
├─────────────────────────────────┤
│  ☑️ Tôi đồng ý với điều khoản   │
│                                 │
│  [      Xác nhận đặt lịch     ] │
└─────────────────────────────────┘
```

- [ ] Booking summary display
- [ ] Payment method selection
- [ ] Bank transfer QR code modal
- [ ] Terms agreement checkbox
- [ ] Submit booking API call
- [ ] Success/Error handling
- [ ] Navigate to appointment detail

#### 3.6 Booking State Management
```typescript
// store/slices/bookingSlice.ts
interface BookingState {
  currentStep: number;
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  examinationType: 'IN_PERSON' | 'ONLINE';
  symptoms: string;
  notes: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER';
  isSubmitting: boolean;
}
```

- [ ] Create booking slice
- [ ] Step navigation logic
- [ ] Reset on completion

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/specialties` | List specialties |
| GET | `/specialties/:id/doctors` | Doctors by specialty |
| GET | `/doctors` | List/search doctors |
| GET | `/doctors/:id` | Doctor detail |
| GET | `/doctors/:id/schedules` | Doctor schedules |
| POST | `/appointments` | Create appointment |

### Deliverables
- ✅ Doctor search & filter
- ✅ Doctor detail screen
- ✅ 4-step booking flow
- ✅ Calendar & time slot selection
- ✅ Booking confirmation
- ✅ Payment method selection

---

## 📅 Phase 4: Appointment Management

**Duration**: 5 days  
**Goal**: View, manage và cancel appointments

### Tasks

#### 4.1 Appointments List Screen
```
┌─────────────────────────────────┐
│  📅 Lịch hẹn của tôi            │
│  ┌─────────────────────────────┐│
│  │ [Sắp tới] [Đã khám] [Đã hủy]││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 📆 15/01/2026 • 09:00       ││
│  │ TS.BS Nguyễn Văn A          ││
│  │ Tim mạch                    ││
│  │ 🟡 Chờ xác nhận             ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 📆 20/01/2026 • 14:00       ││
│  │ BS Trần Thị B               ││
│  │ Da liễu                     ││
│  │ 🟢 Đã xác nhận              ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] Tab filters (Upcoming, Completed, Cancelled)
- [ ] Appointment card component
- [ ] Status badge component
- [ ] Pull-to-refresh
- [ ] Empty state

#### 4.2 Appointment Detail Screen
```
┌─────────────────────────────────┐
│  📋 Chi tiết lịch hẹn           │
│  #APT-2026-0001                 │
├─────────────────────────────────┤
│  Trạng thái: 🟢 Đã xác nhận     │
├─────────────────────────────────┤
│  👨‍⚕️ Thông tin bác sĩ           │
│  TS.BS Nguyễn Văn A             │
│  Tim mạch                       │
│  📞 0901234567                  │
├─────────────────────────────────┤
│  📅 Thời gian                   │
│  15/01/2026 • 09:00 - 09:30     │
│  Khám trực tiếp                 │
├─────────────────────────────────┤
│  🩺 Triệu chứng                 │
│  Đau ngực, khó thở khi gắng sức │
├─────────────────────────────────┤
│  💰 Thanh toán                  │
│  Phí khám: 350,000đ             │
│  Trạng thái: ✅ Đã thanh toán   │
├─────────────────────────────────┤
│  [     Hủy lịch hẹn     ]       │
└─────────────────────────────────┘
```

- [ ] Full appointment details
- [ ] Doctor info with contact
- [ ] Payment status
- [ ] Cancel button (conditional)
- [ ] Reschedule option (optional)

#### 4.3 Cancel Appointment
- [ ] Cancel confirmation dialog
- [ ] Cancellation reason selection
- [ ] Cancel API call
- [ ] Update local state

#### 4.4 Appointment Status Handling
```typescript
type AppointmentStatus = 
  | 'PENDING'      // Chờ xác nhận
  | 'CONFIRMED'    // Đã xác nhận
  | 'IN_PROGRESS'  // Đang khám
  | 'COMPLETED'    // Hoàn thành
  | 'CANCELLED'    // Đã hủy
  | 'NO_SHOW';     // Không đến
```

- [ ] Status badge colors
- [ ] Conditional actions based on status

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | List appointments |
| GET | `/appointments/:id` | Appointment detail |
| POST | `/appointments/:id/cancel` | Cancel appointment |

### Deliverables
- ✅ Appointments list với tabs
- ✅ Appointment detail screen
- ✅ Cancel functionality
- ✅ Status-based UI

---

## 📋 Phase 5: Health Records

**Duration**: 5 days  
**Goal**: View consultation history và medical records

### Tasks

#### 5.1 Health Records List
```
┌─────────────────────────────────┐
│  📋 Hồ sơ sức khỏe              │
├─────────────────────────────────┤
│  📊 Tổng quan                   │
│  Chiều cao: 170cm               │
│  Cân nặng: 65kg                 │
│  Nhóm máu: O+                   │
│  Dị ứng: Penicillin             │
├─────────────────────────────────┤
│  📅 Lịch sử khám                │
│  ┌─────────────────────────────┐│
│  │ 01/01/2026                  ││
│  │ BS Trần Văn B - Nội khoa    ││
│  │ Chẩn đoán: Viêm dạ dày      ││
│  │ [Xem chi tiết →]            ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] Health overview card
- [ ] Consultation history list
- [ ] Filter by date range
- [ ] Filter by doctor
- [ ] Search by diagnosis

#### 5.2 Consultation Detail Screen
```
┌─────────────────────────────────┐
│  📋 Chi tiết lần khám           │
│  01/01/2026                     │
├─────────────────────────────────┤
│  👨‍⚕️ Bác sĩ                     │
│  BS Trần Văn B - Nội khoa       │
├─────────────────────────────────┤
│  🩺 Triệu chứng                 │
│  Đau bụng vùng thượng vị, buồn  │
│  nôn sau ăn                     │
├─────────────────────────────────┤
│  📝 Chẩn đoán                   │
│  Viêm dạ dày cấp                │
├─────────────────────────────────┤
│  💊 Đơn thuốc                   │
│  1. Omeprazole 20mg             │
│     1 viên/ngày, uống trước ăn  │
│  2. Domperidone 10mg            │
│     3 viên/ngày, uống trước ăn  │
├─────────────────────────────────┤
│  📎 Tài liệu y tế               │
│  • Kết quả xét nghiệm máu       │
│  • Kết quả nội soi dạ dày       │
└─────────────────────────────────┘
```

- [ ] Full consultation details
- [ ] Diagnosis display
- [ ] Prescription list
- [ ] Medical documents list
- [ ] Document viewer/download

#### 5.3 Documents Management
- [ ] View document (PDF, images)
- [ ] Download document
- [ ] Share document (optional)

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/me/consultations` | List consultations |
| GET | `/patients/me/consultations/:id` | Consultation detail |

### Deliverables
- ✅ Health overview
- ✅ Consultation history
- ✅ Consultation detail với prescription
- ✅ Document viewing

---

## 💰 Phase 6: Payments & Transactions

**Duration**: 4 days  
**Goal**: View payment history và transaction details

### Tasks

#### 6.1 Payments List Screen
```
┌─────────────────────────────────┐
│  💰 Lịch sử thanh toán          │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ #PAY-2026-0001              ││
│  │ 15/01/2026 • 350,000đ       ││
│  │ TS.BS Nguyễn Văn A          ││
│  │ ✅ Thành công                ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ #PAY-2026-0002              ││
│  │ 01/01/2026 • 250,000đ       ││
│  │ BS Trần Thị B               ││
│  │ ✅ Thành công                ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] Payment list với status
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Payment card component

#### 6.2 Payment Detail Screen
```
┌─────────────────────────────────┐
│  💳 Chi tiết thanh toán         │
│  #PAY-2026-0001                 │
├─────────────────────────────────┤
│  Trạng thái: ✅ Thành công       │
│  Ngày: 15/01/2026 09:30         │
├─────────────────────────────────┤
│  📋 Thông tin cuộc hẹn          │
│  Bác sĩ: TS.BS Nguyễn Văn A     │
│  Ngày khám: 15/01/2026          │
├─────────────────────────────────┤
│  💰 Chi tiết                    │
│  Phí khám: 350,000đ             │
│  Phí thuốc: 0đ                  │
│  ─────────────────              │
│  Tổng: 350,000đ                 │
├─────────────────────────────────┤
│  💳 Phương thức                 │
│  Chuyển khoản ngân hàng         │
├─────────────────────────────────┤
│  🔗 Blockchain                  │
│  Tx: 0x1234...abcd              │
│  [Xem trên Explorer]            │
└─────────────────────────────────┘
```

- [ ] Payment details
- [ ] Appointment info
- [ ] Fee breakdown
- [ ] Blockchain verification link

#### 6.3 Payment Status
```typescript
type PaymentStatus = 
  | 'PENDING'   // Chờ thanh toán
  | 'SUCCESS'   // Thành công
  | 'FAILED'    // Thất bại
  | 'REFUNDED'; // Đã hoàn tiền
```

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/me/payments` | List payments |
| GET | `/patients/me/payments/:id` | Payment detail |

### Deliverables
- ✅ Payment history list
- ✅ Payment detail screen
- ✅ Blockchain verification

---

## 💬 Phase 7: Chat & Support

**Duration**: 5 days  
**Goal**: Real-time chat với Admin support

### Tasks

#### 7.1 Conversations List Screen
```
┌─────────────────────────────────┐
│  💬 Hỗ trợ                      │
│  [    + Tạo cuộc hội thoại    ] │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ Hỏi về lịch khám     🔴 2   ││
│  │ Cảm ơn bạn đã liên hệ...    ││
│  │ 10:30 hôm nay                ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Thắc mắc về đơn thuốc       ││
│  │ Đơn thuốc của bạn...        ││
│  │ Hôm qua                     ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

- [ ] Conversation list
- [ ] Unread badge
- [ ] Last message preview
- [ ] Create new conversation button

#### 7.2 Chat Screen
```
┌─────────────────────────────────┐
│  ← Hỗ trợ: Hỏi về lịch khám     │
├─────────────────────────────────┤
│                                 │
│  ┌────────────────────┐         │
│  │ Xin chào, tôi muốn │  10:00  │
│  │ hỏi về lịch khám   │         │
│  └────────────────────┘         │
│                                 │
│         ┌────────────────────┐  │
│  10:05  │ Chào bạn! Tôi có   │  │
│         │ thể giúp gì cho    │  │
│         │ bạn?               │  │
│         └────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  [📎] [Nhập tin nhắn...] [📤]  │
└─────────────────────────────────┘
```

- [ ] Chat message list
- [ ] Send message input
- [ ] Message bubbles (sent/received)
- [ ] Timestamp display
- [ ] Attachment support (optional)
- [ ] Auto-scroll to bottom

#### 7.3 Real-time Messaging
```typescript
// WebSocket integration
const socket = io(SOCKET_URL, {
  auth: { token: accessToken }
});

socket.on('new_message', (message) => {
  // Handle new message
});
```

- [ ] Socket.io client setup
- [ ] Connect on conversation open
- [ ] Listen for new messages
- [ ] Send message via socket
- [ ] Disconnect on leave

#### 7.4 New Conversation
- [ ] Create conversation modal
- [ ] Subject input
- [ ] Initial message
- [ ] API call

#### 7.5 Unread Count
- [ ] Fetch unread count
- [ ] Display on tab badge
- [ ] Mark as read on open

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/conversations` | List conversations |
| POST | `/patients/conversations` | Create conversation |
| GET | `/patients/conversations/unread-count` | Unread count |
| GET | `/patients/conversations/:id` | Conversation detail |
| GET | `/patients/conversations/:id/messages` | Get messages |
| POST | `/patients/conversations/:id/messages` | Send message |
| PATCH | `/patients/conversations/:id/read` | Mark as read |

### Deliverables
- ✅ Conversation list
- ✅ Chat UI
- ✅ Real-time messaging
- ✅ Unread badge

---

## 👤 Phase 8: Profile & Settings

**Duration**: 3 days  
**Goal**: Profile management và app settings

### Tasks

#### 8.1 Profile Screen
```
┌─────────────────────────────────┐
│        👤                       │
│    Nguyễn Văn A                 │
│    patient@email.com            │
│    [     Chỉnh sửa     ]        │
├─────────────────────────────────┤
│  📋 Thông tin cá nhân           │
│  Ngày sinh: 01/01/1990          │
│  Giới tính: Nam                 │
│  Số điện thoại: 0901234567      │
│  Địa chỉ: 123 ABC Street        │
├─────────────────────────────────┤
│  🏥 Thông tin y tế              │
│  Chiều cao: 170cm               │
│  Cân nặng: 65kg                 │
│  Nhóm máu: O+                   │
│  Dị ứng: Penicillin             │
│  Số BHYT: BH123456789           │
├─────────────────────────────────┤
│  ⚙️ Cài đặt                     │
│  > Ngôn ngữ                     │
│  > Thông báo                    │
│  > Bảo mật                      │
├─────────────────────────────────┤
│  [      Đăng xuất      ]        │
└─────────────────────────────────┘
```

- [ ] Avatar display/upload
- [ ] Personal info display
- [ ] Medical info display
- [ ] Settings menu

#### 8.2 Edit Profile Screen
- [ ] Edit personal info form
- [ ] Edit medical info form
- [ ] Avatar picker
- [ ] Save changes API

#### 8.3 Settings
- [ ] **Language Settings**
  - Vietnamese
  - English
  
- [ ] **Notification Settings** (optional)
  - Push notifications toggle
  - Email notifications toggle
  
- [ ] **Security** (optional)
  - Change password
  - Biometric login

#### 8.4 Logout
- [ ] Logout confirmation
- [ ] Clear tokens
- [ ] Navigate to login

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get profile |
| PATCH | `/patients/me` | Update profile |

### Deliverables
- ✅ Profile display
- ✅ Edit profile
- ✅ Settings screens
- ✅ Logout functionality

---

## 🤖 Phase 9: AI Features

**Duration**: 5 days  
**Goal**: AI-powered doctor recommendation

### Tasks

#### 9.1 AI Chat Interface
```
┌─────────────────────────────────┐
│  🤖 AI Tư vấn                   │
├─────────────────────────────────┤
│  ┌────────────────────┐         │
│  │ Tôi bị đau đầu và  │         │
│  │ chóng mặt          │         │
│  └────────────────────┘         │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🤖 Để giúp bạn tốt hơn,     ││
│  │ bạn có thể cho tôi biết:    ││
│  │                             ││
│  │ • Đau đầu ở vị trí nào?     ││
│  │ • Kèm theo triệu chứng gì?  ││
│  │                             ││
│  │ [Đau nửa đầu] [Đau toàn bộ] ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  [Nhập triệu chứng...]     [📤] │
└─────────────────────────────────┘
```

- [ ] AI chat interface
- [ ] Send symptoms
- [ ] Handle follow-up questions
- [ ] Suggested questions chips

#### 9.2 AI Recommendation Results
```
┌─────────────────────────────────┐
│  🤖 Kết quả phân tích           │
├─────────────────────────────────┤
│  📊 Phân tích                   │
│  Có thể là: Đau đầu migraine    │
│  Mức độ: 🟡 Trung bình          │
│  Chuyên khoa: Thần kinh         │
├─────────────────────────────────┤
│  👨‍⚕️ Bác sĩ được đề xuất        │
│  ┌─────────────────────────────┐│
│  │ #1 TS.BS Lê Thị Giang       ││
│  │ ⭐ 95% phù hợp              ││
│  │ Thần kinh • 16 năm KN       ││
│  │ 420,000đ                    ││
│  │ [      Đặt lịch       ]     ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  ⚠️ Lưu ý: Đây chỉ là gợi ý    │
│  dựa trên AI...                 │
└─────────────────────────────────┘
```

- [ ] Analysis result display
- [ ] Possible conditions
- [ ] Urgency level indicator
- [ ] Recommended doctors list
- [ ] Match score display
- [ ] Direct booking from result

#### 9.3 Integration with Booking
- [ ] Pass AI analysis to booking flow
- [ ] Pre-fill symptoms
- [ ] Pre-select recommended doctor

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat with AI |
| POST | `/ai/recommend-doctor` | Get recommendations |

### Deliverables
- ✅ AI chat interface
- ✅ Symptom analysis
- ✅ Doctor recommendations
- ✅ Integration with booking

---

## 🎨 Phase 10: Polish & Release

**Duration**: 5 days  
**Goal**: Final polish, testing và release preparation

### Tasks

#### 10.1 UI/UX Polish
- [ ] Loading states & skeletons
- [ ] Error states & empty states
- [ ] Pull-to-refresh everywhere
- [ ] Animations (Reanimated)
- [ ] Haptic feedback
- [ ] Consistent styling

#### 10.2 Performance
- [ ] Image optimization
- [ ] List virtualization (FlashList)
- [ ] Memoization
- [ ] Bundle size optimization

#### 10.3 Error Handling
- [ ] Global error boundary
- [ ] API error handling
- [ ] Network offline handling
- [ ] Retry mechanisms

#### 10.4 Testing
- [ ] Unit tests (critical functions)
- [ ] Integration tests (API)
- [ ] Manual testing checklist
- [ ] Device testing (iOS/Android)

#### 10.5 Push Notifications (Optional)
- [ ] Setup Firebase Cloud Messaging
- [ ] Request permissions
- [ ] Handle notifications
- [ ] Deep linking from notifications

#### 10.6 App Store Preparation
- [ ] App icons (all sizes)
- [ ] Splash screen
- [ ] Screenshots
- [ ] App description
- [ ] Privacy policy
- [ ] EAS Build configuration

#### 10.7 Release
- [ ] Internal testing (TestFlight/Internal Track)
- [ ] Beta testing
- [ ] Production release

### Deliverables
- ✅ Polished UI/UX
- ✅ Optimized performance
- ✅ Proper error handling
- ✅ App ready for stores

---

## 📁 Final Project Structure

```
expo-rapid-boilerplate/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (main)/
│       ├── _layout.tsx
│       ├── (tabs)/
│       │   ├── _layout.tsx
│       │   ├── home.tsx
│       │   ├── appointments.tsx
│       │   ├── chat.tsx
│       │   └── profile.tsx
│       ├── booking/
│       │   ├── index.tsx
│       │   ├── select-time.tsx
│       │   ├── enter-info.tsx
│       │   └── confirmation.tsx
│       ├── doctor/
│       │   └── [id].tsx
│       ├── appointment/
│       │   └── [id].tsx
│       ├── consultation/
│       │   └── [id].tsx
│       ├── payment/
│       │   └── [id].tsx
│       ├── conversation/
│       │   └── [id].tsx
│       ├── ai-consult/
│       │   └── index.tsx
│       └── settings/
│           ├── language.tsx
│           └── notifications.tsx
├── components/
│   ├── ui/                    # (existing)
│   ├── navigation/            # (existing)
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── booking/
│   │   ├── DoctorCard.tsx
│   │   ├── SpecialtyCard.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── BookingSummary.tsx
│   ├── appointment/
│   │   ├── AppointmentCard.tsx
│   │   └── StatusBadge.tsx
│   ├── health/
│   │   ├── HealthOverview.tsx
│   │   └── ConsultationCard.tsx
│   ├── chat/
│   │   ├── ConversationItem.tsx
│   │   └── MessageBubble.tsx
│   └── ai/
│       ├── AIChatBubble.tsx
│       └── RecommendationCard.tsx
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── auth/
│   │   └── authService.ts
│   ├── appointment/
│   │   └── appointmentService.ts
│   ├── doctor/
│   │   └── doctorService.ts
│   ├── patient/
│   │   └── patientService.ts
│   ├── payment/
│   │   └── paymentService.ts
│   ├── conversation/
│   │   └── conversationService.ts
│   └── ai/
│       └── aiService.ts
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── appSlice.ts
│       ├── authSlice.ts
│       ├── userSlice.ts
│       ├── bookingSlice.ts
│       └── chatSlice.ts
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── doctor.ts
│   ├── appointment.ts
│   ├── payment.ts
│   ├── conversation.ts
│   └── ai.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   └── useSocket.ts
├── config/
│   ├── colors.ts
│   ├── i18n.ts
│   ├── api.ts
│   └── locales/
│       ├── en.json
│       └── vi.json
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── storage.ts
```

---

## ✅ Summary Checklist

### MVP Features (Phase 0-4)
- [ ] Project setup & configuration
- [ ] Authentication (Login/Register)
- [ ] Dashboard
- [ ] Doctor search & discovery
- [ ] 4-step booking flow
- [ ] Appointment list & detail
- [ ] Cancel appointment

### Full Features (Phase 5-9)
- [ ] Health records & consultation history
- [ ] Payment history
- [ ] Chat support
- [ ] Profile management
- [ ] AI doctor recommendation

### Release (Phase 10)
- [ ] UI/UX polish
- [ ] Performance optimization
- [ ] Testing
- [ ] App store submission

---

## 📞 API Base Configuration

```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.hospital.com/api',
  SOCKET_URL: __DEV__
    ? 'ws://localhost:3000'
    : 'wss://api.hospital.com',
  TIMEOUT: 30000,
};
```

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Author**: Development Team

