import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { TimelineEvent } from "@/components/project/types";
import { format } from "date-fns";

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

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

export const exportToPDF = (
  events: TimelineEvent[],
  use24Hour: boolean,
  brideName?: string,
  groomName?: string,
  projectName?: string,
) => {
  const { headerInfo, data } = prepareEventData(events, use24Hour, brideName, groomName, projectName);
  
  // Create PDF document with CJK support
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    putOnlyUsedFonts: true,
    compress: true
  }) as jsPDFWithAutoTable;
  
  // Add title with proper encoding for CJK
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(headerInfo, 40, 40);
  
  // Prepare data for the table
  const tableData = data.map(event => [
    event.Time,
    event['End Time'],
    event.Duration,
    event.Title,
    event.Description,
    event.Location,
  ]);

  // Add the table with styling and proper CJK support
  doc.autoTable({
    head: [["Time", "End Time", "Duration", "Title", "Description", "Location"]],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      font: "helvetica",
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: {
      fillColor: [147, 51, 234], // wedding-purple color
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 50 }, // Time
      1: { cellWidth: 50 }, // End Time
      2: { cellWidth: 50 }, // Duration
      3: { cellWidth: 120 }, // Title
      4: { cellWidth: 150 }, // Description
      5: { cellWidth: 100 }, // Location
    },
    margin: { top: 60, right: 30, bottom: 30, left: 30 },
    theme: 'grid',
    tableWidth: 'auto',
    didDrawCell: (data) => {
      // Ensure text wrapping for CJK characters
      if (data.cell.section === 'body' || data.cell.section === 'head') {
        const td = data.cell.raw;
        if (td) {
          data.cell.styles.cellPadding = 5;
        }
      }
    }
  });

  const fileName = `wedding-itinerary-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};