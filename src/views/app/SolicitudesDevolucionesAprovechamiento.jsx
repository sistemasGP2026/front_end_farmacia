import React from "react"; 
import { connect } from "react-redux"; 
import TableDevoluciones from "components/SolicitudesDevolucionesAprovechamiento/TableDevoluciones";
import ContactWrapper from "components/SolicitudesDevolucionesAprovechamiento/Devoluciones.style";
import { confirmAlert } from "react-confirm-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import FormDevoluciones from "components/SolicitudesDevolucionesAprovechamiento/FormDevoluciones";
import { gsUrlApi } from '../../config/configServer';
import cogoToast from 'cogo-toast';
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    themeSetting: {
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue
    }
  };
};

class CargarSolicitudesRequisiciones extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Contador: 0,
      DataRoles: [], 
      accionmodelo: "",
      currentModelAction: '',
      arrayDevoluciones: [],
      filteredContactlists: null,
      selected: null,
      searchInput: '',
      editedContent: '',
      contactModel: false,
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      successAlert: false,
      idEliminar: ''
    }
  }

  async componentDidMount() {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Empresa = ObjSesion.Usuario.Empresa;
    let Sede = ObjSesion.Usuario.Sede.value;

    this.setState(state => ({
      ...state, selected: []
    }))
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
      this.state.accionmodelo = "edit";
      this.setState(state => ({
        ...state, currentModelAction: "edit",
        ...state, editedContent: e,
      }))
    } else if (action === "clone") {
      this.CardarData(e);
      this.state.accionmodelo = "clone";
      this.setState(state => ({
        ...state, currentModelAction: "clone",
        ...state, editedContent: e,
      }))
    } else if (action === "delete") {
      this.setState((state) => ({
        ...state,
        idEliminar: e._id,
      }));
      this.alertaEliminar(e._id);
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


  deleteSelected = async (sKey) => {

    var objUsuario = new Object();
    objUsuario._id = this.state.idEliminar;
    fetch(gsUrlApi + '/solicitudes_requisiciones/eliminar/', {
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
      })
      .catch(err => console.log("err", err));
  };

  handleSearch = e => {

    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.arrayDevoluciones.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
      );
    });
    this.setState(state => ({
      ...state, arrayDevoluciones: filteredContactlists,
    }))
  };

  setSuccessAlert = () => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.componentDidMount()
  };

  handleFormSubmit = (data) => {
  
    let Accion = null;
    var objUsuario = new Object();
    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.accionmodelo === "edit") {
      Accion = "actualizar";
      objUsuario._id = this.state.hidden_IdUsuario;
    } else if (this.state.accionmodelo === "clone") {
      Accion = "insertar";
    }
    

    fetch(gsUrlApi + '/solicitudes_devoluciones/' + Accion + '/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        if (data.error) {
          cogoToast.error("Hubo un error al crear el registro", { position: 'bottom-right', heading: 'Error' });

        } else {

          cogoToast.success("Registro agregado exitosamente", { position: 'bottom-right', heading: 'Agregado' });
          this.setState(state => ({
            ...state, hidden_IdUsuario: null
          }))
          this.setSuccessAlert();
        }
      })
      .catch(err => console.log("err", err));


  };

  Consultar = data => {
    let filtro = data.target.value;

    fetch(gsUrlApi + "/solicitudes_requisiciones/consultar/", {
      method: "POST",
      body: JSON.stringify({ search: filtro }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        var lstDatos2 = data.datos;
        this.setState((state) => ({
          ...state,
          arrayDevoluciones: lstDatos2,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  actiononButton = (sKey) => {
    if (sKey === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState(state => ({
        ...state, editedContent: "",
      }))

    } else if (sKey === "guardar") {
      this.componentDidMount()
    } else if (sKey === "eliminar") {
      var data = this.state.editedContent
      this.deleteSelected(data._id);
    } else if (sKey === "cancelar") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  }

  onClick2 = () => {

  }

  alertaEliminar = idEliminar => {
    confirmAlert({
      title: "Eliminar registro",
      message: "¿Desea eliminar el registro seleccionado?",
      buttons: [
        {
          label: "Si",
          onClick: (idEliminar) => this.deleteSelected(idEliminar),
        },
        {
          label: "No",
          onClick: () => this.onClick2("Click no"),
        }
      ]
    });
  };

  render() {
    return (
      <div>
        {
          this.state.ValidateUsuario
            ? <FormDevoluciones
              data={this.state.editedContent}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              actiononButton={(sKey) => this.actiononButton(sKey)}
            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container">
                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    {this.state.arrayDevoluciones && (
                      <>
                        <TableDevoluciones 
                         panel={this.props.panel}
                         searchInput={this.props.searchInput}
                         // arrayDevoluciones2={this.state.arrayDevoluciones2}
                         arrayDevoluciones={this.state.arrayDevoluciones}
                         headerSuperior={[
                           "",
                           "Paciente", 
                           "",
                           "Acciones"
                         ]}
                         bodyLista={[
                           "",
                           "NombrePaciente", 
                         ]}
                         Acciones={true}
                         Consultar={(data) => this.Consultar(data)}
                         contactToggleModel={() => this.contactToggleModel()}
                         selectValue={(data) => this.selectValue(data)}
                         handleSearch={(data) => this.handleSearch(data)}
                         deleteSelected={(data) => this.deleteSelected(data)}
                         actiononButton={(action) => this.actiononButton(action)}
                         actiononContact={(action, data) =>
                           this.actiononContact(action, data)
                         }
                        />
                        <SweetAlert
                          success
                          show={this.state.successAlert}
                          title="Mensaje de confirmacion!"
                          onConfirm={() => this.setSuccessAlert}
                          confirmBtnCssClass="sweet-alert-confirm-button"
                          cancelBtnCssClass="sweet-alert-cancle-button"
                        />
                      </>
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
)(CargarSolicitudesRequisiciones);

