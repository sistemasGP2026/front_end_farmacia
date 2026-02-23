import React from "react";
import { gsUrlApi } from "config/configServer";
import { ModalBody } from "reactstrap";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.css";
const config = {
  background: "#f5f5f5",
  width: 2,
  height: "40%",
};

class Manifiestos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      abierto: false,
      values: "",
      EstadoForm: true,
      TipoIdentificacion: "",
      Identificacion: "",
      Dv: "",
      rsocial: "",
      regimen: "",
      IdPais: "",
      NombreEspañol: "",
      IdMunicipio: "",
      Direccion: "",
      Celular: "",
      Telefono: "",
      Email: "",
      web: "",
      Estado: "",
      DataEdict: "",
      DataTable: [],
      ListaVersiones: [],
      ObjProveedor: [],
    };
  }

  componentDidMount() {
    console.log("data ---->", this.props.ListaVersiones);
    var ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
    let Empresa = ObjSesion.Usuario.Empresa;
  }

  MostrarFormulario(e) {
    if (e == "NuevoDestino") {
      this.setState({ EstadoForm: !this.state.EstadoForm });
    } else if (e == "Nuevo" || e == "Cancelar") {
      this.setState({ EstadoForm: !this.state.EstadoForm });
      this.setState((state) => ({
        ...state,
        DataEdict: "",
      }));
    } else if (e == "Cargar") {
      this.setState({ EstadoForm: !this.state.EstadoForm });
      this.componentDidMount();
    } else if (e == "Guardado") {
      this.setState({ EstadoForm: !this.state.EstadoForm });
      this.componentDidMount();
    } else if (e._id) {
      this.setState({ EstadoForm: !this.state.EstadoForm });
      this.setState((state) => ({
        ...state,
        DataEdict: e,
      }));
    }
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
        <div>
          <p style={{ textAlign: "center" }}>
            NIT 80601521-3 Cod. Habilitación: 130010166701
          </p>
        </div>
        <div>
          <p style={{ textAlign: "center" }}>
            Direccion: Amberes Cra 29N°38- 20
          </p>
        </div>
        <div>
          <p style={{ textAlign: "center" }}>Teléfono: 6810199</p>
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
                  Fecha impresión: {this.props.objDatos.FechaRegistroDispensacion ? this.props.objDatos.FechaRegistroDispensacion.substr(0, 10) : ""}
                </div>
                <div style={{ minWidth: "20%", marginRight: "15px" }}>
                  Hora impresión: {this.props.objDatos.FechaRegistroDispensacion ? this.props.objDatos.FechaRegistroDispensacion.substr(11, 15) : ""}
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
                  <p>Solicitud: SE181596</p>
                </div>
                <div className="row" style={{ minWidth: "20%", marginRight: "15px" }}>
                  <p className="mr-3">Fecha Solicitud: {this.props.objDatos.FechaRegistroSolicitudRequisicion ? this.props.objDatos.FechaRegistroSolicitudRequisicion : ""}</p> <p>  {this.props.FechaPrescripcion ? this.props.objDatos.FechaPrescripcion.substr(11, 15) : ""}</p>
                </div>
                
              </div>
              <div className="row" style={{ paddingLeft: "65px", width: "100%" }}>
                <div className="row" style={{ width: "65%" }}>
                  <p>Unidad: {this.props.objDatos ? this.props.objDatos.Unidades : ""}</p>
                </div>
                <div className="row" style={{ width: "35%", marginRight: "15px" }}>
                  <p>Código: 1713687</p>
                </div>
              </div>
              <div className="row" style={{ paddingLeft: "65px" }}>
                <div className="row" style={{ width: "50%", marginRight: "15px" }}>
                  <>
                    <p>Usuario: </p>
                    <p className="ml-3">{this.props.objDatos.IdentificacionUsuario} {" - "} {this.props.objDatos.UsuarioFarmacia} {", "}</p>
                  </>
                </div>
              </div>
            </div>
          </fieldset>
          <br></br>
          <br></br>
          <div className="row">
            <table
              style={{ width: "100%", paddingLeft: "5%", paddingRight: "5%" }}
            >
              <tr>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
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
                            <tr>
                              <td style={{ textAlign: "left" }}>{item.Codigo}</td>
                              <td style={{ textAlign: "left" }}>{item.Nombre}</td>
                              <td style={{ textAlign: "center" }}>{item.Cantidad}</td>
                              <td style={{ textAlign: "left" }}>{item.Lote}</td>
                              <td style={{ textAlign: "left" }}>{item.FechaVencimiento ? item.FechaVencimiento.substr(0, 10) : ""}</td>
                              <td style={{ textAlign: "center" }}>{item.Riesgo ? item.Riesgo : ""}</td>
                              <td style={{ textAlign: "center" }}>{item.Invima ? item.Invima : ""}</td>
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
