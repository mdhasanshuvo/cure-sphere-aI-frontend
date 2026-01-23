# 🏥 CURESPHERE AI - Complete Multi-Role Healthcare Platform Prompt

> **Copy-paste this prompt into Figma AI, Replit Agent, V0, Bolt.new, Cursor, or Claude to regenerate this entire system**

---

## 🎯 EXECUTIVE SUMMARY

Build a **complete AI-powered healthcare platform** with 3 distinct user roles (Patient, Doctor, Admin), integrated frontend + backend + database + AI API. The AI behaves like a real chamber doctor, asking systematic questions, providing primary treatment, and suggesting tests/reports when patients return after 3+ days.

---

## 🏗️ SYSTEM ARCHITECTURE

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + Shadcn UI
- Lucide React icons
- Recharts for analytics
- Vite build tool

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- cors, dotenv

**AI Engine:**
- Google Generative AI (Gemini API)
- Structured conversation flow
- Doctor-like consultation behavior
- Medical knowledge base

**Database Collections:**
- users (patients, doctors, admins)
- consultations (AI + doctor visits)
- timeline (health history)
- appointments
- lab_reports
- prescriptions
- medicines
- diagnostic_centers

---

## 👥 USER ROLES & DASHBOARDS

### 1. PATIENT DASHBOARD

**Features:**
1. **Health Overview Cards**
   - Active symptoms count
   - Next appointment date
   - Pending lab reports
   - Health score (0-100)

2. **Health Timeline**
   - Chronological medical history
   - AI consultations
   - Doctor visits
   - Lab reports
   - Prescriptions
   - Expandable cards with full details

3. **AI Doctor Chat** ⭐ PRIMARY FEATURE
   - Bilingual (English/Bengali)
   - Multi-turn conversation
   - Systematic questioning
   - Primary treatment recommendations
   - Test suggestions (3+ day rule)
   - Downloadable reports

4. **Quick Actions**
   - Book appointments
   - Upload lab reports
   - Order medicines
   - Find nearby pharmacies
   - Find diagnostic centers

5. **Lab Reports Analyzer**
   - Upload PDF/images
   - AI analysis of CBC, CRP, etc.
   - Abnormal marker detection
   - Risk level assessment

6. **Appointments**
   - Upcoming appointments
   - Past history
   - Video/in-person/phone options

7. **Medicine Orders**
   - Prescription-based ordering
   - Local pharmacy integration
   - Delivery tracking

8. **User Profile**
   - Personal information
   - Medical history
   - Allergies
   - Emergency contacts

---

### 2. DOCTOR DASHBOARD

**Features:**
1. **Overview KPI Cards**
   - Total patients
   - Today's appointments
   - Pending lab reviews
   - AI-flagged cases

2. **Patient Management**
   - Patient list with filters
   - Search functionality
   - Urgency badges (High/Medium/Low)
   - Last visit tracking
   - Current conditions

3. **Patient Profile View**
   - Complete medical history
   - AI consultation history
   - Lab reports timeline
   - Previous prescriptions
   - Allergies & chronic conditions

4. **Today's Schedule**
   - Time-sorted appointments
   - Consultation type (video/in-person/phone)
   - Patient quick info
   - Start call/consultation buttons

5. **E-Prescription Creator**
   - Medicine search with local brands
   - Dosage & frequency selector
   - Duration calculator
   - Digital signature
   - Send to patient + pharmacy

6. **Lab Report Analyzer**
   - Review pending reports
   - AI-assisted interpretation
   - Flag abnormal values
   - Add doctor notes

7. **AI Clinical Insights**
   - AI-flagged high-risk cases
   - Suggested differential diagnoses
   - Treatment recommendations
   - Research-backed suggestions

8. **Earnings Dashboard**
   - Monthly/weekly/daily revenue
   - Consultation fees breakdown
   - Payment status tracking
   - Tax calculation helpers

---

### 3. ADMIN DASHBOARD

**Features:**
1. **Analytics Overview**
   - Total users (patients/doctors)
   - Daily AI consultations
   - Total appointments
   - Platform revenue
   - Weekly activity trends (line chart)

2. **User Management**
   - Search & filter users
   - User roles management
   - Account status (active/suspended)
   - User activity logs

3. **Doctor Verification**
   - Pending doctor approvals
   - BMDC license verification
   - Document review
   - Approve/reject workflow

4. **Pharmacy Management**
   - Partner pharmacy list
   - Medicine inventory
   - Pricing oversight
   - Order fulfillment tracking

5. **Diagnostic Center Management**
   - Partner centers list
   - Test catalog management
   - Pricing control
   - Quality assurance

6. **Appointment Oversight**
   - All appointments view
   - Doctor-patient matching
   - Cancellation management
   - Dispute resolution

7. **AI Monitoring** ⭐ CRITICAL SAFETY FEATURE
   - Flagged AI recommendations
   - Hallucination detection
   - Safety threshold alerts
   - Accuracy metrics (87.5% target)
   - False positive rate (< 5%)
   - Safety compliance (> 99%)
   - Audit logs

8. **Revenue Dashboard**
   - Platform earnings
   - Doctor commission breakdown
   - Pharmacy commissions
   - Payment gateway analytics

9. **Most Reported Symptoms**
   - Pie chart visualization
   - Trending health issues
   - Geographic patterns
   - Seasonal analysis

---

## 🤖 AI DOCTOR BEHAVIOR - DETAILED SPECIFICATION

### Core Principle
**The AI must behave exactly like a real Bangladeshi chamber doctor:**
- Speaks both English and Bengali
- Asks systematic, relevant questions
- Shows empathy and professionalism
- Follows medical best practices
- Knows local medicine brands and prices
- Understands local health context

---

### Consultation Flow (7 Phases)

