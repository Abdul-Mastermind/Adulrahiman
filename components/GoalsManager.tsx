
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, BookOpen, Clock } from 'lucide-react';
import { AppState, SmallGoal, LongGoal, Priority } from '../types';
import ProgressBar from './ProgressBar';

const GoalsManager: React.FC<{ state: AppState; updateState: (key: keyof AppState, value: any) => void }> = ({ state, updateState }) => {
  const [activeTab, setActiveTab] = useState<'small' | 'long'>('small');
  const [smallGoalName, setSmallGoalName] = useState('');
  const [longGoalName, setLongGoalName] = useState('');
  const [newLearning, setNewLearning] = useState<{ id: string, text: string }>({ id: '', text: '' });

  const addSmallGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smallGoalName) return;
    const newGoal: SmallGoal = {
      id: Date.now().toString(),
      name: smallGoalName,
      priority: Priority.MEDIUM,
      completed: false,
    };
    updateState('smallGoals', [newGoal, ...state.smallGoals]);
    setSmallGoalName('');
  };

  const addLongGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longGoalName) return;
    const newGoal: LongGoal = {
      id: Date.now().toString(),
      name: longGoalName,
      progress: 0,
      learnings: []
    };
    updateState('longGoals', [newGoal, ...state.longGoals]);
    setLongGoalName('');
  };

  const addLearningToGoal = (goalId: string) => {
    if (!newLearning.text) return;
    const updatedGoals = state.longGoals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          learnings: [{ date: new Date().toLocaleDateString(), intel: newLearning.text }, ...g.learnings]
        };
      }
      return g;
    });
    updateState('longGoals', updatedGoals);
    setNewLearning({ id: '', text: '' });
  };

  return (
    <div className="space-y-12 max-w-5xl font-normal text-black bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-3xl tracking-tight font-normal">Strategic Goals</h2>
          <p className="text-stone-400 text-sm mt-1 font-normal">Define and monitor your long-term and short-term objectives</p>
        </div>
        <div className="flex p-1 bg-stone-50 border border-stone-100 rounded-xl">
          <button onClick={() => setActiveTab('small')} className={`px-6 py-2 text-xs transition-all rounded-lg font-normal ${activeTab === 'small' ? 'bg-white text-black shadow-sm' : 'text-stone-400'}`}>Short Range</button>
          <button onClick={() => setActiveTab('long')} className={`px-6 py-2 text-xs transition-all rounded-lg font-normal ${activeTab === 'long' ? 'bg-white text-black shadow-sm' : 'text-stone-400'}`}>Long Strategy</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 border border-stone-100 rounded-2xl shadow-sm sticky top-24">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-8 border-b border-stone-50 pb-4 font-normal">Add Objective</h3>
            <form onSubmit={activeTab === 'small' ? addSmallGoal : addLongGoal} className="space-y-6">
              <div>
                <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-normal">Goal Name</label>
                <input 
                  type="text" 
                  value={activeTab === 'small' ? smallGoalName : longGoalName} 
                  onChange={e => activeTab === 'small' ? setSmallGoalName(e.target.value) : setLongGoalName(e.target.value)} 
                  placeholder="Enter specific objective..." 
                  className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg focus:border-black font-normal text-black" 
                />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 text-sm tracking-wide rounded-lg transition-colors font-normal">Confirm Mission</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'small' ? (
            state.smallGoals.map(goal => (
              <div key={goal.id} className={`bg-white p-6 border border-stone-100 rounded-2xl flex items-center gap-6 group transition-all ${goal.completed ? 'opacity-40' : 'hover:shadow-sm'}`}>
                <button onClick={() => updateState('smallGoals', state.smallGoals.map(g => g.id === goal.id ? { ...g, completed: !g.completed } : g))}>
                  {goal.completed ? <CheckCircle size={24} className="text-black" /> : <Circle size={24} className="text-stone-200 hover:text-black" />}
                </button>
                <div className="flex-1">
                  <h4 className={`text-base text-black font-normal ${goal.completed ? 'line-through text-stone-400' : ''}`}>{goal.name}</h4>
                </div>
                <button onClick={() => updateState('smallGoals', state.smallGoals.filter(g => g.id !== goal.id))} className="p-2 text-stone-100 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
              </div>
            ))
          ) : (
            state.longGoals.map(goal => (
              <div key={goal.id} className="bg-white p-8 border border-stone-100 rounded-2xl hover:shadow-sm transition-all text-black space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl text-black tracking-tight font-normal">{goal.name}</h4>
                  </div>
                  <button onClick={() => updateState('longGoals', state.longGoals.filter(g => g.id !== goal.id))} className="p-2 text-stone-200 hover:text-black transition-colors"><Trash2 size={18} /></button>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-normal">Progress Status</span>
                      <span className="text-sm font-normal">{goal.progress}%</span>
                   </div>
                   <ProgressBar progress={goal.progress} showText={false} size="lg" />
                   <div className="pt-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={goal.progress} 
                        onChange={e => updateState('longGoals', state.longGoals.map(g => g.id === goal.id ? { ...g, progress: parseInt(e.target.value) } : g))} 
                        className="w-full h-1 bg-stone-100 appearance-none accent-black cursor-pointer rounded-full" 
                      />
                   </div>
                </div>
                
                <div className="pt-8 border-t border-stone-100">
                   <h5 className="text-[11px] uppercase tracking-widest text-black mb-6 flex items-center gap-2 font-normal">
                     <BookOpen size={14} className="text-green-600" /> Daily Learning Capture
                   </h5>
                   
                   <div className="mb-8">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-3 font-normal">What specifically did you learn for this goal today?</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newLearning.id === goal.id ? newLearning.text : ''} 
                          onChange={e => setNewLearning({ id: goal.id, text: e.target.value })} 
                          placeholder="Note down today's knowledge gain..." 
                          className="flex-1 px-4 py-3 bg-white border border-stone-200 text-sm outline-none focus:border-black rounded-lg font-normal text-black" 
                        />
                        <button onClick={() => addLearningToGoal(goal.id)} className="bg-black text-white px-5 hover:bg-stone-800 transition-colors rounded-lg font-normal flex items-center justify-center">
                          <Plus size={18}/>
                        </button>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {goal.learnings && goal.learnings.length > 0 ? (
                        goal.learnings.map((l, i) => (
                          <div key={i} className="group flex gap-4">
                             <div className="pt-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] text-stone-300 uppercase font-normal">{l.date}</span>
                                </div>
                                <p className="text-sm text-stone-600 leading-relaxed font-normal">{l.intel}</p>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center border border-dashed border-stone-100 rounded-xl">
                          <p className="text-xs text-stone-300 italic font-normal uppercase tracking-widest">No daily logs yet</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsManager;
