import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import type { Page } from '../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span>CureSphere AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              LLM & ML-powered virtual healthcare system providing comprehensive medical support directly at home.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('symptom-analyzer')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Symptom Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pharmacy')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Pharmacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('diagnostics')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Diagnostic Centers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blood-bank')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blood Bank
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>AI Symptom Analysis</li>
              <li>Medicine Recommendations</li>
              <li>Lab Report Analysis</li>
              <li>Virtual Consultations</li>
              <li>Home Sample Collection</li>
              <li>Blood Donor Network</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>info@curesphere.ai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              © 2025 CureSphere AI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">WHO Ethics 2023</a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500">
            <p>Powered by EfficientNet, ResNet, DenseNet, XGBoost, RNN | Following Bangladeshi Pharmaceutical Standards</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
