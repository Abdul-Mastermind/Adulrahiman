
import { SmallGoal, LongGoal, DailyFitness, FitnessTargets } from '../types';

export const calculateSmallGoalsProgress = (goals: SmallGoal[]): number => {
  if (goals.length === 0) return 0;
  const completedCount = goals.filter(g => g.completed).length;
  return Math.round((completedCount / goals.length) * 100);
};

export const calculateLongGoalsProgress = (goals: LongGoal[]): number => {
  if (goals.length === 0) return 0;
  const total = goals.reduce((acc, g) => acc + g.progress, 0);
  return Math.round(total / goals.length);
};

export const calculateWeeklyFitnessProgress = (history: DailyFitness[], targets: FitnessTargets): {
  pushups: number;
  pullups: number;
  plank: number;
  overall: number;
} => {
  const getWeeklySum = (key: 'pushups' | 'pullups' | 'plank') => {
    return history.reduce((acc, h) => acc + h[key], 0);
  };

  const pushupsSum = getWeeklySum('pushups');
  const pullupsSum = getWeeklySum('pullups');
  const plankSum = getWeeklySum('plank');

  const pushupPerc = targets.pushups > 0 ? Math.min(100, (pushupsSum / targets.pushups) * 100) : 0;
  const pullupPerc = targets.pullups > 0 ? Math.min(100, (pullupsSum / targets.pullups) * 100) : 0;
  const plankPerc = targets.plank > 0 ? Math.min(100, (plankSum / targets.plank) * 100) : 0;

  return {
    pushups: Math.round(pushupPerc),
    pullups: Math.round(pullupPerc),
    plank: Math.round(plankPerc),
    overall: Math.round((pushupPerc + pullupPerc + plankPerc) / 3)
  };
};

export const getProgressColor = (percent: number): string => {
  if (percent <= 40) return 'bg-stone-200 text-stone-400'; 
  if (percent <= 75) return 'bg-green-300 text-green-700'; 
  return 'bg-black text-white'; 
};

export const getMotivationalMessage = (score: number): string => {
  if (score === 100) return "Mission Complete. Every objective has been neutralized.";
  if (score >= 90) return "Elite performance. Your focus is unmatched.";
  if (score >= 75) return "Consistent output. Maintain this momentum.";
  if (score >= 50) return "Steady progress. You are exactly where you need to be.";
  if (score >= 25) return "Initiating protocol. Increase operational tempo.";
  return "Zero hour. Your fresh start begins with the next action.";
};
