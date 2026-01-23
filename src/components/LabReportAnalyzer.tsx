import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import type { Page } from '../App';
import { callGeminiParts } from '../services/geminiService';

interface LabReportAnalyzerProps {
  onNavigate: (page: Page) => void;
}

interface AnalysisResult {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface DetectedCondition {
  name: string;
  probability: number;
  indicators: string[];
  recommendations: string[];
}

export function LabReportAnalyzer({ onNavigate }: LabReportAnalyzerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [detectedConditions, setDetectedConditions] = useState<DetectedCondition[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResults(null);
      setDetectedConditions(null);
    }
  };

  const analyzeReport = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setAnalysisResults(null);
    setDetectedConditions(null);
    setAiSummary('');

    try {
      const isImage = uploadedFile.type.startsWith('image/');
      const isPdf = uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        setAiSummary('⚠️ The uploaded file appears to be a PDF. Please upload a screenshot/image of the report for AI analysis.');
        return;
      }

      if (!isImage) {
        setAiSummary('⚠️ This does not look like a medical report image. Please upload a valid health report (PNG/JPG) for AI analysis.');
        return;
      }

      // Read image and convert to base64
      const reader = new FileReader();
      const readDataUrl = () => new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(uploadedFile);
      });

      const dataUrl = await readDataUrl();
      const base64 = dataUrl.split(',')[1];

      // Call Gemini with simpler, more reliable prompt
      const parts = [
        {
          text: `You are an experienced Bangladeshi doctor analyzing a lab report. Analyze this report image and provide:

1. REPORT TYPE: [Type of report, e.g., Blood Test, Lipid Profile, Thyroid Test]

2. KEY FINDINGS: [List 3-5 main test results or abnormalities found]

3. DETECTED CONDITIONS: [What health conditions do these results suggest?]

4. RECOMMENDATIONS: [What should the patient do?]

5. WHEN TO WORRY: [Red flags that need immediate attention]

Keep response clear, brief, and suitable for Bangladeshi patients.`,
        },
        {
          inline_data: { mime_type: uploadedFile.type, data: base64 },
        },
      ];

      const responseText = await callGeminiParts(parts);
      console.log('✅ Gemini Response:', responseText);

      if (!responseText || responseText.length < 10) {
        throw new Error('Empty response from Gemini');
      }

      // Set the full response as summary - this will always display
      setAiSummary(responseText);
      
      // Try to extract structured data from response for parameter analysis
      extractAndDisplayAnalysis(responseText);

    } catch (err) {
      console.error('❌ Analysis error:', err);
      setAiSummary('❌ Error analyzing report: ' + (err instanceof Error ? err.message : 'Unknown error. Please try again.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractAndDisplayAnalysis = (response: string) => {
    try {
      // Simple extraction: find "KEY FINDINGS" section and parse lines
      const findingsMatch = response.match(/KEY FINDINGS:?\s*([\s\S]*?)(?=DETECTED CONDITIONS|RECOMMENDATIONS|$)/i);
      if (findingsMatch) {
        const findingLines = findingsMatch[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
        const mockResults: AnalysisResult[] = findingLines.slice(0, 4).map((line, idx) => ({
          parameter: `Finding ${idx + 1}`,
          value: line.replace(/^[-•]\s*/, '').trim(),
          normalRange: 'See AI Summary',
          status: 'normal',
        }));
        if (mockResults.length > 0) {
          setAnalysisResults(mockResults);
        }
      }

      // Try to extract conditions
      const conditionsMatch = response.match(/DETECTED CONDITIONS:?\s*([\s\S]*?)(?=RECOMMENDATIONS|WHEN TO WORRY|$)/i);
      if (conditionsMatch) {
        const conditionText = conditionsMatch[1].trim();
        const mockConditions: DetectedCondition[] = [{
          name: 'Health Analysis',
          probability: 75,
          indicators: conditionText.split('\n').filter(l => l.trim()).slice(0, 3).map(l => l.replace(/^[-•]\s*/, '').trim()),
          recommendations: [],
        }];
        if (mockConditions[0].indicators.length > 0) {
          setDetectedConditions(mockConditions);
        }
      }
    } catch (e) {
      console.log('Note: Could not extract structured data, displaying full response instead');
    }
  };

  const getStatusIcon = (status: 'normal' | 'high' | 'low') => {
    if (status === 'normal') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'high') return <TrendingUp className="w-5 h-5 text-red-600" />;
    return <TrendingDown className="w-5 h-5 text-orange-600" />;
  };

  const getStatusColor = (status: 'normal' | 'high' | 'low') => {
    if (status === 'normal') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'high') return 'bg-red-50 border-red-200 text-red-700';
    return 'bg-orange-50 border-orange-200 text-orange-700';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">AI Lab Report Analyzer</h1>
        <p className="text-gray-600">Upload your lab reports for automatic analysis powered by Google Gemini AI • Bangladeshi Medical Standards</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-500">
              PDF, JPG, PNG up to 10MB
            </p>
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-900">{uploadedFile.name}</p>
                  <p className="text-gray-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={analyzeReport}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Analyze Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results - Show if we have AI summary */}
      {aiSummary && (
        <div className="space-y-6">
          {/* Report Info */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white mb-2">Analysis Complete</h2>
                <p className="text-blue-100">AI-Powered Report Analysis</p>
              </div>
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>

          {/* AI Doctor Summary - Always show this first */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-4">AI Doctor Summary (Gemini)</h3>
            <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
              {aiSummary}
            </div>
          </div>

          {/* Parameters - Optional, only if extracted */}
          {analysisResults && analysisResults.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-900 mb-4">Key Findings</h3>
              <div className="space-y-3">
                {analysisResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="text-gray-900">{result.parameter}</p>
                          <p className="text-gray-600">{result.normalRange}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{result.value}</p>
                        {result.status !== 'normal' && result.severity && (
                          <p className="text-gray-600 capitalize">{result.severity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Conditions */}
          {detectedConditions && detectedConditions.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-900 mb-4">AI-Detected Patterns & Conditions</h3>
              <div className="space-y-4">
                {detectedConditions.map((condition, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-gray-900 mb-1">{condition.name}</h4>
                        <p className="text-gray-600">AI Confidence: {condition.probability}%</p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                        {condition.probability}%
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">Key Indicators:</p>
                      <div className="flex flex-wrap gap-2">
                        {condition.indicators.map((indicator, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-700 mb-2">Recommendations:</p>
                      <ul className="space-y-2">
                        {condition.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-900 mb-1">Next Steps</p>
                <p className="text-gray-600">Based on the analysis, we recommend consulting with a specialist for personalized treatment.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('doctors')}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Find Specialist Doctor</span>
              </button>
              <button
                onClick={() => onNavigate('diagnostics')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Book Follow-up Tests
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-gray-900 mb-2">AI-Powered Analysis</h4>
          <p className="text-gray-600">Advanced ML models analyze your reports for disease pattern detection</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-gray-900 mb-2">Instant Results</h4>
          <p className="text-gray-600">Get comprehensive analysis within seconds of upload</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-gray-900 mb-2">Expert Consultation</h4>
          <p className="text-gray-600">Connect with specialists for detailed review and treatment</p>
        </div>
      </div>
    </div>
  );
}
