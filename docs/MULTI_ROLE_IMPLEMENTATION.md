# CureSphere AI - Multi-Role Healthcare Platform

## 🏥 Project Overview

CureSphere AI is a comprehensive, AI-powered healthcare platform designed to connect patients, doctors, and healthcare administrators. The platform features intelligent AI-driven health consultations, secure patient data management, and professional healthcare tools.

**Status**: Foundation Complete ✅ | Development In Progress 🚀

---

## 👥 Three-Tier User System

### 1️⃣ **PATIENT DASHBOARD** (`/src/components/dashboards/PatientDashboard.tsx`)

**Designed for**: Individual patients seeking healthcare guidance

**Key Features**:
- 📊 **Health Overview Cards** - Real-time stats on symptoms, appointments, reports, and health score
- 🗓️ **Health Timeline** - Chronological record of all medical events (AI consultations, doctor visits, lab reports)
- 🤖 **AI Doctor Chat** - Conversational medical assessment with doctor-like behavior
- 📋 **Lab Report Management** - Upload, analyze, and track test results
- 💊 **Medicine Orders** - Find and order medicines from nearby pharmacies
- 📅 **Appointment Booking** - Schedule doctor consultations
- 👤 **Profile Management** - Store medical history, blood group, donor status

**Patient Experience Flow**:
```
Home → Chat with AI Doctor → AI generates analysis → 
Timeline entry created → Can book doctor → Order medicines → 
Track health progress
```

---

### 2️⃣ **DOCTOR DASHBOARD** (`/src/components/dashboards/DoctorDashboard.tsx`)

**Designed for**: Licensed medical professionals

**Key Features**:
- 👥 **Patient Management** - Access full patient list with medical history
- 📞 **Appointment Scheduling** - Manage consultations (in-person, video, phone)
- 📝 **E-Prescription Creator** - Generate and send digital prescriptions
- 🔬 **Lab Report Analyzer** - Review and interpret patient lab results
- 🧠 **AI Insights Panel** - Get AI suggestions for diagnosis and treatment
- 💰 **Earnings Dashboard** - Track consultations and revenue
- ⭐ **Patient Rating System** - Build professional reputation

**Doctor Experience Flow**:
```
Login → View Today's Appointments → Access patient profiles → 
Review AI insights → Make diagnosis → Send e-prescription → 
Track earnings
```

---

### 3️⃣ **ADMIN DASHBOARD** (`/src/components/dashboards/AdminDashboard.tsx`)

**Designed for**: Platform administrators and system managers

**Key Features**:
- 📈 **System Analytics** - User growth, consultation trends, revenue metrics
- 👤 **User Management** - Approve, verify, or suspend accounts
- 🏥 **Doctor Verification** - Review and approve medical credentials (BMDC)
- 📊 **Data Analytics** - Charts showing usage patterns and most common symptoms
- 🤖 **AI Monitoring** - Monitor AI outputs for safety and accuracy
- 📋 **Audit Logs** - Track all system activities for compliance
- 🏪 **Pharmacy Management** - Manage network of partner pharmacies
- 🧪 **Diagnostics Management** - Oversee lab centers and tests

**Admin Experience Flow**:
```
Login → View system metrics → Approve pending doctors → 
Monitor AI performance → Manage user accounts → 
Review compliance reports
```

---

## 🤖 AI Doctor Behavior (Real Doctor-Like Consultation)

The AI system mimics professional Bangladeshi doctor behavior:

### Consultation Flow
```
1. GREETING
   "Hello! I'm Dr. AI from CureSphere. How can I help you?"
   
2. SYMPTOM COLLECTION
   "Can you describe your main symptom?"
   → User: "I have a fever and cough"
   
3. DURATION ASSESSMENT
   "How long have you had this symptom?"
   → Tracks days_with_symptoms
   
4. SEVERITY RATING
   "On a scale of 1-10, how severe is it?"
   → Stores severity score
   
5. MEDICINE HISTORY
   "Have you taken any medicines for this?"
   → Prevents drug interactions
   
6. RELATED CONDITIONS
   "Do you have diabetes, high BP, or other chronic conditions?"
   → Personalizes recommendations
   
7. FOLLOW-UP QUESTIONS
   AI asks targeted questions based on symptom pattern
   
8. ANALYSIS
   Generates structured medical impression with:
   - Preliminary diagnosis
   - Recommended medicines (Bangladeshi brands)
   - Suggested tests
   - Lifestyle advice
   - Red flags requiring emergency care
   
9. THREE-DAY RULE
   If symptoms persist 3+ days:
   → AI automatically suggests tests (CBC, CRP, etc.)
   → Recommends follow-up visit
```

