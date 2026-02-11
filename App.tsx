
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Dumbbell, 
  BookText, 
  Moon, 
  Sun,
  Menu,
  X,
  Bell,
  BellOff,
  Smartphone,
  GraduationCap
} from 'lucide-react';
import { AppState, Priority } from './types';
import Dashboard from './components/Dashboard';
import GoalsManager from './components/GoalsManager';
import FitnessTracker from './components/FitnessTracker';
import JournalEntries from './components/JournalEntries';
import AcademicTracker from './components/AcademicTracker';
import SocialTracker from './components/SocialTracker';

const INITIAL_STATE: AppState = {
  smallGoals: [],
  longGoals: [],
  fitnessTargets: { pushups: 10, pullups: 2, plank: 20 },
  fitnessHistory: [],
  journalEntries: [],
  socialUsage: [],
  academicLogs: [],
  academicPlans: [],
  screenTimeLimit: 120,
  muteRemindersDate: null,
  darkMode: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pro_max_life_state_v3');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    localStorage.setItem('pro_max_life_state_v3', JSON.stringify(state));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const isMuted = state.muteRemindersDate === today;
    const todayUsage = state.socialUsage
      .filter(u => u.date === today)
      .reduce((acc, u) => acc + u.minutes, 0);

    if (todayUsage > state.screenTimeLimit && notificationStatus === 'granted' && !isMuted) {
      new Notification("YOUR TIME IS OVER", {
        body: `Screen limit of ${state.screenTimeLimit}m exceeded. Current: ${todayUsage}m. Disconnect now.`,
      });
    }

    const hasStudiedToday = state.academicLogs.some(log => log.date === today) || 
                           state.journalEntries.some(entry => entry.date === today && entry.studyHours > 0);
    
    if (!hasStudiedToday && notificationStatus === 'granted') {
      const planForToday = state.academicPlans.find(p => p.date === today);
      const lastCheck = sessionStorage.getItem('study_reminder_sent');
      
      if (lastCheck !== today) {
        new Notification("ACADEMIC ALERT", {
          body: planForToday 
            ? `You planned to study ${planForToday.subject} (${planForToday.topic}) today. Execute your plan now.`
            : "No study logs detected for today. Engage your goals immediately.",
        });
        sessionStorage.setItem('study_reminder_sent', today);
      }
    }
  }, [state.socialUsage, state.academicLogs, state.journalEntries, state.academicPlans, state.screenTimeLimit, state.muteRemindersDate, notificationStatus]);

  const toggleDarkMode = () => setState(prev => ({ ...prev, darkMode: !prev.darkMode }));

  const updateState = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
  };

  return (
    <Router>
      <div className={`min-h-screen flex font-normal ${state.darkMode ? 'dark' : ''}`}>
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-white/80 dark:bg-stone-900/80 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800
          transform transition-transform duration-300 lg:translate-x-0 lg:static
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-xl text-black dark:text-white tracking-tight">LIFE TRACKER</h1>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              <NavLink to="/" icon={<LayoutDashboard />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
              <NavLink to="/goals" icon={<Target />} label="Goals" onClick={() => setIsSidebarOpen(false)} />
              <NavLink to="/fitness" icon={<Dumbbell />} label="Fitness" onClick={() => setIsSidebarOpen(false)} />
              <NavLink to="/academic" icon={<GraduationCap />} label="Academics" onClick={() => setIsSidebarOpen(false)} />
              <NavLink to="/social" icon={<Smartphone />} label="Social Usage" onClick={() => setIsSidebarOpen(false)} />
              <NavLink to="/journal" icon={<BookText />} label="Mission Log" onClick={() => setIsSidebarOpen(false)} />
            </nav>

            <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 space-y-3">
              <button 
                onClick={requestNotificationPermission} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-wide border transition-all ${
                  notificationStatus === 'granted' 
                  ? 'border-green-100 text-green-700' 
                  : 'border-stone-100 text-stone-400'
                }`}
              >
                {notificationStatus === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                {notificationStatus === 'granted' ? 'Alerts Active' : 'Enable Alerts'}
              </button>
              <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                {state.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {state.darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-stone-950">
          <header className="sticky top-0 z-30 bg-white border-b border-stone-100 dark:border-stone-800 h-16 flex items-center justify-between px-8">
            <button className="lg:hidden p-2 text-stone-400" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1"></div>
            <div className="text-[10px] text-stone-300 uppercase tracking-widest font-normal">
              {notificationStatus === 'granted' ? 'System Active' : 'Offline Mode'}
            </div>
          </header>

          <div className="p-8 lg:p-12 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard state={state} />} />
              <Route path="/goals" element={<GoalsManager state={state} updateState={updateState} />} />
              <Route path="/fitness" element={<FitnessTracker state={state} updateState={updateState} />} />
              <Route path="/academic" element={<AcademicTracker state={state} updateState={updateState} />} />
              <Route path="/social" element={<SocialTracker state={state} updateState={updateState} />} />
              <Route path="/journal" element={<JournalEntries state={state} updateState={updateState} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} onClick={onClick} className={`
      flex items-center gap-4 px-4 py-3 text-sm transition-all duration-200 font-normal
      ${isActive 
        ? 'bg-stone-50 text-black dark:bg-stone-800 dark:text-white border-l-2 border-black dark:border-white' 
        : 'text-stone-400 hover:text-black dark:hover:text-stone-200'}
    `}>
      <span className={isActive ? 'text-black dark:text-white' : 'text-stone-300'}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
      </span>
      {label}
    </Link>
  );
};

export default App;
