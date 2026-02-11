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
let healthPlugin: any = null;

const getHealthPlugin = async () => {
  if (!isIOSNative()) return null;
  if (!healthPlugin) {
    try {
      const module = await import('capacitor-health');
      healthPlugin = module.Health;
    } catch {
      return null;
    }
  }
  return healthPlugin;
};

export const isHealthKitAvailable = (): boolean => {
  return isIOSNative();
};

export const requestHealthKitPermissions = async (): Promise<HealthKitPermissionStatus> => {
  if (!isIOSNative()) {
    return { granted: false, error: 'Not iOS native' };
  }

  try {
    const health = await getHealthPlugin();
    if (!health) return { granted: false, error: 'Plugin not available' };

    // Check availability first
    const availability = await health.isAvailable();
    if (!availability.available) {
      return { granted: false, error: availability.reason || 'HealthKit not available' };
    }

    await health.requestAuthorization({
      read: ['steps', 'distance', 'calories', 'heartRate', 'weight'],
      write: ['weight'],
    });

    // Apple HealthKit does not expose whether the user actually granted permission.
    // requestAuthorization resolves successfully regardless of user choice.
    return { granted: true };
  } catch (error: any) {
    return {
      granted: false,
      error: error?.message || 'Permission request failed',
    };
  }
};

export const readHealthKitExerciseData = async (): Promise<DeviceExerciseData | null> => {
  if (!isIOSNative()) return null;

  try {
    const health = await getHealthPlugin();
    if (!health) return null;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = startOfDay.toISOString();
    const endDate = now.toISOString();

    // Use queryAggregated for efficient daily totals
    const [stepsResult, distanceResult, caloriesResult, heartRateResult] =
      await Promise.allSettled([
        health.queryAggregated({
          dataType: 'steps',
          startDate,
          endDate,
          bucket: 'day',
          aggregation: 'sum',
        }),
        health.queryAggregated({
          dataType: 'distance',
          startDate,
          endDate,
          bucket: 'day',
          aggregation: 'sum',
        }),
        health.queryAggregated({
          dataType: 'calories',
          startDate,
          endDate,
          bucket: 'day',
          aggregation: 'sum',
        }),
        health.readSamples({
          dataType: 'heartRate',
          startDate,
          endDate,
          limit: 1,
        }),
      ]);

    let steps = 0;
    if (stepsResult.status === 'fulfilled' && stepsResult.value?.samples?.length > 0) {
      steps = stepsResult.value.samples.reduce(
        (sum: number, sample: any) => sum + (sample.value || 0), 0
      );
    }

    // distance is in meters
    let distanceMeters = 0;
    if (distanceResult.status === 'fulfilled' && distanceResult.value?.samples?.length > 0) {
      distanceMeters = distanceResult.value.samples.reduce(
        (sum: number, sample: any) => sum + (sample.value || 0), 0
      );
    }

    // calories in kilocalories
    let calories = 0;
    if (caloriesResult.status === 'fulfilled' && caloriesResult.value?.samples?.length > 0) {
      calories = caloriesResult.value.samples.reduce(
        (sum: number, sample: any) => sum + (sample.value || 0), 0
      );
    }

    let heartRate: number | undefined;
    if (heartRateResult.status === 'fulfilled' && heartRateResult.value?.samples?.length > 0) {
      heartRate = heartRateResult.value.samples[0].value;
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
    console.error('HealthKit read error:', error);
    return null;
  }
};

export const readHealthKitWeight = async (): Promise<{ weight?: number; date?: string } | null> => {
  if (!isIOSNative()) return null;

  try {
    const health = await getHealthPlugin();
    if (!health) return null;

    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const result = await health.readSamples({
      dataType: 'weight',
      startDate,
      endDate,
      limit: 1,
    });

    if (!result?.samples?.length) return null;

    const sample = result.samples[0];
    return {
      weight: sample.value, // kg
      date: sample.startDate,
    };
  } catch (error) {
    console.error('HealthKit weight read error:', error);
    return null;
  }
};

export const writeWeightToHealthKit = async (data: HealthKitBodyData): Promise<boolean> => {
  if (!isIOSNative()) return false;

  try {
    const health = await getHealthPlugin();
    if (!health) return false;

    if (data.weight) {
      await health.saveSample({
        dataType: 'weight',
        value: data.weight, // kg (default unit)
      });
    }

    return true;
  } catch (error) {
    console.error('HealthKit write error:', error);
    return false;
  }
};

// Local storage key for tracking permission request state
const HK_PERMISSION_KEY = 'healthkit_permission_requested';

export const hasRequestedHealthKitPermission = (): boolean => {
  return localStorage.getItem(HK_PERMISSION_KEY) === 'true';
};

export const setHealthKitPermissionRequested = (): void => {
  localStorage.setItem(HK_PERMISSION_KEY, 'true');
};
