import { lazy } from 'react';

// Lazy load components for code splitting
export const LazyDieter = lazy(() => import('../page/MainContent/Dieter'));
export const LazyExerciseRecord = lazy(() => import('../page/MainContent/ExerciseRecord'));
export const LazyFoodLog = lazy(() => import('../page/MainContent/FoodLog'));
export const LazyWeightManagement = lazy(() => import('../page/MainContent/WeightManagement'));
export const LazyProfileSettings = lazy(() => import('../page/MainContent/ProfileSettings'));
