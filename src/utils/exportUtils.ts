import { TimelineEvent } from "@/components/project/types";

export const convertTo24Hour = (time: string, use24Hour: boolean): string => {
  if (use24Hour) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const exportToCSV = (events: TimelineEvent[], use24Hour: boolean) => {
  // Define CSV headers
  const headers = ['Time', 'End Time', 'Duration', 'Title', 'Description', 'Location'];
  
  // Convert events to CSV rows
  const rows = events.map(event => [
    convertTo24Hour(event.time, use24Hour),
    convertTo24Hour(event.endTime, use24Hour),
    event.duration,
    event.title,
    event.description || '',
    event.location || ''
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'event_rundown.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};