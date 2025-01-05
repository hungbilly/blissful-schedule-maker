import { TimelineEvent } from "@/components/project/types";

const formatTime = (time: string, use24Hour: boolean): string => {
  if (!time) return "";
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  
  if (use24Hour) {
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

export const exportToCSV = (
  events: TimelineEvent[], 
  use24Hour: boolean,
  brideName?: string,
  groomName?: string,
  projectName?: string
) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  // Create CSV content
  const headers = ['Time', 'End Time', 'Duration', 'Title', 'Description', 'Location'];
  const rows = sortedEvents.map(event => [
    formatTime(event.time, use24Hour),
    formatTime(event.end_time, use24Hour),
    event.duration,
    event.title,
    event.description || '',
    event.location || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Generate filename with bride and groom names if available
  let filename = 'wedding_rundown';
  if (brideName && groomName && projectName) {
    filename = `${brideName}_${groomName}_${projectName}_rundown`.replace(/\s+/g, '_').toLowerCase();
  }
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};