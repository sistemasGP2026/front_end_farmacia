import React from "react";
import Button from "components/button/Button";
import Select from "react-select";
import { gsUrlApi } from "../../config/configServer";
import { confirmAlert } from "react-confirm-alert";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { compose } from "redux";
import enhancer from "components/SolicitudesDevolucionesAprovechamiento/DevolucionesEnhancer";

class RequisicionesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayList: [],
      isValid: "",
      arrayPacientes: [],
      arrayProductos: [],
      Paciente: {},
      Observacion: null
    };
  }

  async componentDidMount() {
    this.ListarPacientes(null);
  }

  ListarPacientes = (value) => {
    this.setState((state) => ({
      ...state, objPaciente: {}
    }));
    if (value === "") {
      value =  null
    }
    this.setState((state) => ({
      ...state, arrayPacientes: [],
    }));
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    fetch(gsUrlApi + "/dispensaciones/listarPacientes/" + Sede.value + "/" + value, {
      method: "GET",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          lstDatos[i].value = lstDatos[i]._id;
          lstDatos[i].label = lstDatos[i].NombrePaciente + " - " + lstDatos[i]._id;
          lstDatos[i].Nombre = lstDatos[i].NombrePaciente;
        }
        this.state.arrayPacientes =  lstDatos
        this.setState((state) => ({
          ...state, arrayPacientes: lstDatos,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  BuscarProductos = async (data) => {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    if (data) {
      let objPaciente = {};
      // objPaciente.Nombre = data.label
      objPaciente.Nombre = data.Nombre
      objPaciente.Identificacion = data.value
      objPaciente.TipoDocumento = data.TipoDocumento
      this.setState((state) => ({
        ...state, objPaciente: objPaciente
      }));
      this.setState((state) => ({
        ...state, arrayList: []
      }));
      fetch(gsUrlApi + "/dispensaciones/listarProductos/" + data.value + "/" + Sede.value, {
        method: "GET",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data)
        .then((data) => {
          let lstDatos = data.datos;
          for (let i = 0; i < lstDatos.length; i++) {
            lstDatos[i].value = lstDatos[i].MovimientoEntrega;
            lstDatos[i].label = lstDatos[i].Producto;
            lstDatos[i].Codigo = lstDatos[i].Codigo;
            lstDatos[i]._id = null;
          }
          this.setState((state) => ({
            ...state, arrayProductos: lstDatos,
          }));
        })
        .catch((err) => console.log("err", err));
    }

  };

  Cancelar = () => {
    this.props.actiononButton("cancelar");
  };



  agregarCampo = (data) => {
    let estadodata = false;
    for (let i = 0; i < this.state.arrayList.length; i++) {
      if (data.label === this.state.arrayList[i].Producto) {
        estadodata = true;
        break;
      }
    }
    if (estadodata === false) {
      let arrayMedicamentos = {};
      if (this.state.arrayProductos.length > 0) {
        for (let i = 0; i < this.state.arrayProductos.length; i++) {
          if (this.state.arrayProductos[i].Producto == data.label) {
            this.state.arrayProductos[i].CodigoEntrega = data.value
            arrayMedicamentos = this.state.arrayProductos[i];
          }
        }
        arrayMedicamentos.CantidadDevolver = 1;
        this.state.arrayList.push(arrayMedicamentos);
        this.setState((state) => ({
          ...state,
          arrayList: this.state.arrayList,
        }));
      }
    } else {
      this.MostrarAlerta();
    }
  };

  agregarCantidad = (data) => {
    this.state.arrayList[data.target.id].CantidadDevolver = data.target.value;
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };

  ChangeObsevacion = (data) => {
    let value = data.target.value;
    this.setState((state) => ({
      ...state,Observacion: value
    }));
  };


  handleSubmit = (data) => {
    data.preventDefault();
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    var dt = new Date();

    let fechaActual = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`

    let objDatos = {};
    objDatos.FechaRegistro = fechaActual.substr(0, 10) + " " + fechaActual.substr(11) + ".000Z";
    objDatos.NombrePaciente = this.state.objPaciente.Nombre;
    objDatos.IdentificacionPaciente = this.state.objPaciente.Identificacion;
    objDatos.TipoIdentificacion = this.state.objPaciente.Identificacion;
    objDatos.IdSede = Sede.value;
    objDatos.Sede = Sede.label;
    objDatos.TipoDocumento = this.state.objPaciente.TipoDocumento;
    objDatos.IdPaciente = this.state.objPaciente.IdPaciente;
    if (this.state.arrayList.length > 0) {
      objDatos.CodigoCentroAtencion = this.state.arrayList[0].CodigoCentroAtencion
      objDatos.NombreCentroAtencion = this.state.arrayList[0].NombreCentroAtencion
      objDatos.CodigoUnidadFuncional = this.state.arrayList[0].CodigoUnidadFuncional
      objDatos.NombreUnidadFuncional = this.state.arrayList[0].UnidadFuncional
      objDatos.NombrePabellon = this.state.arrayList[0].Pabellon
      objDatos.NombreCama = this.state.arrayList[0].NombreCama
      objDatos.Caso = this.state.arrayList[0].Caso
      objDatos.Piso = this.state.arrayList[0].Caso
      objDatos.CodigoPlan = this.state.arrayList[0].CodigoPlan
      objDatos.NombrePlan = this.state.arrayList[0].NombrePlan
    }
    objDatos.MotivoDevolucion = this.state.Observacion
    objDatos.Usuario = ObjSesion.Usuario.NombreCompleto;
    objDatos.IdentificacionUsuario = ObjSesion.Usuario.Identificacion;
    objDatos.ArrayMedicamentos = this.state.arrayList;
    objDatos.CantidadMedicamentos = this.state.arrayList.length;
    if (this.props.isValid) {
      this.props.handleFormSubmit(objDatos);
    } else {
      this.props.handleFormSubmit(objDatos);
    }
  };

  quitarCampo = (data) => {
    for (let i = 0; i < this.state.arrayList.length; i++) {
      if (data.Producto === this.state.arrayList[i].Producto) {
        this.state.arrayList.splice(i, 1);
        break;
      }
    }
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };


  MostrarAlerta = () => {
    confirmAlert({
      title: "Atencion",
      message: "Este registro ya se encuentra",
      buttons: [
        {
          label: "Aceptar",
          onClick: "",
        },
      ],
    });
  };

  Consultar = async (data) => {
    this.BuscarProductos(data)
  };

  Listar = (data) => {
    if (data.key === "Enter") {
      data.preventDefault()
      this.ListarPacientes(data.target.value)
    }
  }


  render() {
    return (
      <div className="container">
        <fieldset
          style={{
            border: "1px #dee2e6",
            padding: "revert",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <legend>
              <div className="row col-md-12">
                <div className="form-group  col-md-9">
                  <h4 style={{ paddingTop: '1%' }}>
                    <i className="fas fa-notes-medical" /> Solicitudes Devoluciones
                  </h4>
                </div>
                <>
                  <div className="form-group  col-md-3" style={{ textAlign: 'end' }}>
                    <Button
                      onClick={() => this.Cancelar("cancelar")}
                      className="c-btn ml-2 btn-outline-danger"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="c-btn ml-2 c-success">
                      Guardar
                    </Button>
                  </div>
                </>
              </div>
            </legend>
            <hr></hr>
            <div className="row">
              <div className="form-group col-md-12 col-xs-12">
                <label>Pacientes:</label>
                <Select
                  id="Paciente"
                  name="Paciente"
                  value={this.state.paciente}
                  placeholder="Escriba aquí para buscar un paciente..."
                  className="react-form-search-input"
                  onChange={this.Consultar}
                  onKeyDown={this.Listar}
                  options={this.state.arrayPacientes}
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-12 col-xs-6">
                <label>Productos o Insumo:</label>
                <Select
                  id="Productos"
                  // value={this.state.SelctMedicamento}
                  onChange={this.agregarCampo}
                  closeMenuOnSelect={false}
                  // onInputChange={this.CambiarSelect}
                  placeholder="Escriba aquí para buscar un medicamento..."
                  className="react-form-search-input"
                  options={this.state.arrayProductos}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 col-xs-6">
                <label>Motivo Devolución:</label>
                <input type="text" value={this.state.Observacion} onChange={env => this.ChangeObsevacion(env)} className="form-control" />
              </div>
            </div>

            <div
              className="right-panel roe-box-shadow"
              style={{
                width: "auto",
              }}
            >
              <div className="contact-table">
                <Scrollbars
                  autoHide
                  className="contact-scroll-height border"
                  style={{
                    minHeight: "220px",
                    background: "white",
                  }}
                >
                  {this.state.arrayList && this.state.arrayList.length ? (
                    <Table hover className="mb-0 border">
                      <thead className="">
                        <tr>
                          <th className="pl-4">Producto / Insumo</th>
                          <th style={{ width: "10%" }}>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {this.state.arrayList.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <div className="flex center">
                                  <div className="ml-10">{e.Producto}</div>
                                </div>
                              </td>
                              <td>
                                <input
                                  id={i}
                                  onChange={this.agregarCantidad}
                                  value={e.CantidadDevolver}
                                  type="number"
                                  required
                                  className="form-control"
                                  style={{ border: "none" }}
                                />
                              </td>
                              <td>
                                <i
                                  className="fas fa-trash more-vert-icon cursor-pointer"
                                  style={{ fontSize: 20 }}
                                  onClick={() => this.quitarCampo(e)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center no-found-message">
                      <br />
                      <br />
                      <br />
                      <br />
                      Ningun Producto Añadido....
                    </div>
                  )}
                </Scrollbars>
              </div>
            </div>
          </form>
        </fieldset>
      </div>
    );
  }
}

export default compose(enhancer)(RequisicionesForm);
