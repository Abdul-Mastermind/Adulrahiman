
import React, { useState } from 'react';
import { Dumbbell, Target, History, TrendingUp, X } from 'lucide-react';
import { AppState, DailyFitness } from '../types';
import ProgressBar from './ProgressBar';
import { calculateWeeklyFitnessProgress } from '../utils/calculations';

const FitnessTracker: React.FC<{ state: AppState; updateState: (key: keyof AppState, value: any) => void }> = ({ state, updateState }) => {
  const [showTargets, setShowTargets] = useState(false);
  const [pushups, setPushups] = useState(0);
  const [pullups, setPullups] = useState(0);
  const [plank, setPlank] = useState(0);
  const [sixPack, setSixPack] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetPushups, setTargetPushups] = useState(state.fitnessTargets.pushups);
  const [targetPullups, setTargetPullups] = useState(state.fitnessTargets.pullups);
  const [targetPlank, setTargetPlank] = useState(state.fitnessTargets.plank);

  const saveTargets = () => {
    updateState('fitnessTargets', { pushups: targetPushups, pullups: targetPullups, plank: targetPlank });
    setShowTargets(false);
  };

  const addDailyEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DailyFitness = { date, pushups, pullups, plank, sixPackDetails: sixPack };
    const idx = state.fitnessHistory.findIndex(h => h.date === date);
    let newHistory = [...state.fitnessHistory];
    if (idx > -1) newHistory[idx] = newEntry;
    else newHistory.push(newEntry);
    updateState('fitnessHistory', newHistory.sort((a, b) => b.date.localeCompare(a.date)));
    setPushups(0); setPullups(0); setPlank(0); setSixPack('');
  };

  const fitness = calculateWeeklyFitnessProgress(state.fitnessHistory, state.fitnessTargets);

  return (
    <div className="space-y-12 max-w-5xl font-normal text-black bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-3xl tracking-tight font-normal text-black">Readiness Logs</h2>
          <p className="text-stone-400 text-sm mt-1 font-normal">Personnel endurance and strength parameters</p>
        </div>
        <button onClick={() => setShowTargets(true)} className="px-6 py-3 bg-white border border-stone-100 text-stone-600 text-xs uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center gap-2 rounded-lg font-normal">
          <Target size={16} className="text-green-600"/> Adjust Targets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 border border-stone-100 rounded-2xl shadow-sm">
             <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-8 border-b border-stone-50 pb-4 font-normal">Input Data</h3>
             <form onSubmit={addDailyEntry} className="space-y-6">
                <div>
                   <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Date</label>
                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Push-ups</label>
                    <input type="number" value={pushups} onChange={e => setPushups(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Pull-ups</label>
                    <input type="number" value={pullups} onChange={e => setPullups(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Static Plank (Sec)</label>
                  <input type="number" value={plank} onChange={e => setPlank(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Notes</label>
                  <textarea value={sixPack} onChange={e => setSixPack(e.target.value)} rows={2} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none resize-none rounded-lg text-black font-normal" placeholder="Focus areas..."/>
                </div>
                <button type="submit" className="w-full bg-black text-white py-4 text-sm tracking-wide rounded-lg transition-colors font-normal">Save Entry</button>
             </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <MetricCard label="Push-ups" current={state.fitnessHistory.reduce((a, b) => a + b.pushups, 0)} target={state.fitnessTargets.pushups} percent={fitness.pushups} />
             <MetricCard label="Pull-ups" current={state.fitnessHistory.reduce((a, b) => a + b.pullups, 0)} target={state.fitnessTargets.pullups} percent={fitness.pullups} />
             <MetricCard label="Plank" current={state.fitnessHistory.reduce((a, b) => a + b.plank, 0)} target={state.fitnessTargets.plank} percent={fitness.plank} unit="s" />
           </div>

           <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
             <div className="px-8 py-5 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
               <h3 className="text-xs uppercase tracking-widest text-stone-400 flex items-center gap-2 font-normal"><TrendingUp size={16} className="text-stone-300"/> Training History</h3>
             </div>
             <div className="divide-y divide-stone-50">
               {state.fitnessHistory.slice(0, 6).map((h, i) => (
                 <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div>
                       <p className="text-sm text-stone-700 font-normal">{h.date}</p>
                       <p className="text-[10px] text-stone-400 uppercase mt-1 italic font-normal">{h.sixPackDetails || 'Standard Drill'}</p>
                    </div>
                    <div className="flex gap-6 text-[10px] text-stone-400 uppercase font-normal">
                       <span className="text-green-700">P: {h.pushups}</span>
                       <span className="text-stone-400">U: {h.pullups}</span>
                       <span className="text-stone-400">S: {h.plank}s</span>
                    </div>
                 </div>
               ))}
               {state.fitnessHistory.length === 0 && <div className="p-24 text-center text-xs text-stone-300 uppercase tracking-widest font-normal">Awaiting performance data</div>}
             </div>
           </div>
        </div>
      </div>

      {showTargets && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-stone-100 p-10 max-w-sm w-full relative shadow-2xl rounded-2xl">
             <button onClick={() => setShowTargets(false)} className="absolute top-6 right-6 text-stone-300 hover:text-stone-900 transition-colors"><X size={20}/></button>
             <h3 className="text-2xl text-black tracking-tight mb-10 font-normal">Target Definitions</h3>
             <div className="space-y-6">
                <div>
                   <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Weekly Pushups</label>
                   <input type="number" value={targetPushups} onChange={e => setTargetPushups(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                </div>
                <div>
                   <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Weekly Pullups</label>
                   <input type="number" value={targetPullups} onChange={e => setTargetPullups(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                </div>
                <div>
                   <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Weekly Plank (Sec)</label>
                   <input type="number" value={targetPlank} onChange={e => setTargetPlank(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" />
                </div>
                <button onClick={saveTargets} className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-green-700 transition-all rounded-lg font-normal">Update Parameters</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ label: string; current: number; target: number; percent: number; unit?: string }> = ({ label, current, target, percent, unit = '' }) => (
  <div className="bg-white p-8 border border-stone-100 rounded-2xl hover:shadow-sm transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className="text-stone-400 text-[10px] uppercase tracking-widest font-normal">{label}</h4>
        <p className="text-2xl text-black mt-2 font-normal">{current}{unit} <span className="text-stone-300 text-xs font-normal">/ {target}</span></p>
      </div>
      <div className={`text-[10px] px-2 py-1 uppercase rounded-md font-normal ${percent >= 75 ? 'bg-green-50 text-green-700' : 'bg-stone-50 text-stone-400'}`}>
        {percent}%
      </div>
    </div>
    <ProgressBar progress={percent} showText={false} size="sm" />
  </div>
);

export default FitnessTracker;
