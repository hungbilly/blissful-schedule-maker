export const calculateDurationInMinutes = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight events
  
  return totalMinutes;
};

export const calculateEndTimeFromMinutes = (startTime: string, durationMinutes: number): string => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  
  let totalMinutes = startHours * 60 + startMinutes + durationMinutes;
  totalMinutes = totalMinutes % (24 * 60); // Keep within 24 hours
  
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
};

export const formatDuration = (minutes: number): string => {
  return `${minutes}mins`;
};

export const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)mins/);
  return match ? parseInt(match[1]) : 0;
};