import jsPDF from 'jspdf';
import { Booking } from '@/types';

export function generateBookingInvoice(booking: Booking) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Theme primary color: Indigo
  const primaryColor: [number, number, number] = [79, 70, 229]; // #4F46E5
  const slateDark: [number, number, number] = [15, 23, 42]; // #0F172A
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748B

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('StudioSpace', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Peer-to-Peer Creative Workspaces & Production Studios', 15, 27);

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...slateDark);
  doc.text('BOOKING RECEIPT & INVOICE', 15, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(`Invoice ID: INV-${booking._id.slice(-8).toUpperCase()}`, 15, 54);
  doc.text(`Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 59);

  // Status Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(145, 43, 50, 16, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(`Status: ${booking.status.toUpperCase()}`, 152, 53);

  // Two Column Metadata Box
  // Creator Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('Billed To (Creator):', 15, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text(`Name: ${booking.userName}`, 15, 82);
  doc.text(`Email: ${booking.userEmail}`, 15, 87);
  if (booking.userPhone) {
    doc.text(`Contact: ${booking.userPhone}`, 15, 92);
  }

  // Host / Studio Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('Workspace & Host:', 115, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text(`Studio: ${booking.studioTitle}`, 115, 82);
  doc.text(`Category: ${booking.studioCategory}`, 115, 87);
  doc.text(`Host: ${booking.hostEmail}`, 115, 92);

  // Reservation Details Box
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 105, 180, 25, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 105, 180, 25, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...slateDark);
  doc.text('Reserved Date', 22, 114);
  doc.text('Reserved Window', 75, 114);
  doc.text('Total Duration', 140, 114);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text(booking.bookingDate, 22, 122);
  doc.text(`${booking.startTime} - ${booking.endTime}`, 75, 122);
  doc.text(`${booking.totalHours} Hour(s)`, 140, 122);

  // Line Items Table Header
  doc.setFillColor(...slateDark);
  doc.rect(15, 140, 180, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 20, 146);
  doc.text('Qty / Hours', 105, 146);
  doc.text('Unit Rate', 140, 146);
  doc.text('Amount ($)', 175, 146);

  // Row 1: Studio Rental
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text(`Workspace Rental: ${booking.studioTitle}`, 20, 158);
  doc.text(`${booking.totalHours} hrs`, 105, 158);
  doc.text(`$${booking.hourlyRate}`, 140, 158);
  doc.text(`$${booking.hourlyRate * booking.totalHours}`, 175, 158);

  // Row 2: Security Deposit
  doc.text('Refundable Security Damage Deposit', 20, 168);
  doc.text('1 deposit', 105, 168);
  doc.text(`$${booking.securityDeposit || 0}`, 140, 168);
  doc.text(`$${booking.securityDeposit || 0}`, 175, 168);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 175, 195, 175);

  // Total Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Grand Total:', 130, 187);
  doc.text(`$${booking.totalPrice}`, 175, 187);

  // Notes & Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateMuted);
  doc.text('Terms: The refundable security deposit will be automatically processed back within 48 hours after shoot checkout.', 15, 215);
  doc.text('Need help? Contact support@studiospace.io with your Invoice ID.', 15, 220);

  // Bottom Border
  doc.setFillColor(...primaryColor);
  doc.rect(0, 287, 210, 10, 'F');

  doc.save(`StudioSpace-Invoice-${booking._id.slice(-6)}.pdf`);
}
