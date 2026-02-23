import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ContactListComponent2 from "components/RelacionMedicamentoProducto/TableRelacionMedicamentoProducto";
import ContactWrapper from "components/RelacionMedicamentoProducto/RelacionMedicamentoProducto.style";
import RelacionMedicamentosForm from "components/RelacionMedicamentoProducto/RelacionMedicamentoProductoForm";
import { gsUrlApi } from "../../config/configServer";
import SweetAlert from "react-bootstrap-sweetalert";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

const mapStateToProps = (state) => {
  return {
    ...state.themeChanger,
    themeSetting: {
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue,
    },
  };
};

class CargarUsuarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DataRoles: [],
      panel: "all",
      Userlists: [],
      Userlists2: [],
      filteredContactlists: null,
      selected: null,
      searchInput: "",
      editedContent: "",
      contactModel: false,
      idEliminar: '',
      currentModelAction: "",
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      successAlert: false,
    };
  }

  async componentDidMount() {
   this.consultarproductos();
  }

  consultarproductos = () => {
    fetch(gsUrlApi + "/productos/listar/", {
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
        var lstDatos = data.datos;
        this.setState((state) => ({
          // ...state,Userlists: data.datos
          ...state,
          Userlists: lstDatos,
        }));
      })
      .catch((err) => console.log("err", err));
  
  }
  // consultarmedicamentos = () => {
  //   fetch(gsUrlApi + "/medicamentos/listar/", {
  //     method: "GET",
  //     body: JSON.stringify(),
  //     headers: {
  //       "Content-Type": "application/json; charset=UTF-8",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => data)
  //     .then((data) => {
  //       var lstDatos = data.datos;

  //       for (let i = 0; i < data.datos.length; i++) {
  //         data.datos[i].EstadoOpen = false
  //       }

  //       this.setState((state) => ({
  //         // ...state,Userlists: data.datos
  //         ...state,
  //         Userlists: data.datos,
  //       }));
  //     })
  //     .catch((err) => console.log("err", err));
  // }
  contactToggleModel = () => {
    this.setState((state) => ({
      ...state,
      contactModel: !this.state.contactModel,
    }));
  };

  actiononContact = async (action, e = null) => {
    if (action === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState((state) => ({
        ...state,
        editedContent: "",
      }));
    } else if (action === "add2") {
      this.setState((state) => ({
        ...state,
        currentModelAction: "add2",
        ...state,
        editedContent: "",
      }));
      this.contactToggleModel2();
    } else if (action === "edit") {
      this.CardarData(e);
      this.setState((state) => ({
        ...state,
        currentModelAction: "edit",
        ...state,
        editedContent: e,
      }));
    } else if (action === "delete") {
      this.setState((state) => ({
        ...state,
        idEliminar: e._id,
      }));
      this.alertaEliminar(e._id);
    }
  };

  onClick2 = () =>{

  }

  AlertaGuardado  = () => {
    confirmAlert({
      title: "Registro Guardado Exitoso",
      buttons: [
        {
          label: "Aceptar",
          onClick: '',
        }
      ]
    });
  };
 
  AlertaError  = (Mensaje) => {
    confirmAlert({
      title: "Error!",
      message: Mensaje,
      buttons: [
        {
          label: "Aceptar",
          onClick: '',
        }
      ]
    });
  };
 
  

  setSuccessAlert = () => {
    this.setState({ successAlert: !this.state.successAlert });
  };

  CardarData = async (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState((state) => ({
      ...state,
      hidden_IdUsuario: e._id,
    }));
  };
  Consultar = data => {
    let filtro = data.target.value;

    fetch(gsUrlApi + "/medicamentos/consultar/", {
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
          Userlists: lstDatos2,
        }));
      })
      .catch((err) => console.log("err", err));
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

 

  handleSearch = (e) => {
    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.Userlists.filter((e) => {
      return e.NombreCompleto.toLowerCase().includes(this.state.searchInput);
      // e.Identificacion.toLowerCase().includes(this.props.searchInput.toLowerCase())
    });
    this.setState((state) => ({
      ...state,
      Userlists: filteredContactlists,
    }));
  };

  handleFormSubmit = (data) => {
    let Accion = null;

    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
      data._id = this.state.hidden_IdUsuario;
    }


    fetch(gsUrlApi + "/medicamentos/" + Accion + "/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        if(data.roles.length > 0){
          this.setState((state) => ({
            ...state,
            hidden_IdUsuario: null,
          }));
          this.setState({ ValidateUsuario: !this.state.ValidateUsuario })
          this.componentDidMount();
          this.AlertaGuardado()
        } else {
          if (data.duplicado == true) {
          this.AlertaError("Error el registro ya existe");
          } else {
          this.AlertaError("Error al guardar Relación");

          }
        }
       
      })
      .catch((err) => {
        this.AlertaError(err);
      });
  };

  actiononButton = (sKey) => {
    if (sKey === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState((state) => ({
        ...state,
        editedContent: "",
      }));
      // this.CargarRoles()
    } else if (sKey === "cancelar") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  };

  render() {
    return (
      <div>
        {this.state.ValidateUsuario ? (
          <RelacionMedicamentosForm
            data={this.state.editedContent}
            handleFormSubmit={(data) => this.handleFormSubmit(data)}
            actiononButton={(action) => this.actiononButton(action)}
          />
        ) : (
          <ContactWrapper {...this.props}>
            <div className="contact-container">
              <div className="flex plr-15 mobile-spacing-class">
                <div className="flex-1 fill-width">
                    <>
                    <ContactListComponent2
                    panel={this.props.panel}
                    searchInput={this.props.searchInput}
                    // Userlists2={this.state.Userlists2}
                    // Userlists={this.state.Userlists}
                    headerSuperior={[
                      "",
                      "Código",
                      "Descripción",
                      "Grupo",
                      "Acciones"
                    ]}
                    bodyLista={[
                      "",
                      "Atc",
                      "Descripcion",
                      "Grupo",
                      ""
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
                </div>
              </div>
            </div>
          </ContactWrapper>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(CargarUsuarios);