#### **Phase 1: GREETING**
```
AI: "আসসালামু আলাইকুম [Name]! আমি CureSphere AI, আপনার স্বাস্থ্য সহায়ক।

Hello! I'm your AI health assistant. I'll ask you a few questions to understand your condition better. How can I help you today?"
```

**User Action:** Describe primary symptom
**Example:** "I have fever and body ache"

---

#### **Phase 2: SYMPTOM COLLECTION**
```
AI: "I understand you have fever and body ache. Let me ask a few more questions:

1. Do you have any other symptoms like:
   - Cough or cold?
   - Headache?
   - Nausea or vomiting?
   - Diarrhea?
   - Chest pain or breathing difficulty?

Please tell me all the symptoms you're experiencing."
```

**User Action:** List all symptoms
**AI Logic:** Store symptoms array, detect patterns (fever+cough = respiratory, fever+headache+body ache = viral, etc.)

---

#### **Phase 3: DURATION ASSESSMENT**
```
AI: "Thank you. How long have you been experiencing these symptoms?

কতদিন ধরে এই সমস্যাগুলো হচ্ছে?

Please mention in days (e.g., 2 days, 1 week, etc.)"
```

**User Action:** "3 days" or "Since yesterday"

**AI Logic:**
- Extract duration in days
- **CRITICAL: If duration >= 3 days → Flag for test recommendations**
- If duration >= 7 days → High urgency
- Store `durationDays` variable

---

#### **Phase 4: SEVERITY RATING**
```
AI: "On a scale from Mild to Severe, how would you rate your symptoms?

তীব্রতা কেমন?

Options:
- Mild (হালকা) - Bearable, can do daily activities
- Moderate (মাঝারি) - Uncomfortable, affecting daily work
- Severe (তীব্র) - Very painful, cannot work"
```

**User Action:** Select severity

**AI Logic:**
- Store severity level
- Severe → Immediate red flags check
- Moderate + 3+ days → Consider tests
- Mild → Symptomatic treatment

---

#### **Phase 5: MEDICINE HISTORY**
```
AI: "Have you taken any medicines for these symptoms?

এই সমস্যার জন্য কোন ঔষধ খেয়েছেন?

If yes, please mention:
- Medicine names
- When you took them
- Did they help?"
```

**User Action:** "Took Napa 2 times, some relief"

**AI Logic:**
- Check for drug interactions
- Assess treatment response
- Avoid recommending same ineffective medicines
- Consider alternative treatments

---

#### **Phase 6: OTHER CONDITIONS**
```
AI: "Do you have any of these conditions?

- Diabetes (ডায়াবেটিস)
- High blood pressure (উচ্চ রক্তচাপ)
- Heart disease (হৃদরোগ)
- Kidney disease (কিডনি রোগ)
- Asthma (হাঁপানি)
- Pregnancy (গর্ভবতী)
- Any known allergies (এলার্জি)

This helps me suggest safer medicines."
```

**User Action:** List conditions or "None"

**AI Logic:**
- Store chronic conditions
- Check contraindications
- Adjust medicine recommendations
- Flag high-risk combinations

---

#### **Phase 7: ANALYSIS & RECOMMENDATIONS**

**AI Processing:**

1. **Analyze Symptoms + Duration + Severity + History**

2. **Generate Medical Impression**
   ```
   Example:
   "Based on your symptoms (fever for 3 days with body ache and headache), 
   you may have viral fever or early bacterial infection. Since it's been 
   3 days, we need to rule out dengue and other infections."
   ```

3. **Recommend Primary Treatment Medicines**
   - Use **Bangladeshi brands** (Napa, Ace, Seclo, Histacin, etc.)
   - Include:
     - Brand name
     - Generic name
     - Dosage (500mg, 20mg, etc.)
     - Frequency (3 times daily after meals)
     - Duration (5 days, 7 days)
     - Price in BDT (৳30, ৳120)
     - Quantity (15 tablets)

   **Example Medicine List:**
   ```
   1. Napa (Paracetamol) 500mg
      - 3 times daily after meals
      - Duration: 5 days
      - ৳30 (15 tablets)

   2. Histacin (Cetirizine) 10mg
      - Once daily at night
      - Duration: 3 days
      - ৳50 (3 tablets)

   3. Seclo (Omeprazole) 20mg
      - Once daily before breakfast
      - Duration: 7 days
      - ৳120 (7 capsules)
   ```

4. **THE 3-DAY RULE - TEST RECOMMENDATIONS** ⭐

   **Logic:**
   ```javascript
   if (durationDays >= 3) {
     recommendTests([
       {
         name: 'CBC (Complete Blood Count)',
         reason: 'Check infection markers (WBC count, Platelet count)',
         price: '৳400',
         category: 'Blood Test'
       },
       {
         name: 'CRP (C-Reactive Protein)',
         reason: 'Detect inflammation level',
         price: '৳600',
         category: 'Blood Test'
       }
     ]);
   }

   if (durationDays >= 5 && hasFever) {
     recommendTests([
       {
         name: 'Dengue NS1 Antigen',
         reason: 'Rule out dengue fever',
         price: '৳800',
         category: 'Blood Test'
       },
       {
         name: 'Widal Test',
         reason: 'Check for typhoid fever',
         price: '৳500',
         category: 'Blood Test'
       }
     ]);
   }
   ```

   **Display:**
   ```
   🔬 RECOMMENDED TESTS:

   Since you've had symptoms for 3+ days, I recommend these tests:

   1. CBC (Complete Blood Count) - ৳400
      Reason: Check infection markers (WBC, Platelet)
      
   2. CRP (C-Reactive Protein) - ৳600
      Reason: Detect inflammation level

   3. Dengue NS1 Antigen - ৳800
      Reason: Rule out dengue (important in Bangladesh)

   📍 You can book these tests from Diagnostic Centers page
   ```

