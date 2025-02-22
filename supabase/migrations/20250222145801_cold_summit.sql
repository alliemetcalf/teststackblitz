/*
  # Quiz Application Schema

  1. New Tables
    - `users` (handled by Supabase Auth)
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (references auth.users)
      - `score` (integer)
      - `completion_time` (integer, in seconds)
      - `created_at` (timestamp)
    - `questions`
      - `id` (uuid, primary key)
      - `question_text` (text)
      - `options` (jsonb array of options)
      - `correct_answer` (integer, index of correct option)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  score integer NOT NULL,
  completion_time integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies for questions
CREATE POLICY "Questions are readable by authenticated users"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for quiz results
CREATE POLICY "Users can insert their own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample questions
INSERT INTO questions (question_text, options, correct_answer) VALUES
  ('What is the capital of France?', '["London", "Berlin", "Paris", "Madrid"]'::jsonb, 2),
  ('Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]'::jsonb, 1),
  ('Who painted the Mona Lisa?', '["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"]'::jsonb, 2),
  ('What is the largest mammal in the world?', '["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]'::jsonb, 1),
  ('Which element has the chemical symbol Au?', '["Silver", "Copper", "Gold", "Aluminum"]'::jsonb, 2),
  ('What is the largest organ in the human body?', '["Heart", "Brain", "Liver", "Skin"]'::jsonb, 3),
  ('Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]'::jsonb, 1),
  ('What is the capital of Japan?', '["Seoul", "Beijing", "Tokyo", "Bangkok"]'::jsonb, 2),
  ('Which gas do plants absorb from the atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]'::jsonb, 1),
  ('What is the hardest natural substance on Earth?', '["Gold", "Iron", "Diamond", "Platinum"]'::jsonb, 2),
  ('Who invented the telephone?', '["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"]'::jsonb, 1),
  ('What is the largest ocean on Earth?', '["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]'::jsonb, 3),
  ('Which country is home to the kangaroo?', '["New Zealand", "South Africa", "Australia", "Brazil"]'::jsonb, 2),
  ('What is the main component of the Sun?', '["Oxygen", "Carbon", "Helium", "Hydrogen"]'::jsonb, 3),
  ('Who was the first person to walk on the Moon?', '["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"]'::jsonb, 1);