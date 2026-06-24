import { jsPDF } from 'jspdf';
import type { Trip } from '../types/trip';

/**
 * Render a trip's itinerary to a clean, multi-page, text-based PDF and trigger a
 * download. Text (not html2canvas) is used deliberately — it is far more reliable
 * across the dark glass UI and produces crisp, selectable output.
 */
export function exportItineraryPdf(trip: Trip): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const line = (
    text: string,
    opts: { size?: number; style?: 'normal' | 'bold' | 'italic'; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const { size = 11, style = 'normal', color = [30, 30, 40], gap = 4 } = opts;
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const wrapped = doc.splitTextToSize(text, contentWidth);
    for (const row of wrapped) {
      ensureSpace(size + gap);
      doc.text(row, margin, y);
      y += size + gap;
    }
  };

  // ── Header ────────────────────────────────────────────────────────────────
  line(trip.title || 'Untitled trip', { size: 22, style: 'bold', color: [20, 20, 30], gap: 6 });

  const dateRange = [trip.startDate, trip.endDate].filter(Boolean).join('  →  ');
  const metaParts: string[] = [];
  if (dateRange) metaParts.push(dateRange);
  if (trip.currency) metaParts.push(`Currency: ${trip.currency}`);
  if (metaParts.length) line(metaParts.join('   ·   '), { size: 10, color: [110, 110, 130], gap: 10 });

  // Divider
  ensureSpace(12);
  doc.setDrawColor(210, 210, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const itinerary = trip.itinerary;
  const currency = trip.currency || itinerary?.currency || '';

  if (!itinerary || itinerary.days.length === 0) {
    line('No itinerary details are available for this trip yet.', {
      size: 11,
      style: 'italic',
      color: [120, 120, 140],
    });
  } else {
    let grandTotal = 0;

    for (const day of itinerary.days) {
      ensureSpace(40);
      const cityLine = [day.city, day.country].filter(Boolean).join(', ');
      line(`Day ${day.dayIndex + 1}${cityLine ? ` — ${cityLine}` : ''}`, {
        size: 14,
        style: 'bold',
        color: [25, 30, 60],
        gap: 4,
      });
      if (day.date) line(day.date, { size: 9, color: [130, 130, 150], gap: 2 });
      if (day.summary) line(day.summary, { size: 10, style: 'italic', color: [110, 110, 130], gap: 6 });

      if (day.activities.length === 0) {
        line('  • No activities planned.', { size: 10, color: [140, 140, 160] });
      } else {
        for (const a of day.activities) {
          const slot = a.timeSlot ? `[${a.timeSlot}] ` : '';
          const cost =
            typeof a.estCost === 'number' && a.estCost > 0
              ? `  (${currency} ${a.estCost.toLocaleString()})`
              : '';
          if (typeof a.estCost === 'number') grandTotal += a.estCost;
          line(`  • ${slot}${a.title}${cost}`, { size: 11, style: 'bold', color: [40, 40, 55], gap: 2 });
          if (a.description) line(`     ${a.description}`, { size: 10, color: [90, 90, 110], gap: 2 });
        }
      }
      y += 8;
    }

    // Accommodation totals
    for (const acc of itinerary.accommodations) {
      if (typeof acc.pricePerNight === 'number') {
        const nights = itinerary.days.filter((d) => d.city === acc.city).length || 1;
        grandTotal += acc.pricePerNight * nights;
      }
    }

    ensureSpace(30);
    doc.setDrawColor(210, 210, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    line(`Estimated total: ${currency} ${Math.round(grandTotal).toLocaleString()}`, {
      size: 12,
      style: 'bold',
      color: [20, 20, 30],
    });
  }

  // Footer note on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 175);
    doc.text(`Tripu · ${trip.title || 'Trip'} · page ${i}/${pageCount}`, margin, pageHeight - 24);
  }

  const safeName = (trip.title || 'tripu-itinerary')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  doc.save(`${safeName || 'tripu-itinerary'}.pdf`);
}
