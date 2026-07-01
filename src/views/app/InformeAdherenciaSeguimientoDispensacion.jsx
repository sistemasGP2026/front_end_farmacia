import React from "react";
import PageTitle from "components/common/PageTitle";
import { Table, Modal } from "reactstrap";
import { Ring } from "react-awesome-spinners";
import Button from "components/button/Button";
import { gsUrlApi } from "config/configServer";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const MESES = [
  { value: 1, label: "ENERO" },
  { value: 2, label: "FEBRERO" },
  { value: 3, label: "MARZO" },
  { value: 4, label: "ABRIL" },
  { value: 5, label: "MAYO" },
  { value: 6, label: "JUNIO" },
  { value: 7, label: "JULIO" },
  { value: 8, label: "AGOSTO" },
  { value: 9, label: "SEPTIEMBRE" },
  { value: 10, label: "OCTUBRE" },
  { value: 11, label: "NOVIEMBRE" },
  { value: 12, label: "DICIEMBRE" }
];

function buildServiciosFromReporte(reporte) {
  const catalogo = Array.isArray(reporte?.ServiciosCatalogo)
    ? reporte.ServiciosCatalogo
    : [];

  // Preferir catálogo (ServiciosSeguimiento) para mostrar columnas por servicio creado
  if (catalogo.length > 0) {
    return catalogo
      .map(s => {
        const key = s?.Key || s?.key || s?.Codigo || s?.Nombre || "";
        if (!key) return null;

        // Si viene Codigo/Nombre, mostrar "CODIGO - NOMBRE"; si no, header simple
        const header =
          [s?.Codigo, s?.Nombre].filter(Boolean).join(" - ") ||
          s?.Header ||
          key;
        const finalLabel = s?.FinalLabel || key;
        return { key, header, finalLabel };
      })
      .filter(Boolean);
  }

  // Fallback (compatibilidad): usar lo que venga en reporte.Servicios
  const reporteServicios = Array.isArray(reporte?.Servicios)
    ? reporte.Servicios
    : [];
  return reporteServicios
    .map(key => ({
      key,
      header: key,
      finalLabel: key
    }))
    .filter(x => x.key);
}

