import { strToU8, zipSync } from "fflate";

const columns = [
  "record_type", "student_id", "session_id", "kind", "topic_id", "scenario_id", "hsk_level", "interface_language",
  "config_version", "started_at", "ended_at", "completed", "turn_count", "observed_at", "turn", "learner_reply", "ai_reply",
  "hint", "feedback", "mode", "previous_mode", "original_asr", "recording_id", "revision_of", "spoken",
];

function values(rows: Record<string, unknown>[]) {
  return [columns, ...rows.map((row) => columns.map((key) => {
    const value = row[key];
    return value instanceof Date ? value.toISOString() : String(value ?? "");
  }))];
}

export function researchCsv(rows: Record<string, unknown>[]) {
  return "\uFEFF" + values(rows).map((row) => row.map((value) => {
    const escaped = /^[\s\uFEFF]*[=+\-@]/u.test(value) ? "'" + value : value;
    return '"' + escaped.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
}

function xml(text: string) {
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function researchExcel(rows: Record<string, unknown>[]) {
  const sheet = values(rows).map((row, index) =>
    `<row r="${index + 1}">${row.map((value, column) =>
      `<c r="${String.fromCharCode(65 + column)}${index + 1}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`
    ).join("")}</row>`).join("");
  const ns = "http://schemas.openxmlformats.org";
  return zipSync({
    "[Content_Types].xml": strToU8(`<Types xmlns="${ns}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`),
    "_rels/.rels": strToU8(`<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    "xl/workbook.xml": strToU8(`<workbook xmlns="${ns}/spreadsheetml/2006/main" xmlns:r="${ns}/officeDocument/2006/relationships"><sheets><sheet name="Practice" sheetId="1" r:id="rId1"/></sheets></workbook>`),
    "xl/_rels/workbook.xml.rels": strToU8(`<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`),
    "xl/worksheets/sheet1.xml": strToU8(`<worksheet xmlns="${ns}/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`),
  });
}

export const privateDownloadHeaders = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
