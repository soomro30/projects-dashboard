// PDF Export functionality for Project Dashboard
// Using html2canvas and jsPDF for high-quality PDF generation

export const exportToPDF = async (elementId, filename = 'project-dashboard', format = 'a4', orientation = 'landscape') => {
  try {
    // Dynamic import to reduce bundle size
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for PDF export');
    }

    // Add print class for styling
    element.classList.add('pdf-export-mode');

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure all fonts are loaded in cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.fontFamily = '"Inter", sans-serif';
        }
      }
    });

    // Remove print class
    element.classList.remove('pdf-export-mode');

    const imgData = canvas.toDataURL('image/png');

    // Configure PDF dimensions based on format
    let pdfWidth, pdfHeight;
    if (format.toLowerCase() === 'a3') {
      if (orientation === 'landscape') {
        pdfWidth = 420; // A3 landscape width in mm
        pdfHeight = 297; // A3 landscape height in mm
      } else {
        pdfWidth = 297; // A3 portrait width in mm
        pdfHeight = 420; // A3 portrait height in mm
      }
    } else { // A4 default
      if (orientation === 'landscape') {
        pdfWidth = 297; // A4 landscape width in mm
        pdfHeight = 210; // A4 landscape height in mm
      } else {
        pdfWidth = 210; // A4 portrait width in mm
        pdfHeight = 297; // A4 portrait height in mm
      }
    }

    // Calculate image dimensions to fit PDF
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format.toLowerCase()
    });

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Dashboard Report', 10, 15);

    // Add timestamp
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated on: ${timestamp}`, 10, 25);

    // Calculate if image fits on one page
    const availableHeight = pdfHeight - 40; // Account for header and margins

    if (imgHeight <= availableHeight) {
      // Single page
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let yPosition = 30;
      let remainingHeight = imgHeight;
      let pageCount = 1;

      while (remainingHeight > 0) {
        const currentPageHeight = Math.min(remainingHeight, availableHeight);
        const sourceY = imgHeight - remainingHeight;

        if (pageCount > 1) {
          pdf.addPage();
          yPosition = 10;
        }

        pdf.addImage(
          imgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          currentPageHeight,
          undefined,
          'FAST',
          0,
          sourceY / canvas.height,
          imgWidth / canvas.width,
          currentPageHeight / canvas.height
        );

        remainingHeight -= currentPageHeight;
        pageCount++;
      }
    }

    // Save the PDF
    pdf.save(`${filename}-${timestamp.replace(/[:/\s]/g, '-')}.pdf`);

    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('PDF export failed:', error);
    return { success: false, message: error.message };
  }
};

// Export function specifically for project dashboard
export const exportProjectDashboard = (format = 'a4', orientation = 'landscape') => {
  return exportToPDF('project-dashboard-content', 'project-dashboard', format, orientation);
};

// Preview function for print
export const printDashboard = () => {
  const element = document.getElementById('project-dashboard-content');
  if (!element) {
    console.error('Dashboard element not found');
    return;
  }

  // Add print-specific class
  element.classList.add('pdf-export-mode');

  // Trigger browser print
  window.print();

  // Remove print class after print dialog
  setTimeout(() => {
    element.classList.remove('pdf-export-mode');
  }, 1000);
};