import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  loading: boolean;
  fetchQuestions: () => Promise<void>;
  answerQuestion: (answerIndex: number) => void;
  startNewQuiz: () => void;
  saveQuizResult: (completionTime: number) => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  loading: false,

  fetchQuestions: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(15);
    
    if (error) throw error;
    
    // Randomly select 5 questions
    const shuffled = data.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    set({ questions: selected, loading: false });
  },

  answerQuestion: (answerIndex: number) => {
    const state = get();
    const isCorrect = answerIndex === state.questions[state.currentQuestionIndex].correct_answer;
    
    set({
      answers: [...state.answers, answerIndex],
      score: isCorrect ? state.score + 1 : state.score,
      currentQuestionIndex: state.currentQuestionIndex + 1,
    });
  },

  startNewQuiz: () => {
    set({
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
    });
    get().fetchQuestions();
  },

  saveQuizResult: async (completionTime: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        score: get().score,
        completion_time: completionTime,
      });
    
    if (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  },
}));