class InformeAdherenciaSeguimientoDispensacion extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();

    this.state = {
      preload: false,
      error: "",
      mes: now.getMonth() + 1,
      ano: now.getFullYear(),
      rondas: 2,
      reporte: null
    };
  }

  cambiarMes = e => {
    this.setState({ mes: Number(e.target.value) });
  };

  cambiarAno = e => {
    this.setState({ ano: Number(e.target.value) });
  };

  consultar = () => {
    const mes = Number(this.state.mes);
    const ano = Number(this.state.ano);

    if (!mes || mes < 1 || mes > 12 || !ano) {
      this.setState({ error: "Debes seleccionar Mes y Año" });
      return;
    }

    this.setState({ preload: true, error: "" });
    let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
    const CodigoSede = ObjSesion?.Usuario?.Sede?.value;

    fetch(gsUrlApi + "/seguimientosalmacenamientos/informeAdherencia", {
      method: "POST",
      body: JSON.stringify({ Mes: mes, Ano: ano, CodigoSede }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.error) {
          this.setState({ preload: false, error: data.error, reporte: null });
          return;
        }

        this.setState({
          preload: false,
          reporte: data?.datos || null,
          rondas: Number(data?.datos?.Rondas || 0)
        });
      })
      .catch(() => {
        this.setState({
          preload: false,
          error: "No fue posible consultar el informe",
          reporte: null
        });
      });
  };

  getMesLabel = mes => {
    const m = MESES.find(x => x.value === mes);
    return m ? m.label : "";
  };

  formatValor = valor => {
    if (valor === "" || valor == null) return "";
    if (valor === "NA") return "N/A";
    if (typeof valor === "number") {
      if (valor === 0) return "0,00";
      return String(valor);
    }
    return String(valor);
  };

  formatFinalPct = value => {
    if (value == null || value === "") return "";
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  renderTablaExcelExport = (reporte, servicios, grupos) => {
    // Estructura de columnas:
    // [#Grupo] + [Código] + [Aspecto/Pregunta] + (por servicio: [Valor, %]) + [Observaciones]
    const totalCols = 1 + 2 + servicios.length * 2 + 1;
    const titleColSpan = totalCols - 1;

    return (
      <table id="adherencia_excel_export" style={{ display: "none" }}>
        <tbody>
          <tr>
            <td />
            <td
              colSpan={titleColSpan}
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              ADHERENCIA SEGUIMIENTO A LA DISPENSACIÓN
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>MES:</td>
            <td style={{ fontWeight: "bold", textAlign: "center" }}>
              {this.getMesLabel(reporte?.Mes)}
            </td>
            <td style={{ fontWeight: "bold" }}>AÑO:</td>
            <td style={{ fontWeight: "bold", textAlign: "center" }}>
              {reporte?.Ano ?? ""}
            </td>
            <td colSpan={Math.max(0, totalCols - 4)} />
          </tr>

          {grupos.map((grupo, groupIndex) => {
            const items = Array.isArray(grupo?.Items) ? grupo.Items : [];
            return (
              <React.Fragment key={`excel-grupo-${grupo?.Grupo || groupIndex}`}>
                <tr>
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>
                    {groupIndex + 1}
                  </td>
                  <td
                    colSpan={titleColSpan}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {grupo?.Grupo || ""}
                  </td>
                </tr>

                <tr>
                  <td />
                  <td
                    colSpan={2}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    ASPECTO DE REVISIÓN
                  </td>
                  {servicios.map(s => (
                    <React.Fragment
                      key={`excel-head-${grupo?.Grupo || groupIndex}-${s.key}`}
                    >
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>
                        {s.header}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>
                        CUMPLIMIENTO
                      </td>
                    </React.Fragment>
                  ))}
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>
                    OBSERVACIONES
                  </td>
                </tr>

                {items.length === 0 ? (
                  <tr>
                    <td />
                    <td colSpan={totalCols - 1} style={{ textAlign: "center" }}>
                      Sin registros
                    </td>
                  </tr>
                ) : (
                  <>
                    {items.map(it => (
                      <tr
                        key={`excel-item-${grupo?.Grupo ||
                          groupIndex}-${it?.Codigo || ""}`}
                      >
                        <td />
                        <td style={{ textAlign: "center" }}>
                          {it?.Codigo || ""}
                        </td>
                        <td>{it?.Pregunta || ""}</td>

                        {servicios.map(s => {
                          const cell = it?.PorServicio?.[s.key] || {};
                          const valor = this.formatValor(cell.Valor);
                          const pct = cell.Porcentaje;
                          const pctText =
                            pct === "" || pct == null
                              ? ""
                              : pct === "NA"
                              ? "N/A"
                              : `${pct}%`;

                          return (
                            <React.Fragment
                              key={`excel-cell-${it?.Codigo || ""}-${s.key}`}
                            >
                              <td style={{ textAlign: "center" }}>
                                {valor || "0"}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {pctText || "0%"}
                              </td>
                            </React.Fragment>
                          );
                        })}

                        <td />
                      </tr>
                    ))}

                    <tr>
                      <td />
                      <td
                        colSpan={2}
                        style={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        TOTAL
                      </td>
                      {servicios.map(s => {
                        const total = grupo?.TotalesPorServicio?.[s.key];
                        const pct = total?.ScorePorcentaje;
                        const aplicables = total?.Aplicables || 0;
                        return (
                          <React.Fragment
                            key={`excel-total-${grupo?.Grupo || groupIndex}-${
                              s.key
                            }`}
                          >
                            <td />
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "center"
                              }}
                            >
                              {aplicables > 0 && pct != null ? `${pct}%` : "0%"}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      <td />
                    </tr>
                  </>
                )}

                <tr>
                  <td colSpan={totalCols} />
                </tr>
              </React.Fragment>
            );
          })}

          <tr>
            <td />
            <td colSpan={2} style={{ fontWeight: "bold", textAlign: "center" }}>
              FINAL
            </td>
            {servicios.map(s => {
              const final = reporte?.FinalPorServicio?.[s.key];
              const finalText = this.formatFinalPct(final);
              return (
                <React.Fragment key={`excel-final-${s.key}`}>
                  <td style={{ fontWeight: "bold", textAlign: "center" }}>
                    {s.header}
                  </td>
                  <td style={{ fontWeight: "bold", textAlign: "center" }}>
                    {finalText ? `${finalText}%` : "0%"}
                  </td>
                </React.Fragment>
              );
            })}
            <td />
          </tr>

          <tr>
            <td />
            <td
              colSpan={titleColSpan}
              style={{ fontSize: "12px", textAlign: "right" }}
            >
              NOTA: SE REALIZARON {reporte?.Rondas ?? ""} RONDAS EN EL MES, POR
              LO QUE LA FORMULA SE AJUSTÓ A ELLO
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  renderEncabezadoExcel = (reporte, servicios) => {
    return (
      <Table bordered responsive size="sm" className="mb-0">
        <tbody>
          <tr>
            <td colSpan={1}></td>
            <td
              colSpan={servicios.length * 2 + 3}
              className="text-center font-weight-bold"
            >
              ADHERENCIA SEGUIMIENTO A LA DISPENSACIÓN
            </td>
          </tr>
          <tr>
            <td className="font-weight-bold">MES:</td>
            <td className="text-center font-weight-bold">
              {this.getMesLabel(reporte.Mes)}
            </td>
            <td className="font-weight-bold">AÑO:</td>
            <td className="text-center font-weight-bold">{reporte.Ano}</td>
          </tr>
        </tbody>
      </Table>
    );
  };

  renderTablaGrupo = (grupo, servicios, groupIndex) => {
    const items = Array.isArray(grupo?.Items) ? grupo.Items : [];
    const totalColSpan = 1 + 2 + servicios.length * 2;
    const idx = groupIndex - 1;
    return (
      <Table key={grupo.Grupo} bordered responsive size="sm" className="mb-3">
        <thead>
          <tr>
            {idx === 0 ? (
              <td
                className="text-center font-weight-bold"
                style={{ width: "40px" }}
              >
                {groupIndex}
              </td>
            ) : null}
            <th colSpan={servicios.length * 2 + 3} className="text-center">
              {grupo.Grupo}
            </th>
          </tr>
          <tr>
            <th colSpan={2} rowSpan={1} className="text-center">
              ASPECTO DE REVISIÓN
            </th>
            {servicios.map(s => (
              <React.Fragment key={grupo.Grupo + "_h_" + s.key}>
                <th className="text-center">{s.header}</th>
                <th className="text-center">CUMPLIMIENTO</th>
              </React.Fragment>
            ))}
            <th className="text-center">OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td className="text-center" style={{ width: "40px" }}>
                {groupIndex}
              </td>
              <td colSpan={totalColSpan - 1} className="text-center">
                Sin registros
              </td>
            </tr>
          ) : (
            <>
              {items.map(it => (
                <tr key={grupo.Grupo + "_" + it.Codigo}>
                  <td style={{ width: "70px" }} className="text-center">
                    {it.Codigo}
                  </td>
                  <td>{it.Pregunta}</td>

                  {servicios.map(s => {
                    const cell = it?.PorServicio?.[s.key] || {};
                    const valor = this.formatValor(cell.Valor);
                    const pct = cell.Porcentaje;
                    const pctText =
                      pct === "" || pct == null
                        ? ""
                        : pct === "NA"
                        ? "N/A"
                        : `${pct}%`;

                    return (
                      <React.Fragment key={it.Codigo + "_" + s.key}>
                        <td className="text-center">{valor || "0"}</td>
                        <td className="text-center">{pctText || "0%"}</td>
                      </React.Fragment>
                    );
                  })}
                  <th></th>
                </tr>
              ))}

              <tr>
                <td colSpan={2} className="font-weight-bold text-center">
                  TOTAL
                </td>
                {servicios.map(s => {
                  const total = grupo?.TotalesPorServicio?.[s.key];
                  const pct = total?.ScorePorcentaje;
                  const aplicables = total?.Aplicables || 0;
                  return (
                    <React.Fragment key={grupo.Grupo + "_total_" + s.key}>
                      <td className="text-center"></td>
                      <td className="text-center font-weight-bold">
                        {aplicables > 0 && pct != null ? `${pct}%` : "0%"}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </>
          )}
        </tbody>
      </Table>
    );
  };

  renderTablaFinal = (reporte, servicios) => {
    return (
      <Table bordered responsive size="sm" className="mb-0">
        <tbody>
          <tr>
            <td style={{ width: "40px" }}></td>
            <td colSpan={2} className="font-weight-bold text-center">
              FINAL
            </td>
            {servicios.map(s => {
              const final = reporte?.FinalPorServicio?.[s.key];
              const finalText = this.formatFinalPct(final);
              return (
                <React.Fragment key={"final_" + s.key}>
                  <td className="text-center font-weight-bold">{s.header}</td>
                  <td className="text-center font-weight-bold text-danger">
                    {finalText ? `${finalText}%` : "0%"}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
        </tbody>
      </Table>
    );
  };

  render() {
    const reporte = this.state.reporte;
    const servicios = buildServiciosFromReporte(reporte);
    const grupos = Array.isArray(reporte?.Grupos) ? reporte.Grupos : [];

    return (
      <>
        <Modal
          centered
          isOpen={this.state.preload}
          fade={false}
          className={this.props.className}
          style={{ maxWidth: "300px" }}
        >
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Ring className="bm-2" size="124" />
            <h3 className="mt-5 pt-3 text-white">Cargando...</h3>
          </div>
        </Modal>

        <div>
          <PageTitle
            title="Informe adherencia seguimiento a la dispensación"
            className="plr-15"
            breadCrumb={[{ name: "Informes" }]}
          />

          <div className="p-15">
            <div className="card p-15">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <label>Mes</label>
                  <select
                    className="form-control react-form-input"
                    value={this.state.mes}
                    onChange={this.cambiarMes}
                  >
                    {MESES.map(m => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-2">
                  <label>Año</label>
                  <input
                    type="number"
                    className="form-control react-form-input"
                    value={this.state.ano}
                    onChange={this.cambiarAno}
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label>Rondas</label>
                  <input
                    type="number"
                    className="form-control react-form-input"
                    value={reporte?.Rondas ?? this.state.rondas}
                    disabled
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <Button
                    type="button"
                    style={{ marginTop: "32px", width: "100%" }}
                    onClick={this.consultar}
                    className="c-btn c-success"
                  >
                    Consultar
                  </Button>
                </div>
              </div>

              {this.state.error ? (
                <div className="alert alert-danger mt-2" role="alert">
                  {this.state.error}
                </div>
              ) : null}

              {reporte ? (
                <>
                  <div className="d-flex justify-content-end mt-3">
                    <ReactHTMLTableToExcel
                      id="adherencia_btn_excel"
                      className="c-btn c-secundary"
                      table="adherencia_excel_export"
                      filename={`ADHERENCIA ${reporte?.Ano ?? ""}`}
                      sheet="ADHERENCIA"
                      buttonText="Imprimir Excel"
                    />
                  </div>

                  <div className="mt-3">
                    {this.renderEncabezadoExcel(reporte, servicios)}

                    {grupos.map((g, idx) =>
                      this.renderTablaGrupo(g, servicios, idx + 1)
                    )}

                    {this.renderTablaFinal(reporte, servicios)}
                    <div
                      className="text-right my-2"
                      style={{ fontSize: "12px" }}
                    >
                      NOTA: SE REALIZARON {reporte.Rondas} RONDAS EN EL MES, POR
                      LO QUE LA FORMULA SE AJUSTÓ A ELLO
                    </div>
                  </div>

                  {this.renderTablaExcelExport(reporte, servicios, grupos)}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default InformeAdherenciaSeguimientoDispensacion;
