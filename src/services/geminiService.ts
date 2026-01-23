/**
 * Gemini AI Service
 * Handles all AI consultation requests using Google Generative AI API
 */

/**
 * Simple function to call Gemini API and get text response
 * Used for multi-turn conversations in the symptom analyzer
 */
export async function callGeminiAPI(prompt: string): Promise<string> {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  console.log('🔍 [Frontend] Gemini API Call Started');
  console.log('📝 Prompt:', prompt.substring(0, 100) + '...');
  console.log('🔗 Backend URL:', base);

  try {
    const url = `${base}/api/gemini/generate`;
    console.log('📤 Posting to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 2000 },
      }),
    });

    console.log('📡 Response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error body:', errorText);
      if (response.status === 429) {
        throw new Error('API quota exceeded. Please wait a few minutes or check your plan.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication error. Backend GEMINI_API_KEY may be missing or invalid.');
      }
      throw new Error(`API ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('❌ No content in response:', data);
      throw new Error('Empty response');
    }

    console.log('✅ Success:', content.substring(0, 80) + '...');
    return content;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Call Gemini API with rich parts (text + inline_data for images)
 */
export async function callGeminiParts(parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }>): Promise<string> {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  console.log('🔍 Gemini Parts API Call Started');
  console.log('Using backend for Gemini calls');

  // API key is managed by backend

  const url = `${base}/api/gemini/generate`;
  console.log('🌐 Calling Backend (parts) endpoint...');

  const body = {
    contents: [
      {
        parts,
      },
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2000,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  console.log('📡 Response status:', response.status, response.statusText);
  if (!response.ok) {
    const err = await response.text();
    if (response.status === 429) {
      throw new Error('API quota exceeded. Please wait a few minutes or try again later.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication error. Backend GEMINI_API_KEY may be missing or invalid.');
    }
    throw new Error(`Gemini API error ${response.status}: ${err.substring(0, 200)}`);
  }
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('Gemini returned empty response');
  return content;
}

interface ConsultationInput {
  symptoms: string[];
  duration: number; // in days
  severity: 'mild' | 'moderate' | 'severe';
  medicinesTaken?: string;
  otherConditions?: string[];
  allergies?: string[];
  userName?: string;
}

interface Medicine {
  brand: string;
  generic: string;
  dosage: string;
  frequency: string;
  duration: string;
  price: number;
  quantity: number;
  instructions?: string;
}

interface Test {
  name: string;
  reason: string;
  price: number;
  category: string;
  urgent?: boolean;
}

interface ConsultationResult {
  impression: string;
  medicines: Medicine[];
  tests: Test[];
  advice: string[];
  redFlags: string[];
  followUp: {
    needed: boolean;
    afterDays: number;
    reason: string;
  };
  urgencyLevel: 'low' | 'medium' | 'high';
  totalEstimatedCost: number;
}

/**
 * Call Gemini API for symptom analysis and treatment recommendations
 */
export async function analyzeSymptoms(
  input: ConsultationInput
): Promise<ConsultationResult> {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  console.log('🔍 Gemini API Call Started');
  console.log('Symptoms:', input.symptoms);
  console.log('Duration:', input.duration);

  try {
    const prompt = buildConsultationPrompt(input);
    console.log('📝 Prompt prepared, length:', prompt.length);

    const url = `${base}/api/gemini/generate`;
    console.log('🌐 Calling Backend Gemini proxy...');
    console.log('Backend URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 2000 },
      }),
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Gemini API error:', response.status, response.statusText);
      console.error('Error details:', errorData);
      
      // Show user-friendly error
      throw new Error(`Gemini API returned ${response.status}: ${errorData.substring(0, 200)}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.warn('⚠️ No content in Gemini response, using fallback');
      return getFallbackAnalysis(input);
    }

    console.log('📄 Gemini response received:', content.substring(0, 300));

    // Return natural response directly
    const result: ConsultationResult = {
      impression: content,
      medicines: [],
      tests: [],
      advice: [],
      redFlags: [],
      followUp: {
        needed: input.duration >= 3,
        afterDays: input.duration >= 3 ? 2 : 3,
        reason: 'Follow-up consultation',
      },
      urgencyLevel: input.duration >= 7 ? 'high' : input.duration >= 3 ? 'medium' : 'low',
      totalEstimatedCost: 0,
    };

    console.log('✅ Returning Gemini response directly');
    return result;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    return getFallbackAnalysis(input);
  }
}

