# 🚀 QUICK START - TEST THE AI DOCTOR WITH GEMINI API

**Your app is ready at:** http://localhost:3001

---

## ✅ Setup Complete

**What's configured:**
- ✅ Gemini API Key: `YOUR_GEMINI_API_KEY`
- ✅ Environment file: `.env` (auto-configured)
- ✅ Gemini Service: `src/services/geminiService.ts`
- ✅ AI Chat Integration: `AIChat.tsx` (updated)
- ✅ Vite Server: Running on **localhost:3001**

---

## 🎯 Test Scenario 1: FEVER (3+ Days) - SEE THE 3-DAY RULE IN ACTION

**This is the PRIMARY feature you requested!**

### Steps:
```
1. Open http://localhost:3001
2. Click "Sign Up"
3. Choose Role: PATIENT
4. Fill in profile (any name, age 25)
5. Create password and click "Sign Up"
6. Login with credentials
7. Click "Patient Dashboard"
8. Click "Chat with AI Doctor" button
```

### Start Conversation:
```
AI: "আসসালামু আলাইকুম! How can I help you today?"

YOU: "I have fever and body ache"

AI: (Asks follow-up) "What other symptoms? Cough? Headache?"

YOU: "Yes, I have a cough and headache too"

AI: "How long have you been experiencing these symptoms?
     কতদিন ধরে এই সমস্যাগুলো হচ্ছে?"

YOU: "3 days"  ← THIS TRIGGERS THE 3-DAY RULE! ⭐

AI: "On a scale from Mild to Severe..."

YOU: "Moderate"

AI: "Have you taken any medicines?"

YOU: "I took Napa yesterday"

AI: "Do you have any chronic conditions?"

YOU: "No"

AI: (Shows loading) "AI is analyzing your symptoms..."
     (Calls REAL Gemini API)

RESULT: ✅ Shows:
- Medical Impression
- Bangladeshi medicines (Napa, Tusca, Seclo with BDT prices)
- ✅ TEST RECOMMENDATIONS (CBC, CRP, Dengue NS1)
- Lifestyle advice
- Red flags
- Follow-up schedule in 2 days
```

---

## 🧪 Test Scenario 2: EXTENDED FEVER (5+ Days)

**Triggers advanced recommendations**

### Just change the answer:
```
Instead of "3 days" → Say "5 days"

RESULT: ✅ More urgent!
- All tests from 3-day rule
- ✅ PLUS Dengue NS1 added (marked URGENT)
- Urgency Level: HIGH
- Follow-up: 2 days
```

---

## 💊 Test Scenario 3: Check Medicine Brands

**Gemini now recommends Bangladeshi brands**

Say: "I have cold and cough"
Answer: "2 days"
Answer: "Mild"

RESULT: ✅ Medicines like:
- Napa (Paracetamol) - ৳30
- Tusca (Cough syrup) - ৳80
- Histacin (Allergy) - ৳50

**NOT international brands!**

---

## 🚨 Test Scenario 4: Red Flags

Say: "I have severe chest pain and fever"
Answer: "1 day"
Answer: "Severe"

RESULT: ✅ Shows Red Flags:
- ⚠️ Fever > 103°F → Hospital
- ⚠️ Chest pain → Hospital immediately
- Urgency Level: HIGH

---

## 📊 What Happens Behind the Scenes

```
AIChat Component
    ↓
Collects: Symptoms, Duration, Severity, History, Conditions
    ↓
Calls: analyzeSymptoms() from geminiService.ts
    ↓
Gemini Service builds medical context prompt
    ↓
Sends to Google Generative AI API
    ↓
Gemini returns:
- Medical impression
- Bangladeshi medicine recommendations
- Test recommendations (3-day rule applied!)
- Lifestyle advice
- Red flags
- Follow-up schedule
    ↓
AI Chat displays formatted response
    ↓
Patient can:
- Save to Health Timeline
- Download PDF Report
- Schedule Follow-up
```

---

## 🔄 Complete API Flow

### Frontend (Browser):
```typescript
// AIChat.tsx
const analysis = await analyzeSymptoms({
  symptoms: ['fever', 'body ache'],
  duration: 3,
  severity: 'moderate',
  userName: 'Ahmed Khan'
});

// geminiService.ts
fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7 }
  })
})

// Gemini API (Google)
// Analyzes medical context
// Returns structured JSON

// Response comes back to AIChat
// Formats and displays to user
```

---

## ⚡ Key Features Working

| Feature | Status | How to See |
|---------|--------|-----------|
| **AI asks systematic questions** | ✅ | Chat flow in AIChat |
| **Bilingual support** | ✅ | English/Bengali toggle |
| **7-phase conversation** | ✅ | Greeting → ... → Analysis |
| **Real Gemini API** | ✅ | "AI is thinking..." shows API call |
| **3-Day Rule** | ✅ | Say "3 days" → Tests recommended |
| **Test Recommendations** | ✅ | CBC, CRP, Dengue appear at 3+ days |
| **Medicine Brands** | ✅ | Only Bangladeshi brands (Napa, Tusca, etc.) |
| **Red Flags** | ✅ | Hospital warnings for severe symptoms |
| **Follow-up Scheduling** | ✅ | Auto-scheduled 2-3 days |
| **PDF Download** | ✅ | Download button at bottom |
| **Save to Timeline** | ✅ | Creates health history entry |

---

## 🐛 Troubleshooting

### Issue: "AI is thinking..." appears forever
**Solution:** 
- Check internet connection
- Open DevTools (F12) → Network tab
- Look for request to `generativelanguage.googleapis.com`
- Check for CORS or timeout errors
- Fallback will kick in after 30 seconds

