# CureSphere AI — Multi-Role Healthcare Platform
## Complete Figma Design + Frontend + Backend + Database + AI Workflow Specification

---

## 📋 PROJECT OVERVIEW

**Project Title:** CureSphere AI — Intelligent Virtual Healthcare Platform (Bangladesh)

**Vision:** A comprehensive AI-powered healthcare platform connecting patients, doctors, and administrators to provide intelligent, accessible, and ethical medical support.

**Core Technology Stack:**
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Shadcn UI
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **AI Engine:** Google Gemini API (via @google/generative-ai)
- **Design System:** Figma design tokens (white, blue→green gradient, rounded-2xl, soft shadows)

---

## 🎨 DESIGN SYSTEM

### Color Palette
- **Primary:** Blue (#3B82F6)
- **Secondary:** Green (#10B981)
- **Accent:** Gradient Blue→Green
- **Neutral:** White, Gray-50 through Gray-900
- **Status:**
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Error: Red (#EF4444)
  - Info: Blue (#3B82F6)

### Typography
- **Headlines:** 24-32px, weight 600-700
- **Subheadings:** 16-20px, weight 600
- **Body:** 14-16px, weight 400
- **Captions:** 12px, weight 500

### Spacing & Borders
- **Breakpoints:** Mobile-first (sm, md, lg, xl, 2xl)
- **Border Radius:** 8px (standard), 12px (cards), 16px (buttons), 24px (large containers)
- **Shadows:** Soft (0 1px 3px rgba), Medium (0 4px 6px rgba), Large (0 10px 25px rgba)

---

## 👥 USER ROLES & THEIR DASHBOARDS

### 1️⃣ PATIENT DASHBOARD

#### Layout Architecture
```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Notifications, Profile Menu)              │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │                                              │
│ Nav      │          Main Dashboard Area                 │
│          │                                              │
│ • Home   │  ┌──────────────────────────────────────┐  │
│ • AI     │  │ Health Overview Cards (4 cols)       │  │
│ Chat     │  ├──────────────────────────────────────┤  │
│ • Appts  │  │ Health Timeline (Chronological)      │  │
│ • Labs   │  │                                      │  │
│ • Rx     │  │ • AI Consultation Entry 1            │  │
│ • Meds   │  │ • Doctor Visit Entry 2               │  │
│ • Tests  │  │ • Lab Report Entry 3                 │  │
│ • Donate │  │ • Prescription Entry 4               │  │
│ • Profile│  │                                      │  │
│          │  └──────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

#### Core Features

**A) Health Overview Cards (Top Row)**
- **Active Symptoms Card**
  - AI-detected current symptoms
  - Color-coded urgency (green/yellow/red)
  - "View More" link to detailed timeline
  
- **Next Appointment Card**
  - Next doctor/specialist appointment
  - Date, time, doctor name
  - "Reschedule" button
  
- **Pending Lab Reports Card**
  - Number of reports awaiting AI analysis
  - "View Reports" button
  - Last report date
  
- **Health Score Card**
  - AI-calculated wellness metric (0-100)
  - Trend indicator (📈 up, 📉 down)
  - Tips to improve score

**B) Health Timeline (Central Feature)**
- Chronological feed of all medical events
- Color-coded entry types:
  - Blue: AI Consultation
  - Green: Doctor Visit
  - Purple: Lab Report
  - Orange: Prescription
  - Yellow: Test Ordered
- Each entry shows:
  - Icon, type, date, brief title
  - Expandable to show full details:
    - Symptoms discussed
    - AI questions asked & answers given
    - AI impression/diagnosis
    - Medicines suggested/prescribed
    - Tests recommended
    - Follow-up schedule
    - Notes/additional info
- "Create Entry" button (for manual health logging)
- Filter by type, date range

**C) AI Consultation (Interactive Chat Component)**

*Located in dedicated page or modal*

**Flow:**
1. **Greeting Phase** (AI initiates)
   - "Hello! I'm Dr. AI. Tell me what brings you here today?"
   - Bilingual support (English/Bangla toggle)

2. **Symptom Collection Phase**
   - "Can you describe your main symptom?"
   - AI listens, parses, and stores response
   - "How long have you had this symptom?" (duration)
   - "On a scale of 1-10, how severe is it?" (severity)
   - Stores: start_date, days_with_symptom, severity_score

3. **Medicine History Phase**
   - "Have you taken any medicines for this?"
   - If yes: "Which medicines and when did you take them?"
   - Stores: medicine_history array

4. **Related Conditions Phase**
   - "Do you have any other conditions? (diabetes, high blood pressure, asthma, etc.)"
   - Stores: pre_existing_conditions array

5. **Follow-up Questions Phase** (AI-driven)
   - AI analyzes collected data
   - Asks targeted follow-up questions based on symptom pattern
   - Example for fever: "Any cough? Any body aches? Any vomiting?"

6. **Analysis Phase**
   - AI generates structured response (JSON format):
   ```json
   {
     "aiImpression": "Likely viral fever with mild respiratory involvement",
     "urgencyLevel": "medium",
     "daysWithSymptoms": 3,
     "followUpNeeded": true,
     "followUpAfterDays": 3,
     "recommendedMedicines": [
       {
         "brand": "Paracetamol",
         "name": "Acetaminophen",
         "dosage": "500mg",
         "frequency": "One tablet every 6 hours",
         "price": 10,
         "duration": "3 days"
       }
     ],
     "recommendedTests": [
       {
         "name": "Complete Blood Count (CBC)",
         "reason": "To check for viral infection markers",
         "price": 500,
         "category": "hematology",
         "suggestedAfterDays": 3
       }
     ],
     "advice": [
       "Stay hydrated - drink water regularly",
       "Get adequate rest",
       "Avoid heavy meals"
     ],
     "redFlags": [
       "If fever exceeds 104°F (40°C)",
       "If difficulty breathing develops",
       "If severe persistent headache with neck stiffness"
     ]
   }
   ```

7. **Timeline Creation**
   - Entire consultation saved as TimelineEntry
   - Date: now
   - Type: 'ai_consultation'
   - All details stored in Consultation document

8. **Follow-up Logic**
   - If `daysWithSymptoms >= 3`: AI adds "Follow-up needed" flag
   - After 3 days, when patient returns, AI suggests additional tests
   - Notification: "Your symptom has been ongoing for 3+ days. Would you like us to recommend tests?"

**D) Lab Reports Section**
- Upload PDF, JPG, PNG
- AI extracts and parses values:
  - CBC markers: RBC, WBC, Hemoglobin, Platelet count
  - Chemistry: Glucose, Creatinine, Urea
  - Thyroid: TSH, T3, T4
  - Lipids: Cholesterol, LDL, HDL, Triglycerides
- AI compares against normal ranges
- Generates insights:
  - Abnormal markers flagged
  - Possible conditions hinted
  - Recommendations (see a specialist, repeat test, lifestyle changes)
- Added to health timeline automatically

**E) Appointment Booking**
- Search doctors by specialty:
  - General Physician
  - Cardiologist
  - Neurologist
  - Pediatrician
  - Dermatologist
  - Gynecologist
  - Psychiatrist
  - etc.
- Filter by:
  - Distance (km)
  - Rating (4.5+, 4.0+, 3.5+)
  - Consultation fee
  - Next available slot
- Book appointment:
  - Select date/time from doctor's available slots
  - Select consultation type (In-person, Video, Phone)
  - Add reason for visit
  - Confirm booking
- Upcoming appointments list with reminders

**F) Medicine Orders**
- Search medicines by name
- View pharmacy stock nearby (distance, availability)
- Price comparison across pharmacies
- One-click order
- Delivery status tracking

**G) Profile Section**
- Personal information
- Medical history (editable)
- Blood group
- Donor toggle (yes/no)
- Recent uploads & exports

---

### 2️⃣ DOCTOR DASHBOARD

#### Layout Architecture
```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Notifications, Doctor Profile)            │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │                                              │
│ Nav      │          Main Dashboard Area                 │
│          │                                              │
│ • Home   │  ┌──────────────────────────────────────┐  │
│ • Patients│ │ Dashboard Cards (KPIs)                │  │
│ • Appts  │  ├──────────────────────────────────────┤  │
│ • Labs   │  │ Patient List / Calendar / AI Insights │  │
│ • Rx     │  │                                      │  │
│ • AI     │  │ Grouped by section selected          │  │
│ • Earn   │  │                                      │  │
│ • Profile│  │                                      │  │
│          │  └──────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

#### Core Features

**A) Doctor Overview Cards**
- **Total Patients**: Lifetime patient count
- **Today's Appointments**: Number of consultations scheduled
- **Pending Lab Reviews**: Reports awaiting doctor's interpretation
- **AI Flagged Cases**: Cases marked as urgent by AI

**B) Patient Management**
- Search patients by name, ID, or phone
- Patient list table:
  - Name, Age, Sex, Blood Group
  - Last visit date
  - AI-detected active conditions
  - Health score
  - Urgency badge (normal/warning/critical)
  - Action buttons: View Profile, Message, Write Prescription

**C) Patient Profile (Doctor View)**
- **Top Section:**
  - Patient photo, name, age, sex, contact
  - Blood group, medical history summary
  - Known allergies (RED highlight)
  - Last visit date
  
