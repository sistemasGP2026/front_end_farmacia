import React from "react";
import enhancer from "components/configuraciones/ConfiguracionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import { iconDemo, AppName } from "helper/constant";
import { gsUrlApi } from "../../config/configServer";
import Buttons from "components/ListButtons/ButtonsConfig";


class FormularioUser extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            handleChange: '',
            handleBlur: '',
            errors: '',
            touched: '',
            values: '',
            submitCount: '',
            values: '', 
            isValid: '', 
            ValidateUsuario: false,
            editedContent: '',
            DataSoftwares: []
        }
    }
    
    async componentDidMount(){
       this.CargarSoftwares();
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
                    objSoftwares.value = lstDatos[i].Nombre;
                    objSoftwares.Nombre = lstDatos[i].Nombre;
                    objSoftwares.Codigo = lstDatos[i].Codigo;
                    items.push(objSoftwares);  
                }

                let DataSoftwaresConfig = this.props.DataSoftwaresConfig;
                for (let k = 0; k < DataSoftwaresConfig.length; k++) {
                    for (let j = 0; j < items.length; j++) {
                        if (items[j].Nombre === DataSoftwaresConfig[k]) {
                             /* items.splice(j, 1); */
                        }                    
                    }              
                }
                
                this.setState(state => ({
                    ...state,DataSoftwares: items
                }))
              
            })
        .catch(err => console.log("err", err));
    }  

    handleSubmit = data => {

        if (this.props.isValid) {
            this.props.handleFormSubmit(this.props.values);
        } else {
            this.props.handleFormSubmit(this.props.values);
        }
    };

    /* actiononButton = (sKey) => {
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
      } */

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                <Buttons
          />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="container">
                                    <div className="row">
                                    <div className="form-group col-md-4 col-xs-6">
                                    <label>Software: *</label>
                                    <select
                                        className="form-control react-form-input"
                                        style={{width: "100%"}}
                                        id="Software"
                                        /* disabled={this.state.EstadoInput} */
                                        onChange={this.props.handleChange}
                                        onBlur={this.props.handleBlur}
                                        value={this.props.values.Software}
                                        required
                                        >
                                        {this.state.DataSoftwares.map((e, key) => {
                                            return <option key={key} value={e.value}>{e.Nombre}</option>;
                                        })}
                                        
                                    </select>
                                        </div>
                                        <div className="form-group col-md-8 col-xs-6">
                                            <p><label>Descripcion:</label></p>
                                            <p><textarea
                                             id="Descripcion" 
                                             name="Descripcion" 
                                             className="form-control react-form-input"
                                             rows="1" 
                                             cols="70" 
                                             onChange={this.props.handleChange}
                                             onBlur={this.props.handleBlur}
                                             value={this.props.values.Descripcion}/></p>
                                            {/* <Error field="Identificacion" /> */}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-4 col-md-xs-6">
                                            <label>Servidor: *</label>
                                            <input
                                                type="text"
                                                className="form-control react-form-input"
                                                id="Servidor"
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                required
                                                value={this.props.values.Servidor}
                                                placeholder="Servidor"
                                            />
                                            {/* <Error field="SegundoNombre" /> */}
                                        </div>
                                        <div className="form-group col-md-4 col-xs-6">
                                            <label>Instancia:</label>
                                            <input
                                                type="text"
                                                className="form-control react-form-input"
                                                id="Instancia"
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                value={this.props.values.Instancia}
                                                placeholder="Instancia"
                                            />
                                            {/* <Error field="PrimerApellido" /> */}
                                        </div>
                                        <div className="form-group col-md-4 col-xs-6">
                                        <label>Puerto:</label>
                                            <input
                                                type="text"
                                                className="form-control react-form-input"
                                                id="Puerto"
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                value={this.props.values.Puerto}
                                                placeholder="Puerto"
                                            />
                                            {/* <Error field="SegundoApellido" /> */}
                                        </div>
    
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-4 col-xs-6">
                                            <label>Base de datos: *</label>
                                            <input
                                                type="text"
                                                className="form-control react-form-input"
                                                id="BaseDatos"
                                                required
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                value={this.props.values.BaseDatos}
                                                placeholder="Base de datos"
                                            />
                                            {/* <Error field="FechaNacimiento" /> */}
                                        </div>
                                        <div className="form-group col-md-4 col-xs-6">
                                            <label>Usuario: *</label>
                                            <input
                                                type="text"
                                                required
                                                className="form-control react-form-input"
                                                id="Usuario"
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                value={this.props.values.Usuario}
                                                placeholder="Usuario"
                                            />
                                            {/* <Error field="Email" /> */}
                                        </div>
                                        <div className="form-group  col-md-4 col-xs-6">
                                            <label>Contraseña: *</label>
                                            <input
                                                type="password"
                                                required
                                                className="form-control react-form-input"
                                                id="Clave"
                                                onChange={this.props.handleChange}
                                                onBlur={this.props.handleBlur}
                                                value={this.props.values.Clave}
                                            />
                                            {/* <Error field="Telefono" /> */}
                                        </div>
                                    </div>
                                    {/* <div className="text-center">
                                        <Button type="submit" className="c-btn c-dark">
                                            Submit
                                        </Button>
                                    </div> */}
                            </div>                   
                        </div>
                    </div>                
                </form>
            </div>
        );
    }

}

export default compose(enhancer)(FormularioUser);
