import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Brain, Loader } from 'lucide-react';

export default function Quiz() {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const {
    questions,
    currentQuestionIndex,
    answers,
    loading,
    fetchQuestions,
    answerQuestion,
    saveQuizResult,
  } = useQuizStore();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (currentQuestionIndex === 5) {
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      saveQuizResult(completionTime).then(() => {
        navigate('/results');
      });
    }
  }, [currentQuestionIndex, navigate, saveQuizResult, startTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Add protection against empty questions array
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Add protection against undefined current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">An error occurred loading the question.</p>
          <button
            onClick={() => fetchQuestions()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <Brain className="h-8 w-8 text-indigo-600" />
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1}/5
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentQuestion.question_text}
          </h2>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(index)}
                className="w-full text-left p-4 border rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestionIndex / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
