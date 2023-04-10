export function epochToCurrentTime(timestamp: number) {
  return new Date(new Date(0).setUTCSeconds(timestamp));
}
