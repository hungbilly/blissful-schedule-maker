export const calculateDuration = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight events
  
  return `${totalMinutes}mins`;
};

export const calculateEndTime = (startTime: string, duration: string) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  let minutes = parseInt(duration);
  
  if (isNaN(minutes)) {
    const durationMatch = duration.match(/(\d+)mins?/);
    minutes = durationMatch ? parseInt(durationMatch[1]) : 0;
  }
  
  let totalMinutes = startHours * 60 + startMinutes + minutes;
  totalMinutes = totalMinutes % (24 * 60); // Keep within 24 hours
  
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
};

export const formatDuration = (minutes: number): string => {
  return `${minutes}mins`;
};

export const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)mins?/);
  return match ? parseInt(match[1]) : parseInt(duration) || 0;
};