
import React, { useState } from 'react';
import { Smartphone, History, X, BellOff, Bell } from 'lucide-react';
import { AppState, SocialUsage } from '../types';

const PLATFORMS = ['Instagram', 'TikTok', 'X', 'Facebook', 'YouTube', 'Gaming', 'Other'];

const SocialTracker: React.FC<{ state: AppState; updateState: (key: keyof AppState, value: any) => void }> = ({ state, updateState }) => {
  const [minutes, setMinutes] = useState(0);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) return;
    const newUsage: SocialUsage = { platform, minutes, date };
    updateState('socialUsage', [newUsage, ...state.socialUsage]);
    setMinutes(0);
  };

  const deleteUsage = (index: number) => {
    const newUsage = [...state.socialUsage];
    newUsage.splice(index, 1);
    updateState('socialUsage', newUsage);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayUsage = state.socialUsage
    .filter(u => u.date === today)
    .reduce((acc, u) => acc + u.minutes, 0);

  const isOverLimit = todayUsage > state.screenTimeLimit;
  const isMuted = state.muteRemindersDate === today;

  const toggleMute = () => {
    updateState('muteRemindersDate', isMuted ? null : today);
  };

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl text-stone-900 dark:text-white tracking-tight">Comms Control</h2>
          <p className="text-stone-400 text-sm mt-1">Monitor digital saturation</p>
        </div>
        <div className={`flex items-center gap-4 px-6 py-4 border ${isOverLimit ? 'bg-red-50 border-red-100 text-red-700' : 'bg-white border-stone-100 text-stone-600'} rounded-xl transition-colors`}>
           <Smartphone size={20} className={isOverLimit ? 'text-red-500' : 'text-green-500'} />
           <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Current Load</p>
              <p className="text-xl">{todayUsage}m / {state.screenTimeLimit}m</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-stone-900 p-8 border border-stone-100 rounded-xl shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-8 border-b border-stone-50 pb-4">Log Duration</h3>
            <form onSubmit={addUsage} className="space-y-6">
              <div>
                <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg">
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Minutes</label>
                <input type="number" value={minutes} onChange={e => setMinutes(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg focus:border-green-600" />
              </div>
              <button type="submit" className="w-full bg-stone-900 hover:bg-green-700 text-white py-4 text-sm tracking-wide rounded-lg transition-colors">Add Record</button>
            </form>
          </div>

          <div className="bg-stone-50/50 dark:bg-stone-900 p-8 border border-stone-100 rounded-xl">
             <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-6">Alert Limit</h3>
             <input 
               type="range" min="30" max="480" step="30" 
               value={state.screenTimeLimit} 
               onChange={e => updateState('screenTimeLimit', parseInt(e.target.value))}
               className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none accent-green-600 cursor-pointer"
             />
             <div className="mt-4 flex justify-between text-[11px] text-stone-500 uppercase tracking-tight">
                <span>Threshold:</span>
                <span className="text-green-700">{Math.floor(state.screenTimeLimit / 60)}h {state.screenTimeLimit % 60}m</span>
             </div>

             <button 
                onClick={toggleMute}
                className={`mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase transition-all rounded-lg border ${
                  isMuted 
                  ? 'bg-amber-50 border-amber-100 text-amber-700' 
                  : 'bg-white border-stone-100 text-stone-400 hover:border-amber-100 hover:text-amber-600'
                }`}
             >
                {isMuted ? <Bell size={14} /> : <BellOff size={14} />}
                {isMuted ? "Alerts Muted" : "Don't remind today"}
             </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-stone-900 border border-stone-100 rounded-xl overflow-hidden">
             <div className="px-8 py-4 bg-stone-50/50 border-b border-stone-100 flex items-center gap-2">
               <History size={16} className="text-stone-300"/> 
               <h3 className="text-xs uppercase tracking-widest text-stone-400">Recent Logs</h3>
             </div>
             <div className="divide-y divide-stone-50">
                {state.socialUsage.slice(0, 8).map((u, i) => (
                   <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-stone-50/30 transition-colors">
                      <div>
                         <p className="text-sm text-stone-700">{u.platform}</p>
                         <p className="text-[10px] text-stone-300 uppercase mt-1">{u.date}</p>
                      </div>
                      <div className="flex items-center gap-8">
                         <span className={`text-sm ${u.minutes > 60 ? 'text-red-500' : 'text-stone-400'}`}>{u.minutes}m</span>
                         <button onClick={() => deleteUsage(i)} className="text-stone-200 hover:text-red-500"><X size={16}/></button>
                      </div>
                   </div>
                ))}
                {state.socialUsage.length === 0 && <div className="p-24 text-center text-xs text-stone-300 uppercase tracking-widest">No history recorded</div>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTracker;
