import React, { useState, useEffect } from "react";
import Button from "components/button/Button";
import { compose } from "redux";
// import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import Select from "react-select";
// import LeftPanel from "components/contact/LeftPanel";
import "../../views/app/RelacionMedicamentoProducto";
import ContactListComponent from "components/tables/TableListaCodigoMedicamento.jsx";
import ContactListComponent2 from "components/tables/TableListaCodigoProducto.jsx";
import ContactListComponent3 from "components/tables/TableListaModal.jsx";
// import ContactWrapper from "components/recepciones/Recepciones.style";
// import { contactList } from "util/data/contacts";
// import { remove, findIndex, filter } from "lodash";
import RolestForm from "components/RelacionMedicamentoProducto/RelacionMedicamentoProductoForm";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import { gsUrlApi } from "../../config/configServer";
import { ApiSios } from "../../config/confiSios";
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

let lstDatos = [];
let EstateEliminar = true;
let ArrayRecepciones = [];
class RelacionMedicamentoProducto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DataRoles: [],
      // panel: 'all',
      listamedicamentos: [{ value: "", label: "" }],
      listaproductos: [],
      Userlists: [],
      Userlists2: [],
      filteredContactlists: null,
      selected: null,
      searchInput: "",
      editedContent: "",
      contactModel: false,
      currentModelAction: "",
      listaClasificacion: [],
      hidden_IdUsuario: null,
      FromUsuario: false,
      ValidateUsuario: false,
      SelctMedicamento: {
        value: "",
        label: "",
        Forma: "",
        Concentracion: "",
        Descripcion: "",
        Id: "",
        Grupo: "",
        Equivalencia: "",
      },

      SelctProducto: { value: "", label: "", Descripcion: "" },
      TableListMedicamento: [],
      TableListProductos: [],
      arrayList: [],
      arrayList2: [],
      Software: { value: "", label: "" }
    };
  }

  async componentDidMount() {
    this.buscarinfomedicamentos();
    this.buscarinfoproductos();
    this.CargarSoftwares();
    if (this.props.listamedicamentos) {
      console.log("lista--->", this.props.listamedicamentos)
      this.setState((state) => ({
        ...state, arrayList: this.props.listamedicamentos,
      }));
      this.setState((state) => ({
        ...state,
        TableListMedicamento: this.props.listamedicamentos,
      }));
      this.setState((state) => ({
        ...state,
        arrayList: this.props.listamedicamentos,
      }));

    }

    if (this.props.data) {
      let objData = {};
      let ArrayData = [];
      objData.Codigo = this.props.data.Codigo;
      objData.Atc = this.props.data.Atc;
      objData.CodMed = this.props.data.CodMed;
      objData.Descripcion = this.props.data.Descripcion;
      objData.Concentracion = this.props.data.Concentracion;
      objData.Forma = this.props.data.Forma;
      objData.Grupo = this.props.data.Grupo;

      ArrayData.push(objData);
      this.setState((state) => ({
        ...state,
        arrayList: ArrayData,
      }));
      this.setState((state) => ({
        ...state,
        arrayList2: this.props.data.Productos,
      }));
    }
    if (this.state.data) {
      EstateEliminar = false;
      let Medicamento = {
        value: this.state.data.Codigo,
        label: this.state.data.Nombre,
        Atc: this.state.data.Atc,
        Forma: this.state.data.Forma,
        Concentracion: this.state.data.Concentracion,
        Descripcion: this.state.data.Descripcion,
        Id: this.state.data.Id,
        Grupo: this.state.data.Grupo,
      };

      this.setState((state) => ({
        ...state,
        SelctMedicamento: Medicamento,
      }));
    }
    if (this.state.data) {
      EstateEliminar = false;
      let Producto = {
        value: this.state.data.Codigo,
        label: this.state.data.Nombre,
      };
      this.setState((state) => ({
        ...state,
        SelctProducto: Producto,
      }));
    }
  }

  CambiarSelect = (data) => {
    let MedicamentoA = "";

    if (data != "") {
      if (data.value) {
        MedicamentoA = {
          value: data.value,
          label: data.label,
          Atc: data.Atc,
          Forma: data.Forma,
          Concentracion: data.Concentracion,
          Descripcion: data.Descripcion,
          CodMed: data.CodMed,
          Grupo: data.Grupo,
        };
      } else {
        MedicamentoA = {
          value: data,
          label: data,
          Atc: data,
          Forma: data,
          Concentracion: data,
          Descripcion: data,
          CodMed: data,
          Grupo: data,
        };
      }
      this.setState((state) => ({
        ...state,
        SelctMedicamento: MedicamentoA,
      }));
      this.buscarinfomedicamentos();
      let arrayMedicamento = [];
      if (this.state.TableListMedicamento.length > 0) {
        for (let i = 0; i < this.state.TableListMedicamento.length; i++) {
          if (this.state.TableListMedicamento[i].value == data.value) {
            arrayMedicamento = this.state.TableListMedicamento[i];
          }
        }
        this.setState((state) => ({
          ...state,
          arrayList: [arrayMedicamento],
        }));
      }
    }
  };
  onClick2 = () => {

  }

  MostrarAlerta = () => {
    confirmAlert({
      title: "Atencion",
      message: "Este registro ya se encuentra",
      buttons: [
        {
          label: "Aceptar",
          onClick: () => this.onClick2("Aceptar"),
        }
      ]
    });
  };

  quitarCampo = (data) => {
    for (let i = 0; i < this.state.arrayList2.length; i++) {
      if (data.Codigo === this.state.arrayList2[i].Codigo) {
        this.state.arrayList2.splice(i, 1);
        break;
      }
    }
    this.setState((state) => ({
      ...state,
      arrayList2: this.state.arrayList2,
    }));
  }


  agregarCampo = (data) => {
    let estadodata = false;
    for (let i = 0; i < this.state.arrayList2.length; i++) {
      if (data.value === this.state.arrayList2[i].Codigo) {
        estadodata = true;
        break;
      }
    }
    if (estadodata === false) {
      let arrayProductos = [];
      if (this.state.TableListProductos.length > 0) {
        for (let i = 0; i < this.state.TableListProductos.length; i++) {
          if (this.state.TableListProductos[i].Codigo == data.value) {
            this.state.TableListProductos[i].Equivalencia = "1";
            arrayProductos = this.state.TableListProductos[i];
          }
        }
        this.state.arrayList2.push(arrayProductos);
        this.setState((state) => ({
          ...state,
          arrayList2: this.state.arrayList2,
        }));

      }
    } else {
      this.MostrarAlerta();
    }
  };
  CambiarSelect2 = (data) => {
    let Producto = "";

    if (data != "") {
      if (data.value) {
        Producto = {
          value: data.value,
          label: data.label,
          Descripcion: data.Descripcion,
        };
      } else {
        Producto = {
          value: data,
          label: data,
          Descripcion: data,
        };
      }
      this.setState((state) => ({
        ...state,
        SelctProducto: Producto,
      }));

      this.buscarinfoproductos();
    }
  };
  buscarinfoproductos() {
    console.log({
      Filtro: this.state.SelctProducto.value,
      Software: "ZEUS",
    });

    fetch(ApiSios + "/consultarProductos/", {
      method: "POST",
      body: JSON.stringify({
        Filtro: this.state.SelctProducto.value,
        Software: "ZEUS",
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        let items = [];
        let lstDatos = data.Datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objAcciones = {};
          objAcciones.value = lstDatos[i].Codigo;
          objAcciones.label = lstDatos[i].Codigo + " - " + lstDatos[i].Nombre;

          items.push(objAcciones);
        }
        this.setState((state) => ({
          ...state,
          listaproductos: items,
        }));
        this.setState((state) => ({
          ...state,
          TableListProductos: data.Datos,
        }));
      })
      .catch((err) => console.log("err", err));
  }

  buscarinfomedicamentos() {
    fetch(ApiSios + "/ConsultarMedicamentos/", {
      method: "POST",
      body: JSON.stringify({
        Filtro: this.state.SelctMedicamento.value,
        Software: "ZEUS",
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => {
        let items = [];
        let lstDatos = data.Datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objAcciones = {};
          objAcciones.value = lstDatos[i].Id;
          objAcciones.Atc = lstDatos[i].Codigo;
          objAcciones.label = lstDatos[i].Nombre;
          objAcciones.Forma = lstDatos[i].Forma;
          objAcciones.Concentracion = lstDatos[i].Concentracion;
          objAcciones.Descripcion = lstDatos[i].Descripcion;
          objAcciones.CodMed = lstDatos[i].Id;
          objAcciones.Grupo = lstDatos[i].Grupo;
          items.push(objAcciones);
        }
        if (items.length > 0) {
          this.setState((state) => ({
            ...state,
            listamedicamentos: items,
          }));
          this.setState((state) => ({
            ...state,
            TableListMedicamento: items,
          }));
        }

      })
      .catch((err) => console.log("err", err));
  }

  contactToggleModel = () => {
    this.setState((state) => ({
      ...state,
      contactModel: !this.state.contactModel,
    }));
  };

  CargarSoftwares = async () => {
    fetch(gsUrlApi + "/softwares/listar/5cac12055d717e661ea7b95b", {
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
        let items = [];
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objClasificaciones = {};
          objClasificaciones.value = lstDatos[i].Codigo;
          objClasificaciones.label = lstDatos[i].Nombre;
          objClasificaciones.Activo = lstDatos[i].Activo;
          items.push(objClasificaciones);
        }
        this.setState((state) => ({
          ...state,
          listaClasificacion: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  agregarEquivalencia = (data) => {
    this.state.arrayList2[data.target.id].Equivalencia = data.target.value;
    this.setState((state) => ({
      ...state,
      arrayList2: this.state.arrayList2,
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
      this.EnviarGuardado(e);
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
      this.deleteSelected(e);
    } else if (action === "deleteAll") {
      this.setState((state) => ({
        ...state,
        idEliminar: e,
      }));
      this.deleteallselected(e);
    }
  };

  CardarData = async (e = null) => {
    this.setState({ ValidateUsuario: !this.state.ValidateUsuario });
    this.setState((state) => ({
      ...state,
      hidden_IdUsuario: e._id,
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

  handleSearch = (e) => {
    this.props.searchInput(e.target.value);
    const filteredContactlists = this.state.Userlists.filter((e) => {
      if (this.props.panel === "favorite") {
        return (
          (e.Codigo.toLowerCase().includes(
            this.props.searchInput.toLowerCase()
          ) ||
            e.Descripcion.toLowerCase().includes(
              this.props.searchInput.toLowerCase()
            ) ||
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

  EnviarGuardado = (data) => {
    data.preventDefault();
    this.state.arrayList[0]["Productos"] = this.state.arrayList2;

    if (this.state.listaClasificacion[0].Activo === true) {
      this.state.arrayList[0].IdSoftware = this.state.listaClasificacion[0].value;
      this.state.arrayList[0].Software = this.state.listaClasificacion[0].label;

    } else if (this.state.listaClasificacion[0].Activo === false) {
      this.state.arrayList[0].IdSoftware = this.state.listaClasificacion[1].value;
      this.state.arrayList[0].Software = this.state.listaClasificacion[1].label;


    }


    this.props.handleFormSubmit(this.state.arrayList[0]);
  };

  deleteSelected = async (sKey) => {
    var objAuditor = {};
    objAuditor._id = sKey._id;
    fetch(gsUrlApi + "/medicamentos/eliminar/", {
      method: "POST",
      body: JSON.stringify(objAuditor),
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
          hidden_Id: null,
        }));
        this.componentDidMount();
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

  render() {
    return (
      <fieldset style={{ border: "0px solid #dee2e6", padding: "revert" }}>
        <form onSubmit={this.EnviarGuardado}>
          <div className="d-flex flex-row-reverse">
            <Button
              type="submit"
              style={{ "background-color": "rgb(0, 196, 134)" }}
              className="c-btn text-white"
            >
              <i class="far fa-save text-white mr-2 fa-lg"></i>
              Guardar
            </Button>
            <Button
              type="button"
              className="c-btn btn-outline-danger  mr-2"
              onClick={() => this.props.actiononButton("cancelar")}
            >
              <i class="fas fa-times mr-2"></i>
              Cancelar
            </Button>
          </div>
          <br />
          <div className="row col-md-12">
            <div className="form-group col-md-2">
              <label style={{ "padding-top": "10px" }}>
                Medicamento
              </label>
            </div>
            <div className="form-group col-md-9">
              <div
                className="searchStyle pos-relative mr-3"
                style={{ "margin-left": "initial" }}
              >
                <i className="fas fa-search close-search"></i>

                <Select
                  id="Medicamento"
                  onChange={this.CambiarSelect}
                  placeholder="Escriba Para Buscar Medicamento...  "
                  className="react-form-search-input"
                  onInputChange={this.CambiarSelect}
                  value={this.state.SelctMedicamento}
                  options={this.state.listamedicamentos}
                />
              </div>
            </div>
          </div>


          <ContactListComponent

            // panel={this.props.panel}
            searchInput={this.props.searchInput}
            Userlists={this.state.arrayList}
            Consultar={(data) => this.Consultar(data)}
            selectValue={(data) => this.selectValue(data)}
            handleSearch={(data) => this.handleSearch(data)}
            deleteSelected={() => this.deleteSelected}
            actiononButton={(action) => this.actiononButton(action)}
            actiononContact={(action, data) =>
              this.actiononContact(action, data)
            }
          />
          <br></br>
          <div className="row col-md-12">
            <div className="form-group col-md-2">
              <label style={{ "padding-top": "10px" }}>
                Producto
              </label>
            </div>
            <div className="form-group col-sm-11 col-md-9">
              <div
                className="searchStyle pos-relative mr-3"
                style={{ "margin-left": "initial" }}
              >
                <i className="fas fa-search close-search"></i>

                <Select
                  id="Producto"
                  value={this.state.SelctProducto}
                  onChange={this.agregarCampo}
                  closeMenuOnSelect={false}
                  onInputChange={this.CambiarSelect2}
                  placeholder="Escriba Para Buscar Producto... "
                  className="react-form-search-input"
                  options={this.state.listaproductos}
                // onChange={(ev) => this.props.Consultar(ev)}
                />
              </div>
            </div>
            <div className="form-group col-sm-1 col-md-1">
              <label style={{ "padding-top": "10px" }}>
                Zeus
              </label>
            </div>
            <div
              className="searchStyle pos-relative mr-3"
              style={{ "margin-left": "initial", width: "250px" }}
            >
            </div>
          </div>
          <ContactListComponent2
            Userlists2={this.state.arrayList2}
            agregarEquivalencia={(data) => this.agregarEquivalencia(data)}
            quitarCampo={(data) => this.quitarCampo(data)}
            deleteSelected={(data) => this.deleteSelected}
            actiononContact={(action, data) =>
              this.actiononContact(action, data)
            }
          ></ContactListComponent2>

        </form>
      </fieldset>
    );
  }
}

export default connect(mapStateToProps, null)(RelacionMedicamentoProducto);
