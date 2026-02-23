import React from "react";
import enhancer from "components/usuarios/ContactEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import { iconDemo, AppName } from "helper/constant";
import { gsUrlApi } from "../../config/configServer";
import Select from "react-select";
import cogoToast from "cogo-toast";
class FormularioUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handleChange: "",
      handleBlur: "",
      errors: "",
      touched: "",
      values: "",
      submitCount: "",
      values: "",
      isValid: "",
      datasedes: [],
      selectdata: [{ value: "", label: "" }],
      DataMunicipios: [],
      DataPais: [],
    };
  }

  componentDidMount() {
    if (this.props.values.IdPais) {
      this.ConsultarMunicipio(this.props.values.IdPais);
    } else {
      this.ConsultarMunicipio("169");
    }
    fetch(gsUrlApi + "/paises", {
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
          DataPais: data.paises,
        }));
      })
      .catch((err) => console.log("err", err));

    this.CargarRoles();
    this.ConsultarSedes();

    for (var key in this.props.values) {
      let value = this.props.values[key];
      this.state[key] = value;
    }

    if (this.props.data._id) {
      for (let i = 0; i < this.props.data.Regionales.length; i++) {
        if(this.props.data.Regionales[i]?.IdRegional){
          this.props.data.Regionales[i].value = this.props.data.Regionales[
            i
          ].IdRegional;
          this.props.data.Regionales[i].label = this.props.data.Regionales[
            i
          ].Nombre;
          this.setState((state) => ({
            ...state,
            SedesSelect: this.props.data.Regionales,
          })); 
        }
        
      }
      if(this.props.data?.Bodegas?.length > 0){
        for (let i = 0; i < this.props.data?.Bodegas?.length; i++) {
          if(this.props.data?.Bodegas[i]?.Codigo){
            this.props.data.Bodegas[i].value = this.props.data?.Bodegas[i]?.IdBodega;
            this.props.data.Bodegas[i].Codigo = this.props.data?.Bodegas[i]?.Codigo;
            this.props.data.Bodegas[i].label = this.props.data?.Bodegas[i]?.Nombre;
            this.setState((state) => ({
              ...state,BodegaSelect: this.props.data.Bodegas,
            }));
          }
         
        }
      }
     
      
      this.ConsultarBodegas(this.props.data.Regionales);
      let Rol = { value: this.props.data.Rol, label: this.props.data.IdRol };

      this.setState((state) => ({
        ...state,
        RolSelect: Rol,
      }));

      let mncpo = {
        value: this.props.data.Municipio,
        label: this.props.data.NombreMunicipio,
      };

      this.setState((state) => ({
        ...state,
        IdMunicipio: mncpo,
      }));
    }
  }

  handleSubmit = (e) => {
    if (this.props.isValid) {
      this.props.values.IdMunicipio = this.state.IdMunicipio;
      this.props.values.SedesSelect = this.state.SedesSelect;
      this.props.values.BodegaSelect = this.state.BodegaSelect;
      this.props.values.DataRoles = this.state.DataRoles;
      this.props.values.RolSelect = this.state.RolSelect;
      this.props.handleFormSubmit(this.props.values);
    } else {
      this.props.values.IdMunicipio = this.state.IdMunicipio;
      this.props.values.SedesSelect = this.state.SedesSelect;
      this.props.values.BodegaSelect = this.state.BodegaSelect;
      this.props.values.DataRoles = this.state.DataRoles;
      this.props.values.RolSelect = this.state.RolSelect;
      this.props.handleFormSubmit(this.props.values);
    }
  };

  // const Error = props => {
  //     const field1 = props.field;
  //     if ((errors[field1] && touched[field1]) || submitCount > 0) {
  //         return (
  //             <span className={props.class ? props.class : "error-msg"}>
  //                 {errors[field1]}
  //             </span>
  //         );
  //     } else {
  //         return <span />;
  //     }
  // };

  CargarRoles = () => {
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
        let items = [];
        let lstDatos = data.datos;
        for (let i = 0; i < lstDatos.length; i++) {
          let objRoles = {};
          objRoles.value = lstDatos[i]._id;
          objRoles.label = lstDatos[i].Nombre;
          items.push(objRoles);
          // arrayRoles.Push(<option value={lstDatos[i]._id}>{lstDatos[i].Nombre}</option>);
        }
        // objRoles.Roles = arrayRoles;
        this.setState((state) => ({
          ...state,
          DataRoles: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  ConsultarSedes = () => {
    let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
    let ObjEmpresa = ObjSesion.Usuario.Rol.Empresa;
    fetch(gsUrlApi + "/empresa_sedes/listar/1", {
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
          let element = {};
          element.value = lstDatos[i]._id;
          element.label = lstDatos[i].Codigo + " - " + lstDatos[i].Nombre;
          element.Codigo = lstDatos[i].Codigo;
          items.push(element);
        }
        this.setState((state) => ({
          ...state,
          DataSedes: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  ConsultarBodegas = (DataSede) => { 
    let arrayTemp = [];
    if(this.state.SedesSelect?.length > 0){
      for (const iterator of this.state.SedesSelect) {
        arrayTemp.push(iterator.Codigo)
      }
    }else if(this.props.data?.Regionales?.length > 0){
      for (const iterator of this.props.data?.Regionales) {
        arrayTemp.push(iterator.Codigo)
      }
    }else if(DataSede?.length > 0){
      for (const iterator of DataSede) {
        arrayTemp.push(iterator.Codigo)
      }
    }
   
    fetch(gsUrlApi + "/homologacionBodegasPorSedes/listarMasivo", {
      method: "POST",
      body: JSON.stringify({arraySedes: arrayTemp}),
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
          let element = {};
          element.value = lstDatos[i]._id;
          element.label = lstDatos[i].CodigoBodega + " - " + lstDatos[i].NombreBodega;
          if(lstDatos[i].CodigoUnidadFuncional != ""){
            element.label = lstDatos[i].CodigoUnidadFuncional + " - " + lstDatos[i].CodigoUnidadFuncional + " " + lstDatos[i].NombreUnidadFuncional;
          } 
          element.Codigo = lstDatos[i].CodigoBodega;
          items.push(element);
        }
        this.setState((state) => ({
          ...state,
          DataBodegas: items,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  mostraralerta = (data) => {
    cogoToast.warn("Seleccione una Sede", {
      position: "bottom-right",
      heading: "Alerta",
    });
  };

  BodegaSelect = (data) => {
    if (data === null) {
      this.setState((state) => ({
        ...state,
        BodegaSelect: "",
      }));
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].IdBodega = data[i].value;
        data[i].Nombre = data[i].label;
        data[i].Codigo = data[i].Codigo;
        this.setState((state) => ({
          ...state,
          BodegaSelect: data,
        }));
      }
    }
  }

  SedesSelect = (data) => {
    if (data === null) {
      this.setState((state) => ({
        ...state,
        SedesSelect: "",
      }));
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].IdRegional = data[i].value;
        data[i].Nombre = data[i].label;
        data[i].Codigo = data[i].Codigo;
        this.setState((state) => ({
          ...state,
          SedesSelect: data,
        }));
      }
    }
    this.ConsultarBodegas(data);
    // this.setState((state) => ({
    //   ...state,
    //   SedesSelect: this.state.dataSedes,
    // }));
    // let dataSedes = {Id: data.value, Nombre: data.label};
    // this.state.SedesSelect = dataSedes;
    // this.setState((state) => ({
    //   ...state,
    //   SedesSelect: this.state.SedesSelect,
    // }));
  };

  IdMunicipio = (data3) => {
    let mncipio = { value: data3.value, label: data3.label };
    this.setState((state) => ({
      ...state,
      IdMunicipio: mncipio,
    }));
  };

  RolSelect = (data2) => {
    let Rol = { value: data2.value, label: data2.label };
    this.setState((state) => ({
      ...state,
      RolSelect: Rol,
    }));
  };

  // ConsultarMunicipio = data => {
  // 	let _id = null;
  // 	if (data) {
  // 		_id = data;
  // 	} else if (this.props.values.IdPais) {
  // 		_id = this.props.values.IdPais;
  // 	} else {
  // 		_id = data;
  // 	}
  // 	if (data) {
  // 		fetch(gsUrlApi + '/municipios/IdPais/' + _id + '/', {
  // 			method: 'GET',
  // 			body: JSON.stringify(),
  // 			headers: {
  // 				'Content-Type': 'application/json; charset=UTF-8',
  // 				Accept: 'application/json'
  // 			}
  // 		})
  // 			.then(res => res.json())
  // 			.then(data => data)
  // 			.then(data => {
  //         let items = [];
  //         let lstDatos = data.municipios;
  //         for (let i = 0; i < lstDatos.length; i++) {
  //           let element = {};
  //           element.value = lstDatos[i]._id;
  //           element.label = lstDatos[i].Municipio
  //           items.push(element);
  //         }
  // 				this.setState(state => ({
  // 					...state,
  // 					DataMunicipios: items
  // 				}));
  // 			})
  // 			.catch(err => console.log('err', err));
  // 	}
  // };

  ConsultarMunicipio = (data2) => {
    let _id = null;
    if (data2.target) {
      _id = data2.target.value;
    } else if (this.props.values.IdPais) {
      _id = this.props.values.IdPais;
    } else {
      _id = data2;
    }
    if (data2) {
      fetch(gsUrlApi + "/municipios/IdPais/" + _id + "/", {
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
          let lstDatos = data.municipios;
          for (let i = 0; i < lstDatos.length; i++) {
            let element = {};
            element.value = lstDatos[i]._id;
            element.label = lstDatos[i].Municipio;
            items.push(element);
          }
          this.setState((state) => ({
            ...state,
            DataMunicipios: items,
          }));
        })
        .catch((err) => console.log("err", err));
    }
  };

  render() {
    return (
      <div>
        {/* <legend
              style={{ width: "auto", fontSize: "large", fontWeight: "900" }}
            >
              Registrar Glosas
            </legend> */}
        <fieldset
          style={{
            border: "1px #dee2e6",
            padding: "revert",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <div className="d-flex flex-row-reverse pb-3">
              <Button
                type="button"
                className="c-btn btn-outline-danger  mr-2"
                onClick={() => this.props.actiononButton("cancelar")}
              >
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </Button>
              &nbsp; &nbsp;
              <Button
                type="button"
                onClick={this.handleSubmit}
                style={{ "background-color": "rgb(86, 60, 145)" }}
                className="c-btn text-white"
              >
                <i class="far fa-save text-white mr-2 fa-lg"></i>
                Guardar
              </Button>
            </div>
            {/* <div className="text-right">
              <Button type="submit" className="c-btn c-dark">
                Agregar
              </Button>
            </div> */}
            <div className="row">
              <div className="col-xs-12 col-md-3 mx-auto">
                <div
                  className=""
                  style={{ fontSize: "50px", color: "#01325B " }}
                >
                  <div>
                    <img
                      src={iconDemo}
                      width="190"
                      height="190"
                      className="float-right"
                      style={{ width: "200px", border: "outset 24px" }}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-md-3">
                <div className="logo-img text-center">
                  <img
                    src={iconDemo}
                    alt="react-logo"
                    style={{ width: "200px", border: "outset 24px" }}
                  />
                </div>
             

              </div> */}
              <div className="col-md-9">
                <div className="container">
                  <div className="row">
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Tipo de identificación: *</label>
                      <select
                        className="form-control react-form-input"
                        id="TipoIdentificacion"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.TipoIdentificacion}
                      >
                        <option selected disabled value="">Tipo Identificacion</option>
                        <option value="CC"> Cédula de ciudadanía</option>
                        <option value="NIT">NIT</option>

                      </select>
                      {/* <Error field="TipoIdentificacion" /> */}
                    </div>
                    <div className="form-group col-md-4 col-xs-6">
                      <label>identificación: *</label>
                      <input
                        type="number"
                        className="form-control react-form-input"
                        id="Identificacion"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.Identificacion}
                        placeholder="identificación"
                      />
                      {/* <Error field="Identificacion" /> */}
                    </div>
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Primer Nombre: *</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="PrimerNombre"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.PrimerNombre}
                        placeholder="Primer Nombre"
                      />
                      {/* <Error field="PrimerNombre" /> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-4 col-md-xs-6">
                      <label>Segundo Nombre:</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="SegundoNombre"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.SegundoNombre}
                        placeholder="Segundo Nombre"
                      />
                      {/* <Error field="SegundoNombre" /> */}
                    </div>
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Primer Apellido: *</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="PrimerApellido"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.PrimerApellido}
                        placeholder="Primer Apellido"
                      />
                      {/* <Error field="PrimerApellido" /> */}
                    </div>
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Segundo Apellido:</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="SegundoApellido"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.SegundoApellido}
                        placeholder="Segundo Apellido"
                      />
                      {/* <Error field="SegundoApellido" /> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Fecha Nacimiento: *</label>
                      <input
                        type="date"
                        className="form-control react-form-input"
                        id="FechaNacimiento"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={
                          this.props.values.FechaNacimiento
                            ? this.props.values.FechaNacimiento.substr(0, 10)
                            : ""
                        }
                        placeholder="Fecha Nacimiento"
                      />
                      {/* <Error field="FechaNacimiento" /> */}
                    </div>
                    <div className="form-group col-md-4 col-xs-6">
                      <label>Correo electrónico: *</label>
                      <input
                        type="email"
                        className="form-control react-form-input"
                        id="Email"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.Email}
                        placeholder="Correo electrónico"
                      />
                      {/* <Error field="Email" /> */}
                    </div>
                    <div className="form-group  col-md-4 col-xs-6">
                      <label>Teléfono:</label>
                      <input
                        type="mobile"
                        className="form-control react-form-input"
                        id="Telefono"
                        onChange={this.props.handleChange}
                        onBlur={this.props.handleBlur}
                        value={this.props.values.Telefono}
                        placeholder="Teléfono"
                      />
                      {/* <Error field="Telefono" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row col-md-12">
              <div className="form-group col-md-12 col-xs-6">
                <label>Sedes: *</label>
                <Select
                  isMulti
                  id="Producto"
                  name="SedesSelect"
                  value={this.state.SedesSelect}
                  onChange={this.SedesSelect}
                  options={this.state.DataSedes}
                />
              </div>
            </div>
            <div className="row col-md-12">
              <div className="form-group col-md-12 col-xs-6">
                <label>Bodegas: *</label>
                <Select
                  isMulti
                  id="Bodega"
                  name="BodegaSelect"
                  value={this.state.BodegaSelect}
                  onChange={this.BodegaSelect}
                  options={this.state.DataBodegas}
                />
              </div>
            </div>
            <div className="row col-md-12">
              <div className="form-group col-md-4 col-xs-6">
                <label>Celular: *</label>
                <input
                  type="mobile"
                  className="form-control react-form-input"
                  id="Celular"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.Celular}
                  placeholder="Celular"
                />
                {/* <Error field="Celular" /> */}
              </div>
              <div className="form-group col-md-4 col-xs-6">
                <label>País: *</label>
                <select
                style={{backgroundColor: "transparent"}}
                  className="form-control react-form-input"
                  id="IdPais"
                  name="IdPais"
                  onChange={this.ConsultarMunicipio}
                  onBlur={this.props.handleBlur}
                  value={"169"}
                  disabled
                >
                  <option value="">Seleccionar...</option>
                  {this.state.DataPais.map((e, key) => {
                    return (
                      <option key={e.IdPais} value={e.Codigo}>
                        {e.NombreEspañol}
                      </option>
                    );
                  })}
                </select>

                {/* <Error field="IdPais" /> */}
              </div>
              <div className="form-group col-md-4 col-xs-6">
                <label>Municipio: *</label>
                <Select
                  id="IdMunicipio"
                  name="IdMunicipio"
                  value={this.state.IdMunicipio}
                  onChange={this.IdMunicipio}
                  options={this.state.DataMunicipios}
                  placeholder="Seleccionar Municipio"
                />
                {/* <select
                  className="form-control react-form-input"
                  id="IdMunicipio"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.IdMunicipio}
                >
                  <option value="">Seleccionar...</option>
                  {this.state.DataMunicipios.map((e, key) => {
                    return (
                      <option key={e.IdMunicipio} value={e.text}>
                        {e.text}
                      </option>
                    );
                  })}
                </select> */}
                {/* <Error field="Municipio" /> */}
              </div>
            </div>

            <div className="row col-md-12">
              <div className="form-group col-md-4 col-xs-6">
                <label>Rol: *</label>
                <Select
                  id="RolSelect"
                  name="RolSelect"
                  value={this.state.RolSelect}
                  onChange={this.RolSelect}
                  options={this.state.DataRoles}
                  placeholder="Seleccionar Rol"

                />
                {/* <select
                  className="form-control react-form-input"
                  id="Rol"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.DataRoles}
                >
                  <option value="">Seleccionar...</option>
                  {this.state.DataRoles.map((e, key) => {
                    return (
                      <option key={key} value={e.value}>
                        {e.Nombre}
                      </option>
                    );
                  })}
                </select> */}
                {/* <Error field="Rol" /> */}
              </div>

              <div className="form-group col-md-4 col-xs-6">
                <label>Login: *</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="Login"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.Login}
                  placeholder="Login"
                />
                {/* <Error field="Login" /> */}
              </div>

              <div className="form-group col-md-4 col-xs-6">
                <label>Contraseña: *</label>
                <input
                  type="password"
                  className="form-control react-form-input"
                  id="Clave"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  value={this.props.values.Clave}
                  placeholder="Contraseña"
                />
                {/* <Error field="Clave" /> */}
              </div>
            </div>
          </form>
        </fieldset>
      </div>
    );
  }
}

export default compose(enhancer)(FormularioUser);
