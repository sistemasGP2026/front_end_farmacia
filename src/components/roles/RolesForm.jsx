import React from "react";
import enhancer from "components/roles/RolesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import { gsUrlApi } from "../../config/configServer";
import CheckboxTree from 'react-checkbox-tree';
// import 'react-checkbox-tree/lib/react-checkbox-tree.css';

let gLstinterfaces = null;
let glstPermisos = null;
class CargarDataRoles extends React.Component {

    handleSubmit = e => {
        // let { values, isValid, handleSubmit } = this.props;

        if (this.props.isValid) {
            this.props.handleFormSubmit(this.props.values);
        } else {
            this.props.handleFormSubmit(this.props.values);
        }
    };


    constructor(props) {
        super(props);
        this.state = {
            handleChange: '',
            handleBlur: '',
            errors: '',
            touched: '',
            values: '',
            submitCount: '',
            checked: [],
            expanded: [],
            nodes: [],
            isValid: '',
        }
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    async componentDidMount() {


        fetch(gsUrlApi + '/interfaces/', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.interfaces.length > 0) {
                    var lstData = [];
                    lstData = data.interfaces;

                    var array = []
                    gLstinterfaces = lstData;
                    let lstInterfaces = lstData;
                    var lstMenus = lstInterfaces.filter(obj => {
                        return obj.parent === "#";
                    });
                    let LstExpanded = [];
                    for (var i = 0; i < lstMenus.length; i++) {
                        var objMenu = lstMenus[i];

                        var objDataMenu = {};
                        var objDataSub = {};

                        var lstSubMenu = lstInterfaces.filter(obj => {
                            return obj.parent === lstMenus[i].id;
                        });
                        LstExpanded.push(lstMenus[i].text)


                        if (lstSubMenu.length > 0) {

                            var objMenu = {};
                            objDataMenu.label = lstMenus[i].text;
                            objDataMenu.value = lstMenus[i].id
                            array.push(objDataMenu)
                            var ArrayChild = []
                            for (let j = 0; j < lstSubMenu.length; j++) {
                                var objDataSub = {};
                                objDataSub.label = lstSubMenu[j].text;
                                objDataSub.value = lstSubMenu[j].id;
                                ArrayChild.push(objDataSub)
                                var lstSubMenuButton = lstInterfaces.filter(obj => {
                                    return obj.parent === lstSubMenu[j].id;
                                });
                                var ArrayChild2 = []
                                for (let p = 0; p < lstSubMenuButton.length; p++) {
                                    var objDataSubButton = {};
                                    objDataSubButton.label = lstSubMenuButton[p].text;
                                    objDataSubButton.value = lstSubMenuButton[p].id;
                                    ArrayChild2.push(objDataSubButton)
                                }
                                if(ArrayChild2.length > 0){
                                    objDataSub.children = ArrayChild2
                                }
                            }
                            array[i].children = ArrayChild;
                        } else {
                            objDataMenu.label = lstMenus[i].text;
                            objDataMenu.value = lstMenus[i].id;
                            // objDataMenu.checked = "false";
                            array.push(objDataMenu)
                        }

                    }

                    if (glstPermisos !== null) {
                        var arrayPermisos = [];
                        for (let i = 0; i < lstData.length; i++) {
                            if (glstPermisos.indexOf(lstData[i].id) !== -1) {
                                arrayPermisos.push(lstData[i].id)
                            }
                        }
                        this.setState(state => ({
                            ...state, checked: arrayPermisos
                        }))


                    }
                    this.setState(state => ({
                        ...state, expanded: LstExpanded
                    }))
                    this.setState(state => ({
                        ...state, nodes: array
                    }))
                }


            })
            .catch(err => console.log("err", err));

    }

    EdcitChecked = () => {

        this.props.values.Permisos = this.state.checked
    }

    render() {
        glstPermisos = this.props.values.Permisos
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Codigo</label>
                        <input
                            type="text"
                            className="form-control react-form-input"
                            id="code"
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                            value={this.props.values.code}
                            placeholder="Codigo"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control react-form-input"
                            id="name"
                            onChange={this.props.handleChange}
                            onBlur={this.props.handleBlur}
                            value={this.props.values.name}
                            placeholder="Nombre"
                        />
                    </div>

                    <div className="form-group">
                        <CheckboxTree
                            nodes={this.state.nodes}
                            checked={this.state.checked}
                            expanded={this.state.expanded}
                            onCheck={checked => this.setState({ checked })}
                            onClick={this.EdcitChecked()}
                            onExpand={expanded => this.setState({ expanded })}
                        />
                    </div>

                    <div className="text-center">
                        <Button type="submit" className="c-btn c-dark">
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

export default compose(enhancer)(CargarDataRoles);