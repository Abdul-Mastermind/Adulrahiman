
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Target, Smartphone, GraduationCap, Dumbbell } from 'lucide-react';
import { AppState } from '../types';
import { 
  calculateSmallGoalsProgress, 
  calculateLongGoalsProgress, 
  calculateWeeklyFitnessProgress, 
  getMotivationalMessage 
} from '../utils/calculations';

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const smallPerc = calculateSmallGoalsProgress(state.smallGoals);
  const longPerc = calculateLongGoalsProgress(state.longGoals);
  const goalPerc = Math.round((smallPerc + longPerc) / 2) || 0;
  const fitness = calculateWeeklyFitnessProgress(state.fitnessHistory, state.fitnessTargets);
  const overallPerformance = Math.round((goalPerc + fitness.overall) / 2);

  const today = new Date().toISOString().split('T')[0];
  const todayUsage = state.socialUsage
    .filter(u => u.date === today)
    .reduce((acc, u) => acc + u.minutes, 0);
  
  const screenTimePerc = state.screenTimeLimit > 0 ? Math.min(100, Math.round((todayUsage / state.screenTimeLimit) * 100)) : 0;

  const academicCount = state.academicLogs.length;
  // Synthetic target for academic pie chart visibility (e.g., 10 logs)
  const academicPerc = Math.min(100, (academicCount / 10) * 100);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 bg-white text-black font-normal">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-3xl tracking-tight font-normal">Performance Dashboard</h2>
          <p className="text-stone-400 text-sm mt-1 font-normal">Real-time status of all mission parameters</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1 font-normal">Efficiency Score</p>
            <p className="text-4xl text-black font-normal">{overallPerformance}%</p>
          </div>
          <Zap className="text-black" size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <CircularMetric title="Goal Completion" percent={goalPerc} icon={<Target size={16} />} />
        <CircularMetric title="Fitness Readiness" percent={fitness.overall} icon={<Dumbbell size={16} />} />
        <CircularMetric title="Screen Usage" percent={screenTimePerc} icon={<Smartphone size={16} />} />
        <CircularMetric title="Academics Logged" percent={academicPerc} icon={<GraduationCap size={16} />} />
      </div>

      <div className="bg-white p-10 border border-stone-100 rounded-2xl">
        <h3 className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-normal flex items-center gap-2">
          Daily Briefing
        </h3>
        <p className="text-2xl text-black italic leading-relaxed font-normal">
          {getMotivationalMessage(overallPerformance)}
        </p>
      </div>
    </div>
  );
};

const CircularMetric: React.FC<{ title: string; percent: number; icon: React.ReactNode }> = ({ title, percent, icon }) => {
  const data = [
    { name: 'Progress', value: percent },
    { name: 'Remaining', value: Math.max(0, 100 - percent) },
  ];

  // Using strictly green shades
  const COLORS = ['#16a34a', '#f0fdf4']; 

  return (
    <div className="flex flex-col items-center group">
      <div className="w-full h-48 relative mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl text-black font-normal">{percent}%</span>
          <div className="text-stone-300 mt-1">{icon}</div>
        </div>
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-normal">{title}</h4>
    </div>
  );
};

export default Dashboard;
