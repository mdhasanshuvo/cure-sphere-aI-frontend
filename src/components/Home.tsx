import { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  Building2, 
  FileText, 
  Users, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Brain,
  Shield,
  Lock,
  FileSearch,
  Video,
  TrendingUp,
  Clock,
  Star,
  Upload,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Award,
  Globe,
  Zap,
  Target,
  BarChart,
  Check
} from 'lucide-react';
import type { Page } from '../App';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from './ui/accordion';
import { Footer } from './Footer';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
                <Award className="w-4 h-4" />
                <span>AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-gray-900 mb-6">
                Your Intelligent Healthcare Companion — Anytime, Anywhere.
              </h1>
              <p className="text-gray-600 mb-8">
                CureSphere AI uses advanced Machine Learning and LLMs to provide early predictions, instant reports, treatment guidance, and seamless communication with certified doctors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => onNavigate('symptom-analyzer')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Health Checkup</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const howItWorksSection = document.getElementById('how-it-works');
                    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
                >
                  See How It Works
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-blue-600 mb-1">10,000+</div>
                  <div className="text-gray-600">Users Helped</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-green-600 mb-1">92%</div>
                  <div className="text-gray-600">Accuracy*</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-purple-600 mb-1">24/7</div>
                  <div className="text-gray-600">AI Support</div>
                </div>
              </div>
            </div>
            
            {/* Right Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900">AI Health Dashboard</h4>
                    <p className="text-gray-500">Real-time Analysis</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Symptom Analysis</span>
                    </div>
                    <div className="w-full bg-blue-200 h-2 rounded-full">
                      <div className="w-4/5 bg-blue-600 h-2 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Vitals Tracking</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-green-600">72</div>
                        <div className="text-gray-500">BPM</div>
                      </div>
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-green-600">98.6°F</div>
                        <div className="text-gray-500">Temp</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">AI Report Ready</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CureSphere AI Stands Out */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Why CureSphere AI Stands Out</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets compassionate care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">AI-Powered Symptom Analysis</h3>
              <p className="text-gray-600">
                Quickly identify risks using ML models like EfficientNet, ResNet, and DenseNet with industry-leading accuracy.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">Doctor-Verified Guidance</h3>
              <p className="text-gray-600">
                Every medical suggestion cross-checked with certified doctors following WHO ethics guidelines 2023.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">Health Report Generator</h3>
              <p className="text-gray-600">
                Instantly produce downloadable medical summaries with AI-powered lab report analysis.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-indigo-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">
                End-to-end encrypted health data with compliance to international healthcare privacy standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need for Smarter Health */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Everything You Need for Smarter Health</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services in one intelligent platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                 onClick={() => onNavigate('symptom-analyzer')}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Smart Symptom Checker</h3>
              <p className="text-gray-600">
                AI-powered analysis with personalized recommendations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                 onClick={() => onNavigate('dashboard')}>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-time Vitals Dashboard</h3>
              <p className="text-gray-600">
                Monitor your health metrics continuously
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                 onClick={() => onNavigate('lab-reports')}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">AI Health Reports & Insights</h3>
              <p className="text-gray-600">
                Get instant analysis of your lab results
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                 onClick={() => onNavigate('doctors')}>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Global Specialists Access</h3>
              <p className="text-gray-600">
                Virtual consultations with verified doctors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How CureSphere AI Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">How CureSphere AI Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '01', icon: Users, title: 'Create Your Profile', desc: 'Sign up with your basic health information' },
              { num: '02', icon: MessageSquare, title: 'Describe Symptoms', desc: 'Enter symptoms or upload medical reports' },
              { num: '03', icon: Brain, title: 'AI Analyzes Risks', desc: 'Our ML models process your health data' },
              { num: '04', icon: CheckCircle, title: 'Get Solutions', desc: 'Receive doctor-verified recommendations' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {step.num}
                      </div>
                    </div>
                    <h3 className="text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-green-300 -z-10"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted Worldwide Health Platform - Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">Trusted Worldwide Health Platform</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who trust CureSphere AI for their healthcare needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '20,000+', label: 'Diagnoses Processed' },
              { num: '1,000+', label: 'Doctors Connected' },
              { num: '95%', label: 'User Satisfaction' },
              { num: '15+', label: 'Countries Supported' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-white mb-2">{stat.num}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Steps to Start */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Simple Steps to Start</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your health journey begins here
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: 'Upload Files', desc: 'Add your medical documents securely', color: 'blue' },
              { icon: FileSearch, title: 'Enter Symptoms', desc: 'Describe what you\'re feeling', color: 'green' },
              { icon: Zap, title: 'Get Predictions', desc: 'Receive AI analysis instantly', color: 'purple' },
              { icon: Video, title: 'Book Follow-up', desc: 'Schedule doctor consultation', color: 'pink' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <h4 className="text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your healthcare needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <h3 className="text-gray-900 mb-2">Free Plan</h3>
              <div className="mb-6">
                <span className="text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Basic symptom checker',
                  'Limited AI report',
                  '3 monthly predictions',
                  'Community support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onNavigate('signup')}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
              >
                Get Started
              </button>
            </div>
            
            {/* Standard Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full">
                Popular
              </div>
              <h3 className="mb-2">Standard Plan</h3>
              <div className="mb-6">
                <span>$19</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Full AI analysis',
                  'Unlimited reports',
                  'Priority response',
                  'Chat with support',
                  'Medicine recommendations',
                  'Lab test suggestions'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onNavigate('signup')}
                className="w-full px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
              >
                Get Started
              </button>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white border-2 border-green-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <h3 className="text-gray-900 mb-2">Premium Healthcare</h3>
              <div className="mb-6">
                <span className="text-gray-900">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Standard',
                  'Doctor video consultation',
                  'Full medical history storage',
                  'Personalized health plan',
                  'Priority doctor booking',
                  '24/7 emergency support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onNavigate('signup')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from people who improved their health with CureSphere AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Ahmed',
                role: 'General Physician',
                image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MXx8fHwxNzY1NTQ3Nzg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
                text: 'CureSphere AI has revolutionized how I provide preliminary consultations. The accuracy of the AI predictions helps me focus on critical cases.',
                rating: 5
              },
              {
                name: 'Mohammed Rahman',
                role: 'Patient',
                image: 'https://images.unsplash.com/photo-1755189118414-14c8dacdb082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU0NjA2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
                text: 'I was able to get instant guidance when I had symptoms at 2 AM. The AI analysis was spot-on and helped me decide to visit a doctor the next day.',
                rating: 5
              },
              {
                name: 'Fatima Khatun',
                role: 'Healthcare Worker',
                image: 'https://images.unsplash.com/photo-1659353888818-0e41520d086a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwaGVhbHRoY2FyZSUyMHNhdGlzZmllZHxlbnwxfHx8fDE3NjU1Njg2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
                text: 'As a healthcare worker in a rural area, CureSphere AI helps me provide better care to patients. The platform bridges the gap in medical access.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Platforms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-gray-900 mb-4">Supported Payment Platforms</h3>
            <p className="text-gray-600">Secure and convenient payment options</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Visa', 'MasterCard', 'bKash', 'Nagad', 'PayPal', 'Stripe'].map((platform) => (
              <div key={platform} className="px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <span className="text-gray-700">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about CureSphere AI</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-xl px-6 border border-gray-200">
              <AccordionTrigger className="text-gray-900 hover:text-blue-600">
                Is CureSphere AI safe to use?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, CureSphere AI is completely safe. We use end-to-end encryption for all health data, comply with international healthcare privacy standards, and follow WHO AI Ethics guidelines 2023. Your data is never shared without your explicit consent.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white rounded-xl px-6 border border-gray-200">
              <AccordionTrigger className="text-gray-900 hover:text-blue-600">
                How accurate are the predictions?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our AI models (EfficientNet, ResNet, DenseNet, XGBoost, RNN) achieve 92% accuracy in symptom analysis. However, AI predictions are meant to support, not replace, professional medical advice. We always recommend consulting with certified doctors for serious conditions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white rounded-xl px-6 border border-gray-200">
              <AccordionTrigger className="text-gray-900 hover:text-blue-600">
                Are doctors available 24/7?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our AI assistant is available 24/7 for symptom analysis and health guidance. Doctor consultations are available during business hours, with premium plan members getting priority booking and extended hours support.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white rounded-xl px-6 border border-gray-200">
              <AccordionTrigger className="text-gray-900 hover:text-blue-600">
                Can I download my medical reports?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes! All your medical reports, AI analyses, and health history are available for download in PDF format. Premium plan members get unlimited cloud storage for their complete medical history.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-white rounded-xl px-6 border border-gray-200">
              <AccordionTrigger className="text-gray-900 hover:text-blue-600">
                Is my health data secure?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely. We implement bank-level encryption, secure cloud storage, regular security audits, and comply with GDPR and international healthcare data protection regulations. Your privacy is our top priority.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Take Control of Your Health Today</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get instant, intelligent, and reliable health insights powered by CureSphere AI. Join thousands of users improving their health with advanced AI technology.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
          >
            <span>Start Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}