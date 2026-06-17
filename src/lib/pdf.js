// ============================================================
// PDF export.
//  - Primary: window.print() against the print stylesheet → vector,
//    selectable, true A4 (KaTeX prints crisp from local fonts).
//  - Fallback: html2canvas + jsPDF, one-click download (rasterized
//    math; used when a sandbox iframe blocks the print dialog).
// jsPDF/html2canvas are dynamically imported so they stay out of the
// initial bundle (the print path needs neither).
// ============================================================

export function printSheet() {
  // The print stylesheet (app.css @media print) reveals .print-root
  // and hides the editor chrome. Nothing else to do.
  window.print()
}

export async function downloadPdf(pageEl) {
  if (!pageEl) return
  const [{ default: html2canvas }, jsPDFmod] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])
  const jsPDF = jsPDFmod.jsPDF || jsPDFmod.default

  const canvas = await html2canvas(pageEl, {
    scale: 3, // crisp-ish raster
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    windowWidth: pageEl.scrollWidth,
  })
  const img = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  // A4 = 210 x 297 mm; fill the page (page aspect already matches A4)
  pdf.addImage(img, 'PNG', 0, 0, 210, 297, undefined, 'FAST')
  pdf.save('דף-נוסחאות.pdf')
}

export default { printSheet, downloadPdf }
