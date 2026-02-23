import React from "react";
import { connect } from "react-redux";
import TableGroup from "components/historialDevoluciones/tableGroup";
import Filtros from "components/filtros/Filtros";
import RecepcionesForm from "components/historialDevoluciones/HistorialDevolucionesForm";
import { gsUrlApi } from '../../config/configServer';
import { Scrollbars } from "react-custom-scrollbars";
import { Ring } from "react-awesome-spinners";
import { Modal } from "reactstrap";

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
      SelectedPacientes: [],
      SelectedMedicamentos: [],
      Preload: true
    }
  }

  async componentDidMount() {
    this.setState(state => ({
      ...state, Preload: true
    }))
    let fecha = new Date();
    fecha.setDate(fecha.getDate());
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var ano = fecha.getFullYear();
    if (dia < 10) {
      dia = '0' + dia;
    }
    if (mes < 10) {
      mes = '0' + mes
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
    Filtros.search = ""

    fetch(gsUrlApi + '/farmacia_devoluciones/listarHistorial/', {
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
        lstDatos = lstDatos.filter((e) => {
          return e.Borrador !== true
        });
        for (let i = 0; i < data.datos.length; i++) {
          data.datos[i].EstadoOpen = false
        }
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, Preload: false
        }))
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

    fetch(gsUrlApi + '/farmacia_devoluciones/listarHistorial/', {
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
        lstDatos = lstDatos.filter((e) => {
          return e.Borrador !== true
        });
        for (let i = 0; i < data.datos.length; i++) {
          data.datos[i].EstadoOpen = false
        }
        this.setState(state => ({
          ...state, listPacientes: data.datos
        }))
        this.setState(state => ({
          ...state, Preload: false
        }))
      })
      .catch(err => console.log("err", err));
  }

  FiltraPacientes = e => {
    if (e.target) {
      this.setState(state => ({
        ...state, Preload: true
      }))
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

      fetch(gsUrlApi + '/farmacia_devoluciones/listarHistorial/', {
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
          lstDatos = lstDatos.filter((e) => {
            return e.Borrador !== true
          });
          for (let i = 0; i < data.datos.length; i++) {
            data.datos[i].EstadoOpen = false
          }
          this.setState(state => ({
            ...state, listPacientes: data.datos
          }))
          this.setState(state => ({
            ...state, Preload: false
          }))
        })
        .catch(err => console.log("err", err));

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
                Ruta={"farmacia_devoluciones"}
                FiltraPacientes={data => this.FiltraPacientes(data)}
                Consultar={data => this.Consultar(data)}

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
                        TextoTablaCabecera="Dispensados"
                        headerSuperior={[
                          "Fecha Dispensación",
                          "Nombre Paciente",
                          "Identificacion",
                          "Grupo",
                        ]}
                        Acciones={true}
                        Consultar={(data) => this.Consultar(data)}
                        ObtenerSelecionados={(array1, array2) => this.ObtenerSelecionados(array1, array2)}
                        handleSearch={(data) => this.handleSearch(data)}
                        deleteSelected={(data) => this.deleteSelected(data)}
                        actiononButton={(action) => this.actiononButton(action)}
                      />
                    ) : (
                      <div className="text-center no-found-message" style={{ color: "blue" }}>
                        <h3>Datos No Encontrados....</h3>
                      </div>
                    )}

                  </Scrollbars>
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

