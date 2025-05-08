import { InternshipApplication } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// We need to extend the jsPDF type to include autoTable which is added by the plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportApplicationsToPDF = (applications: InternshipApplication[], internshipTitles: Record<string, string> = {}) => {
  // Create a new document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text('Applications Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

  // Prepare data for table
  const tableRows = applications.map(app => [
    app.name,
    app.email,
    app.phone,
    internshipTitles[app.internshipId] || 'Unknown Internship',
    app.status.charAt(0).toUpperCase() + app.status.slice(1),
    app.paymentStatus ? (app.paymentStatus.charAt(0).toUpperCase() + app.paymentStatus.slice(1)) : 'N/A',
    new Date(app.appliedAt).toLocaleDateString()
  ]);

  // Add table
  doc.autoTable({
    startY: 40,
    head: [['Name', 'Email', 'Phone', 'Internship', 'Status', 'Payment', 'Applied Date']],
    body: tableRows,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 }
    },
  });

  // Generate the PDF
  doc.save(`applications_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportSingleApplicationToPDF = (application: InternshipApplication, internshipTitle: string = 'Unknown Internship') => {
  // Create a new document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Application Details', 14, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 27);

  // Add internship title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Internship: ${internshipTitle}`, 14, 38);

  // Add application info
  doc.setFontSize(12);
  doc.text('Applicant Information', 14, 48);
  
  doc.setFontSize(10);
  const yStart = 55;
  const lineHeight = 7;
  let y = yStart;

  // Personal info
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(application.name, 50, y);
  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(application.email, 50, y);
  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(application.phone, 50, y);
  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Education:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(application.education, 50, y);
  y += lineHeight;

  // Application status
  y += 5;
  doc.setFontSize(12);
  doc.text('Application Status', 14, y);
  y += 8;
  doc.setFontSize(10);

  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(application.status.charAt(0).toUpperCase() + application.status.slice(1), 50, y);
  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Applied on:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(application.appliedAt).toLocaleString(), 50, y);
  y += lineHeight;

  if (application.paymentStatus) {
    doc.setFont('helvetica', 'bold');
    doc.text('Payment:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(application.paymentStatus.charAt(0).toUpperCase() + application.paymentStatus.slice(1), 50, y);
    y += lineHeight;
  }

  if (application.paymentId) {
    doc.setFont('helvetica', 'bold');
    doc.text('Payment ID:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(application.paymentId, 50, y);
    y += lineHeight;
  }

  if (application.couponCode) {
    doc.setFont('helvetica', 'bold');
    doc.text('Coupon:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(application.couponCode, 50, y);
    y += lineHeight;
  }

  // Skills
  y += 5;
  doc.setFontSize(12);
  doc.text('Skills and Experience', 14, y);
  y += 8;
  doc.setFontSize(10);

  if (application.skills && application.skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Skills:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(application.skills.join(', '), 50, y);
    y += lineHeight;
  }

  if (application.experience) {
    doc.setFont('helvetica', 'bold');
    doc.text('Experience:', 14, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    
    // Handle multi-line text for experience
    const splitExperience = doc.splitTextToSize(application.experience, 170);
    doc.text(splitExperience, 14, y);
    y += splitExperience.length * 5;
  }

  // Message
  if (application.message) {
    y += 5;
    doc.setFontSize(12);
    doc.text('Cover Letter / Message', 14, y);
    y += 8;
    doc.setFontSize(10);
    
    // Handle multi-line text for message
    const splitMessage = doc.splitTextToSize(application.message, 170);
    doc.text(splitMessage, 14, y);
  }

  // Generate the PDF
  doc.save(`application_${application.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}; 