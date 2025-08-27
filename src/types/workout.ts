export type Exercise = {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
};

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  exerciseCount?: number;
};