- **Health Timeline** (same as patient sees, but doctor-enhanced)
  - Shows all AI consultations, doctor visits, lab reports
  - Doctor can add notes to timeline entries
  - Doctor can approve/modify AI suggestions
  
- **Lab Reports Viewer** (Doctor-focused)
  - List of all lab reports
  - AI interpretation panel on right
  - Doctor can accept/override AI findings
  - Can order new tests
  
- **Vital Signs & Trends**
  - Chart showing BP, heart rate, temperature trends over time
  - Based on patient's self-reported or sensor-collected data
  
- **AI Insights Panel** (Right Sidebar)
  - AI highlights probable diagnoses (differential diagnosis)
  - Severity markers (low/medium/high)
  - Risk scoring
  - Suggested follow-up actions
  - Doctor can accept/reject AI suggestions

**D) Appointment Management**
- **Calendar View**: Week/Month calendar showing all appointments
- **Appointment Details**:
  - Patient name, reason for visit
  - Scheduled time, duration
  - Video/Phone consultation links
- **Actions**:
  - Approve/Confirm appointment
  - Reschedule
  - Cancel (with reason)
  - Start video consultation
  - Add notes during/after visit

**E) E-Prescription Creator**
- **Medicine Selection**:
  - Search from standard drug database
  - Filtered by condition (fever, cough, asthma, etc.)
  - AI auto-fill suggestions based on patient's condition
  
