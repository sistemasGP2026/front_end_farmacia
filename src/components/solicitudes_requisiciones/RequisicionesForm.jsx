import React from "react";
import enhancer from "components/solicitudes_requisiciones/RequisicionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import Select from "react-select";
import { ApiSios } from "../../config/confiSios";
import { gsUrlApi } from "../../config/configServer";
import { iconDemo, AppName } from "helper/constant";
import { confirmAlert } from "react-confirm-alert";
import ContactListComponent from "components/solicitudes_requisiciones/TableListProduct";
import ContactWrapper from "components/solicitudes_requisiciones/Requisiciones.style";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";


class RequisicionesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ValorCantidad: 0,
      Contador: 0,
      Medicamento: "",
      Cantidad: "",
      Destino: "",
      fechaInput: "",
      TotalProductos: "",
      ListaPedido: [],
      handleChange: "",
      handleBlur: "",
      errors: "",
      touched: "",
      values: "",
      submitCount: "",
      DataUnidades: [],
      DataSedes: [],
      TableListMedicamento: [],
      arrayList: [],
      isValid: "",
      ValidateUsuario: false,
      SedeNombreDestino: "",
      SelctMedicamento: {
        value: "",
        label: "",
        Forma: "",
        Concentracion: "",
        Descripcion: "",
        Id: "",
        Grupo: "",
      },
      listamedicamentos: [{ value: "", label: "" }],
    };
  }

  async componentDidMount() {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    this.state.SedeNombreDestino = ObjSesion.Usuario.Sede.label;
    this.CargarUnidades();
    this.CargarSedes();
    this.obtenerFechaActual();
    this.buscarinfomedicamentos();
    for (var key in this.props.values) {
      let value = this.props.values[key];
      this.state[key] = value;
    }

    for (var key in this.props.data) {
      let value = this.props.data[key];
      this.state[key] = value;
    }

    if (this.props.data) {
      this.setState((state) => ({
        ...state,
        arrayList: this.props.data.ArrayMedicamentos,
      }));
      this.setState((state) => ({
        ...state,
        fechaInput: this.props.data.Fecha,
      }));

      let selectunidad = {
        value: this.props.data.CodigoUnidad,
        label: this.props.data.Unidades,
      };

      this.setState((state) => ({
        ...state,
        selectunidad: selectunidad,
      }));

    } else {
      this.setState((state) => ({
        ...state,
        arrayList: [],
      }));
    }


    console.log("this.props", this.props.data.ArrayMedicamentos);
  }

  CargarUnidades = async () => {
    fetch(gsUrlApi + "/empresa_unidades/listar/5cac12055d717e661ea7b95b", {
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
        let items = [];
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objUnidades = {};
          objUnidades.value = lstDatos[i].Codigo;
          objUnidades.label = lstDatos[i].Nombre;
          objUnidades.Codigo = lstDatos[i].Codigo;
          objUnidades.Empresa = lstDatos[i].Empresa;
          items.push(objUnidades);
        }
        this.setState((state) => ({
          ...state,
          DataUnidades: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  CargarSedes = async () => {
    fetch(gsUrlApi + "/empresa_sedes/listar/5cac12055d717e661ea7b95b", {
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
        let items = [];
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objSedes = {};
          objSedes.value = lstDatos[i].Nombre;
          objSedes.Nombre = lstDatos[i].Nombre;
          objSedes.Codigo = lstDatos[i].Codigo;
          objSedes.Empresa = lstDatos[i].Empresa;
          items.push(objSedes);
        }
        this.setState((state) => ({
          ...state,
          DataSedes: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  Cancelar = () => {
    this.props.actiononButton("cancelar");
  };


  selectunidad = (data) => {
    let unidad = "";
    if (data != "") {
      if (data.value) {
        unidad = {
          value: data.value,
          label: data.label,
        };
      } else {
        unidad = {
          value: data,
          label: data,
        };
      }
      this.setState((state) => ({
        ...state,
        selectunidad: unidad,
      }));
    }
    // this.agregarCampo(data);
  };

  CambiarSelect = (data) => {
    let Medicamento = "";

    if (data != "") {
      if (data.value) {
        Medicamento = {
          value: data.value,
          label: data.label,
          Atc: data.Atc,
          Forma: data.Forma,
          Descripcion: data.Descripcion,
          Concentracion: data.Concentracion,
          CodMed: data.CodMed,
          Grupo: data.Grupo,
        };
      } else {
        Medicamento = {
          value: data,
          label: data,
          Atc: data,
          Forma: data,
          Descripcion: data,
          Concentracion: data,
          CodMed: data,
          Grupo: data,
        };
      }
      this.setState((state) => ({
        ...state,
        SelctMedicamento: Medicamento,
      }));
      this.buscarinfomedicamentos();
    }
  };

  obtenerFechaActual = () => {
    let fecha = new Date(); //Fecha actual
    let mes = fecha.getMonth() + 1; //obteniendo mes
    let dia = fecha.getDate(); //obteniendo dia
    let ano = fecha.getFullYear(); //obteniendo año
    let hora = fecha.getHours(); //obteniendo hora
    let minuto = fecha.getMinutes();
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    let fecha2 = ano + "-" + mes + "-" + dia + "T" + hora + ":" + minuto;
    this.setState((state) => ({
      ...state,
      fechaInput: fecha2,
    }));
  };

  buscarinfomedicamentos() {
    fetch(ApiSios + "/ConsultarMedicamentos/", {
      method: "POST",
      body: JSON.stringify({
        Filtro: this.state.SelctMedicamento.value,
        Software: "ZEUS",
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        let items = [];
        let lstDatos = data.Datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objAcciones = {};
          objAcciones.value = lstDatos[i].Codigo;
          objAcciones.Codigo = lstDatos[i].Id;
          objAcciones.label = lstDatos[i].Nombre;
          objAcciones.Forma = lstDatos[i].Forma;
          objAcciones.Concentracion = lstDatos[i].Concentracion;
          objAcciones.Descripcion = lstDatos[i].Descripcion;
          objAcciones.CodMed = lstDatos[i].Id;
          objAcciones.Grupo = lstDatos[i].Grupo;
          items.push(objAcciones);
        }
        this.setState((state) => ({
          ...state,
          listamedicamentos: items,
        }));
        this.setState((state) => ({
          ...state,
          TableListMedicamento: data.Datos,
        }));
      })
      .catch((err) => alert(err));
  }

  agregarCampo = (data) => {
    let estadodata = false;
    for (let i = 0; i < this.state.arrayList.length; i++) {
      if (data.value === this.state.arrayList[i].Codigo) {
        estadodata = true;
        break;
      }
    }
    if (estadodata === false) {
      let arrayMedicamentos = [];
      if (this.state.TableListMedicamento.length > 0) {
        for (let i = 0; i < this.state.TableListMedicamento.length; i++) {
          if (this.state.TableListMedicamento[i].Codigo == data.value) {
            arrayMedicamentos = this.state.TableListMedicamento[i];
          }
        }
        arrayMedicamentos.Cantidad = 1;
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
    this.state.arrayList[data.target.id].Cantidad = data.target.value;
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };

  agregarEntregado = (data) => {
    this.state.arrayList[data.target.id].Entregado = data.target.value;
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };

  agregarPendiente = (data) => {
    this.state.arrayList[data.target.id].Pendiente = data.target.value;
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };

  handleSubmit = (data) => {
    data.preventDefault();
    let objDatos = {};
    objDatos.CodigoUnidad = this.state.selectunidad.value
    objDatos.Unidades = this.state.selectunidad.label;
    objDatos.Fecha = this.state.fechaInput;
    objDatos.SedeDestino = data.target.SedeDestino.value;
    objDatos.Observaciones = data.target.Observaciones.value;
    objDatos.arrayList = this.state.arrayList;
    if (this.props.isValid) {
      this.props.handleFormSubmit(objDatos);
    } else {
      this.props.handleFormSubmit(objDatos);
    }
  };

  quitarCampo = (data) => {
    for (let i = 0; i < this.state.arrayList.length; i++) {
      if (data.Codigo === this.state.arrayList[i].Codigo) {
        this.state.arrayList.splice(i, 1);
        break;
      }
    }
    this.setState((state) => ({
      ...state,
      arrayList: this.state.arrayList,
    }));
  };

  onInputchange = (data) => {
    if (data) {
      let name = data.target.name;
      let value = data.target.value;
      this.setState((state) => ({
        ...state,
        [name]: value,
      }));
      if (name === "ValorGlosado2") {
        this.setState((state) => ({
          ...state,
          ValorGlosado1: value,
        }));
      }
    }
  };


  onClick2 = () => {};

  MostrarAlerta = () => {
    confirmAlert({
      title: "Atencion",
      message: "Este registro ya se encuentra",
      buttons: [
        {
          label: "Aceptar",
          onClick: () => this.onClick2("Aceptar"),
        },
      ],
    });
  };
  CambiarFecha = (data) => {
    let valor = data.target.value;
    if (valor) {
      this.setState((state) => ({
        ...state,
        fechaInput: valor,
      }));
    }
  };

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
                  <h4 style={{paddingTop:'1%'}}>
                    <i className="fas fa-notes-medical" /> Requisiciones Solicitudes
                  </h4>
                </div>
                <>
                <div className="form-group  col-md-3" style={{textAlign:'end'}}>
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
            {/* <div className=" text-right">
              <Button
                onClick={() => this.Cancelar("cancelar")}
                className="c-btn ml-2 btn-outline-danger"
              >
                Cancelar
              </Button>
              <Button type="submit" className="c-btn ml-2 c-success">
                Guardar
              </Button>
            </div> */}
            <div className="row">
              <div className="form-group col-md-4 col-xs-6">
                <label>Fecha: *</label>
                <input
                  type="Date"
                  className="form-control react-form-input"
                  id="Fecha"
                  required
                  onChange={this.CambiarFecha}
                  onBlur={this.props.handleBlur}
                  value={this.state.fechaInput.substr(0, 10)}
                  placeholder="Fecha"
                />
                {/* <Error field="FechaNacimiento" /> */}
              </div>
              <div className="form-group col-md-4 col-xs-6">
                <label>Sede:</label>
                <input
                type="text"
                  className="form-control react-form-input"
                  id="SedeDestino"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  required
                  value={this.state.SedeNombreDestino}
                
                 
                  
                />
                {/* <Error field="PrimerNombre" /> */}
              </div>
              <div className="form-group col-md-4 col-xs-6">
                <label>Unidades:</label>
                <Select
                          id="Unidades"
                          style="fullWidth-select"
                          name="selectunidades"
                          value={this.state.selectunidad}
                          onChange={this.selectunidad}
                          options={this.state.DataUnidades}
                        />
                {/* <select
                  className="form-control react-form-input"
                  id="Unidades"
                  required
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.Unidades}
                >
                  <option key="" value="">
                    Opciones...
                  </option>
                  {this.state.DataUnidades.map((e, key) => {
                    return (
                      <option key={key} value={e.value}>
                        {e.Nombre}
                      </option>
                    );
                  })}
                </select> */}
                {/* <Error field="PrimerNombre" /> */}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 col-xs-6">
                <label>Observaciones:</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="Observaciones"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.Observaciones}
                  placeholder="Observaciones"
                />
                {/* <Error field="Identificacion" /> */}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 col-xs-6">
                <label>Medicamento o Insumo:</label>
                <Select
                  id="Medicamento"
                  value={this.state.SelctMedicamento}
                  onChange={this.agregarCampo}
                  closeMenuOnSelect={false}
                  onInputChange={this.CambiarSelect}
                  placeholder="Escriba aquí para buscar un medicamento..."
                  className="react-form-search-input"
                  options={this.state.listamedicamentos}
                />
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
                          <th>Código</th>
                          <th className="pl-4">Medicamento / Insumo</th>
                          <th style={{ width: "10%" }}>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {this.state.arrayList.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td>{e.Id}</td>
                              <td>
                                <div className="flex center">
                                  <div className="ml-10">{e.Descripcion}</div>
                                </div>
                              </td>
                              <td>
                                <input
                                  id={i}
                                  onChange={this.agregarCantidad}
                                  value={e.Cantidad}
                                  type="number"
                                  required
                                  className="form-control"
                                  placeholder={"1"}
                                  style={{ border: "none" }}
                                />
                              </td>
                              <td>
                                <i
                                  className="fas fa-trash more-vert-icon cursor-pointer"
                                
                                  style={{ fontSize: 20, color: 'red' }}
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
                      Ningun Medicamento Añadido....
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