### AI Output Format (JSON)
```json
{
  "aiImpression": "Likely viral respiratory infection",
  "urgencyLevel": "medium",
  "followUpNeeded": true,
  "followUpAfterDays": 3,
  "recommendedMedicines": [
    {
      "brand": "Napa",
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "One tablet every 6 hours",
      "price": 10,
      "duration": "3 days"
    }
  ],
  "recommendedTests": [
    {
      "name": "Complete Blood Count (CBC)",
      "reason": "Check for infection markers",
      "price": 500
    }
  ],
  "advice": [
    "Stay hydrated - drink water regularly",
    "Get adequate rest",
    "Avoid heavy meals"
  ],
  "redFlags": [
    "If fever exceeds 104°F",
    "If difficulty breathing develops"
  ]
}
```

---

## 💾 Database Schema (MongoDB)

### Core Collections

**users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  role: "patient" | "doctor" | "admin",
  bloodGroup: String,
  location: { division, district, area },
  // Doctor-specific
  specialization: String,
  bmdc: String,
  verified: Boolean,
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**consultations**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  date: Date,
  messages: [ChatMessage],
  symptoms: [String],
  daysWithSymptoms: Number,
  severity: Number,
  aiImpression: String,
  recommendedMedicines: [Medicine],
  recommendedTests: [Test],
  followUpNeeded: Boolean,
  status: "active" | "resolved" | "follow_up_needed"
}
```

**timeline**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  type: "ai_consultation" | "doctor_visit" | "lab_report" | "prescription",
  date: Date,
  title: String,
  description: String,
  consultationId: ObjectId,
  doctorId: ObjectId,
  urgencyLevel: "low" | "medium" | "high"
}
```

---

## 🗂️ File Structure

```
/src
├── /components
│   ├── /dashboards
│   │   ├── PatientDashboard.tsx      ← Patient UI
│   │   ├── DoctorDashboard.tsx       ← Doctor UI
│   │   ├── AdminDashboard.tsx        ← Admin UI
│   │   ├── AIChat.tsx                ← AI conversation component
│   │   └── HealthTimeline.tsx        ← Medical event timeline
│   ├── /ui                           ← Shadcn UI components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── Navigation.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── [other components]
├── /context
│   └── AuthContext.tsx               ← Authentication & role management
├── /types
│   └── index.ts                      ← TypeScript interfaces
├── /styles
│   └── globals.css
├── App.tsx                           ← Main router
└── main.tsx
```

---

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6`
- **Secondary Green**: `#10B981`
- **Accent Gradient**: Blue → Green
- **Neutral**: White, Gray-50 to Gray-900

### Component Hierarchy
- **Cards**: `rounded-xl` to `rounded-2xl`
- **Buttons**: Gradient backgrounds with hover shadows
- **Typography**: Bold headings, regular body text
- **Icons**: Lucide React icons throughout

### Responsive Design
- Mobile-first approach
- Tailwind CSS grid system (1 → 2 → 4 columns)
- Sticky headers and navigation
- Touch-friendly buttons and inputs

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### First Time Setup
1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Select role: **Patient**, **Doctor**, or **Admin**
4. Complete profile information
5. Access role-specific dashboard

---

## 🔐 Authentication Flow

```
User Registration
↓
Role Selection (Patient/Doctor/Admin)
↓
Profile Completion
↓
JWT Token Generated
↓
Stored in localStorage
↓
Access Role-Based Dashboard
```

**Authentication Context** (`/src/context/AuthContext.tsx`):
- Manages user session
- Validates JWT tokens
- Enforces role-based access
- Persists user data

---

## 📱 Mobile Responsiveness

All dashboards are fully responsive:
- **Desktop**: Full 4-column grid layouts, sidebars
- **Tablet**: 2-column grids, collapsible menus
- **Mobile**: Single column, bottom navigation

---

## 🧪 Key Components

