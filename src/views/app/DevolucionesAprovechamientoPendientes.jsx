import React from "react";
import { connect } from "react-redux";
import ContactListComponent from "components/devolucionesAprovechamientoPendientes/TableDevoluciones";
import ContactWrapper from "components/devolucionesAprovechamientoPendientes/Devoluciones.style";
import DispensacionesForm from "components/devolucionesAprovechamientoPendientes/DevolucionesForm";
import { gsUrlApi } from '../../config/configServer';
import Filtros from "components/filtros/Filtros";
import { Ring } from "react-awesome-spinners";
import {
  Modal
} from "reactstrap";
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
      listPacientes: [],
      editedContent: '',
      contactModel: false,
      hidden_IdUsuario: null,
      ValidateUsuario: false,
      DataPabellon: [],
      DataUnidadFuncional: [],
      DataMedicos: [],
      DataPacientes: [],
      ObjDataFiltros: {},
      fechaDay: '',
      fechaDay2: '',
      PreloadRelcaion: false,
    }
  }

  async componentDidMount() {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Empresa = ObjSesion.Usuario.Empresa;
    let Sede = ObjSesion.Usuario.Sede.value;
 
    fetch(gsUrlApi + '/solicitudes_devoluciones/IdSede/' + Sede, {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        
        this.setState(state => ({
          ...state, arrayDevoluciones: data.datos
        }))
      })
      .catch(err => console.log("err", err));
  }
  contactToggleModel = () => {
    this.setState(state => ({
      ...state, contactModel: !this.state.contactModel,
    }))
  };

  Consultar = Value => {
    this.setState(state => ({
      ...state, Preload: true
    }))
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
    var fechaActual = +ano + "-" + mes + "-" + dia;
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    let Filtros = {};
    Filtros.NombreUsuario = ""
    Filtros.IdentificacionPaciente = ""
    Filtros.NombreUnidadFuncional = ""
    Filtros.NombrePabellon = ""
    Filtros.FechaInicio = ""
    Filtros.FechaFin = ""
    Filtros.Sede = Sede.value
    Filtros.search = Value
    this.setState(state => ({
      ...state, ObjDataFiltros: {}
    }))
    fetch(gsUrlApi + '/solicitudes_devoluciones/listarHistorial/', {
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
        this.setState(state => ({
          ...state, arrayDevoluciones: lstDatos
        }))

      })
      .catch(err => {  console.log(err)});

  }

  deleteSelected = async (sKey) => {

    var objUsuario = new Object();
    objUsuario._id = sKey;
    fetch(gsUrlApi + '/solicitudes_devoluciones/eliminar/', {
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

  FiltraPacientes = e => {
    if (e.target) {
      this.setState(state => ({
        ...state, PreloadRelcaion: true
      }))
      e.preventDefault();
      let Filtros = {};
      let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
      let Sede = ObjSesion.Usuario.Sede;
      Filtros.NombreUsuario = e.target.select_Funcionario.value
      Filtros.IdentificacionPaciente = e.target.select_Paciente.value
      Filtros.NombreUnidadFuncional = e.target.select_Unidad.value
      Filtros.NombrePabellon = e.target.select_Pabellon.value
      Filtros.FechaInicio = e.target.input_FechaInicio.value
      Filtros.FechaFin = e.target.input_FechaFin.value
      Filtros.Sede = Sede.value;
      this.setState(state => ({
        ...state, ObjDataFiltros: Filtros
      }))
      var sDataDispensaciones = JSON.stringify(Filtros);

      fetch(gsUrlApi + '/solicitudes_devoluciones/listarHistorial/', {
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
          if (lstDatos.length > 0) {
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
              ...state, PreloadRelcaion: false
            }))
          } else {
            this.setState(state => ({
              ...state, PreloadRelcaion: false
            }))
          }
         
        })
        .catch(err => {
          this.setState(state => ({
            ...state, PreloadRelcaion: false
          }))
        });

    }
  }

  actiononContact = async (action, e) => {
    if (action === "add") {
      this.setState(state => ({
        ...state, editedContent: "",
      }))
      this.contactToggleModel();
    } else if (action === "edit") {
      this.CardarData(e);
      this.setState(state => ({
        ...state, editedContent: e,
      }))
    } else if (action === "delete") {
      this.deleteSelected(e);
    }
  }
  OcultarFormulario = () => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.componentDidMount()
  }

  CardarData = async (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState(state => ({
      ...state, hidden_IdUsuario: e._id
    }))


    this.contactToggleModel();
  }



  CancelarDispensacion = data => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
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

    }
  }

  render() {
    return (
      <div>
        {
          this.state.ValidateUsuario
            ? <DispensacionesForm
              data={this.state.editedContent}
              value={this.state.ObjDataFiltros}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              CancelarDispensacion={data => this.CancelarDispensacion(data)}
              OcultarFormulario={() => this.OcultarFormulario()}
            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container ">
                <Filtros
                  Ruta={"prescripciones"}
                  Consultar={data => this.Consultar(data)}
                  FiltraPacientes={data => this.FiltraPacientes(data)}
                />
                <Modal
                  centered
                  isOpen={this.state.PreloadRelcaion}
                  fade={false}
                  className={this.props.className}
                  style={{ maxWidth: "300px" }}
                >
                  <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                    <h3 className="mt-5 pt-3 text-white">Cargando...</h3></div> 
                </Modal>
                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    {this.state.listPacientes && (
                      <ContactListComponent
                        // panel={this.props.panel}
                        searchInput={this.props.searchInput}
                        listPacientes={this.state.arrayDevoluciones}
                        DataPabellon={this.state.DataPabellon}
                        DataUnidadFuncional={this.state.DataUnidadFuncional}
                        DataPacientes={this.state.DataPacientes}
                        DataMedicos={this.state.DataMedicos}
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

