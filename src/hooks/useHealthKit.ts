import { useState, useEffect, useCallback } from 'react';
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  readHealthKitExerciseData,
  readHealthKitWeight,
  writeWeightToHealthKit,
  hasRequestedHealthKitPermission,
  setHealthKitPermissionRequested,
  HealthKitBodyData,
} from '../utils/healthKit';
import type { DeviceExerciseData } from '../utils/deviceSync';

interface UseHealthKitReturn {
  available: boolean;
  permissionGranted: boolean;
  loading: boolean;
  exerciseData: DeviceExerciseData | null;
  weightData: { weight?: number; date?: string } | null;
  error: string | null;
  requestPermissions: () => Promise<boolean>;
  refreshExerciseData: () => Promise<DeviceExerciseData | null>;
  refreshWeightData: () => Promise<void>;
  writeWeight: (data: HealthKitBodyData) => Promise<boolean>;
}

export const useHealthKit = (): UseHealthKitReturn => {
  const [available, setAvailable] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exerciseData, setExerciseData] = useState<DeviceExerciseData | null>(null);
  const [weightData, setWeightData] = useState<{ weight?: number; date?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check availability after mount (Capacitor bridge may not be ready during initial render)
  useEffect(() => {
    const check = isHealthKitAvailable();
    console.log('[HealthKit] available:', check, 'platform:', (() => { try { return (window as any).Capacitor?.getPlatform?.() } catch { return 'unknown' } })());
    setAvailable(check);
  }, []);

  // Request permissions when available
  useEffect(() => {
    if (!available) return;

    const initPermissions = async () => {
      if (!hasRequestedHealthKitPermission()) {
        const result = await requestHealthKitPermissions();
        setPermissionGranted(result.granted);
        setHealthKitPermissionRequested();
        if (result.error) setError(result.error);
      } else {
        // Already requested — assume granted (Apple doesn't tell us)
        setPermissionGranted(true);
      }
    };

    initPermissions();
  }, [available]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!available) return false;
    setLoading(true);
    try {
      const result = await requestHealthKitPermissions();
      setPermissionGranted(result.granted);
      setHealthKitPermissionRequested();
      if (result.error) setError(result.error);
      return result.granted;
    } finally {
      setLoading(false);
    }
  }, [available]);

  const refreshExerciseData = useCallback(async (): Promise<DeviceExerciseData | null> => {
    if (!available) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await readHealthKitExerciseData();
      setExerciseData(data);
      return data;
    } catch (err: any) {
      setError(err?.message || 'Failed to read exercise data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [available]);

  const refreshWeightData = useCallback(async () => {
    if (!available) return;
    setLoading(true);
    setError(null);
    try {
      const data = await readHealthKitWeight();
      setWeightData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to read weight data');
    } finally {
      setLoading(false);
    }
  }, [available]);

  const writeWeight = useCallback(async (data: HealthKitBodyData): Promise<boolean> => {
    if (!available) return false;
    try {
      return await writeWeightToHealthKit(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to write weight data');
      return false;
    }
  }, [available]);

  return {
    available,
    permissionGranted,
    loading,
    exerciseData,
    weightData,
    error,
    requestPermissions,
    refreshExerciseData,
    refreshWeightData,
    writeWeight,
  };
};