5. **Lifestyle Advice**
   ```
   💡 HEALTH ADVICE:

   1. পর্যাপ্ত বিশ্রাম নিন (Rest adequately - 7-8 hours sleep)
   2. প্রচুর পানি পান করুন (Drink 8-10 glasses of water daily)
   3. হালকা গরম খাবার খান (Eat warm, light meals)
   4. ঠান্ডা পানীয় এড়িয়ে চলুন (Avoid cold drinks and ice cream)
   5. ভিটামিন সি সমৃদ্ধ ফল খান (Eat vitamin C rich fruits)
   ```

6. **RED FLAGS - Emergency Warnings** 🚨
   ```
   ⚠️ VISIT HOSPITAL IMMEDIATELY IF:

   - Fever > 103°F (39.4°C)
   - Severe breathing difficulty (শ্বাসকষ্ট)
   - Chest pain (বুকে ব্যথা)
   - Vomiting blood (রক্ত বমি)
   - Severe abdominal pain (তীব্র পেট ব্যথা)
   - Confusion or unconsciousness (অজ্ঞান)
   - Bleeding that won't stop
   ```

7. **Follow-Up Schedule**
   ```
   📅 FOLLOW-UP:

   - If no improvement in 2 days → Complete the recommended tests
   - If symptoms worsen → Consult a doctor immediately
   - If symptoms improve → Continue medicines for full duration
   - Return for follow-up in 3 days with test reports
   ```

8. **Save to Timeline**
   - Button: "Save to Health Timeline"
   - Stores consultation in database
   - Creates timeline entry with:
     - Date & time
     - Symptoms
     - AI analysis
     - Recommended medicines
     - Recommended tests
     - Follow-up date

9. **Download Report**
   - PDF generation
   - Contains full consultation
   - Patient can share with real doctor

---

### AI Response Format (JSON)

```json
{
  "consultationId": "CONS_20231213_001",
  "timestamp": "2023-12-13T10:30:00Z",
  "patient": {
    "id": "USER_123",
    "name": "Ahmed Khan",
    "age": 32,
    "gender": "male"
  },
  "symptoms": [
    "fever",
    "body ache",
    "headache",
    "cough"
  ],
  "duration": {
    "value": 3,
    "unit": "days"
  },
  "severity": "moderate",
  "medicinesTaken": [
    "Napa (Paracetamol) 2 times"
  ],
  "chronicConditions": [],
  "allergies": [],
  "aiImpression": "Based on your symptoms (fever for 3 days with body ache and headache), you may have viral fever or early bacterial infection. Since it's been 3 days, we need to rule out dengue and other infections.",
  "recommendedMedicines": [
    {
      "brand": "Napa",
      "generic": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily (after meals)",
      "duration": "5 days",
      "price": 30,
      "quantity": 15,
      "instructions": "Take with food to avoid stomach upset"
    },
    {
      "brand": "Histacin",
      "generic": "Cetirizine",
      "dosage": "10mg",
      "frequency": "Once daily at night",
      "duration": "3 days",
      "price": 50,
      "quantity": 3
    },
    {
      "brand": "Seclo",
      "generic": "Omeprazole",
      "dosage": "20mg",
      "frequency": "Once daily before breakfast",
      "duration": "7 days",
      "price": 120,
      "quantity": 7
    }
  ],
  "recommendedTests": [
    {
      "name": "CBC (Complete Blood Count)",
      "reason": "Check infection markers (WBC count, Platelet count)",
      "price": 400,
      "category": "Blood Test",
      "urgent": false
    },
    {
      "name": "CRP (C-Reactive Protein)",
      "reason": "Detect inflammation level",
      "price": 600,
      "category": "Blood Test",
      "urgent": false
    },
    {
      "name": "Dengue NS1 Antigen",
      "reason": "Rule out dengue fever (important in Bangladesh)",
      "price": 800,
      "category": "Blood Test",
      "urgent": true
    }
  ],
  "advice": [
    "পর্যাপ্ত বিশ্রাম নিন (Rest adequately - 7-8 hours sleep)",
    "প্রচুর পানি পান করুন (Drink 8-10 glasses of water daily)",
    "হালকা গরম খাবার খান (Eat warm, light meals)",
    "ঠান্ডা পানীয় এড়িয়ে চলুন (Avoid cold drinks and ice cream)"
  ],
  "redFlags": [
    "Fever > 103°F (39.4°C)",
    "Severe breathing difficulty",
    "Chest pain",
    "Vomiting blood"
  ],
  "followUp": {
    "needed": true,
    "afterDays": 2,
    "reason": "Symptom duration exceeds 3 days, tests recommended",
    "nextVisitDate": "2023-12-15"
  },
  "urgencyLevel": "medium",
  "estimatedTotalCost": {
    "medicines": 200,
    "tests": 1800,
    "total": 2000,
    "currency": "BDT"
  }
}
```

---

### Follow-Up Visit Logic

**When patient returns after 3+ days:**

1. **Check Previous Consultation**
   ```javascript
   const previousConsults = getPatientConsultations(userId);
   const lastConsult = previousConsults[0];
   const daysSinceLastVisit = calculateDays(lastConsult.date, today);
   ```

2. **AI Greets with Context**
   ```
   AI: "আসসালামু আলাইকুম Ahmed! স্বাগতম ফিরে।

   Welcome back! I see you consulted me 3 days ago about fever and body ache.

   How are you feeling now?
   - Are symptoms better?
   - Same?
   - Worse?
   - New symptoms?"
   ```

3. **If Symptoms Persist (3+ days)**
   ```
   AI: "I see your symptoms haven't improved after 3 days of treatment.

   This is exactly why I recommended tests. Let me check:

   Did you complete these tests?
   - CBC (Complete Blood Count)
   - CRP
   - Dengue NS1"
   ```

