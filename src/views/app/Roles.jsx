import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import LeftPanel from "components/contact/LeftPanel";
import ContactListComponent from "components/roles/TableRoles";
import ContactWrapper from "components/roles/roles.style";
import { contactList } from "util/data/contacts";
import { remove, findIndex, filter } from "lodash";
import RolestForm from "components/roles/RolesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { gsUrlApi } from "../../config/configServer";

const mapStateToProps = (state) => {
  return {
    ...state.themeChanger,
    themeSetting: {
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue,
    },
  };
};

class CargarRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DataRoles: [],
      panel: "all",
      contactlists: [],
      filteredContactlists: null,
      selected: null,
      searchInput: "",
      editedContent: "",
      contactModel: false,
      currentModelAction: "",
      hidden_IdRol: null,
      Interfaces: []
    };
  }

  async componentDidMount() {
    this.listarInterfaces()
    fetch(gsUrlApi + "/roles/listar/5cac12055d717e661ea7b95b", {
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
        var arrayRoles = [];
        var lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objRoles = {};
          objRoles._id = lstDatos[i]._id;
          objRoles.id = lstDatos[i].id;
          objRoles.code = lstDatos[i].Codigo;
          objRoles.name = lstDatos[i].Nombre;
          objRoles.Permisos = lstDatos[i].Permisos;
          arrayRoles.push(objRoles);
        }
        this.setState((state) => ({
          ...state,
          contactlists: arrayRoles,
        }));
      })
      .catch((err) => console.log("err", err));
  }

  listarInterfaces = () => {
    fetch(gsUrlApi + '/interfaces/', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
      }
    }) . then(res => res.json())
        .then(data =>data)
        .then((data) =>{
          
          this.setState((state) => ({
            ...state,Interfaces: data.interfaces,
          }));
        })
    .catch(err => console.log("err", err));
  }

  contactToggleModel = () => {
    this.setState((state) => ({
      ...state,
      contactModel: !this.state.contactModel,
    }));
  };

  actiononContact = async (action, e = null) => {
    if (action === "add") {
      this.setState((state) => ({
        ...state,
        currentModelAction: "add",
        ...state,
        editedContent: "",
      }));
      this.contactToggleModel();
    } else if (action === "edit") {
      this.CardarData(e);
      this.setState((state) => ({
        ...state,
        currentModelAction: "edit",
        ...state,
        editedContent: e,
      }));
    } else if (action === "delete") {
      this.deleteSelected(e._id);
    }
  };

  CardarData = async (e = null) => {
    this.setState((state) => ({
      ...state,
      hidden_IdRol: e._id,
    }));
    this.contactToggleModel();
  };

  selectValue = async (id) => {
    const selectedTem = this.props.selected
      ? this.props.this.props.selected
      : [];
    if (selectedTem.includes(Number(id))) {
      let index = selectedTem.indexOf(Number(id));
      if (index > -1) {
        selectedTem.splice(index, 1);
      }
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
    } else {
      selectedTem.push(Number(id));
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
    }
  };

  deleteSelected = async (sKey) => {
    var objRol = new Object();
    objRol._id = sKey;
    fetch(gsUrlApi + "/roles/eliminar/", {
      method: "POST",
      body: JSON.stringify(objRol),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        this.setState((state) => ({
          ...state,
          hidden_IdRol: null,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  handleSearch = (e) => {
    this.props.searchInput(e.target.value);
    const filteredContactlists = this.state.contactlists.filter((e) => {
      if (this.props.panel === "favorite") {
        return (
          (e.name
            .toLowerCase()
            .includes(this.props.searchInput.toLowerCase()) ||
            e.email
              .toLowerCase()
              .includes(this.props.searchInput.toLowerCase()) ||
            e.mobile
              .toLowerCase()
              .includes(this.props.searchInput.toLowerCase())) &&
          e.isfav === true
        );
      } else if (this.props.panel === "frequently") {
        return (
          (e.name
            .toLowerCase()
            .includes(this.props.searchInput.toLowerCase()) ||
            e.email
              .toLowerCase()
              .includes(this.props.searchInput.toLowerCase()) ||
            e.mobile
              .toLowerCase()
              .includes(this.props.searchInput.toLowerCase())) &&
          e.isfrequent === true
        );
      } else {
        return (
          e.name.toLowerCase().includes(this.props.searchInput.toLowerCase()) ||
          e.email
            .toLowerCase()
            .includes(this.props.searchInput.toLowerCase()) ||
          e.mobile.toLowerCase().includes(this.props.searchInput.toLowerCase())
        );
      }
    });
    this.setState((state) => ({
      ...state,
      filteredContactlists: filteredContactlists,
    }));
  };

  handleFormSubmit = (data) => {
    let Accion = null;
    if (this.state.hidden_IdRol === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
    }
    let objRol = new Object();

    objRol.Codigo = data.code;
    objRol.Nombre = data.name;
    objRol.id = data.id;
    if (data._id !== "") {
      objRol._id = data._id;
    }
    objRol.text = "interfaces";
    // objRol.IdUsuarioActualizacion = data;
    objRol.FechaActualizacion = new Date();
    objRol.IdEmpresa = "1";
    objRol.Empresa = "5cac12055d717e661ea7b95b";
    objRol.Permisos = data.Permisos;
		for (let i = 0; i < this.state.Interfaces.length; i++) {
			if (!objRol.Permisos.includes(this.state.Interfaces[i].parent)) {
				objRol.Permisos.push(this.state.Interfaces[i].parent);
			}
		}
    fetch(gsUrlApi + "/roles/" + Accion + "/", {
      method: "POST",
      body: JSON.stringify(objRol),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        this.setState((state) => ({
          ...state,
          hidden_IdRol: null,
        }));
        this.componentDidMount();
      })
      .catch((err) => console.log("err", err));
  };

  Consultar = (data) => {
    let filtro = data.target.value;

    fetch(gsUrlApi + "/roles/consultar/", {
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
          contactlists: lstDatos2,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  render() {
    return (
      <ContactWrapper {...this.props}>
        <div className="contact-container">
          <div className="flex plr-15 mobile-spacing-class">
            <div className="flex-1 fill-width">
              {this.state.contactlists && (
                <ContactListComponent
                  Consultar={(data) => this.Consultar(data)}
                  panel={this.props.panel}
                  searchInput={this.props.searchInput}
                  contactlists={this.state.contactlists}
                  selectValue={(data) => this.selectValue(data)}
                  handleSearch={(data) => this.handleSearch(data)}
                  deleteSelected={() => this.deleteSelected}
                  actiononContact={(action, data) =>
                    this.actiononContact(action, data)
                  }
                />
              )}
            </div>
          </div>
        </div>
        <Modal
          centered
          isOpen={this.state.contactModel}
          fade={false}
          toggle={this.contactToggleModel}
          className={this.props.className}
        >
          <ModalHeader toggle={this.contactToggleModel}>
            {this.state.currentModelAction === "add" ? (
              <span>Agregar Rol</span>
            ) : (
              <span>Editar Rol</span>
            )}
          </ModalHeader>
          <ModalBody>
            <RolestForm
              data={this.state.editedContent}
              handleFormSubmit={(data) => this.handleFormSubmit(data)}
            />
          </ModalBody>
        </Modal>
      </ContactWrapper>
    );
  }
}

export default connect(mapStateToProps, null)(CargarRoles);
