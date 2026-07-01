import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { LogoSios } from "helper/constant";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getLocalDateInputValue(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function formatFechaDMY(value) {
  if (!value) return "";

  // yyyy-mm-dd -> dd/mm/yyyy
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yyyy, mm, dd] = value.split("-");
    return `${dd}/${mm}/${yyyy}`;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const FORM_META = {
  codigo: "PPS-FR-020",
  version: "4",
  fecha: getLocalDateInputValue()
};

const SECTION_TITLES_BY_CODE = {
  "1": "ALMACENAMIENTO",
  "2": "ADMINISTRACIÓN DE MEDICAMENTOS",
  "3": "OTROS"
};

function formatFecha(value) {
  if (!value) return "";

  // Si ya viene como yyyy-mm-dd, úsala tal cual.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return getLocalDateInputValue(d);
}

function parseCodigoToParts(codigo) {
  const raw = String(codigo || "").trim();
  if (!raw) return [];
  return raw
    .split(".")
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const n = Number(p);
      return Number.isFinite(n) ? n : p;
    });
}

function compareCodigo(a, b) {
  const aParts = parseCodigoToParts(a);
  const bParts = parseCodigoToParts(b);

  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i += 1) {
    const av = aParts[i];
    const bv = bParts[i];
    if (av === undefined) return -1;
    if (bv === undefined) return 1;

    if (typeof av === "number" && typeof bv === "number") {
      if (av !== bv) return av - bv;
    } else {
      const as = String(av);
      const bs = String(bv);
      if (as !== bs) return as.localeCompare(bs);
    }
  }
  return 0;
}

function getSectionCodeFromItemCodigo(codigo) {
  const raw = String(codigo || "").trim();
  if (!raw) return "";
  return raw.split(".")[0] || "";
}

function getEvidenciaUrls(aspecto) {
  const fromArray = Array.isArray(aspecto?.EvidenciaUrls)
    ? aspecto.EvidenciaUrls
    : [];
  const single = aspecto?.EvidenciaUrl ? [aspecto.EvidenciaUrl] : [];
  return Array.from(
    new Set(
      [...single, ...fromArray].map(u => String(u || "").trim()).filter(Boolean)
    )
  );
}

function buildPrintableRows(aspectos) {
  const items = (Array.isArray(aspectos) ? aspectos : [])
    .filter(Boolean)
    .map(a => ({
      Codigo: a?.Codigo ?? "",
      Seccion: a?.Seccion ?? "",
      Pregunta: a?.Pregunta ?? "",
      Resultado: a?.Resultado ?? "",
      Observaciones: a?.Observaciones ?? "",
      EvidenciaUrl: a?.EvidenciaUrl ?? "",
      EvidenciaUrls: getEvidenciaUrls(a)
    }))
    .sort((x, y) => compareCodigo(x.Codigo, y.Codigo));

  const rows = [];
  let lastSectionCode = null;

  items.forEach(it => {
    const sectionCode = getSectionCodeFromItemCodigo(it.Codigo);
    if (sectionCode && sectionCode !== lastSectionCode) {
      rows.push({
        tipo: "SECCION",
        Codigo: sectionCode,
        Titulo: SECTION_TITLES_BY_CODE[sectionCode] ?? it.Seccion ?? ""
      });
      lastSectionCode = sectionCode;
    }

    rows.push({ tipo: "ITEM", ...it });
  });

  return rows;
}

function markFor(resultado, expected) {
  return resultado === expected ? "X" : "";
}

function isProbablyImageUrl(url) {
  const value = String(url || "").trim();
  if (!value) return false;

  if (value.startsWith("data:image/")) return true;

  // Heurística básica por extensión
  const clean = value
    .split("?")[0]
    .split("#")[0]
    .toLowerCase();
  return (
    clean.endsWith(".png") ||
    clean.endsWith(".jpg") ||
    clean.endsWith(".jpeg") ||
    clean.endsWith(".gif") ||
    clean.endsWith(".webp") ||
    clean.endsWith(".bmp")
  );
}

