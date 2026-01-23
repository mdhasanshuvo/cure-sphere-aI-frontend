import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, Pill } from 'lucide-react';
import type { Page } from '../App';
import { callGeminiAPI } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SymptomAnalyzerProps {
  onNavigate: (page: Page) => void;
  onAnalysisComplete: (symptoms: string[], medicines: any[], tests: any[]) => void;
}

export function SymptomAnalyzer({ onNavigate, onAnalysisComplete }: SymptomAnalyzerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm CureSphere AI, your personal AI doctor powered by Google Gemini.\n\n🏥 I'll help you with primary health consultation for Bangladeshi patients.\n\nTell me: What symptoms are you experiencing right now?\n(e.g., fever, cough, headache, body ache, stomach pain, etc.)",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState<'symptoms' | 'followup' | 'refinement' | 'complete'>('symptoms');
  const [userSymptoms, setUserSymptoms] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    if (conversationStep === 'symptoms') {
      // User provides initial symptoms
      setUserSymptoms(userInput);
      setIsLoading(true);

      try {
        // Call Gemini to provide initial treatment based on symptoms
        const initialTreatmentPrompt = `You are an experienced Bangladeshi doctor. A patient tells you: "${userInput}"

Provide a CONCISE initial assessment and basic treatment recommendations:

1. QUICK ASSESSMENT - What condition do they likely have? (2 sentences)

2. IMMEDIATE HOME REMEDIES
   - Rest, hydration, etc. (2-3 bullet points)

3. BASIC MEDICINES (Bangladeshi brands)
   - Napa 500mg: 1 tablet 3x daily after meals - ৳30
   - [Add 1-2 more common medicines if appropriate]

4. WHEN TO WORRY - Red flags to seek immediate care (2-3 warning signs)

Keep it SHORT and practical.`;

        const initialResponse = await callGeminiAPI(initialTreatmentPrompt);

        const assistantMessage: Message = {
          role: 'assistant',
          content: `${initialResponse}\n\n---\n\nNow let me ask some follow-up questions to refine my recommendation:\n\n1️⃣ How long have you had these symptoms? (e.g., since yesterday, for 3 days, etc.)`,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setConversationStep('followup');
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Error: ${error?.message || 'Failed to get response from Gemini API'}\n\nPlease check the console (F12) and try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else if (conversationStep === 'followup') {
      // User answers follow-up questions
      setIsLoading(true);

      try {
        const refinedPrompt = `You are a Bangladeshi doctor. Patient's symptoms: "${userSymptoms}"
Patient answered: "${userInput}"

Ask ONE more follow-up question to better understand their condition:
- Could ask about: medicines already taken, allergies, chronic conditions, severity, or age

REFINED ASSESSMENT:
[Brief update to initial assessment based on this new info]

NEXT QUESTION:
[Ask ONE specific follow-up question]`;

        const followupResponse = await callGeminiAPI(refinedPrompt);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: followupResponse,
          },
        ]);

        setConversationStep('refinement');
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Error: ${error?.message || 'Failed to process response'}\n\nPlease try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else if (conversationStep === 'refinement') {
      // User provides final information
      setIsLoading(true);

      try {
        const finalPrompt = `You are an experienced Bangladeshi doctor. 
Patient symptoms: "${userSymptoms}"
Based on conversation so far, user just said: "${userInput}"

Now provide FINAL DETAILED RECOMMENDATIONS:

FINAL DIAGNOSIS:
[What condition they likely have]

RECOMMENDED MEDICINES (BANGLADESHI BRANDS):
• [Medicine 1 - Brand (Generic), Dosage, Frequency, Duration, Price in ৳]
• [Medicine 2 - with details]
• [Add 2-3 appropriate medicines]

TESTS TO CONSIDER:
• [Test 1 - Reason, Price in ৳] 
• [Add relevant tests]

CARE INSTRUCTIONS:
• Rest and sleep requirements
• Diet and hydration
• When to contact doctor
• Other practical advice (3-4 points)

RED FLAGS - SEEK IMMEDIATE CARE IF:
• [Symptom that indicates urgency]
• [Another warning sign]

FOLLOW-UP:
When to revisit doctor and what to watch for`;

        const finalResponse = await callGeminiAPI(finalPrompt);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: finalResponse,
          },
        ]);

        setConversationStep('complete');
        onAnalysisComplete([userSymptoms], [], []);
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Error: ${error?.message || 'Failed to generate final recommendations'}\n\nPlease try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else if (conversationStep === 'complete') {
      // Allow user to ask follow-up questions
      setIsLoading(true);

      try {
        const clarificationPrompt = `You are a Bangladeshi doctor. Previous context:
Symptoms: "${userSymptoms}"

Patient asks: "${userInput}"

Answer their question briefly and helpfully (1-2 sentences). If they're asking for clarification about medicines, tests, or care instructions, explain it simply.`;

        const clarificationResponse = await callGeminiAPI(clarificationPrompt);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: clarificationResponse,
          },
        ]);
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Error: ${error?.message}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetConversation = () => {
    setMessages([messages[0]]);
    setInput('');
    setUserSymptoms('');
    setConversationStep('symptoms');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">AI Doctor Consultation</h2>
              <p className="text-emerald-100">Powered by Google Gemini • Bangladeshi Medical Standards</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[550px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Buttons - Only shown after complete */}
        {conversationStep === 'complete' && (
          <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetConversation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <span>🔄 New Consultation</span>
              </button>
              <button
                onClick={() => onNavigate('pharmacy')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <Pill className="w-4 h-4" />
                <span>Find Medicines</span>
              </button>
              <button
                onClick={() => onNavigate('diagnostics')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Book Tests</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            This is for primary consultation only. For emergencies, call 999 or visit the nearest hospital.
          </p>
        </div>
      </div>
    </div>
  );
}
