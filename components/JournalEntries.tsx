
import React, { useState } from 'react';
import { BookOpen, Plus, Search, Trash2, FileText, Clock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { AppState, JournalEntry } from '../types';
import { GoogleGenAI } from "@google/genai";

const JournalEntries: React.FC<{ state: AppState; updateState: (key: keyof AppState, value: any) => void }> = ({ state, updateState }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lesson, setLesson] = useState('');
  const [content, setContent] = useState('');
  const [studyHours, setStudyHours] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isChecking, setIsChecking] = useState(false);
  const [grammarFeedback, setGrammarFeedback] = useState<string | null>(null);

  const checkGrammar = async () => {
    if (!content || content.length < 5) return;
    
    setIsChecking(true);
    setGrammarFeedback(null);
    
    try {
      // Corrected Gemini API initialization to use API key directly from environment variables
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following text for English grammar and spelling mistakes. 
        If there are mistakes, list them clearly and provide a corrected version. 
        If the text is not in English, state 'The text must be written in English'.
        If the grammar is perfect, say 'PERFECT'.
        
        Text to analyze: "${content}"`,
      });
      
      const result = response.text?.trim() || 'No feedback available.';
      if (result !== 'PERFECT') {
        setGrammarFeedback(result);
      } else {
        setGrammarFeedback('Scan Complete: Your grammar is correct.');
      }
    } catch (err) {
      console.error(err);
      setGrammarFeedback('Service temporarily unavailable.');
    } finally {
      setIsChecking(false);
    }
  };

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson || !content) return;
    
    const newEntry: JournalEntry = { 
      id: Date.now().toString(), 
      date, 
      lesson, 
      content,
      studyHours: Number(studyHours) || 0
    };
    updateState('journalEntries', [newEntry, ...state.journalEntries]);
    setLesson(''); 
    setContent(''); 
    setStudyHours(0);
    setGrammarFeedback(null);
    setIsAdding(false);
  };

  const deleteEntry = (id: string) => updateState('journalEntries', state.journalEntries.filter(e => e.id !== id));

  const filtered = state.journalEntries.filter(e => 
    e.lesson.toLowerCase().includes(searchTerm.toLowerCase()) || e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl text-stone-900 dark:text-white tracking-tight">Mission Log</h2>
          <p className="text-stone-400 text-sm mt-1">Field observations and personal debrief</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white text-sm transition-all flex items-center gap-2 rounded-lg">
          {isAdding ? 'Close Log' : <><Plus size={18}/> New Entry</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-stone-900 p-10 border border-stone-100 dark:border-stone-800 animate-in slide-in-from-top-4 duration-500">
           <form onSubmit={addEntry} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Subject</label>
                    <input type="text" value={lesson} onChange={e => setLesson(e.target.value)} placeholder="Lesson title..." className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none focus:border-green-600 rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-2">Hours</label>
                    <input type="number" step="0.5" value={studyHours} onChange={e => setStudyHours(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-stone-200 text-sm outline-none focus:border-green-600 rounded-lg" />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest">Entry Detail (English Only)</label>
                    <button 
                      type="button" 
                      onClick={checkGrammar} 
                      disabled={isChecking || !content}
                      className="text-[10px] text-green-700 hover:text-green-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      {isChecking ? <Loader2 className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      Scan Grammar
                    </button>
                 </div>
                 <textarea 
                   value={content} 
                   onChange={e => setContent(e.target.value)} 
                   rows={6} 
                   className="w-full px-5 py-4 bg-white border border-stone-200 text-sm outline-none resize-none focus:border-green-600 rounded-lg" 
                   placeholder="Write your logs here..."/>
                 
                 {grammarFeedback && (
                   <div className={`p-4 border ${grammarFeedback.includes('Complete') ? 'border-green-100 bg-green-50/30' : 'border-amber-100 bg-amber-50/30'} rounded-lg`}>
                      <div className="flex items-start gap-3">
                         <AlertCircle className={grammarFeedback.includes('Complete') ? 'text-green-600' : 'text-amber-600'} size={16} />
                         <p className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed">{grammarFeedback}</p>
                      </div>
                   </div>
                 )}
              </div>
              <div className="flex justify-end gap-4">
                 <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-stone-400 hover:text-stone-900 transition-colors">Cancel</button>
                 <button type="submit" className="bg-stone-900 text-white px-8 py-3 text-sm hover:bg-green-900 rounded-lg transition-colors">Save Entry</button>
              </div>
           </form>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search records..." className="w-full pl-12 pr-4 py-3 bg-white border border-stone-100 text-sm outline-none focus:border-stone-300 rounded-full transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-stone-900 p-8 border border-stone-100 dark:border-stone-800 group relative hover:border-green-100 transition-all rounded-xl">
             <button onClick={() => deleteEntry(entry.id)} className="absolute top-6 right-6 text-stone-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
             <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-100 text-stone-300 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                   <p className="text-[10px] text-stone-400 uppercase tracking-widest">{entry.date}</p>
                   <h4 className="text-lg text-stone-800 dark:text-stone-200 mt-1">{entry.lesson}</h4>
                </div>
             </div>
             <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
               {entry.content}
             </p>
             <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-tighter">
                <Clock size={12}/> {entry.studyHours} Hours Invested
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center border border-dashed border-stone-100 rounded-xl">
            <BookOpen size={32} className="mx-auto mb-4 text-stone-200" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">No logs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEntries;
