import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PredictionReportData {
  crop: string;
  confidence: number;
  reasoning: string;
  season: string;
  alternatives: { crop: string; confidence: number }[];
  yieldPerHa: number;
  totalYield: number;
  grade: string;
  yieldTrend: { month: string; value: number }[];
  inputs: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    ph: number;
    area: number;
  };
  modelAccuracy?: {
    cropModelAccuracy: number;
    cropModelF1: number;
    yieldModelRmse: number;
  };
}

export function generatePredictionReport(data: PredictionReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  const PRIMARY = [20, 160, 120] as [number, number, number];
  const DARK = [15, 40, 30] as [number, number, number];
  const LIGHT_GREEN = [220, 245, 235] as [number, number, number];
  const GRAY = [100, 110, 108] as [number, number, number];

  // ─── Header Banner ───
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 38, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 36, pageW, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Smart Agriculture AI", margin, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 230, 210);
  doc.text("Crop & Yield Prediction Report", margin, 24);

  const now = new Date();
  doc.setTextColor(150, 200, 180);
  doc.setFontSize(8);
  doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, margin, 31);
  doc.text("AI-Powered Agricultural Intelligence", pageW - margin, 31, { align: "right" });

  let y = 50;

  // ─── Primary Crop Recommendation ───
  doc.setFillColor(...LIGHT_GREEN);
  doc.roundedRect(margin, y, pageW - margin * 2, 36, 3, 3, "F");

  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OPTIMAL CROP RECOMMENDATION", margin + 6, y + 8);

  doc.setFontSize(22);
  doc.setTextColor(...PRIMARY);
  doc.text(data.crop.charAt(0).toUpperCase() + data.crop.slice(1), margin + 6, y + 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(`Confidence: ${Math.round(data.confidence * 100)}%   |   Season: ${data.season}   |   Grade: ${data.grade}`, margin + 6, y + 31);

  y += 44;

  // ─── Reasoning ───
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "italic");
  const reasoningLines = doc.splitTextToSize(data.reasoning, pageW - margin * 2 - 4);
  doc.text(reasoningLines, margin + 2, y);
  y += reasoningLines.length * 5 + 8;

  // ─── Input Parameters ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text("Soil & Environmental Parameters", margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Parameter", "Value", "Unit", "Parameter", "Value", "Unit"]],
    body: [
      ["Nitrogen (N)", data.inputs.nitrogen, "kg/ha", "Temperature", data.inputs.temperature, "°C"],
      ["Phosphorus (P)", data.inputs.phosphorus, "kg/ha", "Humidity", data.inputs.humidity, "%"],
      ["Potassium (K)", data.inputs.potassium, "kg/ha", "Rainfall", data.inputs.rainfall, "mm"],
      ["Soil pH", data.inputs.ph, "", "Area", data.inputs.area, "hectares"],
    ],
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [245, 252, 249] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 36 },
      1: { halign: "right", cellWidth: 18 },
      2: { textColor: GRAY, cellWidth: 16 },
      3: { fontStyle: "bold", cellWidth: 36 },
      4: { halign: "right", cellWidth: 18 },
      5: { textColor: GRAY, cellWidth: 16 },
    },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // ─── Yield Forecast ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text("Yield Forecast", margin, y);
  y += 6;

  doc.setFillColor(...LIGHT_GREEN);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  doc.text(`Yield per Hectare:`, margin + 6, y + 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...PRIMARY);
  doc.text(`${data.yieldPerHa.toLocaleString()} kg/ha`, margin + 52, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(`Total Yield (${data.inputs.area} ha):`, margin + 6, y + 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...PRIMARY);
  doc.text(`${data.totalYield.toLocaleString()} kg`, margin + 52, y + 17);

  y += 30;

  // ─── Yield Trend Table ───
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [data.yieldTrend.map(t => t.month)],
    body: [data.yieldTrend.map(t => `${t.value.toLocaleString()}`)],
    headStyles: { fillColor: DARK, textColor: 255, fontSize: 7, halign: "center" },
    bodyStyles: { fontSize: 8, halign: "center", textColor: DARK },
    alternateRowStyles: { fillColor: [245, 252, 249] },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "italic");
  doc.text("Monthly yield estimates (kg/ha) across seasonal cycle", margin, y);
  y += 10;

  // ─── Alternative Crops ───
  if (data.alternatives.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text("Viable Alternative Crops", margin, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Rank", "Crop", "AI Confidence Score"]],
      body: data.alternatives.map((a, i) => [
        `#${i + 2}`,
        a.crop.charAt(0).toUpperCase() + a.crop.slice(1),
        `${Math.round(a.confidence * 100)}%`,
      ]),
      headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: DARK },
      alternateRowStyles: { fillColor: [245, 252, 249] },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { fontStyle: "bold" },
        2: { halign: "right", textColor: PRIMARY },
      },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  // ─── Model Accuracy ───
  if (data.modelAccuracy) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text("AI Model Performance Metrics", margin, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Metric", "Value"]],
      body: [
        ["Crop Recommendation Accuracy", `${(data.modelAccuracy.cropModelAccuracy * 100).toFixed(2)}%`],
        ["F1 Score (Classification)", `${(data.modelAccuracy.cropModelF1 * 100).toFixed(2)}%`],
        ["Yield Model RMSE", `${data.modelAccuracy.yieldModelRmse.toFixed(2)} kg/ha`],
      ],
      headStyles: { fillColor: DARK, textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: DARK },
      alternateRowStyles: { fillColor: [245, 252, 249] },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "right", textColor: PRIMARY },
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  // ─── Footer ───
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...DARK);
  doc.rect(0, pageH - 14, pageW, 14, "F");
  doc.setFontSize(7);
  doc.setTextColor(150, 200, 180);
  doc.setFont("helvetica", "normal");
  doc.text("Smart Agriculture AI  |  AI-Powered Crop & Yield Intelligence System", margin, pageH - 6);
  doc.text(`Page 1  |  ${now.toLocaleDateString()}`, pageW - margin, pageH - 6, { align: "right" });

  // ─── Save ───
  const filename = `agri-report-${data.crop}-${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function exportHistoryCSV(
  history: {
    id: number; crop: string; confidence: number; yield: number; grade: string;
    nitrogen: number; phosphorus: number; potassium: number;
    temperature: number; humidity: number; rainfall: number; ph: number; createdAt: string;
  }[]
): void {
  const headers = ["ID", "Date", "Crop", "Confidence (%)", "Yield (kg/ha)", "Grade", "Nitrogen", "Phosphorus", "Potassium", "Temperature (°C)", "Humidity (%)", "Rainfall (mm)", "pH"];
  const rows = history.map(r => [
    r.id,
    new Date(r.createdAt).toLocaleDateString(),
    r.crop,
    Math.round(r.confidence * 100),
    r.yield,
    r.grade,
    r.nitrogen,
    r.phosphorus,
    r.potassium,
    r.temperature,
    r.humidity,
    r.rainfall,
    r.ph,
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agri-prediction-history-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