class SeguimientoAlmacenamientosPrint extends React.PureComponent {
  render() {
    const selected = this.props.seguimiento || {};
    const servicio = selected.ServicioNombre || selected.Servicio || "";

    const rows = buildPrintableRows(selected.Aspectos);

    const firmaSrc = selected.RevisadoPorFirma
      ? String(selected.RevisadoPorFirma).startsWith("data:")
        ? selected.RevisadoPorFirma
        : `data:image/png;base64,${selected.RevisadoPorFirma}`
      : "";

    return (
      <div style={{ padding: "24px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed"
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #000",
                  width: "20%",
                  height: "60px",
                  padding: "4px",
                  textAlign: "center",
                  verticalAlign: "middle"
                }}
              >
                <img
                  src={LogoSios}
                  alt="Logo"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    maxHeight: "60px",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain"
                  }}
                />
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  width: "55%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  lineHeight: "1.2",
                  padding: "8px 10px",
                  verticalAlign: "middle"
                }}
              >
                SEGUIMIENTO DEL ALMACENAMIENTO, DISPENSACIÓN Y ADMINISTRACIÓN DE
                <br />
                MEDICAMENTOS, DISPOSITIVOS MÉDICOS Y REACTIVOS
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  width: "25%",
                  padding: 0,
                  verticalAlign: "top"
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                    fontSize: "12px"
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "4px 6px",
                          borderBottom: "1px solid #000"
                        }}
                      >
                        <span className="font-weight-bold">Código:</span>{" "}
                        {FORM_META.codigo}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "4px 6px",
                          borderBottom: "1px solid #000"
                        }}
                      >
                        <span className="font-weight-bold">Versión:</span>{" "}
                        {FORM_META.version}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 6px" }}>
                        <span className="font-weight-bold">Fecha:</span>{" "}
                        {formatFechaDMY(FORM_META.fecha)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table
          className="table table-bordered table-sm mt-3"
          style={{ fontSize: "12px" }}
        >
          <thead>
            <tr>
              <th style={{ width: "70px" }} className="text-center">
                Servicio
              </th>
              <th colSpan={2}>{servicio}</th>
              <th style={{ width: "70px" }} className="text-center">
                Fecha
              </th>
              <th style={{ width: "90px" }} className="text-center">
                {formatFecha(selected.Fecha)}
              </th>
              <th style={{ width: "70px" }} className="text-center">
                Hora
              </th>
              <th style={{ width: "260px" }}>{selected.Hora || ""}</th>
            </tr>
            <tr>
              <th style={{ width: "70px" }} className="text-center">
                #
              </th>
              <th>ASPECTO DE REVISIÓN</th>
              <th style={{ width: "70px" }} className="text-center">
                Cumple
              </th>
              <th style={{ width: "90px" }} className="text-center">
                No Cumple
              </th>
              <th style={{ width: "70px" }} className="text-center">
                N/A
              </th>
              <th style={{ width: "260px" }}>Observaciones</th>
              <th style={{ width: "260px" }}>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Sin aspectos
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                if (row.tipo === "SECCION") {
                  return (
                    <tr key={`sec-${row.Codigo}-${idx}`}>
                      <td className="text-center font-weight-bold">
                        {row.Codigo}
                      </td>
                      <td colSpan={6} className="font-weight-bold text-center">
                        {row.Titulo || "\u00A0"}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`it-${row.Codigo}-${idx}`}>
                    <td className="text-center">{row.Codigo}</td>
                    <td>{row.Pregunta}</td>
                    <td className="text-center">
                      {markFor(row.Resultado, "CUMPLE")}
                    </td>
                    <td className="text-center">
                      {markFor(row.Resultado, "NO_CUMPLE")}
                    </td>
                    <td className="text-center">
                      {markFor(row.Resultado, "NA")}
                    </td>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {row.Observaciones}
                    </td>
                    <td style={{ wordBreak: "break-all" }}>
                      {(row.EvidenciaUrls || []).map((url, idx2) => (
                        <div
                          key={`${row.Codigo}_${idx2}_${url}`}
                          className="mb-1"
                        >
                          {isProbablyImageUrl(url) ? (
                            <img
                              src={url}
                              alt={`Evidencia ${idx2 + 1}`}
                              style={{
                                display: "block",
                                maxWidth: "100%",
                                maxHeight: "90px",
                                height: "auto",
                                objectFit: "contain"
                              }}
                            />
                          ) : (
                            <a href={url} target="_blank" rel="noreferrer">
                              {url}
                            </a>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="row mt-3" style={{ fontSize: "13px" }}>
          <div className="col-6">
            <div>
              <span className="font-weight-bold">Realizado por:</span>{" "}
              {selected.RealizadoPor || ""}
            </div>
            <div className="mt-2">
              <span className="font-weight-bold">Revisado por:</span>{" "}
              {selected.RevisadoPor || ""}
            </div>
          </div>

          <div className="col-6">
            <div className="font-weight-bold">Firma de revisión</div>
            {firmaSrc ? (
              <div className="border rounded p-2">
                <img
                  alt="Firma de revisión"
                  src={firmaSrc}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            ) : (
              <div>Sin firma registrada</div>
            )}
          </div>
        </div>

        <div className="mt-3" style={{ fontSize: "12px" }}>
          Reporte Generado por SIOS
        </div>
      </div>
    );
  }
}

export default SeguimientoAlmacenamientosPrint;
