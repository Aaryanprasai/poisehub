
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function canDeleteTrack(takenDownAt?: Date): boolean {
  if (!takenDownAt) return false;
  
  const now = new Date();
  const takedownDate = new Date(takenDownAt);
  const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // approximate 3 months in milliseconds
  
  return now.getTime() - takedownDate.getTime() >= threeMonthsInMs;
}

export function getDaysUntilDeletable(takenDownAt: Date): number {
  const now = new Date();
  const takedownDate = new Date(takenDownAt);
  const daysSinceTakedown = (now.getTime() - takedownDate.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil(90 - daysSinceTakedown);
}
