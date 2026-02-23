import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import LeftPanel from "components/contact/LeftPanel";
import ContactListComponent from "components/devoluciones/TableDevoluciones";
import ContactWrapper from "components/devoluciones/Devoluciones.style";
import { contactList } from "util/data/contacts";
import { remove, findIndex, filter } from "lodash";
import DevolucionesForm from "components/devoluciones/DevolucionesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { gsUrlApi } from '../../config/configServer';
import { Ring } from "react-awesome-spinners";
import Filtros from "components/filtros/Filtros";

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
      listPacientes: [],
      filteredContactlists: null,
      selected: null,
      searchInput: '',
      editedContent: '',
      contactModel: false,
      currentModelAction: '',
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      Preload: false,
    }
  }

  async componentDidMount() {
    this.setState(state => ({
      ...state, Preload: true
    }))
    let fecha = new Date(); //Fecha actual
    fecha.setDate(fecha.getDate());
    var mes = fecha.getMonth() + 1; //obteniendo smes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear();
    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes //agrega cero si el menor de 10
    }
    var fechaActual = +ano + "-" + mes + "-" + dia;
    let Filtros = {};
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    Filtros.NombreUsuario = ""
    Filtros.IdentificacionPaciente = ""
    Filtros.NombreUnidadFuncional = ""
    Filtros.NombrePabellon = ""
    Filtros.FechaInicio = fechaActual
    Filtros.FechaFin = fechaActual
    Filtros.Sede = Sede.value

    fetch(gsUrlApi + '/devoluciones/agruparPacientes/', {
      method: 'POST',
      body: JSON.stringify(Filtros),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        let lstDatos = data.datos;
        let fecha = new Date(); //Fecha actual
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear();
        if (dia < 10) {
          dia = '0' + dia; //agrega cero si el menor de 10
        }
        if (mes < 10) {
          mes = '0' + mes //agrega cero si el menor de 10
        }
        var fechaActual = +ano + "-" + mes + "-" + dia;
        for (let i = 0; i < lstDatos.length; i++) {
          if (lstDatos[i].Sexo == "F") {
            lstDatos[i].LogoSexo = <i className="fas fa-venus" style={{ color: "pink" }}></i>;
          } else {
            lstDatos[i].LogoSexo = <i className="fas fa-mars" style={{ color: "blue" }}></i>;
          }
          if (lstDatos[i].FechaNacimiento) {
            let edad = fechaActual.substring(0, 4) - lstDatos[i].FechaNacimiento.substring(0, 4);
            if (fechaActual.substring(5, 7) < lstDatos[i].FechaNacimiento.substring(5, 7)) {
              edad--
            }
            if (fechaActual.substring(5, 7) == lstDatos[i].FechaNacimiento.substring(5, 7) && fechaActual.substring(8, 10) > lstDatos[i].FechaNacimiento.substring(8, 10)) {
              edad--
            }
            lstDatos[i].Edad = edad;
          }
          if (lstDatos[i].Origen && lstDatos[i].Origen == "HC") {
            lstDatos[i].LogoMedico = <i style={{ color: "#3b83bd" }} className="fas fa-user-md mt-1 ml-3 mr-1">:</i>
          } else {
            lstDatos[i].LogoMedico = <i style={{ color: "#3b83bd" }} className="fas fa-female mt-1 ml-3 mr-1">:</i>
          }
        }
        console.log("lstData", lstDatos);
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, DataPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, Preload: false
        }))
        this.ConsultarFiltros()
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


  FiltraPacientes = e => {
    this.setState(state => ({
      ...state, Preload: true
    }))
    let Filtros = {};
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    Filtros.NombreUsuario = e.target.select_Funcionario.value
    Filtros.IdentificacionPaciente = e.target.select_Paciente.value
    Filtros.NombreUnidadFuncional = e.target.select_Unidad.value
    Filtros.NombrePabellon = e.target.select_Pabellon.value
    Filtros.FechaInicio = e.target.input_FechaInicio.value
    Filtros.FechaFin = e.target.input_FechaFin.value
    Filtros.Sede = Sede.value
    this.setState(state => ({
      ...state, ObjDataFiltros: Filtros
    }))

    fetch(gsUrlApi + '/devoluciones/agruparPacientes/', {
      method: 'POST',
      body: JSON.stringify(Filtros),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        let lstDatos = data.datos;
        lstDatos.sort(function (a, b) {
          if (a.NombrePaciente > b.NombrePaciente) {
            return 1;
          }
          if (a.NombrePaciente < b.NombrePaciente) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        let fecha = new Date(); //Fecha actual
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear();
        if (dia < 10) {
          dia = '0' + dia; //agrega cero si el menor de 10
        }
        if (mes < 10) {
          mes = '0' + mes //agrega cero si el menor de 10
        }
        var fechaActual = +ano + "-" + mes + "-" + dia;
        for (let i = 0; i < lstDatos.length; i++) {
          if (lstDatos[i].Sexo == "F") {
            lstDatos[i].LogoSexo = <i className="fas fa-venus" style={{ color: "pink" }}></i>;
          } else {
            lstDatos[i].LogoSexo = <i className="fas fa-mars" style={{ color: "blue" }}></i>;
          }
          if (lstDatos[i].FechaNacimiento) {
            let edad = fechaActual.substring(0, 4) - lstDatos[i].FechaNacimiento.substring(0, 4);
            if (fechaActual.substring(5, 7) < lstDatos[i].FechaNacimiento.substring(5, 7)) {
              edad--
            }
            if (fechaActual.substring(5, 7) == lstDatos[i].FechaNacimiento.substring(5, 7) && fechaActual.substring(8, 10) > lstDatos[i].FechaNacimiento.substring(8, 10)) {
              edad--
            }
            lstDatos[i].Edad = edad;
          }
        }
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, DataPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, Preload: false
        }))
        this.ConsultarFiltros()
      })
      .catch(err => console.log("err", err));
  }

  Consultar = Value => {
    this.setState(state => ({
      ...state, Preload: true
    }))
    let Filtros = {};
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    Filtros.NombreUsuario = ""
    Filtros.IdentificacionPaciente = ""
    Filtros.NombreUnidadFuncional = ""
    Filtros.NombrePabellon = ""
    Filtros.FechaInicio = ""
    Filtros.FechaFin = ""
    Filtros.search = Value
    Filtros.Sede = Sede.value

    this.setState(state => ({
      ...state, ObjDataFiltros: {}
    }))

    fetch(gsUrlApi + '/devoluciones/agruparPacientes/', {
      method: 'POST',
      body: JSON.stringify(Filtros),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        let lstDatos = data.datos;
        let fecha = new Date(); //Fecha actual
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear();
        if (dia < 10) {
          dia = '0' + dia; //agrega cero si el menor de 10
        }
        if (mes < 10) {
          mes = '0' + mes //agrega cero si el menor de 10
        }
        var fechaActual = +ano + "-" + mes + "-" + dia;
        for (let i = 0; i < lstDatos.length; i++) {
          if (lstDatos[i].Sexo == "F") {
            lstDatos[i].LogoSexo = <i className="fas fa-venus" style={{ color: "pink" }}></i>;
          } else {
            lstDatos[i].LogoSexo = <i className="fas fa-mars" style={{ color: "blue" }}></i>;
          }
          if (lstDatos[i].FechaNacimiento) {
            let edad = fechaActual.substring(0, 4) - lstDatos[i].FechaNacimiento.substring(0, 4);
            if (fechaActual.substring(5, 7) < lstDatos[i].FechaNacimiento.substring(5, 7)) {
              edad--
            }
            if (fechaActual.substring(5, 7) == lstDatos[i].FechaNacimiento.substring(5, 7) && fechaActual.substring(8, 10) > lstDatos[i].FechaNacimiento.substring(8, 10)) {
              edad--
            }
            lstDatos[i].Edad = edad;
          }
        }
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, DataPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, Preload: false
        }))
        this.ConsultarFiltros()
      })
      .catch(err => console.log("err", err));
  }

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
    const filteredContactlists = this.state.listPacientes.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
      );
    });
    this.setState(state => ({
      ...state, listPacientes: filteredContactlists,
    }))
  };

  CancelarDispensacion = data => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
  }

  OcultarFormulario = () => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState({ FromUsuario: !this.state.FromUsuario });
    this.componentDidMount()
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
    console.log("wwwwwwwwwwwww", e);
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

  render() {
    return (
      <div>
        {
          this.state.ValidateUsuario
            ? <DevolucionesForm
              data={this.state.editedContent}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              CancelarDispensacion={data => this.CancelarDispensacion(data)}
              OcultarFormulario={() => this.OcultarFormulario()}

            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container">
              <Modal
                centered
                isOpen={this.state.Preload}
                fade={false}
                className={this.props.className}
                style={{ maxWidth: "300px" }}
              >
                <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                  <h3 className="mt-5 pt-3 text-white">Cargando...</h3></div>
              </Modal>
                <Filtros
                  Ruta={"devoluciones"}
                  Consultar={data => this.Consultar(data)}
                  FiltraPacientes={data => this.FiltraPacientes(data)}
                />
                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    {this.state.listPacientes && (
                      <ContactListComponent
                        // panel={this.props.panel}
                        searchInput={this.props.searchInput}
                        listPacientes={this.state.listPacientes}
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

