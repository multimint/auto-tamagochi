import { nowMs } from '@/utils/timeUtils';

export function useOfflineReconcile(lastActiveAt: number): {
  deltaMs: number;
  wasOffline: boolean;
} {
  const now = nowMs();
  const deltaMs = Math.max(0, now - lastActiveAt);
  const wasOffline = deltaMs > 5_000; // offline if away more than 5 seconds
  return { deltaMs, wasOffline };
}
