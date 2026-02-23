import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert'
import ContactListComponent from "components/recepciones/TableRecepciones";
import ContactWrapper from "components/recepciones/Recepciones.style";
import TableGroup from "components/recepciones/tableGroup";
import { remove, findIndex, filter } from "lodash";
import RecepcionesForm from "components/recepciones/RecepcionesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import { gsUrlApi } from '../../config/configServer';
import { Table } from "reactstrap";
import Button from "components/button/Button";
import { Scrollbars } from "react-custom-scrollbars";
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
      selectValue: '',
      searchInput: '',
      handleSearch: '',
      actiononButton: '',
      selected: [],
      toggleFavContact: '',
      deleteSelected: '',
      EditDispensacion: '',
      activePanel: '',
      panel: '',
      selectDrp: false,
      SelectedPacientes: [],
      SelectedMedicamentos: []
    }
  }

  async componentDidMount() {
    this.setState(state => ({
      ...state, selected: []
    }))
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    fetch(gsUrlApi + '/dispensaciones/listar/'+ Sede.value, {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        let lstDatos = data.datos;
        lstDatos = lstDatos.filter((e) => {
          return e.Borrador !== true
          // e.Identificacion.toLowerCase().includes(this.props.searchInput.toLowerCase())
        });
        for (let i = 0; i < data.datos.length; i++) {
          data.datos[i].EstadoOpen = false
        }
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
      })
      .catch(err => console.log("err", err));

  }

  contactToggleModel = () => {
    this.setState(state => ({
      ...state, contactModel: !this.state.contactModel,
    }))
  };

  AlertaGuardado = () => {
    confirmAlert({
      title: "Registro guardado con Éxito!",
      buttons: [
        {
          label: "Aceptar",
          onClick: () => this.onClick(),
        }
      ]
    });
  };

  AlertaGuardadoVacio = () => {
    confirmAlert({
      title: "Aviso!",
      message: "No hay ningun dato seleccionado ",
      buttons: [
        {
          className: "text-center",
          label: "Aceptar",
          onClick: () => this.onClick(),
        }
      ]
    });
  };

  ErrorGuardado = () => {
    confirmAlert({
      title: "Error al gestionar el guardado!",
      buttons: [
        {
          className: "text-center",
          label: "Aceptar",
          onClick: () => this.onClick(),
        }
      ]
    });
  };

  CardarData = async (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState(state => ({
      ...state, hidden_IdUsuario: e._id
    }))


    this.contactToggleModel();
  }

  onClick = () => {
    this.componentDidMount()
  }
  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
  ObtenerSelecionados = (data1, data2) => {
   
    this.setState(state => ({
      ...state, SelectedPacientes: data1,
    }))
    this.setState(state => ({
      ...state, SelectedMedicamentos: data2,
    }))
  }

  handleSearch = e => {
    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.listPacientes.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
        // e.Identificacion.toLowerCase().includes(this.props.searchInput.toLowerCase()) 
      );
    });
    this.setState(state => ({
      ...state, listPacientes: filteredContactlists,
    }))
  };

  CancelarDispensacion = data => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
  }

  RecibirMedicamnetos = () => {
    var ArrayPacientes = this.state.SelectedPacientes.filter( this.onlyUnique )
    let ArrayTemporal = [];
    for (let i = 0; i < this.state.listPacientes.length; i++) {
      let Estado = false;
        if (ArrayPacientes.includes(this.state.listPacientes[i]._id)) {
          for (let k = 0; k < this.state.listPacientes[i].ArrayMedicamentos.length; k++) {
              if (this.state.SelectedMedicamentos.includes(this.state.listPacientes[i].ArrayMedicamentos[k].IdDetallePrescripcion)) {
                Estado = true;
                this.state.listPacientes[i].ArrayMedicamentos[k].Estado = "Recibido";
              }            
          }
        } 
        if (Estado === true) {
          ArrayTemporal.push(this.state.listPacientes[i])
        }
    }
    if (ArrayTemporal.length > 0) {
      fetch(gsUrlApi + '/dispensaciones/actualizar/', {
        method: 'POST',
        body: JSON.stringify(ArrayTemporal),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        }
      }).then(res => res.json())
        .then(data => data)
        .then((data) => {
          if (data.error) {
            this.ErrorGuardado();
          } else {
            this.AlertaGuardado();
          }
        })
        .catch(err => console.log("err", err));
    } else {
      this.AlertaGuardadoVacio()
    }
  }

  Consultar = Value =>{
    let fecha = new Date(); //Fecha actual
    var dias = 1; // Número de días a agregar
    fecha.setDate(fecha.getDate() + dias);
    var mes = fecha.getMonth() + 1; //obteniendo smes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear();
    if (dia < 10) {
      dia = '0' + dia; //agrega cero si el menor de 10
    }
    if (mes < 10) {
      mes = '0' + mes //agrega cero si el menor de 10
    }
    let Filtros = {};

    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;

    Filtros.Sede = Sede.value
    Filtros.NombreUsuario = ""
    Filtros.IdentificacionPaciente = ""
    Filtros.NombreUnidadFuncional = ""
    Filtros.NombrePabellon = ""
    Filtros.FechaInicio = ""
    Filtros.FechaFin = ""
    Filtros.search = Value
    var sDataDispensaciones = JSON.stringify(Filtros);
    this.setState(state => ({
      ...state, ObjDataFiltros: {}
    }))
    fetch(gsUrlApi + '/dispensaciones/listarHistorial/', {
      method: 'POST',
      body: sDataDispensaciones,
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
        this.ConsultarFiltros()
      })
      .catch(err => console.log("err", err));


  }

  FiltraPacientes = e => {
    if (e.target) {
      e.preventDefault();
      let Filtros = {};
      Filtros.NombreUsuario = e.target.select_Funcionario.value
      Filtros.IdentificacionPaciente = e.target.select_Paciente.value
      Filtros.NombreUnidadFuncional = e.target.select_Unidad.value
      Filtros.NombrePabellon = e.target.select_Pabellon.value
      Filtros.FechaInicio = e.target.input_FechaInicio.value
      Filtros.FechaFin = e.target.input_FechaFin.value
      this.setState(state => ({
        ...state, ObjDataFiltros: Filtros
      }))
      var sDataDispensaciones = JSON.stringify(Filtros);

      fetch(gsUrlApi + '/dispensaciones/listarHistorial/', {
        method: 'POST',
        body: sDataDispensaciones,
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
          this.ConsultarFiltros()
        })
        .catch(err => console.log("err", err));

    }
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
    }  else if (sKey === "cancelar") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  }

  render() {
    return (
      <div>
        {
          this.state.ValidateUsuario
            ? <RecepcionesForm
              data={this.state.editedContent}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              CancelarDispensacion={data => this.CancelarDispensacion(data)}
            />
            :
            <>
           <Filtros
                Ruta={"dispensaciones"}
                Consultar={(data) => this.Consultar(data)}
                FiltraPacientes={data => this.FiltraPacientes(data)}
              />
              <div className="right-panel roe-box-shadow">
                <div className="contact-table">
                  <Scrollbars
                    autoHide
                    className="contact-scroll-height"
                    style={{
                      minHeight: "500px"
                    }}
                  >
                    {this.state.listPacientes && this.state.listPacientes.length ? (
                     <TableGroup
                     panel={this.props.panel}
                     searchInput={this.props.searchInput}
                     Userlists2={this.state.listPacientes}
                     Userlists={this.state.listPacientes}
                     TextoTablaCabecera="Recepciones"
                     headerSuperior={[
                       "Fecha Dispensación",
                       "Nombre Paciente",
                     ]}
                     Acciones={true}
                     Consultar={(data) => this.Consultar(data)}
                     ObtenerSelecionados={(array1 , array2) => this.ObtenerSelecionados(array1, array2)}
                     contactToggleModel={() => this.contactToggleModel()}
                     handleSearch={(data) => this.handleSearch(data)}
                     deleteSelected={(data) => this.deleteSelected(data)}
                     actiononButton={(action) => this.actiononButton(action)}
                   />
                    ) : (
                        <div className="text-center no-found-message" style={{ color: "blue" }}>
                          Cargando Datos....
                        </div>
                      )}

                  </Scrollbars>
                  <div className=" text-center">
                    <div className="row justify-content-md-center">
                      <div className="col-md-5">
                        <Button onClick={() => this.RecibirMedicamnetos()} className="form-control btn-primary">Recibir medicamentos seleccionados</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  null
)(CargarUsuarios);