- **Prescription Form**:
  - Select medicines (multi-select)
  - Set dosage, frequency, duration for each
  - Add special instructions
  - Sign digitally (doctor's signature)
  
- **Output**:
  - Generate PDF prescription
  - Share directly to patient app
  - Send to connected pharmacies
  - Print for clinic use

**F) Lab Report Analyzer (Doctor Tools)**
- Upload external lab reports
- AI extracts and interprets values
- Doctor reviews AI interpretation
- Can add notes or order follow-up tests
- Share with patient

**G) AI Insights Panel (Doctor Assistant)**
- **Real-time Alerts**:
  - Patient has repeated visits within 7 days
  - Abnormal vital signs detected
  - Lab values outside normal range
  - Patient missed follow-up appointments
  
- **Suggestions**:
  - Tests recommended by AI
  - Specialist referral suggestions
  - Medication interaction warnings
  
- **Doctor Feedback Loop**:
  - Doctor marks suggestions as "useful" or "ignore"
  - Helps train AI model over time

**H) Earnings Dashboard**
- **Revenue Cards**:
  - Today's earnings
  - Month-to-date
  - Last 30 days average
  
- **Transaction History**:
  - Date, patient, consultation fee, status
  - Payout schedule
  - Invoice download

---

### 3️⃣ ADMIN DASHBOARD

#### Layout Architecture
```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Notifications, Admin Profile)             │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │                                              │
│ Nav      │          Main Dashboard Area                 │
│          │                                              │
│ • Home   │  ┌──────────────────────────────────────┐  │
│ • Analytics│ │ Analytics Charts & KPIs              │  │
│ • Users  │  ├──────────────────────────────────────┤  │
│ • Doctors│  │ Tables / Modals for management       │  │
│ • Appts  │  │                                      │  │
│ • Pharmacy│ │ Action buttons, filters               │  │
│ • Labs   │  │                                      │  │
│ • AI Logs│  │                                      │  │
│ • Revenue│  │                                      │  │
│ • Settings│ │                                      │  │
└──────────┴──────────────────────────────────────────────┘
```

#### Core Features

**A) System Analytics Dashboard**
- **KPI Cards**:
  - Total registered users (patients + doctors + admins)
  - Daily active users
  - Total AI consultations (all-time)
  - Total doctor appointments (all-time)
  - Revenue (month-to-date)
  
- **Charts**:
  - **User Growth Chart**: Line chart showing daily/weekly/monthly registration trends
  - **AI Usage Heatmap**: Which times/days have highest consultation volume
  - **Top Symptoms Detected**: Bar chart of most common symptom reports
  - **Appointment Status Pie**: Breakdown of completed/cancelled/pending
  - **Revenue Trend**: Line chart showing income over time
  - **Doctor Engagement**: How active is each doctor (consultations, avg rating)

