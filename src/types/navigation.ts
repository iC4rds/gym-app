export type RootStackParamList = {
  MainTabs: { screen: keyof RootTabParamList };
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Workout: { workoutId?: string };
};

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};
