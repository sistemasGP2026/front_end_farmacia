import React from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import LeftPanel from "components/contact/LeftPanel";
import ContactListComponent from "components/requisiciones/TableRequisicionesSolicitudes";
import ContactWrapper from "components/requisiciones/Requisiciones.style";
import { contactList } from "util/data/contacts";
import { remove, findIndex, filter } from "lodash";
import { confirmAlert } from "react-confirm-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import RequisicionesForm from "components/requisiciones/RequisicionesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { gsUrlApi } from '../../config/configServer';

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
      DataRoles: [],
      // panel: 'all', 
      Userlists: [],
      filteredContactlists: null,
      selected: null,
      searchInput: '',
      editedContent: '',
      contactModel: false,
      currentModelAction: '',
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      successAlert: false,
      idEliminar: ''
    }
  }

  async componentDidMount() {
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede;
    fetch(gsUrlApi + '/solicitudes_requisiciones/listar/' + Sede.value, {
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
          ...state, Userlists: data.datos
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
      this.setState((state) => ({
        ...state,
        idEliminar: e._id,
      }));
      this.alertaEliminar(e._id);
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
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
        this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      })
      .catch(err => console.log("err", err));
  };

  handleSearch = e => {

    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.Userlists.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
      );
    });
    this.setState(state => ({
      ...state, Userlists: filteredContactlists,
    }))
  };

  setSuccessAlert = () => {
    this.setState({ successAlert: true });
  };
  quitarAlerta = () => {
    this.setState({ successAlert: false });
  }

  handleFormSubmit = (data) => {
    let objSesion = JSON.parse(localStorage.getItem('Usuario'));
    let NombreUsuario = objSesion.Usuario.NombreCompleto;
    let Empresa = objSesion.Usuario.Empresa;

    let Accion = null;
    var objUsuario = new Object();
    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
      objUsuario._id = this.state.hidden_IdUsuario;
    }
    var dt = new Date();

    let fechaActual = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`

    objUsuario.Fecha = fechaActual;
    objUsuario.UsuarioFarmacia = objSesion.Usuario.NombreCompleto
    objUsuario.IdentificacionUsuario = objSesion.Usuario.Identificacion
    objUsuario.txtFecha = data.Fecha.substr(0, 10);
    objUsuario.Unidades = data.Unidades;
    objUsuario.SedeDestino = data.SedeDestino;
    objUsuario.Observaciones = data.Observaciones;
    objUsuario.Empresa = Empresa;
    objUsuario.ArrayMedicamentos = data.arrayList;
    objUsuario.Usuario = NombreUsuario

    fetch(gsUrlApi + '/solicitudes_requisiciones/' + Accion + '/', {
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
        this.setSuccessAlert();
        this.actiononButton("cancelar")
        this.componentDidMount()
      })
      .catch(err => console.log("err", err));
  };

  Consultar = data => {
    let filtro = data.target.value;
    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
    let Sede = ObjSesion.Usuario.Sede.value;
    fetch(gsUrlApi + "/solicitudes_requisiciones/consultar/", {
      method: "POST",
      body: JSON.stringify({ search: filtro, Sede: Sede }),
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
          Userlists: lstDatos2,
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
            ? <RequisicionesForm
              data={this.state.editedContent}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              actiononButton={(sKey) => this.actiononButton(sKey)}
            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container">
                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    <>
                      <ContactListComponent
                        panel={this.props.panel}
                        searchInput={this.props.searchInput}
                        Userlists={this.state.Userlists}
                        headerLista={[
                          "Fecha Registro",
                          "Usuario",
                          "Unidades",
                          "Observaciones",
                          "Sede"

                        ]}
                        bodyLista={[
                          "txtFecha",
                          "Usuario",
                          "Unidades",
                          "Observaciones",
                          "SedeDestino"

                        ]}
                        Acciones={true}
                        ComplementoFcha="substr(0,7)"
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
                        onConfirm={() => this.quitarAlerta()}
                        confirmBtnCssClass="sweet-alert-confirm-button"
                        cancelBtnCssClass="sweet-alert-cancle-button"
                      />
                    </>
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

