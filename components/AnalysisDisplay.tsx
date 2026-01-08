
import React from 'react';
import { ClassificationResult, ClassificationType } from '../types';
import FeaturesRadar from './FeaturesRadar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisDisplayProps {
  result: ClassificationResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const isDanger = result.type === ClassificationType.SPAM || result.type === ClassificationType.PHISHING;
  
  const scoreData = [
    { name: 'Risk', value: result.confidence },
    { name: 'Safe', value: 100 - result.confidence },
  ];

  const COLORS = isDanger ? ['#ef4444', '#e2e8f0'] : ['#10b981', '#e2e8f0'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-6 rounded-2xl border ${isDanger ? 'border-rose-100 bg-rose-50/30' : 'border-emerald-100 bg-emerald-50/30'} mb-6`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${isDanger ? 'text-rose-600' : 'text-emerald-600'}`}>
                {Math.round(result.confidence)}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Certainty</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                isDanger ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {result.type} DETECTED
              </span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-500 text-sm">Analyzed via Gemini ML Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              {result.type === ClassificationType.HAM ? 'This email looks legitimate.' : 'Warning: High Risk Detected'}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4 max-w-2xl">
              {result.explanation}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDanger ? 'bg-white border-rose-200 text-rose-700' : 'bg-white border-emerald-200 text-emerald-700'}`}>
                <i className={`fas ${isDanger ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
                <span className="font-semibold">{result.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-microscope mr-2 text-indigo-500"></i>
            Feature Decomposition
          </h3>
          <FeaturesRadar features={result.features} />
          <p className="text-xs text-slate-400 mt-4 text-center">
            Mapping neural network attention across key linguistic markers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-list-check mr-2 text-indigo-500"></i>
            Key Indicators
          </h3>
          <div className="space-y-4">
            {result.features.map((feature, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700 text-sm">{feature.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    feature.score > 70 ? 'bg-rose-100 text-rose-600' : 
                    feature.score > 30 ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {feature.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{feature.description}</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      feature.score > 70 ? 'bg-rose-500' : feature.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${feature.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
