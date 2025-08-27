# Gym Tracker App

A simple gym app for planning, managing, and tracking workouts and exercises.

## Tech Stack

* React Native + Expo
* TypeScript
* Firebase Authentication & Firestore
* TailwindCSS for styling
* React Navigation (Stack & Bottom Tabs)

## Installation

1. **Clone the repo**

```bash
git clone https://github.com/iC4rds/gym-app.git
cd gym-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start Expo**

```bash
npx expo start
```

Open the app in **Expo Go** on your phone or in an emulator.

4. **Set up Firebase**

* Create a Firebase project.
* Enable Auth & Firestore.
* Add your Firebase config in `src/firebase.ts`.

## Project Structure

```
src/
├─ components/      # Reusable UI components (e.g., BottomNav, Buttons)
├─ hooks/           # Custom hooks for state management and Firestore logic (e.g., useWorkouts)
├─ screens/         # App screens (Login, Signup, Home, Workout, Exercise, Profile)
├─ types/           # TypeScript types (Navigation, Data models)
└─ firebase.ts      # Firebase configuration and authentication
```