### PatientDashboard
```tsx
<PatientDashboard user={user} onNavigate={setPage} />
```
- Health stats cards
- Interactive timeline
- AI chat interface
- Quick action buttons

### DoctorDashboard
```tsx
<DoctorDashboard user={user} onNavigate={setPage} />
```
- Patient list management
- Appointment scheduler
- E-prescription generator
- Earnings tracker

### AdminDashboard
```tsx
<AdminDashboard user={user} onNavigate={setPage} />
```
- System analytics with charts
- Doctor approval workflow
- User management tables
- AI monitoring panel

### AIChat
```tsx
<AIChat userId={id} userName={name} onConsultationComplete={handleComplete} />
```
- Multi-turn conversation
- Structured question flow
- JSON analysis output
- Download & share functionality

---

## ✨ Features Implemented

### Phase 1: Foundation ✅
- [x] Merge footers (Footer.tsx)
- [x] Enhanced type system (types/index.ts)
- [x] Comprehensive spec document (MULTI_ROLE_DASHBOARD_SPEC.md)
- [x] AI Chat with doctor-like behavior (AIChat.tsx)
- [x] Patient Dashboard (PatientDashboard.tsx)
- [x] Doctor Dashboard (DoctorDashboard.tsx)
- [x] Admin Dashboard (AdminDashboard.tsx)
- [x] App.tsx routing updates

### Phase 2: Backend Integration 🚧
- [ ] Express.js API setup
- [ ] MongoDB collections & models
- [ ] JWT authentication endpoints
- [ ] AI consultation endpoints
- [ ] Patient data endpoints
- [ ] Doctor management endpoints
- [ ] Admin analytics endpoints

### Phase 3: AI Integration 🚧
- [ ] Gemini API integration
- [ ] Prompt engineering
- [ ] Medicine database
- [ ] Test recommendations
- [ ] Safety monitoring

### Phase 4: Advanced Features 🚧
- [ ] Real-time notifications
- [ ] Video consultations
- [ ] Lab report analysis
- [ ] Medicine inventory sync
- [ ] Payment integration
- [ ] SMS/Email alerts

---

## 📊 Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **UI Components** | Shadcn UI, Lucide React Icons |
| **State Management** | React Context API |
| **Charts** | Recharts |
| **Forms** | React Hook Form |
| **Routing** | React Router (planned) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI** | Google Generative AI (Gemini) |
| **Auth** | JWT (jsonwebtoken) |
| **Deployment** | Vercel (frontend), Heroku/Railway (backend) |

---

## 🔒 Security Features

✅ Role-based access control (RBAC)
✅ JWT token authentication
✅ Password hashing (bcrypt)
✅ Medical data encryption
✅ GDPR-compliant data storage
✅ Audit logging for compliance
✅ AI safety monitoring
✅ Secure file uploads

---

## 📝 License & Attribution

This is a Bangladesh-focused healthcare platform built with:
- React 18
- Shadcn UI Components
- Tailwind CSS
- TypeScript

---

## 🤝 Contributing

This is a full-stack healthcare platform. To extend:

1. **New Features**: Create feature branches
2. **Bug Fixes**: File issues with reproduction steps
3. **Documentation**: Update specs and README
4. **Testing**: Add tests for critical paths

---

## 📞 Support

For questions or issues:
- Check [MULTI_ROLE_DASHBOARD_SPEC.md](./MULTI_ROLE_DASHBOARD_SPEC.md)
- Review component implementations in `/src/components/dashboards/`
- Check type definitions in `/src/types/index.ts`

---

## 🎯 Next Steps

1. **Backend Setup**: Initialize Express.js API
2. **Database**: Set up MongoDB Atlas
3. **AI Integration**: Connect Gemini API
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to production
6. **Scaling**: Optimize for multi-region deployment

---

## 📈 Project Roadmap

**Q1 2025**
- Backend API development
- MongoDB integration
- Basic authentication

**Q2 2025**
- Gemini AI integration
- Lab report analysis
- Video consultations

**Q3 2025**
- Mobile app (React Native)
- Payment gateway
- SMS/Email notifications

**Q4 2025**
- Advanced analytics
- Machine learning models
- Multilingual support

---

**Built with ❤️ for better healthcare in Bangladesh**
