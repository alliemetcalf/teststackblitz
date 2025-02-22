import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '../lib/supabase';
import { Trophy, RotateCcw, Clock, Award } from 'lucide-react';

interface QuizResult {
  score: number;
  completion_time: number;
  created_at: string;
}

export default function Results() {
  const navigate = useNavigate();
  const score = useQuizStore((state) => state.score);
  const startNewQuiz = useQuizStore((state) => state.startNewQuiz);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setQuizHistory(data);
      }
    };

    fetchQuizHistory();
  }, []);

  const handleNewQuiz = () => {
    startNewQuiz();
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Quiz Results</h2>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg text-center">
          <p className="text-4xl font-bold text-indigo-600">{score}/5</p>
          <p className="mt-2 text-gray-600">Your Score</p>
        </div>

        {quizHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Attempts</h3>
            <div className="space-y-2">
              {quizHistory.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">Score: {result.score}/5</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{result.completion_time}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleNewQuiz}
            className="flex items-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Start New Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}