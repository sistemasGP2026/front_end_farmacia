import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import LeftPanel from "components/contact/LeftPanel";
import ContactListComponent from "components/configuraciones/TableConfiguraciones";
import ContactWrapper from "components/configuraciones/configuraciones.style";
import { contactList } from "util/data/contacts";
import { remove, findIndex, filter } from "lodash";
import ConfiguracionesForm from "components/configuraciones/ConfiguracionesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { gsUrlApi } from '../../config/configServer';
import Buttons from "components/ListButtons/Buttons";

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    themeSetting: {
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue
    }
  };
};

class CargarConfiguraciones extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      DataRoles: [],
      ListaSoftwares: [],
      Userlists: [],
      SoftwareArray: [],
      filteredContactlists: null,
      selected: null,
      searchInput: '',
      editedContent: '',
      NombreSoftware: '',
      CodigoSoftware: '',
      contactModel: false,
      currentModelAction: '',
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      DataSoftwaresConfig: []
    }
  }

  async componentDidMount() {


    fetch(gsUrlApi + '/configuraciones/listar/5cac12055d717e661ea7b95b', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        let items = [];
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          items.push(lstDatos[i].Software);
        }
        // objRoles.Roles = arrayRoles;
        this.setState(state => ({
          ...state, DataSoftwaresConfig: items
        }))

        this.setState(state => ({
          ...state, Userlists: data.datos
        }))
      })
      .catch(err => console.log("err", err));

  }

  CargarSoftwares = async () => {

    fetch(gsUrlApi + '/softwares/listar/5cac12055d717e661ea7b95b', {
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
                let objSoftwares = {}
                objSoftwares.value = lstDatos[i]._id;
                objSoftwares.Nombre = lstDatos[i].Nombre;
                objSoftwares.Codigo = lstDatos[i].Codigo;
                items.push(objSoftwares);  
                // arrayRoles.Push(<option value={lstDatos[i]._id}>{lstDatos[i].Nombre}</option>); 
            }
            // objRoles.Roles = arrayRoles;
            this.setState(state => ({
                ...state,SoftwareArray: items
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
    fetch(gsUrlApi + '/configuraciones/eliminar/', {
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
    // if (e.target.value) {
    //   this.setState(state => ({
    //       ...state,searchInput: e.target.value
    //   }))
    // }
    this.setState({ searchInput: e.target.value });
    const filteredContactlists = this.state.Userlists.filter(e => {
      return (
        e.NombreCompleto.toLowerCase().includes(this.state.searchInput)
        // e.Identificacion.toLowerCase().includes(this.props.searchInput.toLowerCase()) 
      );
    });
    this.setState(state => ({
      ...state, Userlists: filteredContactlists,
    }))
  };

  handleFormSubmit = data => {
    let Accion = null;
    var objUsuario = new Object();
    if (this.state.hidden_IdUsuario === null) {
      Accion = "insertar";
    } else if (this.state.currentModelAction !== null) {
      Accion = "actualizar";
      objUsuario._id = this.state.hidden_IdUsuario;
    }

    objUsuario.Software = data.Software;

    let softwarec = data.Software;

     if (softwarec=="SIOS") {
      objUsuario.CodigoSoftware = "01";
      objUsuario.IdSoftware = "60148decf593820880828cfe";
    }else if (softwarec=="ZEUS") {
      objUsuario.CodigoSoftware = "02";
      objUsuario.IdSoftware = "602aae3e1da5f71e7288fd7e";
    } else {
      objUsuario.CodigoSoftware = "";
      objUsuario.IdSoftware = "";
    } 


    objUsuario.Descripcion = data.Descripcion;
    objUsuario.Servidor = data.Servidor;
    objUsuario.Instancia = data.Instancia;
    objUsuario.Puerto = data.Puerto;
    objUsuario.BaseDatos = data.BaseDatos;
    objUsuario.Usuario = data.Usuario;
    objUsuario.Clave = data.Clave;
    objUsuario.Empresa = "5cac12055d717e661ea7b95b";


    fetch(gsUrlApi + '/configuraciones/' + Accion + '/', {
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
        console.log("insertado.....................ya");
      })
      .catch(err => console.log("err", err));
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

  render() {
    return (
      <div>
        <div className="text-right">
          <Buttons
            actiononButton={(sKey) =>
              this.actiononButton(sKey)
            }
          />
        </div>
        {
          this.state.ValidateUsuario
            ? <ConfiguracionesForm
              data={this.state.editedContent}
              DataSoftwaresConfig={this.state.DataSoftwaresConfig}
              handleFormSubmit={data => this.handleFormSubmit(data)}
              actiononButton={sKey => this.actiononButton(sKey)}
            />
            : <ContactWrapper {...this.props}>
              <div className="contact-container">
                <div className="flex plr-15 mobile-spacing-class">
                  <div className="flex-1 fill-width">
                    {this.state.Userlists && (
                      <ContactListComponent
                        searchInput={this.props.searchInput}
                        Userlists={this.state.Userlists}
                        selectValue={data => this.selectValue(data)}
                        handleSearch={data => this.handleSearch(data)}
                        deleteSelected={() => this.deleteSelected}
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
)(CargarConfiguraciones);