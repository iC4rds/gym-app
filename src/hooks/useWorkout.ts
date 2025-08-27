import { useEffect, useState } from "react";
import { collection, onSnapshot, } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Workout } from "../types/workout";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const workoutsRef = collection(db, "users", user.uid, "workouts");

    const unsubscribe = onSnapshot(workoutsRef, (snapshot) => {
      const workoutList: Workout[] = [];

      snapshot.forEach((docSnap) => {
        workoutList.push({
          id: docSnap.id,
          name: docSnap.data().name,
          exercises: [],
          exerciseCount: docSnap.data().exerciseCount || 0,
        });
      });

      setWorkouts(workoutList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { workouts, loading };
}
