import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ContactListComponent from "components/usuarios/TableUsuarios";
import ContactWrapper from "components/usuarios/usuarios.style";
import UsuariosForm from "components/usuarios/UsuariosForm";
import { gsUrlApi } from "../../config/configServer";
import SweetAlert from "react-bootstrap-sweetalert";
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
      // panel: 'all',
      Userlists: [],
      filteredContactlists: null,
      selected: null,
      searchInput: "",
      editedContent: "",
      contactModel: false,
      currentModelAction: "",
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      successAlert: false,
      contactlists: [],
    };
  }

   componentDidMount() {
    fetch(gsUrlApi + "/usuarios/listar/5cac12055d717e661ea7b95b", {
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
        this.setState((state) => ({
          ...state,
          Userlists: data.datos,
        }));
      })
      .catch((err) => console.log("err", err));
  }

  contactToggleModel = () => {
    this.setState((state) => ({
      ...state,
      contactModel: !this.state.contactModel,
    }));
  };

  actiononContact =  (action, e = null) => {
    if (action === "add") {
      this.setState((state) => ({
        ...state,
        currentModelAction: "add",
        ...state,
        editedContent: "",
      }));
      this.setState({ FromUsuario: !this.state.FromUsuario });
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
    } else if (action === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState((state) => ({
        ...state,
        editedContent: "",
      }));
    } else if (action === "Guardado") {
      this.componentDidMount();

      this.setState((state) => ({
        ...state,
        EstadoAlerta: true,
      }));
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  };

  CardarData =  (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState((state) => ({
      ...state,
      hidden_IdUsuario: e._id,
    }));

    this.contactToggleModel();
  };

  selectValue =  (id) => {
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

  deleteSelected =  (sKey) => {
    var objUsuario = new Object();
    objUsuario._id = sKey;
    fetch(gsUrlApi + "/usuarios/eliminar/", {
      method: "POST",
      body: JSON.stringify(objUsuario),
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
          hidden_IdUsuario: null,
        }));
        this.componentDidMount();
        this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      })
      .catch((err) => console.log("err", err));
  };

  handleSearch = (e) => {
    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.Userlists.filter((e) => {
      return e.NombreCompleto.toLowerCase().includes(this.state.searchInput);
    });
    this.setState((state) => ({
      ...state,
      Userlists: filteredContactlists,
    }));
  };
  




  handleFormSubmit = (data) => {
    let Accion = null;
    var objUsuario = new Object();
    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
      objUsuario._id = this.state.hidden_IdUsuario;
    }

		if(data?.BodegaSelect?.length > 0){
			objUsuario.Bodegas = data.BodegaSelect;
		}else{
			objUsuario.Bodegas = "";

    } 

    if(data?.SedesSelect?.length > 0){
			objUsuario.Regionales = data.SedesSelect;
		}else{
			objUsuario.Regionales = "";

    } 

    

    objUsuario.Rol = data.RolSelect.label;
    objUsuario.IdRol = data.RolSelect.value;
    objUsuario.Login = data.Login;
    objUsuario.Clave = data.Clave;
    objUsuario.TipoIdentificacion = data.TipoIdentificacion;
    objUsuario.Identificacion = data.Identificacion;
    objUsuario.PrimerNombre = data.PrimerNombre;
    objUsuario.SegundoNombre = data.SegundoNombre;
    objUsuario.PrimerApellido = data.PrimerApellido;
    objUsuario.SegundoApellido = data.SegundoApellido;
    objUsuario.NombreCompleto =
      objUsuario.PrimerNombre +
      " " +
      objUsuario.SegundoNombre +
      " " +
      objUsuario.PrimerApellido +
      " " +
      objUsuario.SegundoApellido;
    objUsuario.FechaNacimiento = data.FechaNacimiento;
    objUsuario.Email = data.Email;
    objUsuario.Telefono = data.Telefono;
    objUsuario.Celular = data.Celular;
    objUsuario.Pais = "Colombia";
    objUsuario.IdPais = '169'
    objUsuario.IdRol = data.RolSelect.label;
    objUsuario.Rol = data.RolSelect.value;
    objUsuario.NombreMunicipio = data.IdMunicipio.label;
    objUsuario.Municipio = data.IdMunicipio.value;
    // objUsuario.Direccion = data
    // objUsuario.Activo = data.Activo
    objUsuario.Empresa = "5cac12055d717e661ea7b95b";
    // objUsuario.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
    objUsuario.FechaRegistro = new Date();
    // objUsuario.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");
    objUsuario.FechaActualizacion = new Date();
    // objUsuario.Rutas = $("#select_Rutas").val();

    fetch(gsUrlApi + "/usuarios/" + Accion + "/", {
      method: "POST",
      body: JSON.stringify(objUsuario),
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
          hidden_IdUsuario: null,
        }));
        this.actiononContact("Guardado");
      })
      .catch((err) => console.log("err", err));
  };

  actiononButton = (sKey) => {
    if (sKey === "nuevo") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
      this.setState((state) => ({
        ...state,
        editedContent: "",
      }));
    } else if (sKey === "guardar") {
    } else if (sKey === "eliminar") {
      var data = this.state.editedContent;
      this.deleteSelected(data._id);
    } else if (sKey === "cancelar") {
      this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    }
  };

  // setSuccessAlert = () => {
  //   this.setState({ successAlert: !this.state.successAlert });
  //   if (this.actiononContact("Guardado")) {
  //     this.actiononContact("Guardado");
  //   }
  // };

  Consultar = (data) => {
    let filtro = data.target.value;

    fetch(gsUrlApi + "/usuarios/consultar/", {
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

  render() {
    return (
      <div>

        {this.state.ValidateUsuario ? (
          <>
          <UsuariosForm
            data={this.state.editedContent}
            handleFormSubmit={(data) => this.handleFormSubmit(data)}
            actiononButton={(action, data) => this.actiononButton(action, data)}

          />
          {/* <SweetAlert
          success
          show={this.state.successAlert}
          title="Mensaje de confirmacion!"
          onConfirm={this.setSuccessAlert}
          confirmBtnCssClass="sweet-alert-confirm-button"
          cancelBtnCssClass="sweet-alert-cancle-button"
        >
          Registro guardado exitosamente!
        </SweetAlert> */}
      </> 
        ) : (
          <ContactWrapper {...this.props}>
            <div className="contact-container">
              <div className="flex plr-15 mobile-spacing-class">
                <div className="flex-1 fill-width">
                  {this.state.Userlists && (
                    <ContactListComponent
                      // panel={this.props.panel}
                      Consultar={(data) => this.Consultar(data)}
                      searchInput={this.props.searchInput}
                      Userlists={this.state.Userlists}
                      selectValue={(data) => this.selectValue(data)}
                      handleSearch={(data) => this.handleSearch(data)}
                      deleteSelected={() => this.deleteSelected}
                      actiononContact={(action, data) =>
                        this.actiononContact(action, data)
                      }
                      actiononButton={(action) => this.actiononButton(action)}
                    />
                  )}
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
