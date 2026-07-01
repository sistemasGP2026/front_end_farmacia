import React from "react";
import PageTitle from "components/common/PageTitle";
import SeguimientosAlmacenamientosForm from "components/seguimientosAlmacenamientos/SeguimientosAlmacenamientosForm";
import SeguimientoAlmacenamientosPrint from "components/seguimientosAlmacenamientos/SeguimientoAlmacenamientosPrint";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table
} from "reactstrap";
import { gsUrlApi } from "config/configServer";
import { Ring } from "react-awesome-spinners";
import ReactToPrint from "react-to-print";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";

class SeguimientosAlmacenamientos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Preload: false,
      mostrarFormulario: false,
      data: [],
      detalleItem: null,
      editItem: null,
      historialOpen: false,
      historialData: [],
      historialLoading: false
    };
    this.formRef = React.createRef();
    this.printDetalleRef = null;
  }

  fetchImageAsDataUrl = async url => {
    const value = String(url || "").trim();
    if (!value) return null;

    if (value.startsWith("data:image/")) {
      return {
        dataUrl: value,
        extension: this.getImageExtensionFromDataUrl(value)
      };
    }

    try {
      const res = await fetch(value, { method: "GET" });
      if (!res.ok) return null;

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const extension = this.getImageExtension(contentType, value, dataUrl);
      if (!dataUrl || !String(dataUrl).startsWith("data:image/")) return null;
      return { dataUrl, extension };
    } catch (err) {
      // Si falla por CORS/Red, no bloqueamos el Excel; se deja el link.
      // eslint-disable-next-line no-console
      console.warn(
        "No se pudo descargar evidencia para embebido en Excel:",
        url,
        err
      );
      return null;
    }
  };

  getImageExtensionFromDataUrl = dataUrl => {
    const m = /^data:image\/(png|jpe?g|gif|webp|bmp);base64,/i.exec(
      String(dataUrl || "")
    );
    if (!m) return "png";
    const ext = m[1].toLowerCase();
    return ext === "jpg" ? "jpeg" : ext;
  };

  getImageExtension = (contentType, url, dataUrl) => {
    const ct = String(contentType || "").toLowerCase();
    if (ct.includes("image/png")) return "png";
    if (ct.includes("image/jpeg") || ct.includes("image/jpg")) return "jpeg";
    if (ct.includes("image/gif")) return "gif";
    if (ct.includes("image/webp")) return "webp";
    if (ct.includes("image/bmp")) return "bmp";

    const clean = String(url || "")
      .split("?")[0]
      .split("#")[0]
      .toLowerCase();
    if (clean.endsWith(".png")) return "png";
    if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "jpeg";
    if (clean.endsWith(".gif")) return "gif";
    if (clean.endsWith(".webp")) return "webp";
    if (clean.endsWith(".bmp")) return "bmp";

    return this.getImageExtensionFromDataUrl(dataUrl);
  };

  componentDidMount() {
    this.cargarListado();
  }

  cargarListado = async () => {
    this.setState({ Preload: true });
    try {
      let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
      const CodigoSede = ObjSesion?.Usuario?.Sede?.value;

      const res = await fetch(
        gsUrlApi + "/seguimientosalmacenamientos/listar/" + CodigoSede,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json"
          }
        }
      );
      const json = await res.json();
      const datos = Array.isArray(json?.datos) ? json.datos : [];
      this.setState({ data: datos });
    } catch (err) {
      console.log("err", err);
      this.setState({ data: [] });
    } finally {
      this.setState({ Preload: false });
    }
  };

  irANuevo = () => {
    this.setState({ mostrarFormulario: true, editItem: null }, () => {
      if (this.formRef.current) {
        this.formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  editarRegistro = item => {
    this.setState({ mostrarFormulario: true, editItem: item || null }, () => {
      if (this.formRef.current) {
        this.formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  cancelarFormulario = () => {
    this.setState({ mostrarFormulario: false, editItem: null });
  };

  eliminarRegistro = async item => {
    if (!item?._id) return;

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      "¿Desea eliminar este seguimiento? Esta acción se registrará en el histórico."
    );
    if (!confirmed) return;

    try {
      const sesion = JSON.parse(localStorage.getItem("Usuario") || "null");
      const usuarioCambioId =
        sesion?.Usuario?._id ||
        sesion?.Usuario?.IdUsuario ||
        sesion?.Usuario?.id ||
        "";
      const usuarioCambioNombre =
        sesion?.Usuario?.NombreCompleto ||
        sesion?.Usuario?.Nombre ||
        sesion?.Usuario?.usuario ||
        "";

      const res = await fetch(
        gsUrlApi + "/seguimientosalmacenamientos/eliminar",
        {
          method: "POST",
          body: JSON.stringify({
            _id: item._id,
            UsuarioCambioId: usuarioCambioId,
            UsuarioCambioNombre: usuarioCambioNombre
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json"
          }
        }
      );

      const json = await res.json();
      if (!res.ok || json?.error) {
        // eslint-disable-next-line no-alert
        alert("No fue posible eliminar el registro.");
        return;
      }

      this.cargarListado();
      if (this.state.detalleItem?._id === item._id) {
        this.closeDetalle();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error eliminando seguimiento", err);
      // eslint-disable-next-line no-alert
      alert("No fue posible eliminar el registro.");
    }
  };

  openHistorial = async item => {
    if (!item?._id) return;

    this.setState({
      historialOpen: true,
      historialLoading: true,
      historialData: []
    });
    try {
      let objSesion = JSON.parse(localStorage.getItem("Usuario") || "null");
      const CodigoSede = objSesion?.Usuario?.Sede?.value;

      const res = await fetch(
        gsUrlApi + "/seguimientosalmacenamientos/listarHistorial",
        {
          method: "POST",
          body: JSON.stringify({
            SeguimientoId: item._id,
            CodigoSede
          }),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json"
          }
        }
      );
      const json = await res.json();
      this.setState({
        historialData: Array.isArray(json?.datos) ? json.datos : []
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error consultando histórico", err);
      this.setState({ historialData: [] });
    } finally {
      this.setState({ historialLoading: false });
    }
  };

  closeHistorial = () => {
    this.setState({
      historialOpen: false,
      historialData: [],
      historialLoading: false
    });
  };

  formatFechaHora = value => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("es-CO");
  };

  formatFecha = value => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es-CO");
  };

  formatFechaISO = value => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
      return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  isProbablyImageUrl = url => {
    const value = String(url || "").trim();
    if (!value) return false;
    if (value.startsWith("data:image/")) return true;
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
  };

  getEvidenciaUrls = aspecto => {
    const fromArray = Array.isArray(aspecto?.EvidenciaUrls)
      ? aspecto.EvidenciaUrls
      : [];
    const single = aspecto?.EvidenciaUrl ? [aspecto.EvidenciaUrl] : [];
    return Array.from(
      new Set(
        [...single, ...fromArray]
          .map(u => String(u || "").trim())
          .filter(Boolean)
      )
    );
  };

  contarResultados = (aspectos = [], key) => {
    if (!Array.isArray(aspectos)) return 0;
    return aspectos.filter(a => a && a.Resultado === key).length;
  };

  openDetalle = item => {
    this.setState({ detalleItem: item || null });
  };

  closeDetalle = () => {
    this.setState({ detalleItem: null });
  };

  setPrintDetalleRef = ref => {
    this.printDetalleRef = ref;
  };

  reactToPrintDetalleContent = () => {
    return this.printDetalleRef;
  };

  descargarExcelDetalle = async () => {
    const selected = this.state.detalleItem;
    if (!selected) return;

    const service = selected.ServicioNombre || selected.Servicio || "";
    const fechaISO = this.formatFechaISO(selected.Fecha);
    const hora = selected.Hora || "";

    const firmaSrc = selected.RevisadoPorFirma
      ? String(selected.RevisadoPorFirma).startsWith("data:image/")
        ? selected.RevisadoPorFirma
        : `data:image/png;base64,${selected.RevisadoPorFirma}`
      : "";

    let firmaExtension = "png";
    if (firmaSrc) {
      const m = /^data:image\/(png|jpe?g);base64,/i.exec(firmaSrc);
      if (m) {
        firmaExtension =
          m[1].toLowerCase() === "jpg" ? "jpeg" : m[1].toLowerCase();
      }
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Seguimiento");

    const aspectos = Array.isArray(selected.Aspectos) ? selected.Aspectos : [];
    const maxEvidencias = Math.max(
      1,
      ...aspectos.map(a => this.getEvidenciaUrls(a).length)
    );
    const evidenciaStartCol = 6;
    const totalCols = evidenciaStartCol + maxEvidencias - 1;

    const getExcelColumnLetter = colNumber => {
      let n = colNumber;
      let letters = "";
      while (n > 0) {
        const rem = (n - 1) % 26;
        letters = String.fromCharCode(65 + rem) + letters;
        n = Math.floor((n - 1) / 26);
      }
      return letters;
    };

    const lastColLetter = getExcelColumnLetter(totalCols);

    worksheet.getColumn(1).width = 14; // Código
    worksheet.getColumn(2).width = 24; // Sección
    worksheet.getColumn(3).width = 60; // Pregunta
    worksheet.getColumn(4).width = 14; // Resultado
    worksheet.getColumn(5).width = 40; // Observaciones
    for (let i = 0; i < maxEvidencias; i += 1) {
      worksheet.getColumn(evidenciaStartCol + i).width = 36;
    }

    worksheet.mergeCells(`A1:${lastColLetter}1`);
    worksheet.getCell("A1").value =
      "SEGUIMIENTO DEL ALMACENAMIENTO, DISPENSACIÓN Y ADMINISTRACIÓN DE MEDICAMENTOS DISPOSITIVOS MÉDICOS Y REACTIVOS";
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true
    };
    worksheet.getRow(1).font = { bold: true };

    worksheet.getCell("A2").value = "Servicio";
    worksheet.getCell("B2").value = service;
    worksheet.getCell("C2").value = "Fecha";
    worksheet.getCell("D2").value = fechaISO;
    worksheet.getCell("E2").value = "Hora";
    worksheet.getCell("F2").value = hora;
    worksheet.getRow(2).font = { bold: true };

    worksheet.mergeCells(`A3:${lastColLetter}3`);
    worksheet.getCell("A3").value = `Realizado por: ${selected.RealizadoPor ||
      ""} | Revisado por: ${selected.RevisadoPor || ""}`;
    worksheet.getCell("A3").alignment = { vertical: "middle", wrapText: true };

    const headerRowIndex = 4;
    worksheet.getRow(headerRowIndex).values = [
      "Código",
      "Sección",
      "Pregunta",
      "Resultado",
      "Observaciones",
      ...Array.from(
        { length: maxEvidencias },
        (_, idx) => `Evidencia ${idx + 1}`
      )
    ];
    worksheet.getRow(headerRowIndex).font = { bold: true };
    worksheet.getRow(headerRowIndex).alignment = {
      vertical: "middle",
      wrapText: true
    };

    for (const a of aspectos) {
      const evidenciaUrls = this.getEvidenciaUrls(a);

      const row = worksheet.addRow([
        a?.Codigo || "",
        a?.Seccion || "OTROS",
        a?.Pregunta || "",
        a?.Resultado || "",
        a?.Observaciones || "",
        ...Array.from({ length: maxEvidencias }, () => "")
      ]);
      row.getCell(5).alignment = { wrapText: true, vertical: "top" };
      row.getCell(3).alignment = { wrapText: true, vertical: "top" };
      for (let i = 0; i < maxEvidencias; i += 1) {
        row.getCell(evidenciaStartCol + i).alignment = {
          wrapText: true,
          vertical: "top"
        };
      }

      // Intentar embebido de TODAS las evidencias de imagen en el Excel.
      // Cada evidencia se coloca en su propia columna (Evidencia 1..N) en la misma fila.
      const evidenciaImagenes = evidenciaUrls.filter(url =>
        this.isProbablyImageUrl(url)
      );
      if (evidenciaImagenes.length > 0) {
        row.height = 95;
      }

      const rowIndex0 = row.number - 1;
      for (let i = 0; i < evidenciaImagenes.length; i += 1) {
        const urlImagen = evidenciaImagenes[i];
        const img = await this.fetchImageAsDataUrl(urlImagen);
        if (!img?.dataUrl) continue;

        const imageId = workbook.addImage({
          base64: img.dataUrl,
          extension: img.extension || "png"
        });

        // ExcelJS usa índices 0-based para col/row en posiciones.
        worksheet.addImage(imageId, {
          tl: { col: evidenciaStartCol - 1 + i, row: rowIndex0 },
          ext: { width: 130, height: 90 }
        });
      }
    }

    // Firma al final del documento
    const lastRowNumber = worksheet.lastRow
      ? worksheet.lastRow.number
      : headerRowIndex;
    const firmaLabelRow = lastRowNumber + 2;
    worksheet.mergeCells(`A${firmaLabelRow}:${lastColLetter}${firmaLabelRow}`);
    worksheet.getCell(`A${firmaLabelRow}`).value = "Firma de revisión";
    worksheet.getCell(`A${firmaLabelRow}`).font = { bold: true };

    if (firmaSrc) {
      const imageId = workbook.addImage({
        base64: firmaSrc,
        extension: firmaExtension
      });
      const imgTopRow = firmaLabelRow + 1;
      const imgBottomRow = imgTopRow + 3;

      worksheet.addImage(imageId, `B${imgTopRow}:D${imgBottomRow}`);
      worksheet.getRow(imgTopRow).height = 20;
      worksheet.getRow(imgTopRow + 1).height = 20;
      worksheet.getRow(imgTopRow + 2).height = 40;
      worksheet.getRow(imgTopRow + 3).height = 40;
    } else {
      worksheet.mergeCells(
        `A${firmaLabelRow + 1}:${lastColLetter}${firmaLabelRow + 1}`
      );
      worksheet.getCell(`A${firmaLabelRow + 1}`).value = "Sin firma registrada";
    }

    const filename = `Seguimiento_Almacenamiento_${service}_${fechaISO ||
      ""}.xlsx`;
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        filename
      );
    } catch (err) {
      // Mantener UX simple: log en consola
      // eslint-disable-next-line no-console
      console.error("Error generando Excel", err);
      // eslint-disable-next-line no-alert
      alert("No se pudo generar el Excel. Revisa la consola para más detalle.");
    }
  };

  reactToPrintDetalleTrigger = () => {
    return (
      <Button color="primary" disabled={!this.state.detalleItem}>
        Imprimir
      </Button>
    );
  };

  render() {
    return (
      <div>
        <PageTitle
          title="Formatos para Seguimientos"
          className="plr-15"
          breadCrumb={[
            { name: "Administrativos - Formatos para Seguimientos" }
          ]}
        />

        {this.state.mostrarFormulario ? (
          <div className="p-15" ref={this.formRef}>
            <SeguimientosAlmacenamientosForm
              onSaved={() => {
                this.setState({ mostrarFormulario: false, editItem: null });
                this.cargarListado();
              }}
              onCancel={this.cancelarFormulario}
              initialData={this.state.editItem}
            />
          </div>
        ) : (
          <div className="p-15">
            <div className="card p-15">
              <div className="d-flex align-items-center mb-3">
                <div className="font-weight-bold flex-1">
                  Listado de seguimientos realizados
                </div>
                <Button color="primary" onClick={this.irANuevo}>
                  Nuevo
                </Button>
              </div>

              {this.state.Preload ? (
                <div className="d-flex align-items-center">
                  <Ring />
                  <div className="ml-2">Cargando…</div>
                </div>
              ) : (
                <>
                  <Table bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th style={{ width: "120px" }}>Fecha</th>
                        <th style={{ width: "90px" }}>Hora</th>
                        <th>Realizado por</th>
                        <th>Revisado por</th>
                        <th style={{ width: "90px" }} className="text-center">
                          Cumple
                        </th>
                        <th style={{ width: "110px" }} className="text-center">
                          No cumple
                        </th>
                        <th style={{ width: "70px" }} className="text-center">
                          N/A
                        </th>
                        <th style={{ width: "120px" }} className="text-center">
                          Detalle
                        </th>
                        <th style={{ width: "170px" }} className="text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center">
                            Sin registros
                          </td>
                        </tr>
                      ) : (
                        this.state.data.map(item => (
                          <tr key={item._id}>
                            <td>
                              {item.ServicioNombre || item.Servicio || ""}
                            </td>
                            <td>{this.formatFecha(item.Fecha)}</td>
                            <td>{item.Hora || ""}</td>
                            <td>{item.RealizadoPor || ""}</td>
                            <td>{item.RevisadoPor || ""}</td>
                            <td className="text-center">
                              {this.contarResultados(item.Aspectos, "CUMPLE")}
                            </td>
                            <td className="text-center">
                              {this.contarResultados(
                                item.Aspectos,
                                "NO_CUMPLE"
                              )}
                            </td>
                            <td className="text-center">
                              {this.contarResultados(item.Aspectos, "NA")}
                            </td>
                            <td className="text-center">
                              <Button
                                color="link"
                                className="p-0"
                                onClick={() => this.openDetalle(item)}
                              >
                                Ver detalle
                              </Button>
                            </td>
                            <td className="text-center">
                              <Button
                                color="link"
                                className="p-0 mr-2"
                                onClick={() => this.editarRegistro(item)}
                              >
                                Editar
                              </Button>
                              <Button
                                color="link"
                                className="p-0 text-danger"
                                onClick={() => this.eliminarRegistro(item)}
                              >
                                Eliminar
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  <Modal
                    isOpen={!!this.state.detalleItem}
                    toggle={this.closeDetalle}
                    size="lg"
                  >
                    <ModalHeader toggle={this.closeDetalle}>
                      Detalle del seguimiento
                    </ModalHeader>
                    <ModalBody>
                      {this.state.detalleItem
                        ? (() => {
                            const selected = this.state.detalleItem;
                            const aspectos = Array.isArray(selected.Aspectos)
                              ? selected.Aspectos
                              : [];

                            const firmaExcelSrc = selected.RevisadoPorFirma
                              ? String(selected.RevisadoPorFirma).startsWith(
                                  "data:"
                                )
                                ? selected.RevisadoPorFirma
                                : `data:image/png;base64,${selected.RevisadoPorFirma}`
                              : "";

                            const sectionOrder = [];
                            const sectionMap = new Map();
                            aspectos.forEach(a => {
                              const key = (a?.Seccion || "").trim() || "OTROS";
                              if (!sectionMap.has(key)) {
                                sectionMap.set(key, []);
                                sectionOrder.push(key);
                              }
                              sectionMap.get(key).push(a);
                            });

                            return (
                              <>
                                <div className="mb-2">
                                  <div>
                                    <span className="font-weight-bold">
                                      Servicio:
                                    </span>{" "}
                                    {selected.ServicioNombre ||
                                      selected.Servicio ||
                                      ""}
                                  </div>
                                  <div>
                                    <span className="font-weight-bold">
                                      Fecha:
                                    </span>{" "}
                                    {this.formatFecha(selected.Fecha)}
                                    {"  "}
                                    <span className="font-weight-bold">
                                      Hora:
                                    </span>{" "}
                                    {selected.Hora || ""}
                                  </div>
                                  <div>
                                    <span className="font-weight-bold">
                                      Realizado por:
                                    </span>{" "}
                                    {selected.RealizadoPor || ""}
                                  </div>
                                </div>

                                {aspectos.length === 0 ? (
                                  <div className="text-center">
                                    Sin aspectos
                                  </div>
                                ) : (
                                  sectionOrder.map(sectionName => {
                                    const items =
                                      sectionMap.get(sectionName) || [];
                                    return (
                                      <div key={sectionName} className="mb-3">
                                        <div className="font-weight-bold mb-2">
                                          {sectionName}
                                        </div>

                                        <Table bordered responsive size="sm">
                                          <thead>
                                            <tr>
                                              <th style={{ width: "80px" }}>
                                                Código
                                              </th>
                                              <th>Pregunta</th>
                                              <th style={{ width: "120px" }}>
                                                Resultado
                                              </th>
                                              <th>Observaciones</th>
                                              <th
                                                className="text-center"
                                                style={{ width: "160px" }}
                                              >
                                                Evidencia
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {items.map((a, idx) => (
                                              <tr
                                                key={`${sectionName}-${a?.Codigo ||
                                                  ""}-${idx}`}
                                              >
                                                <td>{a?.Codigo || ""}</td>
                                                <td>{a?.Pregunta || ""}</td>
                                                <td>{a?.Resultado || ""}</td>
                                                <td>
                                                  {a?.Observaciones || ""}
                                                </td>
                                                <td align="center">
                                                  {this.getEvidenciaUrls(a).map(
                                                    (url, evIdx) => (
                                                      <div
                                                        key={`${a?.Codigo ||
                                                          ""}_${evIdx}_${url}`}
                                                      >
                                                        <a
                                                          href={url}
                                                          target="_blank"
                                                          rel="noreferrer"
                                                          title="Ver evidencia"
                                                          aria-label="Ver evidencia"
                                                        >
                                                          <i className="fas fa-eye" />{" "}
                                                          Ver {evIdx + 1}
                                                        </a>
                                                      </div>
                                                    )
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </Table>
                                      </div>
                                    );
                                  })
                                )}

                                <div className="mt-3">
                                  <div className="font-weight-bold mb-2">
                                    Firma de revisión
                                  </div>
                                  {selected.RevisadoPorFirma ? (
                                    <div className="border rounded p-2">
                                      <img
                                        alt="Firma de revisión"
                                        src={
                                          String(
                                            selected.RevisadoPorFirma
                                          ).startsWith("data:")
                                            ? selected.RevisadoPorFirma
                                            : `data:image/png;base64,${selected.RevisadoPorFirma}`
                                        }
                                        style={{
                                          maxWidth: "100%",
                                          height: "auto"
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div>Sin firma registrada</div>
                                  )}
                                </div>

                                <table
                                  id="seguimiento_almacenamiento_excel"
                                  style={{ display: "none" }}
                                >
                                  <thead>
                                    <tr>
                                      <th colSpan={6}>
                                        SEGUIMIENTO DEL ALMACENAMIENTO,
                                        DISPENSACIÓN Y ADMINISTRACIÓN DE
                                        MEDICAMENTOS DISPOSITIVOS MÉDICOS Y
                                        REACTIVOS
                                      </th>
                                    </tr>
                                    <tr>
                                      <th>Servicio</th>
                                      <th>
                                        {selected.ServicioNombre ||
                                          selected.Servicio ||
                                          ""}
                                      </th>
                                      <th>Fecha</th>
                                      <th>
                                        {this.formatFechaISO(selected.Fecha)}
                                      </th>
                                      <th>Hora</th>
                                      <th>{selected.Hora || ""}</th>
                                    </tr>
                                    <tr>
                                      <th colSpan={6}>
                                        Realizado por:{" "}
                                        {selected.RealizadoPor || ""} | Revisado
                                        por: {selected.RevisadoPor || ""}
                                      </th>
                                    </tr>
                                    <tr>
                                      <th colSpan={6}>
                                        Firma de revisión:{" "}
                                        {firmaExcelSrc ? (
                                          <img
                                            alt="Firma de revisión"
                                            src={firmaExcelSrc}
                                            style={{
                                              display: "block",
                                              maxWidth: "260px",
                                              maxHeight: "120px",
                                              width: "auto",
                                              height: "auto",
                                              objectFit: "contain"
                                            }}
                                          />
                                        ) : (
                                          "Sin firma registrada"
                                        )}
                                      </th>
                                    </tr>
                                    <tr>
                                      <th>Código</th>
                                      <th>Sección</th>
                                      <th>Pregunta</th>
                                      <th>Resultado</th>
                                      <th>Observaciones</th>
                                      <th>EvidenciaUrl</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {aspectos.length === 0 ? (
                                      <tr>
                                        <td colSpan={6}>Sin aspectos</td>
                                      </tr>
                                    ) : (
                                      aspectos.map((a, idx) => (
                                        <tr
                                          key={`excel-${a?.Codigo ||
                                            ""}-${idx}`}
                                        >
                                          <td>{a?.Codigo || ""}</td>
                                          <td>{a?.Seccion || ""}</td>
                                          <td>{a?.Pregunta || ""}</td>
                                          <td>{a?.Resultado || ""}</td>
                                          <td>{a?.Observaciones || ""}</td>
                                          <td>
                                            {this.getEvidenciaUrls(a).map(
                                              (url, evIdx) =>
                                                this.isProbablyImageUrl(url) ? (
                                                  <img
                                                    key={`${a?.Codigo ||
                                                      ""}_${evIdx}_${url}`}
                                                    src={url}
                                                    alt={`Evidencia ${evIdx +
                                                      1}`}
                                                    style={{
                                                      display: "block",
                                                      maxWidth: "220px",
                                                      maxHeight: "120px",
                                                      width: "auto",
                                                      height: "auto",
                                                      objectFit: "contain"
                                                    }}
                                                  />
                                                ) : (
                                                  <div
                                                    key={`${a?.Codigo ||
                                                      ""}_${evIdx}_${url}`}
                                                  >
                                                    {url}
                                                  </div>
                                                )
                                            )}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </>
                            );
                          })()
                        : ""}

                      <div style={{ display: "none" }}>
                        <SeguimientoAlmacenamientosPrint
                          ref={this.setPrintDetalleRef}
                          seguimiento={this.state.detalleItem}
                        />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <ReactToPrint
                        content={this.reactToPrintDetalleContent}
                        documentTitle={`Seguimiento_Almacenamiento_${this.state
                          .detalleItem?.ServicioNombre ||
                          this.state.detalleItem?.Servicio ||
                          ""}_${this.state.detalleItem?.Fecha || ""}`}
                        removeAfterPrint
                        trigger={this.reactToPrintDetalleTrigger}
                      />

                      <Button
                        color="info"
                        onClick={() =>
                          this.openHistorial(this.state.detalleItem)
                        }
                        disabled={!this.state.detalleItem}
                      >
                        Ver histórico
                      </Button>

                      <Button
                        color="success"
                        onClick={this.descargarExcelDetalle}
                        disabled={!this.state.detalleItem}
                      >
                        Descargar Excel
                      </Button>

                      <Button color="secondary" onClick={this.closeDetalle}>
                        Cerrar
                      </Button>
                    </ModalFooter>
                  </Modal>

                  <Modal
                    isOpen={this.state.historialOpen}
                    toggle={this.closeHistorial}
                    size="lg"
                  >
                    <ModalHeader toggle={this.closeHistorial}>
                      Histórico de cambios
                    </ModalHeader>
                    <ModalBody>
                      {this.state.historialLoading ? (
                        <div className="d-flex align-items-center">
                          <Ring />
                          <div className="ml-2">Cargando histórico…</div>
                        </div>
                      ) : this.state.historialData.length === 0 ? (
                        <div className="text-center">
                          Sin cambios registrados
                        </div>
                      ) : (
                        <Table bordered hover responsive size="sm">
                          <thead>
                            <tr>
                              <th style={{ width: "140px" }}>Acción</th>
                              <th style={{ width: "200px" }}>Fecha cambio</th>
                              <th>Usuario</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.historialData.map(h => (
                              <tr key={h._id}>
                                <td>{h.Accion || ""}</td>
                                <td>
                                  {this.formatFechaHora(
                                    h.FechaCambio || h.CreatedAt
                                  )}
                                </td>
                                <td>{h.UsuarioCambioNombre || ""}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.closeHistorial}>
                        Cerrar
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SeguimientosAlmacenamientos;
