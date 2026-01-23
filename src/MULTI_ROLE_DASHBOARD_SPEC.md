# CureSphere AI - Multi-Role Dashboard System
## Complete Implementation Specification

---

## 🎯 OVERVIEW

This document provides the complete specification for implementing Patient, Doctor, and Admin dashboards with AI-powered doctor-like consultation, health timeline tracking, and cross-role data synchronization.

---

## 📋 TABLE OF CONTENTS

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [AI Behavior Specification](#ai-behavior-specification)
4. [Patient Dashboard](#patient-dashboard)
5. [Doctor Dashboard](#doctor-dashboard)
6. [Admin Dashboard](#admin-dashboard)
7. [Frontend Components](#frontend-components)
8. [Backend API Specification](#backend-api-specification)
9. [Implementation Roadmap](#implementation-roadmap)

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Tailwind CSS v4.0 with custom design tokens
- Context API for state management
- Lucide React for icons
- Recharts for analytics

**Backend:**
- Node.js + Express
- MongoDB (with Mongoose)
- Google Gemini API (AI Integration)
- JWT for authentication

**AI Integration:**
- Google Gemini 1.5 Pro/Flash
- Custom prompt engineering for medical consultations
- Function calling for structured outputs

### User Roles

```typescript
type UserRole = 'patient' | 'doctor' | 'admin';
```

### Role-Based Access Control

- **Patient**: Access to personal health data, AI consultations, appointments, lab reports
- **Doctor**: Access to patient records, AI insights, appointment management, prescription creation
- **Admin**: Full system access, user management, analytics, AI monitoring

---

## 🗄️ DATABASE SCHEMA

### Collections

#### 1. **users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  phone: String,
  birthdate: Date,
  bloodGroup: String,
  height: Number, // cm
  weight: Number, // kg
  location: {
    division: String,
    district: String,
    area: String
  },
  medicalHistory: String,
  allergies: String,
  isDonor: Boolean,
  lastDonationDate: Date,
  role: String, // 'patient' | 'doctor' | 'admin'
  specialization: String, // For doctors
  bmdc: String, // For doctors (Bangladesh Medical & Dental Council)
  profileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **consultations** (AI Chat History)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  date: Date,
  messages: [{
    id: String,
    sender: String, // 'ai' | 'user'
    message: String,
    timestamp: Date,
    questionType: String // 'greeting' | 'symptom' | 'duration' | etc.
  }],
  symptoms: [String],
  duration: String,
  severity: String,
  medicinesTaken: String,
  otherConditions: String,
  aiImpression: String,
  recommendedMedicines: [{
    brand: String,
    name: String,
    dosage: String,
    frequency: String,
    price: Number,
    quantity: Number,
    duration: String
  }],
  recommendedTests: [{
    name: String,
    reason: String,
    price: Number,
    category: String
  }],
  followUpNeeded: Boolean,
  followUpAfterDays: Number,
  urgencyLevel: String, // 'low' | 'medium' | 'high'
  advice: [String],
  status: String, // 'active' | 'resolved' | 'follow_up_needed'
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **timeline_entries**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  type: String, // 'ai_consultation' | 'doctor_visit' | 'lab_report' | 'prescription' | 'test_ordered'
  date: Date,
  title: String,
  description: String,
  symptoms: [String],
  aiImpression: String,
  medicines: [Medicine],
  tests: [Test],
  followUpDate: Date,
  urgencyLevel: String,
  doctorId: ObjectId (ref: 'users'),
  doctorName: String,
  consultationId: ObjectId (ref: 'consultations'),
  prescriptionId: ObjectId (ref: 'prescriptions'),
  labReportId: ObjectId (ref: 'lab_reports'),
  createdAt: Date
}
```

#### 4. **appointments**
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: 'users'),
  patientName: String,
  doctorId: ObjectId (ref: 'users'),
  doctorName: String,
  date: Date,
  time: String,
  type: String, // 'in_person' | 'video' | 'phone'
  status: String, // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  reason: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **lab_reports**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  date: Date,
  type: String, // 'CBC' | 'Lipid Profile' | 'Liver Function' | etc.
  file: String, // File path/URL
  values: {
    "Hemoglobin": { value: Number, unit: String, normal: String, status: String },
    "WBC": { value: Number, unit: String, normal: String, status: String },
    // ... more markers
  },
  aiAnalysis: {
    abnormalMarkers: [String],
    insights: [String],
    recommendations: [String],
    riskLevel: String // 'low' | 'medium' | 'high'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **prescriptions**
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: 'users'),
  doctorId: ObjectId (ref: 'users'),
  doctorName: String,
  date: Date,
  medicines: [Medicine],
  diagnosis: String,
  notes: String,
  createdAt: Date
}
```

#### 7. **ai_logs** (Admin monitoring)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  consultationId: ObjectId (ref: 'consultations'),
  prompt: String,
  response: String,
  model: String,
  tokensUsed: Number,
  responseTime: Number, // ms
  flagged: Boolean,
  flagReason: String,
  reviewStatus: String, // 'pending' | 'approved' | 'rejected'
  createdAt: Date
}
```

---

## 🤖 AI BEHAVIOR SPECIFICATION

### Doctor-Like Consultation Flow

The AI behaves like a professional Bangladeshi doctor conducting a chamber consultation.

#### Phase 1: Greeting & Initial Assessment
```
AI: "আসসালামু আলাইকুম। আমি CureSphere AI, আপনার স্বাস্থ্য সহায়ক। আপনার কি সমস্যা?"
(Translation: "Assalamu Alaikum. I am CureSphere AI, your health assistant. What is your problem?")
```

#### Phase 2: Structured Question Flow

**Step 1: Symptom Collection**
```
AI: "আপনার ঠিক কোন সমস্যা হচ্ছে? যেমন: জ্বর, মাথা ব্যথা, কাশি, পেট ব্যথা ইত্যাদি?"
(What exactly are you experiencing? Like: fever, headache, cough, stomach pain, etc.?)
```

**Step 2: Duration**
```
AI: "এই সমস্যা কত দিন ধরে হচ্ছে?"
(How long have you been experiencing this?)
```

**Step 3: Severity**
```
AI: "ব্যথা/সমস্যার মাত্রা কেমন? হালকা, মাঝারি নাকি তীব্র?"
(How severe is the pain/problem? Mild, moderate, or severe?)
```

**Step 4: Medicine History**
```
AI: "আপনি এই জন্য কোন ঔষধ খেয়েছেন কি?"
(Have you taken any medicine for this?)
```

**Step 5: Other Conditions**
```
AI: "আপনার কি ডায়াবেটিস, উচ্চ রক্তচাপ বা অন্য কোন রোগ আছে?"
(Do you have diabetes, high blood pressure, or any other conditions?)
```

#### Phase 3: Analysis & Recommendation

After collecting sufficient information, AI generates:

```javascript
{
  "aiImpression": "Based on your symptoms (fever for 3 days, body ache, mild headache), you may have viral fever or early infection.",
  
  "recommendedMedicines": [
    {
      "brand": "Napa",
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily (after meals)",
      "duration": "3-5 days",
      "price": 30,
      "quantity": 15
    },
    {
      "brand": "Antihistamine",
      "name": "Cetirizine",
      "dosage": "10mg",
      "frequency": "Once daily (at night)",
      "duration": "3 days",
      "price": 50,
      "quantity": 3
    }
  ],
  
  "recommendedTests": [],
  
  "followUpNeeded": true,
  "followUpAfterDays": 3,
  "urgencyLevel": "medium",
  
  "advice": [
    "Rest as much as possible",
    "Drink plenty of water (8-10 glasses daily)",
    "Avoid cold drinks and ice cream",
    "If fever persists after 3 days, return for follow-up",
    "⚠️ RED FLAG: If temperature exceeds 103°F or breathing difficulty occurs, visit emergency immediately"
  ]
}
```

#### Follow-Up Behavior (After 3+ Days)

When a patient returns after 3 days with recurring symptoms:

```
AI: "আমি দেখছি আপনি ৩ দিন আগে জ্বরের জন্য এসেছিলেন। এখন কেমন অনুভব করছেন?"
(I see you came 3 days ago for fever. How are you feeling now?)

User: "জ্বর এখনও আছে"
(Fever is still present)

AI: "ঠিক আছে। জ্বর কি একই রকম নাকি বেড়েছে? কোন নতুন লক্ষণ এসেছে কি? যেমন: শ্বাসকষ্ট, বুকে ব্যথা, প্রচণ্ড মাথা ব্যথা?"
(Okay. Is the fever same or increased? Any new symptoms? Like: breathing difficulty, chest pain, severe headache?)

[After assessment]

AI: "আপনার জ্বর তিন দিনের বেশি হয়ে গেছে। এখন কিছু পরীক্ষা করা উচিত।"
(Your fever has persisted beyond three days. Now some tests should be done.)

"recommendedTests": [
  {
    "name": "CBC (Complete Blood Count)",
    "reason": "Check for infection markers (WBC, Platelet)",
    "price": 400,
    "category": "Blood Test"
  },
  {
    "name": "CRP (C-Reactive Protein)",
    "reason": "Detect inflammation level",
    "price": 600,
    "category": "Blood Test"
  }
]
```

### AI Prompt Template (Gemini)

```javascript
const DOCTOR_AI_PROMPT = `
You are a professional, compassionate doctor at CureSphere AI, conducting a medical consultation following Bangladesh medical standards and WHO ethics guidelines.

Current patient data:
- Name: {patientName}
- Age: {age}
- Gender: {gender}
- Medical History: {medicalHistory}
- Allergies: {allergies}
- Previous Consultations: {previousConsultations}

Conversation History:
{conversationHistory}

Your Task:
1. If this is the first message, greet warmly in both English and Bangla
2. Ask one focused medical question at a time (symptom, duration, severity, medicine history, other conditions)
3. Do NOT provide diagnosis until you have gathered enough information (at least: symptoms, duration, severity)
4. When ready, provide structured output in JSON format with these fields:
   - aiImpression (string)
   - recommendedMedicines (array of objects)
   - recommendedTests (array of objects, empty if < 3 days of symptoms)
   - followUpNeeded (boolean)
   - followUpAfterDays (number)
   - urgencyLevel ('low' | 'medium' | 'high')
   - advice (array of strings, including red flags)

Important Rules:
- If symptoms < 3 days: suggest only OTC medicines, no tests
- If symptoms >= 3 days OR returning patient: suggest tests (CBC, CRP, etc.)
- Always include red flag warnings (when to seek emergency care)
- Use Bangladeshi medicine brands (Napa, Square, Incepta, Beximco, etc.)
- Price ranges: Paracetamol (৳30-50), Antihistamine (৳40-60), CBC (৳400-500)
- Never give definitive diagnosis - always say "may have" or "possible"
- Encourage doctor consultation for moderate/high urgency

Respond naturally, ask follow-up questions, and be supportive like a real chamber doctor.
`;
```

---

## 👤 PATIENT DASHBOARD

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo] CureSphere AI                    [🔔] [Profile ▼]    │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │ Sidebar     │  │                                        │  │
│  │             │  │          Main Content Area            │  │
│  │ • Dashboard │  │                                        │  │
│  │ • AI Chat   │  │                                        │  │
│  │ • Timeline  │  │                                        │  │
│  │ • Appts     │  │                                        │  │
│  │ • Reports   │  │                                        │  │
│  │ • Rx        │  │                                        │  │
│  │ • Pharmacy  │  │                                        │  │
│  │ • Profile   │  │                                        │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Page: Dashboard Overview

**Stats Cards (Top Row):**
1. Active Symptoms (Count with AI badge)
2. Next Appointment (Date & Doctor)
3. Pending Lab Reports (Count)
4. Health Score (AI-calculated, 0-100)

**Health Timeline (Central Feature):**
- Chronological feed of all health events
- Expandable cards showing full details
- Color-coded by type:
  - Blue: AI Consultation
  - Green: Doctor Visit
  - Purple: Lab Report
  - Orange: Prescription
  - Pink: Test Ordered

**Quick Actions:**
- Start AI Consultation
- Book Appointment
- Upload Lab Report
- Order Medicine

### Page: AI Consultation (Chat UI)

**Layout:**
```
┌────────────────────────────────────────┐
│  AI Doctor - Online ●                  │
├────────────────────────────────────────┤
│                                        │
│  [AI Avatar] Hello! How can I help?   │
│                                        │
│         I have fever        [You]     │
│                                        │
│  [AI Avatar] How many days?            │
│                                        │
│         3 days              [You]     │
│                                        │
├────────────────────────────────────────┤
│  [Type your message...]      [Send →] │
└────────────────────────────────────────┘
```

**Features:**
- Real-time message streaming
- "AI is typing..." indicator
- Quick reply buttons
- Symptom autocomplete
- Medical history prefill
- Export consultation as PDF

**AI Response Card (After Analysis):**
```
┌────────────────────────────────────────┐
│  📋 CONSULTATION SUMMARY               │
├────────────────────────────────────────┤
│  Symptoms: Fever, Body ache, Headache  │
│  Duration: 3 days                      │
│  Urgency: Medium ⚠️                   │
├────────────────────────────────────────┤
│  💊 RECOMMENDED MEDICINES               │
│  • Napa 500mg - 3x daily - ৳30         │
│  • Cetirizine 10mg - 1x daily - ৳50    │
│  [View Pharmacies] [Add to Cart]       │
├────────────────────────────────────────┤
│  🧪 TESTS (if symptoms persist)         │
│  • CBC - ৳400                          │
│  • CRP - ৳600                          │
│  [View Diagnostic Centers]             │
├────────────────────────────────────────┤
│  📝 ADVICE                              │
│  • Rest 7-8 hours daily                │
│  • Drink 8-10 glasses water            │
│  • Return after 3 days if no relief    │
│  ⚠️ Seek emergency if fever > 103°F    │
├────────────────────────────────────────┤
│  📅 Follow-up: December 15, 2025       │
│  [Set Reminder] [Book Doctor]          │
└────────────────────────────────────────┘
```

### Page: Health Timeline

**Timeline Entry Card:**
```
┌────────────────────────────────────────┐
│  🤖 AI Consultation                    │
│  December 12, 2025 - 10:30 AM         │
├────────────────────────────────────────┤
│  Symptoms: Fever, Body ache           │
│  Urgency: Medium                      │
│  Status: Follow-up in 3 days          │
│  [View Details ▼]                      │
└────────────────────────────────────────┘

[Expanded View Shows:]
- Full conversation transcript
- Medicines recommended
- Tests suggested
- AI impression
- Follow-up schedule
```

### Page: Appointments

**Appointment Card:**
```
┌────────────────────────────────────────┐
│  Dr. Fahmida Rahman                    │
│  Cardiologist                          │
│  📅 Dec 15, 2025 | ⏰ 10:00 AM         │
│  📍 Square Hospital, Dhaka             │
│  Status: Confirmed ✓                   │
│  [Join Video Call] [Cancel] [Reschedule]│
└────────────────────────────────────────┘
```

### Page: Lab Reports

**Report Card:**
```
┌────────────────────────────────────────┐
│  📄 CBC (Complete Blood Count)         │
│  December 10, 2025                     │
├────────────────────────────────────────┤
│  AI Analysis:                          │
│  ⚠️ 2 Abnormal Markers Detected        │
│  • WBC: 12,000 (High) - Infection sign │
│  • Hemoglobin: 10.5 (Low) - Anemia     │
├────────────────────────────────────────┤
│  Risk Level: Medium                    │
│  [View Full Report] [Share with Doctor]│
└────────────────────────────────────────┘
```

---

## 👨‍⚕️ DOCTOR DASHBOARD

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo] CureSphere AI  |  Dr. {Name}         [🔔] [Profile ▼]│
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │ Sidebar     │  │                                        │  │
│  │             │  │          Main Content Area            │  │
│  │ • Dashboard │  │                                        │  │
│  │ • Patients  │  │                                        │  │
│  │ • Appts     │  │                                        │  │
│  │ • AI Insights│  │                                        │  │
│  │ • Prescribe │  │                                        │  │
│  │ • Reports   │  │                                        │  │
│  │ • Earnings  │  │                                        │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Page: Dashboard Overview

**Stats Cards:**
1. Total Patients (with new patients this month)
2. Today's Appointments (count + list)
3. Pending Lab Reviews (count)
4. AI Flagged Urgent Cases (red badge)

**Today's Schedule:**
- Timeline view of appointments
- Color-coded by type (video/in-person/phone)
- Quick actions: Join, Reschedule, Cancel

**AI Insights Panel:**
- Patients needing follow-up
- Abnormal lab results detected
- Repeated visits (< 7 days)
- High-risk cases

### Page: Patient List

**Patient Card:**
```
┌────────────────────────────────────────┐
│  Mohammed Rahman, 35M                  │
│  📞 +880 1700-000000                   │
│  🩸 B+ | 📍 Dhaka, Bangladesh          │
├────────────────────────────────────────┤
│  Last Visit: Dec 10, 2025              │
│  AI Detected: Recurring fever (7 days) │
│  Urgency: High ⚠️                      │
├────────────────────────────────────────┤
│  [View Profile] [Start Consultation]   │
└────────────────────────────────────────┘
```

### Page: Patient Profile (Doctor View)

**Layout:**
```
┌─────────────────────────────────────────────┬───────────────┐
│  Patient Info                               │  AI Insights  │
│  • Name, Age, Gender                        │  • Risk Score │
│  • Blood Group, Height, Weight              │  • Patterns   │
│  • Medical History                          │  • Red Flags  │
│  • Allergies                                │  • Suggestions│
├─────────────────────────────────────────────┴───────────────┤
│  📋 Health Timeline (Combined AI + Doctor)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Dec 12 - AI Consultation: Fever, 3 days             │  │
│  │ Dec 10 - Lab: CBC - High WBC                        │  │
│  │ Dec 05 - Doctor Visit: You prescribed antibiotics   │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  🧪 Lab Reports                 💊 Prescriptions            │
│  [View All]                     [View All]                  │
└─────────────────────────────────────────────────────────────┘
```

**AI Insights Sidebar:**
```
┌────────────────────────────────┐
│  🤖 AI Doctor Assistant         │
├────────────────────────────────┤
│  Differential Diagnosis:        │
│  • Bacterial Infection (78%)    │
│  • Viral Fever (65%)            │
│  • Dengue (35%) ⚠️              │
├────────────────────────────────┤
│  Suggested Next Steps:          │
│  • Order: Dengue NS1 Antigen    │
│  • Monitor: Platelet count      │
│  • Consider: Hospitalization    │
├────────────────────────────────┤
│  Risk Factors:                  │
│  • Fever > 5 days               │
│  • Low platelet trend           │
│  [Approve AI Suggestions]       │
└────────────────────────────────┘
```

### Page: E-Prescription Creator

**Interface:**
```
┌────────────────────────────────────────┐
│  CREATE PRESCRIPTION                   │
├────────────────────────────────────────┤
│  Patient: Mohammed Rahman              │
│  Date: Dec 12, 2025                    │
├────────────────────────────────────────┤
│  Diagnosis:                            │
│  [Viral Fever with secondary infection]│
├────────────────────────────────────────┤
│  Medicines:                            │
│  ┌──────────────────────────────────┐ │
│  │ 1. [Search Medicine...]    [AI ⚡]│ │
│  │    Suggested: Napa 500mg           │ │
│  │    Dosage: [500mg ▼]              │ │
│  │    Frequency: [3x daily ▼]        │ │
│  │    Duration: [5 days]             │ │
│  │    [+ Add Medicine]                │ │
│  └──────────────────────────────────┘ │
├────────────────────────────────────────┤
│  Notes:                                │
│  [Free text area]                      │
├────────────────────────────────────────┤
│  [AI Autofill Based on Symptoms]       │
│  [Generate PDF] [Send to Patient]      │
└────────────────────────────────────────┘
```

**AI Autofill Feature:**
When clicked, AI analyzes patient's symptoms and suggests:
- Appropriate medicines
- Correct dosages
- Duration based on condition severity
- Necessary precautions

---

## 👨‍💼 ADMIN DASHBOARD

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo] CureSphere AI  |  Admin Panel       [🔔] [Profile ▼]│
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │ Sidebar     │  │                                        │  │
│  │             │  │          Main Content Area            │  │
│  │ • Analytics │  │                                        │  │
│  │ • Users     │  │                                        │  │
│  │ • Doctors   │  │                                        │  │
│  │ • AI Logs   │  │                                        │  │
│  │ • Pharmacy  │  │                                        │  │
│  │ • Revenue   │  │                                        │  │
│  │ • Settings  │  │                                        │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Page: System Analytics

**Top Metrics:**
```
┌────────────┬────────────┬────────────┬────────────┐
│ Total Users│ AI Chats   │ Doctors    │ Revenue    │
│ 10,245     │ 1,543/day  │ 127        │ ৳2.4M      │
│ +12% ↑     │ +8% ↑      │ +3 this mo │ +15% ↑     │
└────────────┴────────────┴────────────┴────────────┘
```

**Charts:**
1. **Daily AI Consultations** (Line chart, 30 days)
2. **Most Common Symptoms** (Bar chart)
   - Fever: 34%
   - Headache: 28%
   - Cough: 22%
   - Stomach issues: 16%
3. **Doctor Engagement** (Donut chart)
   - Active: 78%
   - Inactive: 22%
4. **Medicine Orders Trend** (Area chart)

### Page: User Management

**User Table:**
```
┌─────────────┬───────────────┬──────────┬────────────┬──────────┐
│ Name        │ Email         │ Role     │ Status     │ Actions  │
├─────────────┼───────────────┼──────────┼────────────┼──────────┤
│ Mohammed R. │ mo@email.com  │ Patient  │ Active ✓   │ [View]   │
│ Dr. Sarah A.│ dr@email.com  │ Doctor   │ Pending ⏳ │ [Approve]│
│ Admin User  │ ad@email.com  │ Admin    │ Active ✓   │ [Edit]   │
└─────────────┴───────────────┴──────────┴────────────┴──────────┘
```

**Doctor Approval Modal:**
```
┌────────────────────────────────────────┐
│  DOCTOR VERIFICATION                   │
├────────────────────────────────────────┤
│  Name: Dr. Sarah Ahmed                 │
│  Specialization: Cardiologist          │
│  BMDC Registration: 12345              │
│  📄 Documents:                         │
│  • MBBS Certificate ✓                  │
│  • BMDC Card ✓                         │
│  • Experience Letter ✓                 │
├────────────────────────────────────────┤
│  [Approve] [Reject] [Request More Info]│
└────────────────────────────────────────┘
```

### Page: AI Monitoring

**AI Logs Table:**
```
┌──────────┬────────────┬───────────┬────────────┬──────────┐
│ Date/Time│ User       │ Prompt    │ Response   │ Flag     │
├──────────┼────────────┼───────────┼────────────┼──────────┤
│ 10:23 AM │ Mohammed R.│ Fever 3d  │ Recomme... │ Safe ✓   │
│ 10:15 AM │ Fatima K.  │ Chest pain│ Emergency  │ Review ⚠│
│ 09:50 AM │ Karim M.   │ Headache  │ Paraceta...│ Safe ✓   │
└──────────┴────────────┴───────────┴────────────┴──────────┘
```

**Flagged Response Review:**
```
┌────────────────────────────────────────┐
│  ⚠️ FLAGGED AI RESPONSE                │
├────────────────────────────────────────┤
│  User: Fatima Khatun                   │
│  Symptom: "Severe chest pain, left arm"│
│  AI Response: "This could be serious..."│
│  Flag Reason: Emergency keyword detected│
├────────────────────────────────────────┤
│  Admin Action:                         │
│  ☑ AI response was appropriate         │
│  ☐ AI should have been more cautious   │
│  ☐ Requires model retraining           │
│  [Approve] [Flag for Review]           │
└────────────────────────────────────────┘
```

### Page: Pharmacy Management

**Pharmacy CRUD:**
```
┌────────────────────────────────────────┐
│  ADD PHARMACY                          │
├────────────────────────────────────────┤
│  Name: [Square Pharmaceuticals]        │
│  Location: [Dhaka, Gulshan]            │
│  Coordinates: [Lat, Lng]               │
│  Contact: [+880 1700-000000]           │
│  Delivery: [Yes ✓] [No]                │
│  Stock Available:                      │
│  [+ Add Medicine Stock]                │
│  [Save] [Cancel]                       │
└────────────────────────────────────────┘
```

---

## 🧩 FRONTEND COMPONENTS

### Reusable Components to Build

#### 1. **Sidebar Navigation** (`components/dashboards/Sidebar.tsx`)
```tsx
interface SidebarProps {
  role: 'patient' | 'doctor' | 'admin';
  currentPage: string;
  onNavigate: (page: string) => void;
}
```

#### 2. **Stats Card** (`components/dashboards/StatsCard.tsx`)
```tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string; // "+12%"
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}
```

#### 3. **Timeline Entry** (`components/dashboards/TimelineEntry.tsx`)
```tsx
interface TimelineEntryProps {
  entry: TimelineEntry;
  expanded?: boolean;
  onExpand?: () => void;
}
```

#### 4. **AI Chat Interface** (`components/dashboards/AIChat.tsx`)
```tsx
interface AIChatProps {
  userId: string;
  consultationId?: string;
  onConsultationComplete?: (consultation: Consultation) => void;
}
```

#### 5. **Patient Card** (`components/dashboards/PatientCard.tsx`)
```tsx
interface PatientCardProps {
  patient: User;
  lastVisit?: Date;
  aiFlags?: string[];
  urgency?: 'low' | 'medium' | 'high';
  onViewProfile: () => void;
}
```

#### 6. **Appointment Card** (`components/dashboards/AppointmentCard.tsx`)
```tsx
interface AppointmentCardProps {
  appointment: Appointment;
  role: 'patient' | 'doctor';
  onJoin?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
}
```

#### 7. **Prescription Creator** (`components/dashboards/PrescriptionCreator.tsx`)
```tsx
interface PrescriptionCreatorProps {
  patientId: string;
  doctorId: string;
  aiSuggestions?: Medicine[];
  onSave: (prescription: Prescription) => void;
}
```

#### 8. **Lab Report Viewer** (`components/dashboards/LabReportViewer.tsx`)
```tsx
interface LabReportViewerProps {
  report: LabReport;
  showAIAnalysis?: boolean;
  onShare?: () => void;
}
```

---

## 🔌 BACKEND API SPECIFICATION

### Authentication

#### POST `/api/auth/signup`
```json
Request:
{
  "name": "Mohammed Rahman",
  "email": "mohammed@email.com",
  "password": "SecurePass123",
  "phone": "+880 1700-000000",
  "birthdate": "1990-05-15",
  "role": "patient"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ...userObject }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "mohammed@email.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ...userObject }
}
```

### AI Consultation

#### POST `/api/ai/chat`
```json
Request:
{
  "userId": "user_id",
  "consultationId": "consultation_id", // optional, for continuing chat
  "message": "I have fever for 3 days"
}

Response:
{
  "success": true,
  "aiMessage": "I understand you have fever. How severe is it? Mild, moderate, or high?",
  "consultationId": "new_consultation_id",
  "questionType": "severity",
  "needsMoreInfo": true
}
```

#### POST `/api/ai/analyze`
```json
Request:
{
  "userId": "user_id",
  "consultationId": "consultation_id"
}

Response:
{
  "success": true,
  "analysis": {
    "aiImpression": "...",
    "recommendedMedicines": [...],
    "recommendedTests": [...],
    "followUpNeeded": true,
    "followUpAfterDays": 3,
    "urgencyLevel": "medium",
    "advice": [...]
  }
}
```

### Timeline

#### GET `/api/timeline/:userId`
```json
Response:
{
  "success": true,
  "timeline": [
    {
      "id": "entry_id",
      "type": "ai_consultation",
      "date": "2025-12-12T10:30:00Z",
      "title": "AI Consultation",
      "description": "Fever, Body ache",
      ...
    }
  ]
}
```

#### POST `/api/timeline/entry`
```json
Request:
{
  "userId": "user_id",
  "type": "doctor_visit",
  "title": "Doctor Consultation",
  "description": "Follow-up for fever",
  "doctorId": "doctor_id",
  ...
}
```

### Appointments

#### GET `/api/appointments/patient/:patientId`
#### GET `/api/appointments/doctor/:doctorId`
#### POST `/api/appointments/create`
#### PATCH `/api/appointments/:id/status`

### Lab Reports

#### GET `/api/lab-reports/:userId`
#### POST `/api/lab-reports/upload`
#### POST `/api/lab-reports/analyze` (AI analysis)

### Prescriptions

#### GET `/api/prescriptions/patient/:patientId`
#### GET `/api/prescriptions/doctor/:doctorId`
#### POST `/api/prescriptions/create`

### Admin

#### GET `/api/admin/analytics`
#### GET `/api/admin/users`
#### PATCH `/api/admin/users/:id/approve`
#### GET `/api/admin/ai-logs`
#### PATCH `/api/admin/ai-logs/:id/review`

---

## 🗺️ IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [x] Update User types with role support
- [ ] Enhance AuthContext for role-based auth
- [ ] Create base dashboard layouts (Patient, Doctor, Admin)
- [ ] Implement sidebar navigation components
- [ ] Set up role-based routing in App.tsx

### Phase 2: Patient Dashboard (Week 3-4)
- [ ] Build Patient Dashboard Overview
- [ ] Create AI Chat Interface with Gemini integration
- [ ] Implement Health Timeline component
- [ ] Build Appointment booking system
- [ ] Create Lab Report upload & viewer

### Phase 3: AI Doctor (Week 5-6)
- [ ] Design AI prompt templates
- [ ] Implement conversation flow logic
- [ ] Add follow-up detection (3+ days)
- [ ] Create medicine recommendation system
- [ ] Build test suggestion logic
- [ ] Integrate with Timeline

### Phase 4: Doctor Dashboard (Week 7-8)
- [ ] Build Doctor Dashboard Overview
- [ ] Create Patient list with AI flags
- [ ] Implement Patient Profile (doctor view)
- [ ] Build E-Prescription creator
- [ ] Add AI Insights panel
- [ ] Create Appointment management

### Phase 5: Admin Dashboard (Week 9-10)
- [ ] Build Analytics dashboard (Recharts)
- [ ] Create User management interface
- [ ] Implement Doctor approval workflow
- [ ] Build AI Monitoring panel
- [ ] Add Pharmacy/Diagnostic CRUD
- [ ] Create Revenue tracking

### Phase 6: Backend Integration (Week 11-12)
- [ ] Set up MongoDB schemas
- [ ] Implement Express API endpoints
- [ ] Integrate Gemini API
- [ ] Add JWT authentication
- [ ] Create data sync across roles
- [ ] Implement error handling

### Phase 7: Testing & Polish (Week 13-14)
- [ ] End-to-end testing
- [ ] AI prompt optimization
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deployment

---

## 📚 ADDITIONAL RESOURCES

### Gemini API Integration

```javascript
// Example: Call Gemini for AI consultation
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIResponse(conversationHistory, userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
  const prompt = buildDoctorPrompt(conversationHistory, userMessage);
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return parseAIResponse(text);
}
```

### Database Indexes (MongoDB)

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Consultations collection
db.consultations.createIndex({ userId: 1, date: -1 });
db.consultations.createIndex({ status: 1 });

// Timeline collection
db.timeline_entries.createIndex({ userId: 1, date: -1 });
db.timeline_entries.createIndex({ type: 1 });

// Appointments collection
db.appointments.createIndex({ patientId: 1, date: 1 });
db.appointments.createIndex({ doctorId: 1, date: 1 });
db.appointments.createIndex({ status: 1 });
```

---

## 🔒 SECURITY & COMPLIANCE

### Data Encryption
- Use bcrypt for password hashing (salt rounds: 10)
- Implement JWT with 7-day expiry
- Use HTTPS in production
- Encrypt sensitive medical data at rest (AES-256)

### WHO AI Ethics Guidelines 2023
- Always include disclaimer: "AI is supportive, not a substitute for doctors"
- Never provide definitive diagnoses
- Include red flag warnings for emergencies
- Allow user to opt out of AI at any time
- Maintain audit logs of all AI interactions

### GDPR / Data Privacy
- User consent for data collection
- Right to data deletion
- Data portability (export as PDF/JSON)
- Anonymize data for analytics

---

## 📞 SUPPORT & MAINTENANCE

### Monitoring
- Track AI response times
- Monitor error rates
- Alert on high-urgency cases
- Log all API calls

### Continuous Improvement
- Collect feedback on AI accuracy
- Retrain models quarterly
- Update medicine database monthly
- Review flagged cases weekly

---

## ✅ DONE!

This specification provides a complete blueprint for implementing the multi-role dashboard system. Follow the implementation roadmap phase by phase, and refer to this document for detailed requirements.

For questions or clarifications, refer to the inline comments in the codebase or the API documentation.

**Last Updated:** December 12, 2025
**Version:** 1.0.0
**Author:** CureSphere AI Development Team
