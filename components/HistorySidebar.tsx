
import React from 'react';
import { ClassificationResult, ClassificationType } from '../types';

interface HistorySidebarProps {
  history: ClassificationResult[];
  onSelect: (result: ClassificationResult) => void;
  activeId?: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, activeId }) => {
  const getIcon = (type: ClassificationType) => {
    switch (type) {
      case ClassificationType.SPAM: return 'fa-triangle-exclamation text-amber-500';
      case ClassificationType.PHISHING: return 'fa-skull-crossbones text-rose-500';
      case ClassificationType.HAM: return 'fa-circle-check text-emerald-500';
      default: return 'fa-question text-slate-400';
    }
  };

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center">
          <i className="fas fa-clock-rotate-left mr-2 opacity-50"></i>
          Recent Analysis
        </h3>
      </div>
      <div className="divide-y divide-slate-100">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 text-sm">No analysis history yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-4 hover:bg-slate-50 transition-colors group ${activeId === item.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''}`}
            >
              <div className="flex items-start justify-between">
                <i className={`fas ${getIcon(item.type)} mt-1 text-sm`}></i>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm mt-1 truncate">{item.subject || '(No Subject)'}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.content}</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
