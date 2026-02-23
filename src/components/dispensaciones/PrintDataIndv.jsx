import React from "react";
import "bootstrap/dist/css/bootstrap.css";

class Manifiestos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }


  render() {
    console.log("this.props.data", this.props.objDatos);

    return (
      <div>
        <div>
          <h3
            style={{ textAlign: "center", paddingTop: "5%" }}
            className="font-weight-bold"
          >
            Gestión Salud S.A.S.
          </h3>
        </div>
        <div className="mx-auto" style={{ minWidth: "100%" }}>
          <div className="row" style={{ minWidth: "100%" }}>
            <div className="mx-auto" style={{ minWidth: "100%" }}>
              <p style={{ paddingLeft: "15%" }}>
                NIT 80601521-3 Cod. Habilitación: 130010166701 Direccion: Amberes Cra 29N°38- 20  Teléfono: 6810199
              </p>
            </div>
          </div>
        </div>
        <br></br>
        <div style={{ paddingLeft: "5%", paddingRight: "6%" }}>
          <fieldset
            style={{
              border: "1px solid",
              borderRadius: "5px",
            }}
          >
            <div>
              <h3 style={{ textAlign: "center" }} className="font-weight-bold">
                Entrega
              </h3>
            </div>
            <div>
              <div className="row" style={{ paddingLeft: "5%" }}>
                <div style={{ minWidth: "20%", marginRight: "15px" }}>
                  Fecha impresión: {this.props.objDatos.FechaRegistro ? this.props.objDatos.FechaRegistro.substr(0, 10) : ""}
                </div>
                <div style={{ minWidth: "20%", marginRight: "15px" }}>
                  Hora impresión: {this.props.objDatos.FechaRegistro ?  this.props.objDatos.FechaRegistro.substring(11, 16): ""}
                </div>
                <div style={{ minWidth: "20%", marginRight: "15px" }}>
                  Movimiento: {this.props.objDatos ? "0" : ""}
                </div>
                <div style={{ minWidth: "20%", marginRight: "15px" }}>
                  Estado:  {this.props.objDatos ? "Dispensado" : ""}
                </div>
              </div>
              <div className="row" style={{ paddingLeft: "65px", width: "100%" }}>
                <div className="row" style={{ minWidth: "20%", marginRight: "15px" }}>
                  <p>Fecha: </p>
                </div>
                <div className="row" style={{ minWidth: "20%", marginRight: "15px" }}>
                  <p>Solicitud: SE181596</p>
                </div>
                <div className="row" style={{ minWidth: "20%", marginRight: "15px" }}>
                  <p>Caso: {this.props.objDatos ? this.props.objDatos.Caso : ""}</p>
                </div>
              </div>
              <div className="row" style={{ paddingLeft: "65px", width: "100%" }}>
                <div className="row" style={{ width: "80%" }}>
                  <p>Paciente: {this.props.DataPaciente?.Identificacion ? this.props.DataPaciente.Identificacion + " - " + this.props.DataPaciente.NombrePaciente 
                  : this.props.objDatos?.IdentificacionPaciente + " - " + this.props.objDatos?.NombreCompleto }</p>
                </div>
                <div className="row" style={{ width: "20%", marginRight: "15px" }}>
                  <p>Código: 1713687</p>
                </div>
              </div>
              <div className="row" style={{ paddingLeft: "65px" }}>
                <div className="row" style={{ width: "50%", marginRight: "15px" }}>
                  <p>
                    Plan: {this.props.objDatos ? this.props.objDatos.NombrePlan : ""}
                  </p>
                </div>
                <div className="row" style={{ width: "50%", marginRight: "15px" }}>
                  <p>Unidad: {this.props.CodigoUnidadFuncionalImpr ? this.props.CodigoUnidadFuncionalImpr + " - " + this.props.UnidadFuncionalImpr : ""}</p>
                </div>
              </div>
              <div className="row" style={{ paddingLeft: "65px" }}>
                <div className="row" style={{ width: "50%", marginRight: "15px" }}>
                  <p>Módulo: {this.props.CodigoUnidadFuncionalImpr ? this.props.CodigoUnidadFuncionalImpr + " - " + this.props.UnidadFuncionalImpr : ""}</p>
                </div>
                <div className="row" style={{ width: "50%", marginRight: "15px" }}>
                  <p>Puesto: {this.props.objDatos ? this.props.objDatos.CodigoCentroAtencion + " - " + this.props.objDatos.NombreCentroAtencion : ""}</p>
                </div>
              </div>
              <div className="row"  >
                <div className="row" style={{ width: "100%", marginRight: "15px" }}>

                  {this.props.Funcionarios
                    ? <div className="row" style={{ paddingLeft: "80px", width: "100%" }}>
                      <p>Prestador: </p>
                      {this.props.Funcionarios.map((row) => {

                        return (
                          <p className="ml-3">{row.IdentificacionUsuario} {" - "} {row.NombreUsuario} {", "}</p>
                        )

                      })}
                    </div>
                    : ""}
                </div>
              </div>
            </div>
          </fieldset>
          <br></br>
          <div className="row">
            <table
              style={{ width: "100%", paddingLeft: "5%", paddingRight: "5%", paddingBottom: "10px" }}
            >
              <tr>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "left" }}>Fecha Solicitud</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th style={{ textAlign: "left" }}>Lote</th>
                <th style={{ textAlign: "left" }}>Vencimiento</th>
                <th style={{ textAlign: "center" }}>Riesgo</th>
                <th style={{ textAlign: "center" }}>Invima</th>
              </tr>

              {this.props.objDatos.ArrayMedicamentos
                ? <>
                  {this.props.objDatos.ArrayMedicamentos.map((row) => {
                    return (
                      <>
                        {row.Productos.map((item) => {
                          return (
                            <tr >
                              <td style={{ textAlign: "left" }}>{item.Codigo}</td>
                              <td style={{ textAlign: "left" }}>{item.Nombre}{row.Medicamento !== row.Posologia ?<div><div className="font-weight-bold">{"Posología: "}</div>{row.Posologia ? row.Posologia.replace(row.Medicamento, '') : ""}</div>: ""}</td>
                              <td style={{ textAlign: "left" }}>{item.FechaRegistro}</td>
                              <td style={{ textAlign: "center" }}>{item.Cantidad}</td>
                              <td style={{ textAlign: "left" }}>{item.Lote}</td>
                              <td style={{ textAlign: "left" }}>{item.FechaVencimiento ? item.FechaVencimiento.substr(0, 10) : ""}</td>
                              <td style={{ textAlign: "center" }}>{item.Riesgo ? item.Riesgo : "N/A"}</td>
                              <td style={{ textAlign: "center" }}>{item.Invima ? item.Invima : "N/A"}</td>
                            </tr>
                          )
                        })}
                      </>

                    )
                  })}
                </>
                : ""}
              {/*  */}

            </table>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="row" style={{ paddingLeft: "10%" }}>
              <div className="row" style={{ paddingRight: "6%" }}>
                <p> __________________ Elaborado por</p>
              </div>
              <div className="row" style={{ paddingRight: "6%" }}>
                <p> __________________ Entregado Por</p>
              </div>
              <div className="row" style={{ paddingRight: "6%" }}>
                <p> __________________ Recibido Por</p>
              </div>
            </div>
            <div>
              <p>Reporte Generado por SIOS</p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Manifiestos;