**B) User Management**
- **Patient Management**:
  - List all patients: Name, Email, Phone, Registration Date, Status
  - Filter by: Active/Inactive, Verified/Unverified, Location
  - Actions:
    - View patient profile
    - Send message/notification
    - Suspend account (with reason)
    - Verify email/phone
    - Export user data
  
- **User Verification**:
  - Email verification status
  - Phone verification status
  - ID verification (optional for premium features)

**C) Doctor Management**
- **Doctor Approval Workflow**:
  - New doctor registrations pending approval
  - Doctor submits: Name, BMDC License, License Expiry, Specialization, Clinic Address, Consultation Fee
  - Admin reviews:
    - Verify BMDC license validity
    - Check credentials
    - Approve or Reject
  
- **Doctor List**:
  - Name, Specialization, License Number, Clinic Address
  - Status: Verified/Pending/Suspended
  - Rating (avg patient rating)
  - Total patients
  - Actions:
    - View profile
    - Suspend (fraud/complaints)
    - Extend/Renew license
    - Message doctor

**D) Appointment System Board**
- **Global Calendar View**:
  - All appointments across all doctors
  - Filter by doctor, specialty, status
  
- **Management**:
  - Resolve double-bookings
  - Approve/Cancel appointments
  - View appointment details
  - Send reminders to patients/doctors

**E) Pharmacy Management**
- **Add/Edit Pharmacies**:
  - Pharmacy name, location, phone
  - Stock list (medicines + quantities)
  - Delivery radius (km)
  - Delivery fee
  - Operating hours
  
- **Stock Management**:
  - Verify pharmacy stock updates
  - Flag low-stock items
  - Request reorder notifications
  
- **Delivery Partner Management**:
  - Approve delivery partners
  - Track delivery performance
  - Manage complaints

**F) Diagnostics Center Management**
- **Add Diagnostics Centers**:
  - Center name, location, phone
  - List of tests offered with prices
  - Home sample collection availability
  - Operating hours
  
- **Test Pricing**:
  - Set standard test prices
  - Manage discounts (seasonal, bulk)
  - Special pricing for premium members
  
- **Collectors Management**:
  - Approve home sample collectors
  - Track collection performance
  - Handle complaints

**G) Blood Bank Management**
- **Inventory Management**:
  - Blood group stock levels
  - Critical level alerts
  - Donor management (list, availability, last donation)
  - Request history (fulfilled/pending)
  
- **Donor Management**:
  - Approve new donors
  - Track donation history
  - Send donation reminders
  - Manage donor eligibility

**H) AI Monitoring Panel**
- **Prompt Logs**:
  - View all AI-generated medical suggestions
  - Filter by date, doctor, patient
  - Review AI reasoning
  
- **Safety Monitoring**:
  - Flag potentially unsafe recommendations (AI hallucinations)
  - Review case: Patient complaint about AI suggestion
  - Admin feedback to model layer
  
- **Model Performance**:
  - Accuracy metrics (against later doctor diagnosis)
  - False positive/negative rates
  - Most commonly overridden suggestions
  
- **Audit Trail**:
  - All AI interactions logged for compliance
  - GDPR-compliant data handling

**I) Revenue Management**
- **Income Streams**:
  - Doctor consultation fees (platform commission)
  - Premium subscriptions
  - Pharmacy orders commission
  - Lab report analysis fees
  
- **Transaction History**:
  - Date, type, amount, status
  - Doctor payouts
  - Refund requests
  
- **Invoicing & Payouts**:
  - Generate invoices for doctors
  - Automated payout schedule
  - Manual payout requests

---

## 🛠️ FRONTEND SPECIFICATION

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Context API (AuthContext) + Local State
- **HTTP Client**: Fetch API / Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Notifications**: Sonner Toast

### Project Structure
```
/src
  /components
    /dashboards
      PatientDashboard.tsx
      DoctorDashboard.tsx
      AdminDashboard.tsx
      AIChat.tsx
      HealthTimeline.tsx
    /ui
      (Shadcn UI components)
    Home.tsx
    Login.tsx
    SignUp.tsx
    Navigation.tsx
    Header.tsx
    Footer.tsx
    SymptomAnalyzer.tsx
    PharmacyFinder.tsx
    DiagnosticCenters.tsx
    LabReportAnalyzer.tsx
    DoctorConsultation.tsx
    UserProfile.tsx
    BloodBank.tsx
  /context
    AuthContext.tsx
  /styles
    globals.css
  /types
    index.ts
  App.tsx
  main.tsx
```

