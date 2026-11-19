export function slaHours(priority) {
  return ({Urgent:4,High:8,Medium:24,Low:72})[priority] || 24;
}
