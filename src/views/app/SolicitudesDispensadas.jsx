import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import LeftPanel from "components/contact/LeftPanel";
import ContactListComponent from "components/SolicitudesDispensadas/TableDispensaciones";
import ContactWrapper from "components/SolicitudesDispensadas/Dispensaciones.style";
import { contactList } from "util/data/contacts";
import { remove, findIndex, filter } from "lodash";
import DispensacionesForm from "components/SolicitudesDispensadas/DispensacionesDispensadasForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { gsUrlApi } from '../../config/configServer';
import Button from "components/button/Button";

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    themeSetting: {
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue
    }
  };
};

class CargarUsuarios extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      DataRoles: [],
      // panel: 'all', 
      ListaSolicitudes: [],
      ListaPedidos: [],
      filteredContactlists: null,
      selected: null,
      searchInput: '',
      editedContent: '',
      ListaPedido: [],
      contactModel: false,
      currentModelAction: '',
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      DataPabellon: [],
      DataUnidadFuncional: [],
      DataMedicos: [],
      DataPacientes: [],
      EstateFiltro: false,
      ObjDataFiltros: {},
      DataBuscar: [],
      fechaDay: ''
    }
  }

   componentDidMount = () => {
    this.listarSolicitudesRequisiciones();
    this.CargarSedes();
    this.consultarsolicitudes();
  }
  consultarsolicitudes() {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede.value;
    let Empresa = ObjSesion.Usuario.Empresa;
    // '/dispensaciones_requisiciones/listarporestado/:value/:key/:Empresa'
    fetch(gsUrlApi + '/dispensaciones_requisiciones/listarporestado/' + Sede + '/Dispensado/'+ Empresa, {
    // fetch(gsUrlApi + '/dispensaciones_requisiciones/listarporestado/5cac12055d717e661ea7b95b/Dispensado', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        var objData = data.datos;
        this.setState(state => ({
          ...state, ListaSolicitudes: objData
        }))
      })
      .catch(err => console.log("err", err));
  }
  

  listarSolicitudesRequisiciones() {
    fetch(gsUrlApi + '/solicitudes_requisiciones/listar/5cac12055d717e661ea7b95b', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        var objData = data.datos;
        for (let i = 0; i < objData.length; i++) {
          for (let k = 0; k < objData[i].ArrayMedicamentos.length; k++) {
            objData[i].ArrayMedicamentos[k].Entrega = 0
            objData[i].ArrayMedicamentos[k].Pendiente = objData[i].ArrayMedicamentos[k].Cantidad
            objData[i].ArrayMedicamentos[k].Aprovechamiento = ""
            objData[i].ArrayMedicamentos[k].EstadoAprovechamiento = true
            objData[i].ArrayMedicamentos[k].Productos = []
            objData[i].ArrayMedicamentos[k].Estado = "Dispensado"
          }
        }
        this.setState(state => ({
          ...state, ListaPedidos: data.datos
        }))
      })
      .catch(err => console.log("err", err));
  }

  contactToggleModel = () => {
    this.setState(state => ({
      ...state, contactModel: !this.state.contactModel,
    }))
  };


  actiononContact = async (action, e = null) => {
    if (action === "add") {
      this.setState(state => ({
        ...state, currentModelAction: "add",
        ...state, editedContent: "",
      }))
      this.setState({ FromUsuario: !this.state.FromUsuario });
      this.contactToggleModel();
    } else if (action === "edit") {
      this.CardarData(e);
      this.setState(state => ({
        ...state, currentModelAction: "edit",
        ...state, editedContent: e,
      }))
    } else if (action === "delete") {
      this.deleteSelected(e._id);
    }
  }

  OcultarFormulario = () => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState({ FromUsuario: !this.state.FromUsuario });
    this.componentDidMount()
  }

  CardarData = async (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState(state => ({
      ...state, hidden_IdUsuario: e._id
    }))


    this.contactToggleModel();
  }

  selectValue = async id => {
    const selectedTem = this.props.selected ? this.props.this.props.selected : [];
    if (selectedTem.includes(Number(id))) {
      let index = selectedTem.indexOf(Number(id));
      if (index > -1) {
        selectedTem.splice(index, 1);
      }
      this.setState(state => ({
        ...state, selected: null,
        ...state, selected: selectedTem,
      }))
    } else {
      selectedTem.push(Number(id));
      this.setState(state => ({
        ...state, selected: null,
        ...state, selected: selectedTem,
      }))
    }
  };


  deleteSelected = async (sKey) => {

    var objUsuario = new Object();
    objUsuario._id = sKey;
    fetch(gsUrlApi + '/usuarios/eliminar/', {
      method: 'POST',
      body: JSON.stringify(objUsuario),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        this.setState(state => ({
          ...state, hidden_IdUsuario: null
        }))
        this.componentDidMount()
        this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      })
      .catch(err => console.log("err", err));
  };



  handleSearch = e => {

    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.ListaPedidos.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
        // e.Identificacion.toLowerCase().includes(this.props.searchInput.toLowerCase()) 
      );
    });
    this.setState(state => ({
      ...state, ListaPedidos: filteredContactlists,
    }))
  };

  CancelarDispensacion = data => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.componentDidMount()
  }
  OcultarFiltros = data => {
    this.setState({ EstateFiltro: !this.state.EstateFiltro });
  }

  handleFormSubmit = data => {
    let Accion = null;
    var objUsuario = new Object();
    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
      objUsuario._id = this.state.hidden_IdUsuario;
    }

  }

  EditDispensacion = e => {
  }

  actiononButton = (sKey) => {
    if (sKey === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState(state => ({
        ...state, editedContent: "",
      }))
      // this.CargarRoles()

    } else if (sKey === "guardar") {

    } else if (sKey === "eliminar") {
      var data = this.state.editedContent
      this.deleteSelected(data._id);
    } else if (sKey === "cancelar") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  }

  CargarSedes = async () => {

    fetch(gsUrlApi + '/empresa_sedes/listar/5cac12055d717e661ea7b95b', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
      }
    }) . then(res => res.json())
        .then(data => data)
        .then((data) =>{
            
            let items = []; 
            let lstDatos =  data.datos;
            for (let i = 0; i < lstDatos.length; i++) {
                let objSedes = {}
                objSedes.value = lstDatos[i].Nombre;
                objSedes.Nombre = lstDatos[i].Nombre;
                objSedes.Codigo = lstDatos[i].Codigo;
                objSedes.Empresa = lstDatos[i].Empresa;
                items.push(objSedes);  
            }
            this.setState(state => ({
                ...state,DataSedes: items
            }))
          
        })
    .catch(err => console.log("err", err));
};

  render() {
    return (
      <div>
        {
          this.state.ValidateUsuario
            ? <DispensacionesForm
              data={this.state.editedContent}
              /* value={this.state.ObjDataFiltros} */
              listPacientes={this.state.listPacientes}
              DataBuscar={this.state.editedContent}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              CancelarDispensacion={data => this.CancelarDispensacion(data)}
              OcultarFormulario={() => this.OcultarFormulario()}
            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container ">

                <div>
                  {
                    this.state.EstateFiltro
                      ? <form onSubmit={this.FiltraPacientes} className="plr-15">
                        <div className="row pb-3">
                          <div className="col-md-4">
                            <label>Fecha Inicio</label>
                            <input
                              type="date"
                              value={this.state.fechaDay}
                              className="form-control react-form-input"
                              id="input_FechaInicio"
                              placeholder="Fecha Inicio"
                            />
                          </div>
                          <div className="col-md-4">
                            <label>Fecha Fin</label>
                            <input
                              type="date"
                              value={this.state.fechaDay}
                              className="form-control react-form-input"
                              id="input_FechaFin"
                              placeholder="Fecha Fin"
                            />
                          </div>
                          <div className="col-md-4">
                            <label>Sede:</label>
                            <select
                              className="form-control react-form-input"
                              id="SedeDestino"
                              onChange={this.props.handleChange}
                              onBlur={this.props.handleBlur}
                              required
                              value={this.props.values.SedeDestino}
                            >
                              <option key="" value="">Opciones...</option>
                              {this.state.DataSedes.map((e, key) => {
                                return <option key={key} value={e.value}>{e.Nombre}</option>;
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="row pb-4">
                          <div className="col-md-4">
                            <label>Pabellones</label>
                            <select
                              className="form-control react-form-input"
                              style={{ width: "100%" }}
                              id="select_Pabellon"

                            >
                              <option value="">Seleccionar...</option>
                              {this.state.DataPabellon.map((e, key) => {
                                return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                              })}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <label>Unidades Funcionales</label>
                            <select
                              className="form-control react-form-input"
                              style={{ width: "100%" }}
                              id="select_Unidad"
                            >
                              <option value="">Seleccionar...</option>
                              {this.state.DataUnidadFuncional.map((e, key) => {
                                return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                              })}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <label>Funcionario</label>
                            <select
                              className="form-control react-form-input"
                              style={{ width: "100%" }}
                              id="select_Funcionario"
                            >
                              <option value="">Seleccionar...</option>
                              {this.state.DataMedicos.map((e, key) => {
                                return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="plr-15 mb-2 text-right">
                          <div className=" d-inline">
                            <Button type="submit" className="c-btn c-success">
                              Aplicar Filtros
                        </Button>
                          </div>
                          <div className=" d-inline ml-3">
                            <i className="c-btn c-danger">
                              Limpiar Filtros
                          </i>
                          </div>
                          <div className="d-inline ml-3">
                            <i onClick={this.OcultarFiltros} className="c-btn c-primary">
                              Ocultar Filtros
                          </i>
                          </div>

                        </div>
                      </form>
                      : <div className="plr-15 mb-3 text-right">
                        <i onClick={this.OcultarFiltros} className="c-btn c-primary">
                          Mostrar Filtros
                          </i>
                      </div>
                  }
                </div>

                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    {this.state.ListaPedidos && (
                      <ContactListComponent
                        // panel={this.props.panel}
                        ListaSolicitudes={this.state.ListaSolicitudes}
                        searchInput={this.props.searchInput}
                        ListaPedidos={this.state.ListaPedidos}
                        DataPabellon={this.state.DataPabellon}
                        DataUnidadFuncional={this.state.DataUnidadFuncional}
                        /* DataPacientes={this.state.DataPacientes} */
                        DataBuscar={this.state.DataBuscar}
                        DataMedicos={this.state.DataMedicos}
                        selectValue={data => this.selectValue(data)}
                        handleSearch={data => this.handleSearch(data)}
                        deleteSelected={() => this.deleteSelected}
                        EditDispensacion={action =>
                          this.EditDispensacion(action)
                        }
                        actiononButton={(action) =>
                          this.actiononButton(action)
                        }
                        actiononContact={(action, data) =>
                          this.actiononContact(action, data)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </ContactWrapper>
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  null
)(CargarUsuarios);