### Authentication Flow
```
1. User visits app → Home page
2. Click "Sign Up" or "Login"
3. SignUp:
   - Email, password, name, phone, role (patient/doctor)
   - If doctor: BMDC license, specialization, clinic address
   - Create user in DB
   - Set AuthContext + localStorage token
4. Login:
   - Email, password
   - Verify credentials
   - Set AuthContext + localStorage token
   - Redirect to role-based dashboard
```

### Protected Routes
- Patient routes: `/dashboard` (only for role='patient')
- Doctor routes: `/doctor-dashboard` (only for role='doctor')
- Admin routes: `/admin-dashboard` (only for role='admin')
- Use ProtectedRoute component to enforce

### Component Design Patterns

**Patient Dashboard Components**:
```tsx
// HealthOverviewCards.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard icon={Activity} title="Active Symptoms" value={symptomCount} />
  <StatCard icon={Calendar} title="Next Appointment" value={nextApptDate} />
  <StatCard icon={FileText} title="Pending Reports" value={reportCount} />
  <StatCard icon={Heart} title="Health Score" value={healthScore} />
</div>

// HealthTimeline.tsx
<div className="space-y-4">
  {timeline.map(entry => (
    <TimelineEntry key={entry.id} entry={entry} onExpand={...} />
  ))}
</div>

// AIChat.tsx
<div className="flex flex-col h-screen">
  <ChatMessages messages={messages} />
  <ChatInput onSend={handleSend} />
</div>
```

---

## 🔌 BACKEND SPECIFICATION

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **File Upload**: Multer (for lab reports)
- **Validation**: Joi / Zod

### API Architecture
```
Base URL: http://localhost:5000/api

Routes:
/auth
  POST /register         → Create user account
  POST /login            → Authenticate & return JWT
  POST /doctor-verify    → Doctor license verification
  GET /verify-email      → Email confirmation
  POST /refresh-token    → Refresh JWT

/patient
  GET /:id               → Get patient profile
  PUT /:id               → Update patient profile
  GET /:id/timeline      → Get health timeline
  POST /:id/upload-report → Upload lab report
  GET /:id/consultations → Get all AI consultations

/doctor
  GET /:id               → Get doctor profile
  PUT /:id               → Update doctor profile
  GET /:id/patients      → List doctor's patients
  GET /:id/appointments  → Get doctor's appointments
  POST /:id/prescription → Create e-prescription
  GET /:id/earnings      → Get earnings dashboard

/admin
  GET /users             → List all users
  POST /users/:id/suspend → Suspend user
  GET /doctors/pending   → Pending doctor approvals
  POST /doctors/:id/approve → Approve doctor
  GET /analytics         → System analytics
  GET /ai-logs           → View AI logs

/ai/consult
  POST /                 → Start AI consultation
  POST /:id/message      → Send message in consultation
  GET /:id               → Get consultation details

/appointments
  GET /                  → List appointments
  POST /                 → Create appointment
  PUT /:id               → Update appointment
  DELETE /:id            → Cancel appointment

/lab
  GET /                  → List lab reports
  POST /                 → Upload & analyze report
  GET /:id               → Get report details
  POST /:id/analysis     → Get AI analysis

/pharmacy
  GET /                  → List pharmacies
  POST /                 → Add pharmacy (admin)
  GET /:id/stock         → Get pharmacy stock
  POST /order            → Place medicine order

/diagnostics
  GET /                  → List diagnostic centers
  POST /                 → Add center (admin)
  GET /:id/tests         → List tests offered
  POST /request-test     → Request test

/blood-bank
  GET /inventory         → Blood bank inventory
  GET /donors            → List donors
  POST /request          → Request blood
  POST /donate           → Register donation
```

### Core Controllers

#### AuthController
```typescript
// Register
- Validate input (email, password strength, role)
- Hash password (bcrypt)
- Create user in DB
- Return JWT token

// Login
- Verify email/password
- Create JWT token (exp: 7 days)
- Return token + user profile

// Doctor Verify
- Admin uploads BMDC license verification
- Call BMDC API or manual verification
- Mark doctor as verified/rejected
```

#### PatientController
```typescript
// Get Timeline
- Fetch all TimelineEntry documents for patient
- Sort by date (newest first)
- Populate related data (consultation, report, etc.)
- Return with pagination

// Upload Lab Report
- Receive file (PDF/JPG/PNG)
- Store in cloud storage (AWS S3 or similar)
- Call AI to extract values
- Create LabReport document
- Add TimelineEntry
// AI Lab Report Analysis
- Extract numeric values from report image
- Compare against normal ranges
- Generate insights
- Return structured analysis
```

