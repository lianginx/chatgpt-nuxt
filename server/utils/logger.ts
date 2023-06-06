export function logger(...message: any[]) {
  console.log(`${new Date().toISOString()}`, ...message);
}
