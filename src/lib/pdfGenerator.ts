import jsPDF from "jspdf";
import { toJpeg, toPng } from "html-to-image";
import type { Itinerary } from "@/types/itinerary";

/* ================================================================
   CONSTANTS
   ================================================================ */

const EXPORT_WIDTH = 800;
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Quality presets tried in order.  The first pass uses the highest
 * quality; if the resulting PDF exceeds MAX_PDF_BYTES the generator
 * retries with lower quality automatically.
 */
const QUALITY_PRESETS: { pixelRatio: number; jpegQuality: number }[] = [
  { pixelRatio: 2, jpegQuality: 0.92 },   // best – sharp text & images
  { pixelRatio: 1.5, jpegQuality: 0.85 },  // balanced
  { pixelRatio: 1.5, jpegQuality: 0.75 },  // smaller
  { pixelRatio: 1, jpegQuality: 0.7 },     // minimum acceptable
];

/* ================================================================
   FILE-NAME HELPERS
   ================================================================ */

/** Characters forbidden on Windows / macOS / Linux file-systems. */
const UNSAFE_CHARS = /[/\\:*?"<>|]/g;

/**
 * Build a professional, human-readable PDF file name from itinerary
 * data using the format:
 *   ItineraryCode - ClientName - Destination - Duration - Pax.pdf
 *
 * Example:
 *   AH-1023 - Mr.Harish - Cochin-Vagamon-Varkala - 6N7D - 3Pax.pdf
 */
const buildFileName = (itinerary: Itinerary): string => {
  const code = (itinerary.itineraryCode || "DRAFT").trim();
  const client = (itinerary.clientName || "Client").trim();
  const destination = (itinerary.destination || "Destination").trim();
  const duration = (itinerary.duration || "").trim();
  const pax = `${itinerary.groupSize ?? 1}Pax`;

  const raw = `${code} - ${client} - ${destination} - ${duration} - ${pax}`;
  return sanitizeFileName(raw) + ".pdf";
};

/**
 * Sanitise a string so it is a valid, readable file name on every OS.
 */
const sanitizeFileName = (name: string): string => {
  return name
    .replace(UNSAFE_CHARS, "")   // remove forbidden chars
    .replace(/\s+/g, " ")       // collapse whitespace
    .replace(/--+/g, "-")       // collapse double hyphens
    .trim();
};

/* ================================================================
   DOM HELPERS
   ================================================================ */

/** Wait for every <img> in the sub-tree to finish loading. */
const waitForImages = (container: HTMLElement): Promise<void[]> => {
  const images = container.querySelectorAll("img");
  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight > 0) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  );
};

/**
 * Strip every form of horizontal auto-centering from a cloned
 * element tree so the content renders flush-left at x = 0.
 */
const stripHorizontalCentering = (root: HTMLElement): void => {
  root.style.width = `${EXPORT_WIDTH}px`;
  root.style.maxWidth = `${EXPORT_WIDTH}px`;
  root.style.minWidth = `${EXPORT_WIDTH}px`;
  root.style.margin = "0";
  root.style.marginLeft = "0";
  root.style.marginRight = "0";
  root.style.paddingLeft = "0";
  root.style.paddingRight = "0";
  root.style.transform = "none";
  root.style.left = "0";
  root.style.position = "relative";
  root.style.overflowX = "hidden";

  root.querySelectorAll("*").forEach((node) => {
    const el = node as HTMLElement;
    if (!el.style) return;
    const cs = window.getComputedStyle(el);
    if (cs.marginLeft === "auto") el.style.marginLeft = "0";
    if (cs.marginRight === "auto") el.style.marginRight = "0";
    if (cs.transform && cs.transform !== "none") el.style.transform = "none";
  });
};

/* ================================================================
   CORE: capture → PDF
   ================================================================ */

/**
 * Capture the clone as a JPEG data-URL at the given quality settings.
 * Falls back to PNG for the first attempt if JPEG fails.
 */