#### AIController
```typescript
// POST /ai/consult
- Initialize consultation
- Create Consultation document
- Return initial greeting message

// POST /ai/consult/:id/message
- Receive user message
- Add to ChatMessage array
- Call Gemini API with system prompt
- Parse AI response
- Generate next question or analysis
- Save consultation state
- Return AI message

// AI System Prompt (Doctor-like behavior)
```

#### DoctorController
```typescript
// Get Patients
- Fetch all appointments for doctor
- Get unique patients
- Fetch patient profiles
- Include last visit date, AI insights
- Return paginated list

// Create Prescription
- Validate medicine list
- Create Prescription document
- Add TimelineEntry (prescription type)
- Send notification to patient
- Return prescription ID

// Get Earnings
- Sum all consultation fees (date range)
- Group by date/month
- Calculate payouts
- Return charts data
```

#### AdminController
```typescript
// System Analytics
- Count users by role
- Count daily consultations (last 30 days)
- Get most common symptoms (from Consultation docs)
- Calculate revenue (last 30 days)
- Return chart data

// User Management
- List patients/doctors
- Filter, search, sort
- Suspend/verify accounts
- Export user data

// AI Monitoring
- Fetch AI logs (Consultation + ChatMessage docs)
- Search for unsafe content
- Track false positives
// Get Analytics
- Generate KPI cards
- Return chart data (Recharts format)
- Filter by date range
```

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  name: String,
  phone: String,
  birthdate: Date,
  role: "patient" | "doctor" | "admin",
  bloodGroup: String,
  location: {
    division: String,
    district: String,
    area: String
  },
  profilePicture: String (URL),
  // Doctor-specific
  specialization: String,
  bmdc: String (unique),
  licenseExpiry: Date,
  verified: Boolean,
  clinicAddress: String,
  consultationFee: Number,
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  status: "active" | "suspended" | "pending"
}
```

#### Consultations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  date: Date,
  messages: [
    {
      sender: "ai" | "user",
      message: String,
      timestamp: Date,
      questionType: String
    }
  ],
  symptoms: [String],
  daysWithSymptoms: Number,
  severity: Number (1-10),
  medicinesTaken: [String],
  otherConditions: [String],
  // AI-generated analysis
  aiImpression: String,
  recommendedMedicines: [
    {
      brand: String,
      dosage: String,
      frequency: String,
      price: Number,
      duration: String
    }
  ],
  recommendedTests: [
    {
      name: String,
      reason: String,
      price: Number,
      suggestedAfterDays: Number
    }
  ],
  advice: [String],
  redFlags: [String],
  urgencyLevel: "low" | "medium" | "high",
  followUpNeeded: Boolean,
  followUpAfterDays: Number,
  status: "active" | "resolved" | "follow_up_needed",
  createdAt: Date,
  updatedAt: Date
}
```

#### Timeline Entries Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  type: "ai_consultation" | "doctor_visit" | "lab_report" | "prescription" | "appointment",
  date: Date,
  title: String,
  description: String,
  consultationId: ObjectId (ref Consultation),
  reportId: ObjectId (ref LabReport),
  prescriptionId: ObjectId (ref Prescription),
  doctorId: ObjectId (ref User),
  doctorName: String,
  urgencyLevel: "low" | "medium" | "high",
  createdAt: Date
}
```

#### Lab Reports Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  date: Date,
  reportType: String (CBC, CRP, etc.),
  fileUrl: String (cloud storage URL),
  // AI-extracted values
  values: {
    rbc: { value: Number, unit: String, normalRange: String, status: "normal" | "low" | "high" },
    wbc: { ... },
    hemoglobin: { ... },
    // ... more fields
  },
  // AI Analysis
  aiAnalysis: {
    abnormalMarkers: [String],
    insights: [String],
    recommendations: [String],
    riskLevel: "low" | "medium" | "high"
  },
  uploadedBy: ObjectId (ref User),
  createdAt: Date
}
```

#### Appointments Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref User),
  patientName: String,
  doctorId: ObjectId (ref User),
  doctorName: String,
  date: Date,
  time: String,
  type: "in_person" | "video" | "phone",
  reason: String,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  notes: String,
  consultationFee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Prescriptions Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref User),
  doctorId: ObjectId (ref User),
  doctorName: String,
  date: Date,
  medicines: [
    {
      brand: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }
  ],
  diagnosis: String,
  notes: String,
  createdAt: Date
}
```

---

## 🤖 AI SPECIFICATION

### Core AI Behavior: Doctor-like Consultation Flow

The AI system should mimic a professional Bangladeshi doctor's consultation behavior:

```
1. GREETING PHASE
   AI: "Hello! I'm Dr. AI from CureSphere. How can I help you today?"
   [Bilingual support: English / Bengali toggle]

