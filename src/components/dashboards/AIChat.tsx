import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Clock,
  AlertTriangle,
  Pill,
  FileText,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  MessageSquare
} from 'lucide-react';
import type { ChatMessage, Medicine, Test } from '../../types';
import { analyzeSymptoms } from '../../services/geminiService';

interface AIChatProps {
  userId: string;
  userName: string;
  userMedicalHistory?: string;
  userAllergies?: string;
  onConsultationComplete?: (data: any) => void;
}

export function AIChat({
  userId,
  userName,
  userMedicalHistory,
  userAllergies,
  onConsultationComplete
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [consultationComplete, setConsultationComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation state
  const [conversationState, setConversationState] = useState({
    symptoms: [] as string[],
    duration: '',
    severity: '',
    medicinesTaken: '',
    otherConditions: '',
    stage: 'greeting' // greeting, symptom, duration, severity, medicine_history, other_conditions, analysis
  });

  useEffect(() => {
    // Initial greeting
    addAIMessage(
      `আসসালামু আলাইকুম ${userName.split(' ')[0]}! আমি CureSphere AI, আপনার স্বাস্থ্য সহায়ক। 

Hello! I'm your AI health assistant. I'll ask you a few questions to understand your condition better. How can I help you today?`,
      'greeting'
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAIMessage = (message: string, questionType?: string) => {
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      message,
      timestamp: new Date().toISOString(),
      questionType: questionType as any
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const addUserMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const getAIResponse = async (userInput: string, stage: string) => {
    setIsAITyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiResponse = '';
    let nextStage = stage;
    let updatedState = { ...conversationState };

    switch (stage) {
      case 'greeting':
        // Extract symptoms from user input
        const commonSymptoms = ['fever', 'জ্বর', 'headache', 'মাথা ব্যথা', 'cough', 'কাশি', 'stomach', 'পেট', 'pain', 'ব্যথা', 'cold', 'সর্দি'];
        const detectedSymptoms = commonSymptoms.filter(s => 
          userInput.toLowerCase().includes(s.toLowerCase())
        );
        
        if (detectedSymptoms.length > 0) {
          updatedState.symptoms = detectedSymptoms;
          aiResponse = `ঠিক আছে, আমি বুঝতে পারছি আপনার ${detectedSymptoms.join(', ')} সমস্যা হচ্ছে।

I understand you're experiencing ${detectedSymptoms.join(', ')}. 

এই সমস্যা কত দিন ধরে হচ্ছে? (How long have you been experiencing this?)
- কয়েক ঘণ্টা (Few hours)
- ১-২ দিন (1-2 days)
- ৩-৫ দিন (3-5 days)
- এক সপ্তাহের বেশি (More than a week)`;
          nextStage = 'duration';
        } else {
          aiResponse = `আপনার ঠিক কোন সমস্যা হচ্ছে? যেমন:

Please describe your symptoms. For example:
- জ্বর (Fever)
- মাথা ব্যথা (Headache)
- কাশি (Cough)
- পেট ব্যথা (Stomach pain)
- শরীর ব্যথা (Body ache)`;
          nextStage = 'symptom';
        }
        break;

      case 'symptom':
        updatedState.symptoms = userInput.split(',').map(s => s.trim());
        aiResponse = `ঠিক আছে। এই সমস্যা কত দিন ধরে হচ্ছে?

Okay. How long have you been experiencing these symptoms?`;
        nextStage = 'duration';
        break;

      case 'duration':
        updatedState.duration = userInput;
        const daysMatch = userInput.match(/(\d+)/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 0;
        
        if (days >= 3) {
          aiResponse = `${days} দিন ধরে! এটা কিছুটা দীর্ঘ সময়।

${days} days is quite some time. 

ব্যথা/সমস্যার মাত্রা কেমন? (How severe is the problem?)
- হালকা (Mild) - সাধারণ কাজকর্ম করতে পারছেন
- মাঝারি (Moderate) - কিছুটা অসুবিধা হচ্ছে  
- তীব্র (Severe) - স্বাভাবিক কাজকর্ম করতে পারছেন না`;
        } else {
          aiResponse = `${userInput}। ঠিক আছে।

${userInput}. Alright.

ব্যথা/সমস্যার মাত্রা কেমন? (How severe is it?)
- হালকা (Mild)
- মাঝারি (Moderate)
- তীব্র (Severe)`;
        }
        nextStage = 'severity';
        break;

      case 'severity':
        updatedState.severity = userInput;
        aiResponse = `এই সমস্যার জন্য কোন ঔষধ খেয়েছেন কি? যদি খেয়ে থাকেন, কোন ঔষধ?

Have you taken any medicine for this? If yes, which ones?`;
        nextStage = 'medicine_history';
        break;

      case 'medicine_history':
        updatedState.medicinesTaken = userInput;
        aiResponse = `আপনার কি ডায়াবেটিস, উচ্চ রক্তচাপ বা অন্য কোন দীর্ঘমেয়াদী রোগ আছে?

Do you have diabetes, high blood pressure, or any other chronic conditions?${
          userMedicalHistory ? `\n\n(From your profile: ${userMedicalHistory})` : ''
        }`;
        nextStage = 'other_conditions';
        break;

      case 'other_conditions':
        updatedState.otherConditions = userInput;
        
        // Now analyze and provide recommendation
        aiResponse = `ধন্যবাদ। আমি এখন আপনার তথ্য বিশ্লেষণ করছি...

Thank you. Let me analyze your information and provide recommendations...`;
        nextStage = 'analysis';
        
        // Perform analysis
        setTimeout(() => performAnalysis(updatedState), 2000);
        break;
    }

    setConversationState(updatedState);
    setIsAITyping(false);
    
    if (nextStage !== 'analysis') {
      addAIMessage(aiResponse, nextStage);
      setConversationState(prev => ({ ...prev, stage: nextStage }));
    } else {
      addAIMessage(aiResponse);
    }
  };

  const performAnalysis = async (state: any) => {
    // Call real Gemini API for AI analysis
    setIsAITyping(true);
    
    try {
      const durationDays = parseInt(state.duration.match(/(\d+)/)?.[1] || '1');
      const severityMapping = state.severity.toLowerCase().includes('severe') || state.severity.includes('তীব্র') ? 'severe' :
                              state.severity.toLowerCase().includes('moderate') || state.severity.includes('মাঝারি') ? 'moderate' : 'mild';
      
      // Call Gemini API
      const analysis = await analyzeSymptoms({
        symptoms: state.symptoms,
        duration: durationDays,
        severity: severityMapping,
        medicinesTaken: state.medicinesTaken || undefined,
        otherConditions: state.otherConditions ? state.otherConditions.split(',').map((c: string) => c.trim()) : undefined,
        allergies: userAllergies ? userAllergies.split(',').map(a => a.trim()) : undefined,
        userName: userName
      });

      const result = {
        aiImpression: analysis.impression,
        recommendedMedicines: analysis.medicines,
        recommendedTests: analysis.tests,
        followUpNeeded: analysis.followUp.needed,
        followUpAfterDays: analysis.followUp.afterDays,
        urgencyLevel: analysis.urgencyLevel,
        advice: analysis.advice,
        redFlags: analysis.redFlags,
        totalEstimatedCost: analysis.totalEstimatedCost
      };

      setAnalysisResult(result);
      setConsultationComplete(true);
      displayAnalysisResult(result);

      if (onConsultationComplete) {
        onConsultationComplete(result);
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      addAIMessage('Sorry, I encountered an error analyzing your symptoms. Please try again.');
    } finally {
      setIsAITyping(false);
    }
  };

  const displayAnalysisResult = (result: any) => {
    const summary = `

📋 **পরামর্শ সংক্ষেপ / CONSULTATION SUMMARY**

**অবস্থা বিশ্লেষণ / Assessment:**
${result.aiImpression}

**জরুরী মাত্রা / Urgency Level:** ${result.urgencyLevel.toUpperCase()} ${
  result.urgencyLevel === 'high' ? '⚠️' : result.urgencyLevel === 'medium' ? '🟡' : '✅'
}

---

💊 **প্রস্তাবিত ঔষধ / RECOMMENDED MEDICINES:**

${result.recommendedMedicines.map((med: Medicine, idx: number) => `
${idx + 1}. **${med.brand}** (${med.name})
   - Dosage: ${med.dosage}
   - Frequency: ${med.frequency}
   - Duration: ${med.duration}
   - Price: ৳${med.price} (${med.quantity} tablets)
`).join('\n')}

${result.recommendedTests.length > 0 ? `
---

🧪 **প্রস্তাবিত পরীক্ষা / RECOMMENDED TESTS:**
${result.urgencyLevel === 'high' || result.followUpAfterDays <= 2 ? '⚠️ আপনার লক্ষণ দীর্ঘ হওয়ায় এই পরীক্ষাগুলো করা উচিত' : 'যদি উপসর্গ অব্যাহত থাকে:'}

${result.recommendedTests.map((test: Test, idx: number) => `
${idx + 1}. **${test.name}**
   - Reason: ${test.reason}
   - Price: ৳${test.price}
`).join('\n')}
` : ''}

---

📝 **পরামর্শ / ADVICE:**

${result.advice.map((adv: string, idx: number) => `${idx + 1}. ${adv}`).join('\n')}

---

📅 **ফলো-আপ / FOLLOW-UP:**
${result.followUpNeeded ? `
আপনার ${result.followUpAfterDays} দিন পর ফিরে আসা উচিত যদি উপসর্গ না কমে।
You should return after ${result.followUpAfterDays} days if symptoms don't improve.
` : 'No immediate follow-up needed, but consult if symptoms worsen.'}

---

⚠️ **গুরুত্বপূর্ণ দাবিত্যাগ / IMPORTANT DISCLAIMER:**
এই পরামর্শটি সহায়ক, প্রাথমিক চিকিৎসা নয়। গুরুতর সমস্যা বা সন্দেহ থাকলে রেজিস্টার্ড ডাক্তারের পরামর্শ নিন।
This guidance is supportive, not a definitive diagnosis. Please consult a registered doctor for serious conditions or if you're unsure.

আপনি চাইলে এখন:
- ঔষধ অর্ডার করুন (Order medicines from nearby pharmacies)
- ডাক্তার অ্যাপয়েন্টমেন্ট বুক করুন (Book doctor appointment)
- রিপোর্ট ডাউনলোড করুন (Download consultation report)
`;

    addAIMessage(summary);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || consultationComplete) return;

    addUserMessage(inputMessage);
    getAIResponse(inputMessage, conversationState.stage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white">AI Doctor</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-100">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultationComplete && (
            <>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-blue-50 to-green-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'ai'
                  ? 'bg-gradient-to-br from-blue-500 to-green-500'
                  : 'bg-gray-300'
              }`}
            >
              {message.sender === 'ai' ? (
                <Bot className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-gray-700" />
              )}
            </div>
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.sender === 'ai'
                  ? 'bg-white shadow-md'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.message}</p>
              <div className="flex items-center gap-1 mt-2 opacity-70">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isAITyping && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-green-500">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white shadow-md p-4 rounded-2xl">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {consultationComplete && analysisResult && (
          <div className="mt-6 space-y-4">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Pill className="w-5 h-5" />
                <span>Order Medicines</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Book Doctor</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>View Centers</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!consultationComplete && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAITyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isAITyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {consultationComplete && (
        <div className="border-t border-gray-200 p-4 bg-green-50">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>Consultation Complete - Your health timeline has been updated</span>
          </div>
        </div>
      )}
    </div>
  );
}