const captureImage = async (
  clone: HTMLElement,
  height: number,
  preset: { pixelRatio: number; jpegQuality: number }
): Promise<string> => {
  const opts = {
    quality: preset.jpegQuality,
    pixelRatio: preset.pixelRatio,
    width: EXPORT_WIDTH,
    height,
    backgroundColor: "#000655",
    cacheBust: true,
    style: {
      overflow: "visible",
      margin: "0",
      padding: "0",
      transform: "none",
      left: "0",
    } as Partial<CSSStyleDeclaration>,
    filter: () => true,
  };

  try {
    // Prefer JPEG – much smaller than PNG for photographic content
    return await toJpeg(clone, opts);
  } catch {
    // Fallback to PNG (lossless, larger, but more compatible)
    return await toPng(clone, { ...opts, quality: 1.0 });
  }
};

/** Load an Image element from a data-URL and return it. */
const loadImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

/**
 * Build the jsPDF document from a raster data-URL and return the Blob
 * so we can check its size before saving.
 */
const buildPdf = async (dataUrl: string) => {
  const img = await loadImage(dataUrl);

  const pdfWidthPt = 595; // A4 width in points
  const ratio = pdfWidthPt / img.width;
  const pdfHeightPt = img.height * ratio;

  // Use JPEG format string when the data-URL is a JPEG
  const isJpeg = dataUrl.startsWith("data:image/jpeg");
  const imgFormat = isJpeg ? "JPEG" : "PNG";

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [pdfWidthPt, pdfHeightPt],
    compress: true, // enable deflate compression
  });

  pdf.addImage(dataUrl, imgFormat, 0, 0, pdfWidthPt, pdfHeightPt);
  return pdf;
};

/* ================================================================
   PUBLIC API
   ================================================================ */

/**
 * Generate a single-page PDF that matches the browser preview.
 *
 * @param elementId  – DOM id of the element to capture
 * @param itinerary  – itinerary data for dynamic file naming
 */
export const generatePDF = async (
  elementId: string,
  itinerary?: Itinerary
): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) throw new Error(`Element #${elementId} not found`);

  // ---- Dynamic file name ----
  const fileName = itinerary ? buildFileName(itinerary) : "itinerary.pdf";

  // ---- Scroll to top for consistent capture ----
  const savedScrollY = window.scrollY;
  window.scrollTo(0, 0);
  await waitForImages(input);
  await new Promise((r) => setTimeout(r, 500));

  // ---- Clone off-screen ----
  const clone = input.cloneNode(true) as HTMLElement;
  clone.id = "pdf-export-clone";
  clone.classList.add("pdf-export-mode");
  stripHorizontalCentering(clone);

  const offScreen = document.createElement("div");
  offScreen.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: ${EXPORT_WIDTH}px;
    overflow: visible;
    z-index: -9999;
  `;
  offScreen.appendChild(clone);
  document.body.appendChild(offScreen);
  await new Promise((r) => setTimeout(r, 500));

  const exportHeight = clone.scrollHeight;

  try {
    // ---- Try each quality preset until under 10 MB ----
    for (let i = 0; i < QUALITY_PRESETS.length; i++) {
      const preset = QUALITY_PRESETS[i];
      const dataUrl = await captureImage(clone, exportHeight, preset);
      const pdf = await buildPdf(dataUrl);
      const blob = pdf.output("blob");

      if (blob.size <= MAX_PDF_BYTES || i === QUALITY_PRESETS.length - 1) {
        // Either under the limit or we've exhausted all presets — save
        pdf.save(fileName);
        return;
      }
      // else: too large, retry with next (lower) quality preset
      console.info(
        `PDF size ${(blob.size / 1024 / 1024).toFixed(1)} MB exceeds 10 MB. ` +
        `Retrying with lower quality (preset ${i + 2}/${QUALITY_PRESETS.length})…`
      );
    }
  } finally {
    document.body.removeChild(offScreen);
    window.scrollTo(0, savedScrollY);
  }
};
