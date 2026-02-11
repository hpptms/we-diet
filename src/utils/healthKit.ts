// HealthKit Service Layer for Capacitor iOS
// Uses capacitor-health plugin (v7+)
import { isIOSNative } from './platform';
import type { DeviceExerciseData } from './deviceSync';

export interface HealthKitPermissionStatus {
  granted: boolean;
  error?: string;
}

export interface HealthKitBodyData {
  weight?: number;  // kg
  date?: Date;
}

// capacitor-health plugin reference (loaded lazily to avoid import errors on web)
// IMPORTANT: Never return this proxy from an async function!
// Capacitor's registerPlugin returns a Proxy that intercepts ALL property access.
// If returned from an async function, the Promise resolution algorithm calls .then()
// on the proxy, which gets routed to the native side and fails.
let _health: any = null;
let _pluginLoaded = false;

const ensurePlugin = async (): Promise<boolean> => {
  if (_pluginLoaded) return _health !== null;
  _pluginLoaded = true;
  if (!isIOSNative()) return false;
  try {
    const mod = await import('capacitor-health');
    _health = mod.Health;
    return true;
  } catch {
    return false;
  }
};

export const isHealthKitAvailable = (): boolean => {
  return isIOSNative();
};

export const requestHealthKitPermissions = async (): Promise<HealthKitPermissionStatus> => {
  if (!isIOSNative()) {
    return { granted: false, error: 'Not iOS native' };
  }

  try {
    const ready = await ensurePlugin();
    if (!ready || !_health) return { granted: false, error: 'Plugin not available' };

    // Check availability first
    const availability = await _health.isHealthAvailable();
    if (!availability.available) {
      return { granted: false, error: 'HealthKit not available' };
    }

    await _health.requestHealthPermissions({
      permissions: [
        'READ_STEPS',
        'READ_DISTANCE',
        'READ_ACTIVE_CALORIES',
        'READ_TOTAL_CALORIES',
        'READ_HEART_RATE',
        'READ_WORKOUTS',
      ],
    });

    // Apple HealthKit does not expose whether the user actually granted permission.
    // requestHealthPermissions resolves successfully regardless of user choice.
    return { granted: true };
  } catch (error: any) {
    console.error('[HealthKit] Permission request error:', error);
    return {
      granted: false,
      error: error?.message || 'Permission request failed',
    };
  }
};

export const readHealthKitExerciseData = async (): Promise<DeviceExerciseData | null> => {
  if (!isIOSNative()) return null;

  try {
    const ready = await ensurePlugin();
    if (!ready || !_health) return null;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = startOfDay.toISOString();
    const endDate = now.toISOString();

    // Query steps and active calories via queryAggregated
    // Query workouts for distance and heart rate
    const [stepsResult, caloriesResult, workoutsResult] =
      await Promise.allSettled([
        _health.queryAggregated({
          startDate,
          endDate,
          dataType: 'steps',
          bucket: 'day',
        }),
        _health.queryAggregated({
          startDate,
          endDate,
          dataType: 'active-calories',
          bucket: 'day',
        }),
        _health.queryWorkouts({
          startDate,
          endDate,
          includeHeartRate: true,
          includeRoute: false,
          includeSteps: true,
        }),
      ]);

    // Steps from aggregated data
    let steps = 0;
    if (stepsResult.status === 'fulfilled' && stepsResult.value?.aggregatedData?.length > 0) {
      steps = stepsResult.value.aggregatedData.reduce(
        (sum: number, sample: any) => sum + (sample.value || 0), 0
      );
    }

    // Calories from aggregated data
    let calories = 0;
    if (caloriesResult.status === 'fulfilled' && caloriesResult.value?.aggregatedData?.length > 0) {
      calories = caloriesResult.value.aggregatedData.reduce(
        (sum: number, sample: any) => sum + (sample.value || 0), 0
      );
    }

    // Distance and heart rate from workouts
    let distanceMeters = 0;
    let heartRate: number | undefined;
    if (workoutsResult.status === 'fulfilled' && workoutsResult.value?.workouts?.length > 0) {
      const workouts = workoutsResult.value.workouts;
      distanceMeters = workouts.reduce(
        (sum: number, w: any) => sum + (w.distance || 0), 0
      );
      // Get latest heart rate from most recent workout
      const latestWorkout = workouts[workouts.length - 1];
      if (latestWorkout.heartRate?.length > 0) {
        const lastHR = latestWorkout.heartRate[latestWorkout.heartRate.length - 1];
        heartRate = lastHR.bpm;
      }
    }

    if (steps === 0 && distanceMeters === 0 && calories === 0) {
      return null;
    }

    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;
    const activeMinutes = steps > 0 ? Math.round(steps / 80) : undefined;

    return {
      steps,
      distance: distanceKm > 0 ? distanceKm : undefined,
      duration: activeMinutes,
      calories: Math.round(calories) || Math.round(steps * 0.04),
      activeMinutes,
      heartRate,
    };
  } catch (error) {
    console.error('[HealthKit] read error:', error);
    return null;
  }
};

// Note: capacitor-health v7 does not support reading/writing weight data.
// Weight management remains manual input only.
export const readHealthKitWeight = async (): Promise<{ weight?: number; date?: string } | null> => {
  return null;
};

export const writeWeightToHealthKit = async (data: HealthKitBodyData): Promise<boolean> => {
  // Not supported by capacitor-health v7
  return false;
};

// Local storage key for tracking permission request state
const HK_PERMISSION_KEY = 'healthkit_permission_requested';

export const hasRequestedHealthKitPermission = (): boolean => {
  return localStorage.getItem(HK_PERMISSION_KEY) === 'true';
};

export const setHealthKitPermissionRequested = (): void => {
  localStorage.setItem(HK_PERMISSION_KEY, 'true');
};
