
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Chatrapati AI
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
          <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">API</a>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-all">
            Get Pro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
