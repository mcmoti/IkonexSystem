import { useState } from 'react';
import Dashboard from './components/Dashboard';
import StudentRoster from './components/StudentRoster';
import AssessmentConsole from './components/AssessmentConsole';
import { LayoutDashboard, Users, FileEdit } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roster' | 'assessments'>('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">IKONEX</h1>
          <p className="text-ice-blue text-sm opacity-80">Academy Management</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-cobalt text-white' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('roster')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'roster' ? 'bg-cobalt text-white' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Student Roster</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('assessments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'assessments' ? 'bg-cobalt text-white' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <FileEdit size={20} />
            <span className="font-medium">Assessments</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cobalt flex items-center justify-center font-bold">
              SA
            </div>
            <div>
              <p className="font-medium text-sm">Super Admin</p>
              <p className="text-xs text-gray-400">admin@ikonex.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h2 className="text-xl font-semibold text-navy capitalize">
            {activeTab === 'roster' ? 'Student Roster' : activeTab}
          </h2>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'roster' && <StudentRoster />}
          {activeTab === 'assessments' && <AssessmentConsole streamId="1" subjectId="1" />}
        </main>
      </div>
    </div>
  );
}

export default App;
