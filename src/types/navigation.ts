export type RootStackParamList = {
  MainTabs: { screen: keyof RootTabParamList };
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Workout: { 
    workoutId: string; 
    isNew?: boolean; 
  };
  Exercise: { 
    workoutId: string; 
    exerciseId?: string; 
  };
};

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};