### Issue: API Key error
**Check:** Is `.env` file present?
```bash
cat .env
# Should show: VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Issue: Tests not showing at 3 days
**Debug:**
1. Open DevTools Console
2. Check for errors
3. Should see: "Calling Gemini for: ['fever'], 3"
4. Should see response JSON with tests array

### Issue: Vite not reloading
**Solution:**
```bash
# In terminal
r + enter
# (restart server manually)
```

---

## 📝 Files You Can Check

### 1. Check Gemini Service Implementation
```bash
cat src/services/geminiService.ts
# See the 3-day rule logic at lines 200-230
```

### 2. Check AIChat Integration
```bash
grep -n "analyzeSymptoms" src/components/dashboards/AIChat.tsx
# Should be imported and used in performAnalysis()
```

### 3. Check .env
```bash
cat .env
# Should have Gemini API key
```

### 4. Check API Service
```bash
cat src/services/api.ts
# All backend endpoints ready
```

---

## 🎓 Test Cases for Validation

### TC1: Mild Symptoms (< 3 days)
```
Symptoms: Mild cough
Duration: 1 day
Severity: Mild

Expected: NO tests recommended
```

### TC2: Moderate Symptoms (3+ days) ⭐
```
Symptoms: Fever, body ache
Duration: 3 days
Severity: Moderate

Expected: ✅ CBC + CRP tests
```

### TC3: Severe Symptoms (5+ days)
```
Symptoms: High fever, severe cough
Duration: 5 days
Severity: Severe

Expected: ✅ CBC + CRP + Dengue NS1
         ✅ Urgency: HIGH
         ✅ Follow-up: 2 days
```

### TC4: Bangladeshi Medicines
```
Any symptom with fever duration 3+ days

Expected: ✅ Only Bangladeshi brands:
- Napa, Ace (Paracetamol)
- Tusca, Cofsil (Cough)
- Seclo, Omepra (Stomach)
- Histacin (Allergy)
- Brufen (Pain)
```

### TC5: Red Flags
```
Symptoms: Chest pain, high fever
Duration: 1 day
Severity: Severe

Expected: ✅ Red Flags:
- "Fever > 103°F → Visit hospital"
- "Chest pain → Hospital immediately"
```

---

## 📊 Expected Output

When you say "Fever for 3 days, moderate severity":

```
📋 CONSULTATION SUMMARY

Assessment:
You have had fever for 3 days, which requires further 
investigation. This could be bacterial infection, dengue, 
or other conditions that need medical tests.

Urgency Level: MEDIUM 🟡

---

💊 RECOMMENDED MEDICINES:

1. Napa (Paracetamol)
   - 500mg, 3 times daily
   - 5 days duration
   - ৳30 (15 tablets)

2. Tusca (Dextromethorphan)
   - 10mg, 2 times daily
   - 3 days duration
   - ৳80 (10 tablets)

3. Seclo (Omeprazole)
   - 20mg, once daily
   - 7 days duration
   - ৳120 (7 capsules)

---

🔬 RECOMMENDED TESTS:

Since you've had symptoms for 3+ days, I recommend:

1. CBC (Complete Blood Count) - ৳400
   Reason: Check infection markers

2. CRP (C-Reactive Protein) - ৳600
   Reason: Detect inflammation level

3. Dengue NS1 Antigen - ৳800
   Reason: Rule out dengue fever

---

💡 HEALTH ADVICE:

1. Rest adequately - 7-8 hours sleep
2. Drink 8-10 glasses of water daily
3. Eat warm, light meals
4. Avoid cold drinks and ice cream

---

⚠️ VISIT HOSPITAL IMMEDIATELY IF:

- Fever > 103°F (39.4°C)
- Severe breathing difficulty
- Chest pain
- Vomiting blood

---

📅 FOLLOW-UP:

- If no improvement in 2 days → Complete the recommended tests
- If symptoms worsen → Consult a doctor immediately
- Return for follow-up in 2 days with test reports

---

[Save to Health Timeline] [Download PDF Report]
```

---

## 🎉 SUCCESS CRITERIA

You'll know everything is working when:

✅ **AI asks systematic questions**
✅ **Shows "AI is thinking..."** when calling Gemini API
✅ **Returns medicines with Bangladeshi brands**
✅ **At 3 days duration → Recommends CBC + CRP**
✅ **At 5 days duration → Adds Dengue NS1**
✅ **Shows red flags for severe symptoms**
✅ **Schedules follow-up automatically**
✅ **Can download PDF report**
✅ **Can save to health timeline**

---

## 🚀 Next Steps

1. **Test all 5 scenarios above** (5 minutes)
2. **Verify 3-day rule works** (1 minute)
3. **Check Bangladeshi medicines** (1 minute)
4. **Try downloading PDF** (1 minute)

**Total: 10 minutes to verify everything!**

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| **App URL** | http://localhost:3001 |
| **Gemini API Key** | In `.env` file |
| **Gemini Service** | `src/services/geminiService.ts` |
| **AI Chat Component** | `src/components/dashboards/AIChat.tsx` |
| **API Service** | `src/services/api.ts` |
| **Gemini Docs** | https://ai.google.dev/docs |
| **3-Day Rule Logic** | Line 200-230 in geminiService.ts |

---

## ✨ You're All Set!

Your healthcare AI platform is now **LIVE** with **REAL Gemini API**!

**Try it now:** http://localhost:3001

**Test the 3-day rule:** Describe fever → Say "3 days" → See tests recommended!

---

*CureSphere AI - Powered by Google Generative AI*
*Intelligent Healthcare for Bangladesh* 🇧🇩
