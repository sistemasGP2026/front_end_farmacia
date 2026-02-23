import React, { Fragment } from "react";
import Radium from "radium";
import { gsUrlApi } from '../../config/configServer';

class CargarRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataRoles: []
        };
    }
    async componentDidMount() {
    
        fetch(gsUrlApi + '/roles/listar/5cac12055d717e661ea7b95b', {
          method: 'GET',
          body: JSON.stringify(),
          headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json',
          }
        }) . then(res => res.json())
            .then(data =>data)
            .then((data) =>{
                var arrayRoles= [];
                for (let i = 0; i < data.length; i++) {
                    let objRoles = {};
                    objRoles.id = data[i]._id
                    objRoles.code = data[i].Codigo
                    objRoles.name = data[i].Nombre
                    objRoles.Permisos = data[i].Permisos
                    arrayRoles.push(objRoles)
                }
                this.setState(state => ({
                    ...state,DataRoles: arrayRoles
                }))
               return arrayRoles;
              
            })
        .catch(err => console.log("err", err));
        
    }
    render() {
        return (this.props.DataRoles);
    }
}
export default Radium(CargarRoles);