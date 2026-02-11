
import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, PieChart as PieIcon, AlertTriangle, Calendar, CheckCircle2, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AppState, AcademicLog, AcademicPlan } from '../types';

const AcademicTracker: React.FC<{ state: AppState; updateState: (key: keyof AppState, value: any) => void }> = ({ state, updateState }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [intel, setIntel] = useState('');
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [planSubject, setPlanSubject] = useState('');
  const [planTopic, setPlanTopic] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const hasLoggedToday = state.academicLogs.some(l => l.date === today);

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic || !intel) return;
    const newLog: AcademicLog = {
      id: Date.now().toString(),
      date,
      subject,
      topic,
      intel,
      timeSpent: Number(timeSpent) || 0
    };
    updateState('academicLogs', [newLog, ...state.academicLogs]);
    setSubject(''); setTopic(''); setIntel(''); setTimeSpent(0); setIsAdding(false);
  };

  const addPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planSubject || !planTopic) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const newPlan: AcademicPlan = {
      id: Date.now().toString(),
      date: tomorrowStr,
      subject: planSubject,
      topic: planTopic
    };
    
    updateState('academicPlans', [newPlan, ...state.academicPlans]);
    setPlanSubject(''); setPlanTopic(''); setIsPlanning(false);
  };

  const deleteLog = (id: string) => updateState('academicLogs', state.academicLogs.filter(l => l.id !== id));
  const deletePlan = (id: string) => updateState('academicPlans', state.academicPlans.filter(p => p.id !== id));

  const subjectDistribution = state.academicLogs.reduce((acc: Record<string, number>, log) => {
    acc[log.subject] = (acc[log.subject] || 0) + log.timeSpent;
    return acc;
  }, {});

  const pieData = Object.keys(subjectDistribution).map(name => ({
    name,
    value: subjectDistribution[name]
  }));

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

  return (
    <div className="space-y-12 max-w-6xl font-normal text-black bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-3xl tracking-tight font-normal text-black">Academic Logs</h2>
          <p className="text-stone-400 text-sm mt-1 font-normal">Track subjects, topics, and time investment</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsAdding(!isAdding)} className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2 rounded-lg font-normal">
            {isAdding ? 'Close Form' : <><Plus size={16}/> Add Study Entry</>}
          </button>
        </div>
      </div>

      {!hasLoggedToday && !isPlanning && !isAdding && (
        <div className="bg-stone-50 border border-stone-100 p-8 rounded-2xl animate-in fade-in duration-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border border-stone-100 text-amber-500">
               <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-black font-normal">No academic activity logged today.</p>
              <p className="text-xs text-stone-400 font-normal mt-1">Consistency is key to performance. Plan your tomorrow now.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPlanning(true)}
            className="px-6 py-3 border border-black text-black text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all rounded-lg font-normal flex items-center gap-2"
          >
            <Calendar size={16} /> Set Study Reminder
          </button>
        </div>
      )}

      {isPlanning && (
        <div className="bg-stone-50 p-8 border border-stone-100 rounded-2xl animate-in slide-in-from-top-4">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-normal">Tomorrow's Strategic Plan</h3>
              <button onClick={() => setIsPlanning(false)} className="text-stone-400 hover:text-black"><X size={16}/></button>
           </div>
           <form onSubmit={addPlan} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                 <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Target Subject</label>
                 <input type="text" value={planSubject} onChange={e => setPlanSubject(e.target.value)} placeholder="e.g. Advanced Calculus" className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" required />
              </div>
              <div>
                 <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Target Topic</label>
                 <input type="text" value={planTopic} onChange={e => setPlanTopic(e.target.value)} placeholder="e.g. Integration by parts" className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg text-black font-normal" required />
              </div>
              <button type="submit" className="bg-black text-white py-3.5 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all rounded-lg font-normal">Establish Reminder</button>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="h-64 relative bg-white border border-stone-100 p-6 rounded-2xl">
             <h3 className="text-[10px] uppercase tracking-widest text-stone-400 mb-4 text-center">Subject Distribution</h3>
             {pieData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 400 }} />
                  </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-stone-200">
                  <PieIcon size={48} />
               </div>
             )}
          </div>

          <div className="bg-white border border-stone-100 p-8 rounded-2xl">
             <h3 className="text-[10px] uppercase tracking-widest text-stone-400 mb-6 font-normal">Upcoming Plans</h3>
             <div className="space-y-4">
               {state.academicPlans.map(plan => (
                 <div key={plan.id} className="p-4 border border-stone-50 bg-stone-50/30 rounded-xl group relative">
                    <button onClick={() => deletePlan(plan.id)} className="absolute top-2 right-2 text-stone-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                       <X size={14} />
                    </button>
                    <div className="flex items-start gap-3">
                       <div className="mt-1 text-green-600"><CheckCircle2 size={14} /></div>
                       <div>
                          <p className="text-xs text-stone-400 uppercase tracking-tight">{plan.date}</p>
                          <p className="text-sm text-black mt-1 font-normal">{plan.subject}</p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{plan.topic}</p>
                       </div>
                    </div>
                 </div>
               ))}
               {state.academicPlans.length === 0 && (
                 <p className="text-xs text-stone-300 italic py-4 text-center">No reminders scheduled</p>
               )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
           {isAdding && (
             <div className="bg-white p-10 border border-stone-100 rounded-2xl shadow-sm">
                <form onSubmit={addLog} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                         <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Subject</label>
                         <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics" className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg font-normal text-black" />
                      </div>
                      <div>
                         <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Topic</label>
                         <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Mechanics" className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg font-normal text-black" />
                      </div>
                      <div>
                         <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Time (Min)</label>
                         <input type="number" value={timeSpent} onChange={e => setTimeSpent(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg font-normal text-black" />
                      </div>
                      <div>
                         <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Date</label>
                         <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg font-normal text-black" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">What you learned</label>
                      <textarea value={intel} onChange={e => setIntel(e.target.value)} rows={3} className="w-full px-5 py-4 bg-white border border-stone-200 text-sm outline-none resize-none focus:border-black rounded-lg font-normal text-black" placeholder="Summarize your key takeaways..."/>
                   </div>
                   <div className="flex justify-end gap-6">
                      <button type="submit" className="bg-black text-white px-10 py-3 text-sm hover:bg-stone-800 transition-colors rounded-lg font-normal">Submit Entry</button>
                   </div>
                </form>
             </div>
           )}

           <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-stone-50 border-b border-stone-100">
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Date</th>
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Subject</th>
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Topic</th>
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Intel</th>
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Time</th>
                     <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                   {state.academicLogs.map(log => (
                     <tr key={log.id} className="hover:bg-stone-50/50 transition-colors group">
                       <td className="px-6 py-4 text-sm text-stone-400 font-normal whitespace-nowrap">{log.date}</td>
                       <td className="px-6 py-4 text-sm text-black font-normal">{log.subject}</td>
                       <td className="px-6 py-4 text-sm text-black font-normal">{log.topic}</td>
                       <td className="px-6 py-4 text-sm text-stone-500 font-normal leading-relaxed">{log.intel}</td>
                       <td className="px-6 py-4 text-sm text-black font-normal whitespace-nowrap">{log.timeSpent}m</td>
                       <td className="px-6 py-4">
                         <button onClick={() => deleteLog(log.id)} className="text-stone-200 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {state.academicLogs.length === 0 && (
                     <tr>
                       <td colSpan={6} className="px-6 py-24 text-center text-xs text-stone-300 uppercase tracking-widest font-normal">
                         No records found
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTracker;