/**
 * Build the consultation prompt for Gemini
 */
function buildConsultationPrompt(input: ConsultationInput): string {
  return `You are an experienced Bangladeshi doctor. A patient has the following symptoms:

**Patient Information:**
- Symptoms: ${input.symptoms.join(', ')}
- Duration: ${input.duration} days
- Severity: ${input.severity}
- Previous medicines: ${input.medicinesTaken || 'None'}
- Other conditions: ${input.otherConditions?.join(', ') || 'None'}
- Allergies: ${input.allergies?.join(', ') || 'None'}

**Your task:**
Provide a medical consultation in this EXACT format:

**MEDICAL IMPRESSION:**
[Write 2-3 sentences about what condition the patient likely has]

**RECOMMENDED MEDICINES (Bangladeshi Brands):**
${input.duration >= 1 ? '• Napa (Paracetamol) 500mg - Take 1 tablet 3 times daily after meals for 5 days - ৳30\n• ' : ''}[List 2-3 medicines with: Brand name, Generic name, dosage, frequency, duration, price in BDT]

**DIAGNOSTIC TESTS:**
${input.duration >= 3 ? '• CBC (Complete Blood Count) - To check infection markers - ৳400\n• CRP (C-Reactive Protein) - To detect inflammation - ৳600\n' : ''}${input.duration >= 5 && input.symptoms.join(' ').toLowerCase().includes('fever') ? '• Dengue NS1 Antigen - Rule out dengue (URGENT) - ৳800\n' : ''}[If symptoms < 3 days, write "No tests needed yet. Monitor symptoms." If 3+ days, recommend CBC & CRP]

**HEALTH ADVICE:**
• Rest adequately (7-8 hours sleep)
• Drink plenty of water (8-10 glasses daily)
• [Add 2-3 specific advice based on symptoms]

**RED FLAGS - SEEK IMMEDIATE CARE IF:**
• Fever > 103°F
• Severe breathing difficulty
• [Add 2-3 specific warning signs]

**FOLLOW-UP:**
${input.duration >= 3 ? 'Return in 2 days if symptoms persist or worsen immediately.' : 'Return in 3 days if symptoms persist or worsen immediately.'}

**IMPORTANT RULES:**
1. Use ONLY Bangladeshi medicine brands: Napa, Tusca, Seclo, Histacin, Brufen, Ace, Cofsil
2. If duration >= 3 days → MUST recommend CBC + CRP tests
3. If fever + duration >= 5 days → MUST add Dengue NS1 test marked as URGENT
4. Price all medicines and tests in BDT (৳)

Write naturally like a real doctor, addressing the specific symptoms mentioned.`;
}

/**
 * Fallback analysis if API fails
 */
