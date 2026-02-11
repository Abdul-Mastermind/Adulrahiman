
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface SmallGoal {
  id: string;
  name: string;
  deadline?: string;
  priority: Priority;
  completed: boolean;
}

export interface GoalLearning {
  date: string;
  intel: string;
}

export interface LongGoal {
  id: string;
  name: string;
  targetDate?: string;
  progress: number; // 0-100
  learnings: GoalLearning[];
}

export interface FitnessTargets {
  pushups: number;
  pullups: number;
  plank: number; // seconds
}

export interface DailyFitness {
  date: string;
  pushups: number;
  pullups: number;
  plank: number;
  sixPackDetails: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  lesson: string;
  content: string;
  studyHours: number;
}

export interface SocialUsage {
  platform: string;
  minutes: number;
  date: string;
}

export interface AcademicLog {
  id: string;
  date: string;
  subject: string;
  topic: string;
  intel: string;
  timeSpent: number; // in minutes
}

export interface AcademicPlan {
  id: string;
  date: string;
  subject: string;
  topic: string;
}

export interface AppState {
  smallGoals: SmallGoal[];
  longGoals: LongGoal[];
  fitnessTargets: FitnessTargets;
  fitnessHistory: DailyFitness[];
  journalEntries: JournalEntry[];
  socialUsage: SocialUsage[];
  academicLogs: AcademicLog[];
  academicPlans: AcademicPlan[];
  screenTimeLimit: number; // in minutes
  muteRemindersDate: string | null; // ISO date string if muted
  darkMode: boolean;
}
