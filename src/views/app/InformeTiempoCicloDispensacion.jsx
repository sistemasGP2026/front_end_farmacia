import React from "react";
import { Table, Modal } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import Select from "react-select";
import { Ring } from "react-awesome-spinners";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Button from "components/button/Button";
import { gsUrlApi } from "config/configServer";

class InformeTiempoCicloDispensacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preload: false,
      error: "",
      arraySedes: [],
      Sede: null,
      fechaInicio: this.getStartOfMonthLocal(),
      fechaFin: this.getNowLocal(),
      fichaTecnica: null,
      resumenMensual: null,
      medicionDiaria: [],
      porTurno: [],
      porServicioSolicitante: [],
      porTipoOrden: []
    };
  }

  componentDidMount = () => {
    this.ListarSedes();
  };

  getNowLocal = () => {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  getStartOfMonthLocal = () => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  ListarSedes = () => {
    fetch(gsUrlApi + "/empresa_sedes/listar/1", {
      method: "GET",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        const items = [];
        const lstDatos = data.datos || [];
        for (let i = 0; i < lstDatos.length; i++) {
          items.push({
            value: lstDatos[i].Codigo,
            label: lstDatos[i].Codigo + " - " + lstDatos[i].Nombre
          });
        }

        this.setState({ arraySedes: items }, () => {
          this.Filtrar();
        });
      })
      .catch(() => {
        this.setState({
          error: "No fue posible cargar la lista de sedes"
        });
      });
  };

  CambiarSelect = data => {
    this.setState({ Sede: data });
  };

  CambiarFechaInicio = event => {
    this.setState({ fechaInicio: event.target.value });
  };

  CambiarFechaFin = event => {
    this.setState({ fechaFin: event.target.value });
  };

  Filtrar = () => {
    if (!this.state.fechaInicio || !this.state.fechaFin) {
      this.setState({ error: "Debes seleccionar fecha inicio y fecha fin" });
      return;
    }

    if (this.state.fechaInicio > this.state.fechaFin) {
      this.setState({
        error: "La fecha inicio no puede ser mayor que la fecha fin"
      });
      return;
    }

    this.setState({ preload: true, error: "" });

    fetch(gsUrlApi + "/dispensaciones/informeTiempoCiclo", {
      method: "POST",
      body: JSON.stringify({
        FechaInicio: this.state.fechaInicio,
        FechaFin: this.state.fechaFin,
        Sede: this.state.Sede ? this.state.Sede.value : null
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        const datos = data && data.datos ? data.datos : {};

        this.setState({
          fichaTecnica: datos.FichaTecnica || null,
          resumenMensual: datos.ResumenMensual || null,
          medicionDiaria: datos.MedicionDiaria || [],
          porTurno: (datos.Desagregacion && datos.Desagregacion.PorTurno) || [],
          porServicioSolicitante:
            (datos.Desagregacion &&
              datos.Desagregacion.PorServicioSolicitante) ||
            [],
          porTipoOrden:
            (datos.Desagregacion && datos.Desagregacion.PorTipoOrden) || [],
          preload: false
        });
      })
      .catch(() => {
        this.setState({
          preload: false,
          error: "No fue posible consultar el informe de tiempo de ciclo"
        });
      });
  };

  getBadgeStyle = clasificacion => {
    if (clasificacion === "CUMPLE") {
      return { background: "#157347", color: "#ffffff" };
    }

    if (clasificacion === "EN RIESGO") {
      return { background: "#b76e00", color: "#ffffff" };
    }

    return { background: "#b02a37", color: "#ffffff" };
  };

  renderResumenCard = (titulo, valor, subtitulo, bg) => {
    return (
      <div className="col-md-6 col-xl-3 mb-3">
        <div
          className="p-3"
          style={{
            borderRadius: "14px",
            background: bg,
            color: "#0f172a",
            minHeight: "120px",
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)"
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.75 }}>{titulo}</div>
          <div
            style={{ fontSize: "28px", fontWeight: 700, lineHeight: "34px" }}
          >
            {valor}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.75 }}>{subtitulo}</div>
        </div>
      </div>
    );
  };

  render() {
    const resumen = this.state.resumenMensual;
    const ficha = this.state.fichaTecnica;

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

        <div
          className="p-4 mb-4"
          style={{
            borderRadius: "18px",
            background:
              "linear-gradient(120deg, #f9f6ef 0%, #dff2f6 45%, #fef3de 100%)",
            border: "1px solid #e2e8f0"
          }}
        >
          <h3 style={{ marginBottom: "6px", color: "#0f172a" }}>
            Indicador: Tiempo de ciclo de dispensacion
          </h3>
          <p style={{ margin: 0, color: "#334155" }}>
            Medicion diaria y analisis mensual del tiempo entre recepcion de la
            orden medica y entrega en farmacia.
          </p>
        </div>

        <div className="row pb-3">
          <div className="col-md-3 mb-2">
            <label>Fecha inicio</label>
            <input
              type="datetime-local"
              value={this.state.fechaInicio}
              onChange={this.CambiarFechaInicio}
              className="form-control react-form-input"
            />
          </div>

          <div className="col-md-3 mb-2">
            <label>Fecha fin</label>
            <input
              type="datetime-local"
              value={this.state.fechaFin}
              onChange={this.CambiarFechaFin}
              className="form-control react-form-input"
            />
          </div>

          <div className="col-md-4 mb-2">
            <label>Sede</label>
            <Select
              id="Sedes"
              onChange={this.CambiarSelect}
              placeholder="Todas las sedes"
              className="react-form-search-input"
              value={this.state.Sede}
              options={this.state.arraySedes}
              isClearable
            />
          </div>

          <div className="col-md-2 mb-2">
            <Button
              type="button"
              style={{ marginTop: "32px", width: "100%" }}
              onClick={this.Filtrar}
              className="c-btn c-success"
            >
              Consultar
            </Button>
          </div>
        </div>

        {this.state.error ? (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        ) : null}

        {resumen ? (
          <>
            <div className="row mb-2">
              {this.renderResumenCard(
                "Promedio mensual",
                resumen.PromedioHoras + " h",
                resumen.PromedioMinutos + " minutos",
                "#e7f6ef"
              )}
              {this.renderResumenCard(
                "Ordenes dispensadas",
                resumen.OrdenesDispensadas,
                "Total del periodo consultado",
                "#e8f1ff"
              )}
              {this.renderResumenCard(
                "Minimo",
                resumen.MinimoMinutos + " min",
                "Mejor tiempo del periodo",
                "#fff4de"
              )}
              {this.renderResumenCard(
                "Maximo",
                resumen.MaximoMinutos + " min",
                "Mayor tiempo del periodo",
                "#ffe8e8"
              )}
            </div>

            <div
              className="mb-4 p-3"
              style={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="mb-1">Estado del indicador mensual</h5>
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    Meta institucional: promedio mensual {"<="} 24 horas (1440
                    min)
                  </div>
                </div>
                <span
                  style={{
                    ...this.getBadgeStyle(resumen.Clasificacion),
                    padding: "8px 14px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.6px"
                  }}
                >
                  {resumen.Clasificacion}
                </span>
              </div>
            </div>
          </>
        ) : null}

        <div className="right-panel roe-box-shadow mb-4">
          <div className="contact-list-header row">
            <div className="ml-4">
              <h4>Medicion diaria del indicador</h4>
            </div>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <button className="c-btn c-secundary">
                <ReactHTMLTableToExcel
                  id="export_diario"
                  className="botontransparente"
                  table="tablaMedicionDiaria"
                  filename="tiempo_ciclo_diario"
                  sheet="medicion_diaria"
                  buttonText="Exportar Excel"
                />
              </button>
            </div>
          </div>
          <div className="contact-table">
            <Scrollbars autoHide style={{ minHeight: "260px" }}>
              {this.state.medicionDiaria.length > 0 ? (
                <Table
                  striped
                  bordered
                  hover
                  className="mb-0"
                  id="tablaMedicionDiaria"
                >
                  <thead>
                    <tr className="border-bottom">
                      <th>Fecha</th>
                      <th>Ordenes dispensadas</th>
                      <th>Promedio minutos</th>
                      <th>Promedio horas</th>
                      <th>Clasificacion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.medicionDiaria.map((item, i) => (
                      <tr key={i} className="border-bottom">
                        <td>{item.Fecha}</td>
                        <td>{item.OrdenesDispensadas}</td>
                        <td>{item.PromedioMinutos}</td>
                        <td>{item.PromedioHoras}</td>
                        <td>
                          <span
                            style={{
                              ...this.getBadgeStyle(item.Clasificacion),
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "11px",
                              fontWeight: 700
                            }}
                          >
                            {item.Clasificacion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center no-found-message">
                  No se encontraron datos para el rango consultado.
                </div>
              )}
            </Scrollbars>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="right-panel roe-box-shadow">
              <div className="contact-list-header row">
                <div className="ml-4">
                  <h5>Desagregacion por turno</h5>
                </div>
              </div>
              <div className="contact-table">
                <Scrollbars autoHide style={{ minHeight: "220px" }}>
                  <Table striped bordered hover className="mb-0">
                    <thead>
                      <tr className="border-bottom">
                        <th>Turno</th>
                        <th>Ordenes</th>
                        <th>Promedio (h)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.porTurno.map((item, i) => (
                        <tr key={i} className="border-bottom">
                          <td>{item.Turno}</td>
                          <td>{item.OrdenesDispensadas}</td>
                          <td>{item.PromedioHoras}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Scrollbars>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="right-panel roe-box-shadow">
              <div className="contact-list-header row">
                <div className="ml-4">
                  <h5>Desagregacion por tipo de orden</h5>
                </div>
              </div>
              <div className="contact-table">
                <Scrollbars autoHide style={{ minHeight: "220px" }}>
                  <Table striped bordered hover className="mb-0">
                    <thead>
                      <tr className="border-bottom">
                        <th>Tipo orden</th>
                        <th>Ordenes</th>
                        <th>Promedio (h)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.porTipoOrden.map((item, i) => (
                        <tr key={i} className="border-bottom">
                          <td>{item.TipoOrden}</td>
                          <td>{item.OrdenesDispensadas}</td>
                          <td>{item.PromedioHoras}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Scrollbars>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel roe-box-shadow mb-4">
          <div className="contact-list-header row">
            <div className="ml-4">
              <h5>Desagregacion por servicio solicitante</h5>
            </div>
          </div>
          <div className="contact-table">
            <Scrollbars autoHide style={{ minHeight: "260px" }}>
              <Table striped bordered hover className="mb-0">
                <thead>
                  <tr className="border-bottom">
                    <th>Servicio solicitante</th>
                    <th>Ordenes</th>
                    <th>Promedio minutos</th>
                    <th>Promedio horas</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.porServicioSolicitante.map((item, i) => (
                    <tr key={i} className="border-bottom">
                      <td>{item.ServicioSolicitante}</td>
                      <td>{item.OrdenesDispensadas}</td>
                      <td>{item.PromedioMinutos}</td>
                      <td>{item.PromedioHoras}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Scrollbars>
          </div>
        </div>

        {ficha ? (
          <div
            className="p-3"
            style={{
              borderRadius: "12px",
              border: "1px dashed #94a3b8",
              background: "#f8fafc"
            }}
          >
            <h5>Ficha tecnica</h5>
            <p className="mb-1">
              <strong>Nombre:</strong> {ficha.NombreIndicador}
            </p>
            <p className="mb-1">
              <strong>Proceso:</strong> {ficha.Proceso}
            </p>
            <p className="mb-1">
              <strong>Tipo indicador:</strong> {ficha.TipoIndicador}
            </p>
            <p className="mb-1">
              <strong>Tendencia esperada:</strong> {ficha.TendenciaEsperada}
            </p>
            <p className="mb-1">
              <strong>Formula:</strong> {ficha.Formula}
            </p>
            <p className="mb-0">
              <strong>Unidad medida:</strong> {ficha.UnidadMedida}
            </p>
          </div>
        ) : null}
      </>
    );
  }
}

export default InformeTiempoCicloDispensacion;
