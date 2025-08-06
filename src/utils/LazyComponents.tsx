import { lazy } from 'react';

// Lazy load components for code splitting
export const LazyDieter = lazy(() => import('../page/MainContent/Dieter'));
export const LazyExerciseRecord = lazy(() => import('../page/MainContent/ExerciseRecord'));
export const LazyFoodLog = lazy(() => import('../page/MainContent/FoodLog'));
export const LazyWeightManagement = lazy(() => import('../page/MainContent/WeightManagement'));
export const LazyProfileSettings = lazy(() => import('../page/MainContent/ProfileSettings'));

// Dieter components lazy loading
export const LazyFollowManagement = lazy(() => import('../component/Dieter/user/FollowManagement'));
export const LazyMessages = lazy(() => import('../component/Dieter/message/Messages'));
export const LazyNotificationsPage = lazy(() => import('../component/Dieter/notifications/NotificationsPage'));

// Chart components are loaded through page components, so we don't need separate lazy loading for them