2. CHIEF COMPLAINT PHASE
   AI: "Can you describe your main symptom or concern?"
   User: "I have a fever and cough for 2 days"
   [AI parses and stores: symptoms = ["fever", "cough"], daysWithSymptoms = 2]

3. DURATION & PROGRESSION PHASE
   AI: "You mentioned you've had this for 2 days. Is it getting better, worse, or staying the same?"
   User: "It's getting worse"
   [AI stores: progression = "worsening"]

4. SEVERITY ASSESSMENT PHASE
   AI: "On a scale of 1-10, how much is the fever affecting your daily activities?"
   User: "7 out of 10"
   [AI stores: severityScore = 7]

5. MEDICINE HISTORY PHASE
   AI: "Have you taken any medicine for this? If yes, which ones?"
   User: "I took paracetamol twice"
   [AI stores: medicineHistory = ["paracetamol"]]

6. PRE-EXISTING CONDITIONS PHASE
   AI: "Do you have any chronic conditions? (diabetes, high blood pressure, asthma, thyroid, etc.)"
   User: "No, I'm generally healthy"
   [AI stores: preExistingConditions = []]

7. RELATED SYMPTOMS PHASE (AI-driven follow-ups)
   AI: "Along with fever and cough, do you have any of these?
       - Body aches or joint pain?
       - Sore throat?
       - Difficulty breathing?
       - Vomiting or diarrhea?"
   [AI asks follow-ups based on symptom pattern]

8. ANALYSIS PHASE
   AI generates structured response (AI model inference):
   {
     "aiImpression": "Likely viral upper respiratory infection or common cold",
     "urgencyLevel": "medium",
     "daysWithSymptoms": 2,
     "followUpNeeded": false,  // Only true if symptoms persist 3+ days
     "followUpAfterDays": 3,
     "recommendedMedicines": [
       {
         "brand": "Napa",
         "name": "Paracetamol",
         "dosage": "500mg",
         "frequency": "One tablet every 6 hours",
         "price": 10,
         "quantity": 12,
         "duration": "3 days"
       },
       {
         "brand": "Strepsils",
         "name": "Lozenge (Menthol + Eucalyptus)",
         "dosage": "1 lozenge",
         "frequency": "Every 3 hours",
         "price": 50,
         "quantity": 1,
         "duration": "3 days"
       }
     ],
     "recommendedTests": [],  // Empty because symptoms < 3 days
     "advice": [
       "Stay hydrated - drink water, warm tea, or soup regularly",
       "Get adequate rest - aim for 7-8 hours of sleep",
       "Gargle with warm salt water for sore throat",
       "Use a humidifier in your room",
       "Avoid smoking and smoky environments"
     ],
     "redFlags": [
       "If fever exceeds 103°F (39.4°C)",
       "If difficulty breathing or chest pain develops",
       "If cough produces blood",
       "If you feel severely fatigued or confused"
     ]
   }

9. THREE-DAY RULE
   If daysWithSymptoms >= 3:
   - AI automatically flags "Follow-up needed"
   - Suggests tests:
     - CBC (Complete Blood Count) to check for bacterial infection
     - CRP (C-Reactive Protein) to assess inflammation
     - Chest X-ray if respiratory symptoms persist
   
   Example:
   "Your cough has been ongoing for 4 days. I recommend:
    - CBC test (₹500) - to check for infection type
    - CRP test (₹300) - to assess inflammation
    - Consider a chest X-ray (₹800) if symptoms worsen"

10. FOLLOW-UP VISIT
    When patient returns after 3+ days:
    AI: "Welcome back! Let's check on your fever and cough.
         - Have the symptoms improved?
         - Which medicines did you take?
         - Any new symptoms?
         Based on your response + recommended tests, AI updates treatment plan"
```

### Gemini API Integration

**System Prompt (Doctor Role)**:
```
You are Dr. AI, a professional and empathetic Bangladeshi doctor.

Your responsibilities:
1. Ask structured medical questions in a logical sequence
2. Collect comprehensive symptom history
3. Provide preliminary guidance (NOT final diagnosis - always advise seeing a doctor for definitive diagnosis)
4. Suggest lifestyle changes, OTC medicines, and tests
5. Track symptom duration and progression
6. After symptoms persist for 3+ days, recommend additional diagnostic tests
7. Always highlight RED FLAGS that require immediate hospital visit
8. Remember previous consultations and ask about follow-up improvements
9. Be empathetic, professional, and safety-conscious

