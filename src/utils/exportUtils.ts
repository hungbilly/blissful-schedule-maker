import * as XLSX from "xlsx";
import { TimelineEvent } from "@/components/project/types";
import { format } from "date-fns";

const formatTime = (time: string, use24Hour: boolean): string => {
  if (use24Hour) return time;
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${period}`;
};

const prepareEventData = (
  events: TimelineEvent[], 
  use24Hour: boolean,
  brideName?: string,
  groomName?: string,
  projectName?: string,
) => {
  const coupleNames = [brideName, groomName].filter(Boolean).join(" & ");
  const title = projectName || "Wedding Itinerary";
  const headerInfo = coupleNames ? `${title} - ${coupleNames}` : title;

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  return {
    headerInfo,
    data: sortedEvents.map((event) => ({
      Time: formatTime(event.time, use24Hour),
      'End Time': formatTime(event.end_time, use24Hour),
      Duration: event.duration,
      Title: event.title,
      Description: event.description || '',
      Location: event.location || '',
    })),
  };
};

export const exportToCSV = (
  events: TimelineEvent[],
  use24Hour: boolean,
  brideName?: string,
  groomName?: string,
  projectName?: string,
) => {
  const { data } = prepareEventData(events, use24Hour, brideName, groomName, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
  
  const fileName = `wedding-itinerary-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToExcel = (
  events: TimelineEvent[],
  use24Hour: boolean,
  brideName?: string,
  groomName?: string,
  projectName?: string,
) => {
  const { data } = prepareEventData(events, use24Hour, brideName, groomName, projectName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
  
  const fileName = `wedding-itinerary-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};