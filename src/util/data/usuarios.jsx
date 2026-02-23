
import React, { Fragment } from "react";
import Radium from "radium";
import { gsUrlApi } from '../../config/configServer';

class ListarUsuarios extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataUsuario: []
        };
    }
    async componentDidMount() {
    
        fetch(gsUrlApi + '/usuarios/listar/5cac12055d717e661ea7b95b', {
          method: 'GET',
          body: JSON.stringify(),
          headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json',
          }
        }) . then(res => res.json())
            .then(data =>data)
            .then((data) =>{
               
                this.setState(state => ({
                    ...state,DataUsuario: data
                }))

            })
        .catch(err => console.log("err", err));
        
    }
    render() {
        return (this.props.DataUsuario);
    }
}
export default Radium(ListarUsuarios);