4. **If Tests Not Done**
   ```
   AI: "⚠️ IMPORTANT: Since symptoms persist after 3 days, these tests are 
   now ESSENTIAL to rule out:
   - Dengue fever
   - Typhoid
   - Bacterial infection
   - Other serious conditions

   আপনি কি আজই টেস্ট করতে পারবেন? (Can you do the tests today?)

   [Button: Book Tests Now]"
   ```

5. **If Tests Done - Upload Reports**
   ```
   AI: "Great! Please upload your test reports so I can analyze them.

   [Upload Button]"
   ```

6. **AI Analyzes Reports**
   - Parse CBC values (WBC, Platelet, Hemoglobin)
   - Detect abnormal ranges
   - Check dengue patterns (low platelet + high WBC)
   - Generate interpretation

7. **Updated Recommendations**
   ```
   Based on Test Results:

   CBC Results:
   - WBC: 12,000 (High - Normal: 4,000-11,000) ⚠️
   - Platelet: 140,000 (Borderline Low - Normal: 150,000-400,000)
   - Hemoglobin: 13.5 (Normal)

   AI Impression:
   "Your WBC count is high, suggesting bacterial infection. Platelet is 
   borderline low. This could be early dengue or bacterial infection.

   Updated Treatment:
   1. Stop previous medicines
   2. Start antibiotic: Cefixime 200mg (2x daily for 5 days)
   3. Continue Napa for fever
   4. Repeat CBC after 2 days
   5. URGENT: If platelet drops below 100,000 → Hospital admission"
   ```

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
Primary Blue: #3B82F6
Secondary Green: #10B981
Gradient: linear-gradient(135deg, #3B82F6 0%, #10B981 100%)

Backgrounds:
- Main BG: #F9FAFB
- Card BG: #FFFFFF
- Hover: #F3F4F6

Text:
- Primary: #111827
- Secondary: #6B7280
- Muted: #9CA3AF

Status Colors:
- Success: #10B981
- Warning: #F59E0B
- Danger: #EF4444
- Info: #3B82F6

Urgency Badges:
- High: #EF4444 (Red)
- Medium: #F59E0B (Orange)
- Low: #10B981 (Green)
```

### Typography
```css
Headings:
- H1: 32px, font-weight: 700
- H2: 24px, font-weight: 600
- H3: 20px, font-weight: 600

Body:
- Regular: 16px, font-weight: 400
- Small: 14px, font-weight: 400
- Caption: 12px, font-weight: 400

Font Family: 
- English: Inter, system-ui, sans-serif
- Bengali: SolaimanLipi, Kalpurush, sans-serif
```

### Component Styling
```css
Cards:
- Border radius: 16px (rounded-2xl)
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Hover shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
- Padding: 24px
- Background: white

Buttons:
- Primary: Blue gradient with white text
- Secondary: White with blue border
- Danger: Red solid
- Border radius: 12px (rounded-xl)
- Padding: 12px 24px
- Transition: all 0.3s ease

Input Fields:
- Border: 1px solid #E5E7EB
- Border radius: 8px (rounded-lg)
- Padding: 12px 16px
- Focus: Blue border + shadow

Badges:
- Border radius: 20px (rounded-full)
- Padding: 4px 12px
- Font size: 12px
- Font weight: 600
```

### Layout Structure
```
Desktop (1280px+):
- Sidebar: 256px fixed
- Main content: flex-1
- Grid: 4 columns

Tablet (768px - 1279px):
- Sidebar: Collapsible
- Main content: full width
- Grid: 2 columns

Mobile (<768px):
- Bottom navigation
- Full width content
- Grid: 1 column
- Stack all cards
```

---

## 📁 FILE STRUCTURE

```
curesphere-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboards/
│   │   │   │   ├── PatientDashboard.tsx
│   │   │   │   ├── DoctorDashboard.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── AIChat.tsx ⭐ PRIMARY AI COMPONENT
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   └── ... (40+ Shadcn components)
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Login.tsx
│   │   │   └── SignUp.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── index.ts (All TypeScript interfaces)
│   │   ├── services/
│   │   │   ├── api.ts (Axios setup)
│   │   │   └── aiService.ts (Gemini API)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── patientController.ts
│   │   │   ├── doctorController.ts
│   │   │   ├── adminController.ts
│   │   │   └── aiController.ts ⭐ AI CONSULTATION LOGIC
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Consultation.ts
│   │   │   ├── Timeline.ts
│   │   │   ├── Appointment.ts
│   │   │   ├── LabReport.ts
│   │   │   ├── Prescription.ts
│   │   │   └── Medicine.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── patientRoutes.ts
│   │   │   ├── doctorRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   └── aiRoutes.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── services/
│   │   │   ├── geminiService.ts ⭐ GEMINI API INTEGRATION
│   │   │   ├── emailService.ts
│   │   │   └── notificationService.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   └── server.ts
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🗄️ DATABASE SCHEMA (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // bcrypt hashed
  phone: String,
  role: ['patient', 'doctor', 'admin'],
  
  // Patient-specific fields
  age: Number,
  gender: ['male', 'female', 'other'],
  bloodGroup: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  medicalHistory: [String],
  allergies: [String],
  chronicConditions: [String],
  currentMedicines: [String],
  
  // Doctor-specific fields
  specialization: String,
  bmdc: String, // Bangladesh Medical & Dental Council
  licenseNumber: String,
  licenseExpiry: Date,
  clinicAddress: String,
  consultationFee: Number,
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  totalPatients: Number,
  rating: Number,
  verified: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Consultations Collection
```javascript
{
  _id: ObjectId,
  consultationId: String, // CONS_YYYYMMDD_NNN
  patientId: ObjectId,
  type: ['ai', 'doctor'],
  doctorId: ObjectId, // Only for doctor consultations
  
  // Conversation data
  symptoms: [String],
  duration: {
    value: Number,
    unit: String // days, weeks, months
  },
  daysWithSymptoms: Number, // Calculated
  severity: ['mild', 'moderate', 'severe'],
  medicinesTaken: String,
  otherConditions: [String],
  allergies: [String],
  
  // AI Analysis
  aiImpression: String,
  recommendedMedicines: [{
    brand: String,
    generic: String,
    dosage: String,
    frequency: String,
    duration: String,
    price: Number,
    quantity: Number,
    instructions: String
  }],
  recommendedTests: [{
    name: String,
    reason: String,
    price: Number,
    category: String,
    urgent: Boolean
  }],
  advice: [String],
  redFlags: [String],
  
  // Follow-up
  followUpNeeded: Boolean,
  followUpAfterDays: Number,
  nextVisitDate: Date,
  urgencyLevel: ['low', 'medium', 'high'],
  
  // Status
  status: ['active', 'resolved', 'follow_up_needed'],
  
  // Conversation history
  messages: [{
    role: ['user', 'ai', 'doctor'],
    content: String,
    timestamp: Date,
    questionType: String
  }],
  
  // Tests results (if uploaded later)
  testResults: [{
    testName: String,
    reportUrl: String,
    uploadDate: Date,
    values: Object,
    aiAnalysis: String
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Timeline Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  entries: [{
    type: ['ai_consultation', 'doctor_visit', 'lab_report', 
           'prescription', 'test_ordered', 'appointment'],
    title: String,
    description: String,
    date: Date,
    consultationId: ObjectId,
    reportId: ObjectId,
    appointmentId: ObjectId,
    metadata: Object
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  date: Date,
  time: String,
  type: ['in_person', 'video', 'phone'],
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  reason: String,
  notes: String,
  consultationFee: Number,
  paymentStatus: ['pending', 'paid', 'refunded'],
  
  // Video call details
  meetingLink: String,
  meetingId: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### LabReports Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  consultationId: ObjectId,
  reportType: String, // CBC, CRP, Dengue, etc.
  date: Date,
  fileUrl: String,
  
  // Parsed values (for AI analysis)
  values: {
    wbc: Number,
    platelet: Number,
    hemoglobin: Number,
    crp: Number,
    // ... other markers
  },
  
  // AI Analysis
  aiAnalysis: {
    abnormalMarkers: [String],
    interpretation: String,
    recommendations: [String],
    riskLevel: ['low', 'medium', 'high']
  },
  
  // Doctor review
  doctorReviewed: Boolean,
  doctorNotes: String,
  reviewedAt: Date,
  reviewedBy: ObjectId,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Prescriptions Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  consultationId: ObjectId,
  
  medicines: [{
    brand: String,
    generic: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
    instructions: String
  }],
  
  diagnosis: String,
  notes: String,
  
  // Pharmacy fulfillment
  pharmacyId: ObjectId,
  fulfillmentStatus: ['pending', 'processing', 'delivered'],
  
  // Digital signature
  doctorSignature: String,
  signedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API ENDPOINTS

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh-token     - Refresh JWT token
POST   /api/auth/forgot-password   - Send password reset email
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/me                - Get current user
```

### AI Consultation Routes ⭐
```
POST   /api/ai/consult/start       - Start new AI consultation
POST   /api/ai/consult/message     - Send message to AI
POST   /api/ai/consult/analyze     - Trigger final analysis
GET    /api/ai/consult/:id         - Get consultation details
POST   /api/ai/consult/:id/save    - Save to timeline
GET    /api/ai/consult/history     - Get user's AI consultation history
POST   /api/ai/analyze-report      - AI analyze lab report
```

### Patient Routes
```
GET    /api/patient/dashboard      - Get dashboard data
GET    /api/patient/timeline       - Get health timeline
POST   /api/patient/timeline       - Add timeline entry
GET    /api/patient/profile        - Get profile
PUT    /api/patient/profile        - Update profile
GET    /api/patient/appointments   - Get appointments
POST   /api/patient/appointments   - Book appointment
GET    /api/patient/lab-reports    - Get lab reports
POST   /api/patient/lab-reports    - Upload lab report
GET    /api/patient/prescriptions  - Get prescriptions
POST   /api/patient/medicine-order - Order medicines
```

### Doctor Routes
```
GET    /api/doctor/dashboard       - Get dashboard data
GET    /api/doctor/patients        - Get patient list
GET    /api/doctor/patients/:id    - Get patient details
GET    /api/doctor/appointments    - Get appointments
PUT    /api/doctor/appointments/:id - Update appointment status
POST   /api/doctor/prescriptions   - Create prescription
GET    /api/doctor/lab-reports     - Get pending lab reports
PUT    /api/doctor/lab-reports/:id - Review lab report
GET    /api/doctor/earnings        - Get earnings data
GET    /api/doctor/ai-insights     - Get AI-flagged cases
```

### Admin Routes
```
GET    /api/admin/dashboard        - Get analytics data
GET    /api/admin/users            - Get all users
PUT    /api/admin/users/:id        - Update user
DELETE /api/admin/users/:id        - Delete user
GET    /api/admin/doctors/pending  - Get pending doctor approvals
PUT    /api/admin/doctors/:id/verify - Approve/reject doctor
GET    /api/admin/appointments     - Get all appointments
GET    /api/admin/ai-monitoring    - Get AI safety metrics
GET    /api/admin/audit-logs       - Get audit logs
GET    /api/admin/revenue          - Get revenue data
```

---

## 🤖 GEMINI AI INTEGRATION

### Setup

```javascript
// server/src/services/geminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const consultWithAI = async (conversationHistory, symptoms, duration, severity) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an experienced Bangladeshi doctor with 15 years of practice. A patient has come to you with the following:

Symptoms: ${symptoms.join(', ')}
Duration: ${duration}
Severity: ${severity}

Previous medicines taken: ${conversationHistory.medicinesTaken || 'None'}
Chronic conditions: ${conversationHistory.otherConditions || 'None'}

Based on this information:

1. Provide a medical impression (diagnosis hypothesis)
2. Recommend PRIMARY TREATMENT medicines using Bangladeshi brands:
   - For fever: Napa, Ace (Paracetamol)
   - For cough: Tusca, Cofsil
   - For stomach: Seclo, Omepra (Omeprazole)
   - For allergies: Histacin (Cetirizine)
   - Include dosage, frequency, duration, and approximate price in BDT

3. ${parseInt(duration) >= 3 ? 'IMPORTANT: Since symptoms persist for 3+ days, recommend these tests: CBC, CRP, and if fever persists 5+ days, add Dengue NS1. Explain why each test is needed.' : 'Provide symptomatic treatment advice.'}

4. Give lifestyle advice in both English and Bengali
5. List RED FLAGS that require immediate hospital visit
6. Specify follow-up schedule

Format response as JSON matching this structure:
{
  "impression": "string",
  "medicines": [{"brand": "string", "generic": "string", "dosage": "string", "frequency": "string", "duration": "string", "price": number}],
  "tests": [{"name": "string", "reason": "string", "price": number}],
  "advice": ["string"],
  "redFlags": ["string"],
  "followUp": {"needed": boolean, "afterDays": number}
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse JSON response
  const analysis = JSON.parse(text);
  
  return analysis;
};
```

### Conversation Flow Handler

```javascript
// server/src/controllers/aiController.ts

export const handleAIMessage = async (req, res) => {
  const { consultationId, message, stage } = req.body;
  const userId = req.user.id;

  // Get or create consultation
  let consultation = await Consultation.findOne({ consultationId });
  
  if (!consultation) {
    consultation = new Consultation({
      consultationId: generateConsultationId(),
      patientId: userId,
      type: 'ai',
      status: 'active',
      messages: []
    });
  }

  // Store user message
  consultation.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
    questionType: stage
  });

  // Process based on stage
  let aiResponse;
  switch (stage) {
    case 'greeting':
      consultation.symptoms.push(message);
      aiResponse = {
        message: "I understand you have " + message + ". Let me ask a few more questions:\n\n1. Do you have any other symptoms like:\n   - Cough or cold?\n   - Headache?\n   - Nausea or vomiting?\n   - Diarrhea?\n   - Chest pain or breathing difficulty?\n\nPlease tell me all the symptoms you're experiencing.",
        nextStage: 'symptom'
      };
      break;

    case 'symptom':
      consultation.symptoms.push(...message.split(',').map(s => s.trim()));
      aiResponse = {
        message: "Thank you. How long have you been experiencing these symptoms?\n\nকতদিন ধরে এই সমস্যাগুলো হচ্ছে?\n\nPlease mention in days (e.g., 2 days, 1 week, etc.)",
        nextStage: 'duration'
      };
      break;

    case 'duration':
      const durationMatch = message.match(/(\d+)/);
      const days = durationMatch ? parseInt(durationMatch[1]) : 1;
      consultation.duration = { value: days, unit: 'days' };
      consultation.daysWithSymptoms = days;
      
      aiResponse = {
        message: "On a scale from Mild to Severe, how would you rate your symptoms?\n\nতীব্রতা কেমন?\n\nOptions:\n- Mild (হালকা) - Bearable, can do daily activities\n- Moderate (মাঝারি) - Uncomfortable, affecting daily work\n- Severe (তীব্র) - Very painful, cannot work",
        nextStage: 'severity'
      };
      break;

    case 'severity':
      consultation.severity = message.toLowerCase().includes('severe') || message.includes('তীব্র') ? 'severe' :
                             message.toLowerCase().includes('moderate') || message.includes('মাঝারি') ? 'moderate' : 'mild';
      
      aiResponse = {
        message: "Have you taken any medicines for these symptoms?\n\nএই সমস্যার জন্য কোন ঔষধ খেয়েছেন?\n\nIf yes, please mention:\n- Medicine names\n- When you took them\n- Did they help?",
        nextStage: 'medicine_history'
      };
      break;

    case 'medicine_history':
      consultation.medicinesTaken = message;
      
      aiResponse = {
        message: "Do you have any of these conditions?\n\n- Diabetes (ডায়াবেটিস)\n- High blood pressure (উচ্চ রক্তচাপ)\n- Heart disease (হৃদরোগ)\n- Kidney disease (কিডনি রোগ)\n- Asthma (হাঁপানি)\n- Pregnancy (গর্ভবতী)\n- Any known allergies (এলার্জি)\n\nThis helps me suggest safer medicines.",
        nextStage: 'other_conditions'
      };
      break;

    case 'other_conditions':
      consultation.otherConditions = message.split(',').map(s => s.trim());
      
      // Trigger AI analysis
      const analysis = await consultWithAI(
        consultation.messages,
        consultation.symptoms,
        `${consultation.daysWithSymptoms} days`,
        consultation.severity
      );
      
      // Store analysis
      consultation.aiImpression = analysis.impression;
      consultation.recommendedMedicines = analysis.medicines;
      consultation.recommendedTests = analysis.tests;
      consultation.advice = analysis.advice;
      consultation.redFlags = analysis.redFlags;
      consultation.followUpNeeded = analysis.followUp.needed;
      consultation.followUpAfterDays = analysis.followUp.afterDays;
      consultation.nextVisitDate = new Date(Date.now() + analysis.followUp.afterDays * 24 * 60 * 60 * 1000);
      consultation.urgencyLevel = consultation.severity === 'severe' || consultation.daysWithSymptoms >= 7 ? 'high' :
                                  consultation.severity === 'moderate' || consultation.daysWithSymptoms >= 3 ? 'medium' : 'low';
      consultation.status = 'resolved';
      
      // Format response
      aiResponse = {
        message: formatAnalysisMessage(analysis),
        nextStage: 'complete',
        analysis: analysis
      };
      break;
  }

  // Store AI response
  consultation.messages.push({
    role: 'ai',
    content: aiResponse.message,
    timestamp: new Date(),
    questionType: aiResponse.nextStage
  });

  await consultation.save();

  res.json({
    success: true,
    consultationId: consultation.consultationId,
    response: aiResponse
  });
};

// Helper function
const formatAnalysisMessage = (analysis) => {
  return `
📋 **পরামর্শ সংক্ষেপ / CONSULTATION SUMMARY**

**অবস্থা বিশ্লেষণ / Assessment:**
${analysis.impression}

---

💊 **প্রস্তাবিত ঔষধ / RECOMMENDED MEDICINES:**

${analysis.medicines.map((med, idx) => `
${idx + 1}. **${med.brand}** (${med.generic})
   - Dosage: ${med.dosage}
   - Frequency: ${med.frequency}
   - Duration: ${med.duration}
   - Price: ৳${med.price}
`).join('\n')}

${analysis.tests.length > 0 ? `
---

🔬 **RECOMMENDED TESTS:**

Since you've had symptoms for 3+ days, I recommend these tests:

${analysis.tests.map((test, idx) => `
${idx + 1}. **${test.name}** - ৳${test.price}
   Reason: ${test.reason}
`).join('\n')}

📍 You can book these tests from Diagnostic Centers page
` : ''}

---

💡 **HEALTH ADVICE:**

${analysis.advice.map((adv, idx) => `${idx + 1}. ${adv}`).join('\n')}

${analysis.redFlags.length > 0 ? `
---

⚠️ **VISIT HOSPITAL IMMEDIATELY IF:**

${analysis.redFlags.map(flag => `- ${flag}`).join('\n')}
` : ''}

---

📅 **FOLLOW-UP:**

${analysis.followUp.needed ? `
- If no improvement in ${analysis.followUp.afterDays} days → Complete the recommended tests
- If symptoms worsen → Consult a doctor immediately
- If symptoms improve → Continue medicines for full duration
- Return for follow-up in ${analysis.followUp.afterDays} days ${analysis.tests.length > 0 ? 'with test reports' : ''}
` : 'Continue treatment as advised. Consult if symptoms persist.'}

---

[Save to Health Timeline] [Download PDF Report]
`;
};
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Frontend Setup (Week 1)
- [ ] Initialize React + TypeScript project with Vite
- [ ] Install dependencies (Tailwind, Shadcn, Lucide, Recharts)
- [ ] Set up Shadcn UI components (40+ components)
- [ ] Create type definitions (types/index.ts)
- [ ] Build authentication (Login, SignUp, AuthContext)
- [ ] Build navigation (Header, Sidebar, Footer)
- [ ] Build Patient Dashboard
  - [ ] Health Overview Cards
  - [ ] Health Timeline
  - [ ] AI Chat Component ⭐
  - [ ] Lab Reports section
  - [ ] Appointments section
- [ ] Build Doctor Dashboard
  - [ ] KPI cards
  - [ ] Patient management
  - [ ] Today's schedule
  - [ ] E-prescription creator
  - [ ] Earnings tracker
- [ ] Build Admin Dashboard
  - [ ] Analytics with charts
  - [ ] User management
  - [ ] Doctor verification
  - [ ] AI monitoring panel
- [ ] Responsive design testing

### Phase 2: Backend Setup (Week 2)
- [ ] Initialize Node.js + Express project
- [ ] Set up MongoDB connection
- [ ] Create database models (User, Consultation, Timeline, etc.)
- [ ] Implement JWT authentication
- [ ] Create API routes structure
- [ ] Implement authentication endpoints
- [ ] Implement patient endpoints
- [ ] Implement doctor endpoints
- [ ] Implement admin endpoints
- [ ] Add error handling middleware
- [ ] Add validation middleware
- [ ] Add CORS configuration

### Phase 3: AI Integration (Week 2-3)
- [ ] Get Gemini API key from google.ai
- [ ] Install @google/generative-ai package
- [ ] Create geminiService.ts
- [ ] Implement AI consultation logic
  - [ ] Multi-turn conversation handler
  - [ ] Symptom analysis logic
  - [ ] Medicine recommendation logic
  - [ ] **3-day rule for test recommendations** ⭐
  - [ ] Red flag detection
  - [ ] Follow-up scheduling
- [ ] Create AI consultation endpoints
- [ ] Implement lab report AI analysis
- [ ] Test AI responses with various symptoms
- [ ] Fine-tune prompts for accuracy

### Phase 4: Frontend-Backend Integration (Week 3)
- [ ] Create API service layer (services/api.ts)
- [ ] Connect authentication flow
- [ ] Connect Patient Dashboard to APIs
  - [ ] Fetch timeline data
  - [ ] Connect AI chat to backend
  - [ ] Upload lab reports
  - [ ] Book appointments
- [ ] Connect Doctor Dashboard to APIs
  - [ ] Fetch patient list
  - [ ] Manage appointments
  - [ ] Create prescriptions
- [ ] Connect Admin Dashboard to APIs
  - [ ] Fetch analytics data
  - [ ] Manage users
  - [ ] Monitor AI safety
- [ ] Implement real-time notifications (optional)
- [ ] Test all user flows

### Phase 5: Testing & Polish (Week 4)
- [ ] Test all user roles
- [ ] Test AI consultation flows
- [ ] Test 3-day follow-up logic
- [ ] Test lab report upload & analysis
- [ ] Test appointments booking
- [ ] Test medicine recommendations
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Add loading states
- [ ] Add error messages
- [ ] Polish UI/UX

### Phase 6: Deployment
- [ ] Build frontend (npm run build)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Set up MongoDB Atlas
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Test production environment
- [ ] Set up monitoring (Sentry)
- [ ] Set up analytics (Google Analytics)

---

## 🎯 CRITICAL FEATURES SUMMARY

### ⭐ PRIMARY FEATURE: AI Doctor Consultation

**Must-Have Behaviors:**
1. ✅ Asks systematic questions like real doctor
2. ✅ Speaks bilingual (English + Bengali)
3. ✅ Collects: Symptoms → Duration → Severity → Medicine History → Other Conditions
4. ✅ Provides medical impression
5. ✅ Recommends Bangladeshi medicine brands with prices
6. ✅ **Implements 3-day rule: If symptoms ≥3 days → Suggest tests (CBC, CRP, Dengue)**
7. ✅ Generates lifestyle advice
8. ✅ Detects red flags
9. ✅ Schedules follow-up
10. ✅ Saves to health timeline
11. ✅ Downloadable PDF report

### 🔬 3-Day Rule Logic (CRITICAL)

```javascript
if (daysWithSymptoms >= 3) {
  recommendTests([
    'CBC (Complete Blood Count)',
    'CRP (C-Reactive Protein)'
  ]);
  
  if (daysWithSymptoms >= 5 && hasFever) {
    addTests(['Dengue NS1', 'Widal Test']);
  }
  
  urgencyLevel = 'medium';
  followUpAfterDays = 2;
}
```

### 🏥 Doctor Chamber Behavior

**What a real doctor does:**
1. Greets patient warmly
2. Asks "কি সমস্যা?" (What's the problem?)
3. Follows up with specific questions
4. Checks duration systematically
5. Asks about previous treatments
6. Checks chronic conditions & allergies
7. Examines (in AI: analyzes patterns)
8. Provides diagnosis hypothesis
9. Writes prescription (local brands)
10. If problem persists 3+ days → Orders tests
11. Schedules follow-up
12. Gives lifestyle advice
13. Warns about danger signs

**Your AI implements ALL of this! ✅**

---

## 📊 SUCCESS METRICS

**AI Performance:**
- Consultation completion rate: > 85%
- User satisfaction: > 4.0/5.0
- Diagnostic accuracy: > 80% (compared to real doctor)
- False positive rate: < 5%
- Safety compliance: > 99%

**Platform Metrics:**
- Daily active users: Track growth
- AI consultations per day: Target 100+
- Doctor appointments booked: Target 50+/day
- Lab tests ordered: Track conversion from recommendations
- Medicine orders: Track prescription fulfillment

---

## 🎓 LEARNING RESOURCES

**For AI Integration:**
- Google Generative AI Docs: https://ai.google.dev/docs
- Gemini API Quickstart: https://ai.google.dev/tutorials/quickstart
- Prompt Engineering Guide: https://www.promptingguide.ai/

**For Medical Knowledge:**
- WHO Bangladesh: https://www.who.int/bangladesh
- DGHS Bangladesh: http://www.dghs.gov.bd/
- Bangladesh Medical Journals

**For Development:**
- React Docs: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- MongoDB: https://www.mongodb.com/docs/
- Express.js: https://expressjs.com/

---

## ⚠️ LEGAL & ETHICAL CONSIDERATIONS

1. **Disclaimer:**
   - "This AI is for preliminary consultation only"
   - "Not a replacement for professional medical advice"
   - "Always consult a licensed doctor for serious conditions"

2. **Data Privacy:**
   - Encrypt all health data
   - HIPAA-compliant storage
   - User consent for data usage
   - Right to delete data

3. **AI Safety:**
   - Never diagnose definitively
   - Always suggest doctor visit for serious symptoms
   - Flag high-risk cases
   - Monitor for hallucinations

4. **Medical Regulations:**
   - Register with Bangladesh health authorities
   - Partner with licensed doctors
   - Verify doctor credentials (BMDC)
   - Comply with telemedicine regulations

---

## 🎯 COPY-PASTE PROMPTS FOR OTHER TOOLS

### For Figma AI:
```
Design a healthcare dashboard with 3 user roles (Patient, Doctor, Admin). Use blue-green gradient color scheme. Include:

1. Patient Dashboard: Health timeline, AI chat interface, appointment cards, lab reports section
2. Doctor Dashboard: Patient list, today's schedule, earnings cards, AI insights panel
3. Admin Dashboard: Analytics charts, doctor approval workflow, AI monitoring panel

Style: Modern, rounded cards, soft shadows, responsive grid layout
```

### For V0/Bolt.new:
```
Build a React healthcare platform with Patient/Doctor/Admin dashboards. Must have AI chat that asks medical questions systematically (symptoms → duration → severity → history → analysis). If symptoms persist 3+ days, recommend CBC/CRP tests. Use TypeScript, Tailwind, Shadcn UI.
```

### For Cursor/Replit:
```
Full-stack healthcare app: React frontend + Express backend + MongoDB + Gemini AI. 

AI doctor flow:
1. Ask symptoms
2. Ask duration
3. Ask severity
4. Analyze and recommend medicines
5. IF duration >= 3 days THEN recommend tests (CBC, CRP, Dengue)
6. Save to health timeline

Use Bangladeshi medicine brands (Napa, Ace, Seclo) with BDT prices.
```

---

## ✅ YOU'RE READY TO BUILD!

**This prompt contains:**
✅ Complete system architecture
✅ All 3 dashboards specified
✅ AI doctor behavior detailed
✅ 3-day rule logic explained
✅ Database schema
✅ API endpoints
✅ Design system
✅ File structure
✅ Implementation checklist
✅ Code examples

**Copy-paste this into any AI tool and get a working prototype!**

**Estimated Development Time:**
- AI prototype: 1-2 weeks
- Full MVP: 3-4 weeks
- Production-ready: 6-8 weeks

---

## 🚀 START BUILDING NOW!

1. Copy this entire prompt
2. Paste into Replit Agent / Bolt.new / Cursor
3. Watch it build your healthcare platform
4. Deploy and help millions in Bangladesh! 🇧🇩

**Good luck! 🎉**

---

*CureSphere AI - Intelligent Healthcare for Bangladesh*
*Developed with ❤️ for better healthcare access*