Always respond in JSON format:
{
  "aiMessage": "Your conversational response to the patient",
  "followUpNeeded": boolean,
  "followUpAfterDays": number,
  "recommendedTests": [
    {
      "name": "Test name",
      "reason": "Why this test",
      "price": number,
      "category": "hematology|chemistry|imaging|etc"
    }
  ],
  "recommendedMedicines": [
    {
      "brand": "Medicine brand name (local)",
      "name": "Generic name",
      "dosage": "500mg",
      "frequency": "One tablet every 6 hours",
      "price": number,
      "duration": "3 days"
    }
  ],
  "urgencyLevel": "low|medium|high",
  "advice": [
    "Lifestyle recommendation 1",
    "Lifestyle recommendation 2"
  ],
  "redFlags": [
    "Symptom requiring immediate hospital visit 1",
    "Symptom requiring immediate hospital visit 2"
  ]
}
```

### AI Features

**Memory**: Each consultation maintains chat history
- User question → AI response → Context preserved for next turn
- AI refers back: "Earlier you mentioned... does that still apply?"

**Bangladeshi Context**: Uses local medicines, prices, specialist names
- Instead of generic "ibuprofen", uses "Brufen" or "Napa"
- Currency in BDT (₹)
- Recognizes divisions: Dhaka, Chittagong, Sylhet, etc.
- Local health concerns: Dengue, typhoid, water-borne diseases

**Confidence Scoring**: AI indicates certainty of assessment
- High confidence: "Likely flu"
- Low confidence: "Could be multiple conditions - see a doctor"

**Red Flag Detection**: Automatically identifies emergency symptoms
- Chest pain + shortness of breath → "Seek immediate medical attention"
- High fever (>104°F) → "Call 999 or visit nearest hospital"

---

## 📊 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-2)
- [x] Merge footers (done)
- [ ] Enhanced type system (in-progress)
- [ ] Create multi-role dashboard spec (in-progress)
- [ ] Set up MongoDB schemas
- [ ] Initialize Express backend

### Phase 2: Patient Dashboard (Weeks 3-4)
- [ ] Build PatientDashboard component
- [ ] Build AIChat component with doctor-like behavior
- [ ] Build HealthTimeline component
- [ ] Integrate with Gemini API
- [ ] Create patient API endpoints

### Phase 3: Doctor Dashboard (Weeks 5-6)
- [ ] Build DoctorDashboard component
- [ ] Patient management interface
- [ ] E-Prescription creator
- [ ] Lab report analyzer
- [ ] Earnings dashboard

### Phase 4: Admin Dashboard (Weeks 7-8)
- [ ] Build AdminDashboard component
- [ ] Analytics and charts
- [ ] User management
- [ ] Doctor verification workflow
- [ ] AI monitoring panel

### Phase 5: Integration & Polish (Week 9-10)
- [ ] Role-based routing
- [ ] Full backend integration
- [ ] Authentication & authorization
- [ ] Testing & bug fixes
- [ ] Deployment

---

## 🔐 SECURITY CONSIDERATIONS

1. **Authentication**: JWT tokens with 7-day expiration
2. **Authorization**: Role-based access control (RBAC)
3. **Data Encryption**: HTTPS for all API calls
4. **Database Security**: MongoDB authentication, encrypted fields
5. **File Upload Safety**: Validate file types, scan for malware
6. **AI Safety**: Monitor AI outputs for medical misinformation
7. **GDPR Compliance**: Secure data storage, user privacy controls
8. **Audit Logging**: Track all sensitive actions for compliance

---

## 🚀 DEPLOYMENT

**Frontend**: Deployed to Vercel/Netlify
**Backend**: Deployed to Heroku/Railway/AWS
**Database**: MongoDB Atlas (cloud)
**File Storage**: AWS S3 or Google Cloud Storage
**AI API**: Google Generative AI (Gemini)

---

## 📝 CONCLUSION

This comprehensive specification provides a complete roadmap for building a professional, AI-powered, multi-role healthcare platform. The system is designed to be:

✅ **Patient-Centric**: Easy-to-use interface with intelligent health tracking
✅ **Doctor-Enabled**: Tools to assist doctors in patient management
✅ **Admin-Controlled**: Full system oversight and analytics
✅ **AI-Intelligent**: Doctor-like consultation behavior with safety guardrails
✅ **Scalable**: Modular architecture ready for growth

All components follow Figma design standards with modern UI/UX best practices.