function getFallbackAnalysis(input: ConsultationInput): ConsultationResult {
  console.log('⚠️ Using FALLBACK analysis (Gemini API failed)');
  
  const symptomsText = input.symptoms.join(' ').toLowerCase();
  const hasFever = symptomsText.includes('fever');
  const hasCough = symptomsText.includes('cough');

  const medicines: Medicine[] = [];
  const tests: Test[] = [];

  // Add fever medicine
  if (hasFever) {
    medicines.push({
      brand: 'Napa',
      generic: 'Paracetamol',
      dosage: '500mg',
      frequency: '3 times daily (after meals)',
      duration: '5 days',
      price: 30,
      quantity: 15,
      instructions: 'Take with food to avoid stomach upset',
    });
  }

  // Add cough medicine
  if (hasCough) {
    medicines.push({
      brand: 'Tusca',
      generic: 'Dextromethorphan',
      dosage: '10mg',
      frequency: '2 times daily',
      duration: '3 days',
      price: 80,
      quantity: 10,
    });
  }

  // Add stomach protection if severe
  if (input.severity === 'severe') {
    medicines.push({
      brand: 'Seclo',
      generic: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily (before breakfast)',
      duration: '7 days',
      price: 120,
      quantity: 7,
    });
  }

  // 3-DAY RULE: If symptoms >= 3 days, recommend tests
  if (input.duration >= 3) {
    tests.push(
      {
        name: 'CBC (Complete Blood Count)',
        reason: 'Check infection markers (WBC count, Platelet count)',
        price: 400,
        category: 'Blood Test',
      },
      {
        name: 'CRP (C-Reactive Protein)',
        reason: 'Detect inflammation and infection level',
        price: 600,
        category: 'Blood Test',
      }
    );

    // If fever for 5+ days, add dengue test
    if (input.duration >= 5 && hasFever) {
      tests.push({
        name: 'Dengue NS1 Antigen',
        reason: 'Rule out dengue fever',
        price: 800,
        category: 'Blood Test',
        urgent: true,
      });
    }
  }

  return {
    impression: generateImpressionFallback(input),
    medicines,
    tests,
    advice: [
      'পর্যাপ্ত বিশ্রাম নিন (Rest adequately - 7-8 hours sleep)',
      'প্রচুর পানি পান করুন (Drink 8-10 glasses of water daily)',
      'হালকা গরম খাবার খান (Eat warm, light meals)',
      'ভিটামিন সি সমৃদ্ধ ফল খান (Eat vitamin C rich fruits)',
    ],
    redFlags: [
      'Fever > 103°F (39.4°C)',
      'Severe breathing difficulty (শ্বাসকষ্ট)',
      'Chest pain (বুকে ব্যথা)',
      'Vomiting blood (রক্ত বমি)',
    ],
    followUp: {
      needed: input.duration >= 3 || input.severity !== 'mild',
      afterDays: input.duration >= 3 ? 2 : 3,
      reason:
        input.duration >= 3
          ? 'Symptoms persist for 3+ days, tests recommended'
          : 'Monitor symptom progression',
    },
    urgencyLevel: calculateUrgency(input),
    totalEstimatedCost: calculateTotalCost(medicines, tests),
  };
}

/**
 * Helper: Generate impression for fallback
 */
function generateImpressionFallback(input: ConsultationInput): string {
  const hasFever = input.symptoms.some((s) =>
    s.toLowerCase().includes('fever')
  );
  const hasCough = input.symptoms.some((s) =>
    s.toLowerCase().includes('cough')
  );

  if (
    hasFever &&
    input.duration < 3
  ) {
    return `Based on your symptoms (fever with ${input.symptoms.slice(1).join(', ')}), you may have viral fever or early infection. This is common and usually resolves with rest and supportive care.`;
  } else if (hasFever && input.duration >= 3) {
    return `You have had fever for ${input.duration} days with ${input.symptoms.join(', ')}, which requires further investigation. This could be bacterial infection, dengue, or other conditions that need medical tests.`;
  } else if (hasCough) {
    return `Based on your cough and other symptoms, you may have upper respiratory tract infection. Proper rest, hydration, and treatment are important.`;
  } else {
    return `Based on your symptoms (${input.symptoms.join(', ')}), you may need symptomatic treatment. Please follow the recommendations below.`;
  }
}

/**
 * Helper: Calculate urgency level
 */
function calculateUrgency(
  input: ConsultationInput
): 'low' | 'medium' | 'high' {
  if (input.severity === 'severe') return 'high';
  if (input.duration >= 7) return 'high';
  if (input.severity === 'moderate' || input.duration >= 3) return 'medium';
  return 'low';
}

/**
 * Helper: Calculate total estimated cost
 */
function calculateTotalCost(medicines: Medicine[], tests: Test[]): number {
  const medicinesTotal = medicines.reduce((sum, m) => sum + m.price, 0);
  const testsTotal = tests.reduce((sum, t) => sum + t.price, 0);
  return medicinesTotal + testsTotal;
}

export default {
  analyzeSymptoms,
};
