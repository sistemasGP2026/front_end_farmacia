import React, { useState } from "react";
import { loginBack2, iconDemo } from "helper/constant";
import { loginBack, LoginFarmacia } from "helper/constant";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import AuthActions from "redux/auth/actions";
import enhancer from "./enhancer/LoginFormEnhancer";
import { gsUrlApi } from '../../../config/configServer';
import { confirmAlert } from "react-confirm-alert";
import Select from "react-select";

const { login } = AuthActions;

const Login = props => {

    const [Sede, setSedes] = useState(false);
    const [EstadoSede, setEstadoSede] = useState(false); 
    const [DataSedes, setDataSedes] = useState([]);
    const [objSede, setobjSedes] = useState(false);

    const [DataBodega, setDataBodega] = useState([]);
    const [Bodega, setBodegas] = useState(false);
    const [objBodegas, setobjBodegas] = useState(false);
    const [EstadoBodega, setEstadoBodega] = useState(false);

    const handleLogin = e => {
        e.preventDefault();
        let { values, handleSubmit } = props;

        if (values.email !== "" && values.password !== "") {

            let respuesta = {
                mensaje: "",
                error: null,
                analisis: null
            };

            const resultado = fetch(gsUrlApi + '/usuarios/validarIngreso', {
                method: 'POST',
                body: JSON.stringify({ Login: values.email, Clave: values.password }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json',
                }
            }).then(res => res.json())
                .then(data => data)
                .then(function Validar(data) {
                    if (data.error) {
                        AlertaError();
                    } else {
                        if (data.usuarios.length > 0) {
                            var objSesion = {};
                            objSesion.Usuario = data.usuarios[0];
                            if (objSesion.Usuario.Regionales.length == 1) {
                                let objTemp = {};
                                objTemp.label = objSesion.Usuario.Regionales[0].Nombre
                                objTemp.value = objSesion.Usuario.Regionales[0].Codigo
                                objSesion.Usuario.Sede = objTemp  
                                if (objSesion.Usuario.Bodegas?.length == 1) {
                                    let objTemp = {};
                                    objTemp.label = objSesion.Usuario.Bodegas[0].Nombre
                                    objTemp.value = objSesion.Usuario.Bodegas[0].Codigo
                                    objSesion.Usuario.Bodega = objTemp 
                                    localStorage.setItem('Usuario', JSON.stringify(objSesion))
                                    props.login(resultado);
                                    props.history.push("/dashboard");
                                }else if(objSesion.Usuario.Bodegas?.length > 0){
                                    let arrayTemp = [];
                                    for (const iterator of objSesion.Usuario.Bodegas) {
                                        let objTemp = {};
                                        objTemp.label = iterator.Nombre
                                        objTemp.value = iterator.Codigo
                                        arrayTemp.push(objTemp) 
                                    } 
                                    setDataBodega(arrayTemp) 
                                    setEstadoBodega(true)
                                }else{ 
                                    alert('El usuario no tiene bodegas asignadas') 
                                }
                                
                                if (Bodega) {
                                    objSesion.Usuario.Bodega = objBodegas
                                    localStorage.setItem('Usuario', JSON.stringify(objSesion))
                                    props.login(resultado);
                                    props.history.push("/dashboard");
                                }
                            } else if (objSesion.Usuario.Regionales.length > 1) {
                                let Array = [];
                                for (let i = 0; i < objSesion.Usuario.Regionales.length; i++) {
                                    let objTemp = {};
                                    objTemp.label = objSesion.Usuario.Regionales[i].Nombre
                                    objTemp.value = objSesion.Usuario.Regionales[i].Codigo
                                    Array.push(objTemp)
                                }
                                if (Sede) {
                                    objSesion.Usuario.Sede = objSede 
                                    if (objSesion.Usuario.Bodegas?.length == 1) {
                                        let objTemp = {};
                                        objTemp.label = objSesion.Usuario.Bodegas[0].Nombre
                                        objTemp.value = objSesion.Usuario.Bodegas[0].Codigo
                                        objSesion.Usuario.Bodega = objTemp  
                                        localStorage.setItem('Usuario', JSON.stringify(objSesion))
                                        props.login(resultado);
                                        props.history.push("/dashboard");
                                    }else if(objSesion.Usuario.Bodegas?.length > 0){
                                        let arrayTemp = [];

                                        for (const iterator of objSesion.Usuario.Bodegas) {
                                            let objTemp = {};
                                            objTemp.label = iterator.Nombre
                                            objTemp.value = iterator.Codigo
                                            arrayTemp.push(objTemp) 
                                        } 
                                        setDataBodega(arrayTemp) 
                                        setEstadoBodega(true)
                                    }else{
                                        alert('El usuario no tiene bodegas asignadas')
                                    }
                                }
                                if (Bodega) {
                                    objSesion.Usuario.Bodega = objBodegas
                                    localStorage.setItem('Usuario', JSON.stringify(objSesion))
                                    props.login(resultado);
                                    props.history.push("/dashboard");
                                }
                               
                                setDataSedes(Array)
                                setEstadoSede(true)
                            }

                        } else {
                            AlertaLogin();
                        }
                    }

                })
                .catch(err => {
                    AlertaError(err)
                });

            return respuesta;

        }
        handleSubmit();
    };

    const AlertaLogin = () => {
        confirmAlert({
            title: "Aviso!",
            message: "¡Usuario y contaseña no validos!",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: () => onClick(),
                }
            ]
        });
    };

    const AlertaError = (Error) => {
        let Aviso = Error.message;
        confirmAlert({
            title: "Aviso!",
            message: Aviso,
            buttons: [
                {
                    label: "Aceptar",
                    onClick: () => onClick(),
                }
            ]
        });
    };

    const SelecthandleChange = data => {
        setSedes(data.value);
        setobjSedes(data) 
    }

    const SelecthandleChangeBodega = data => {
        setBodegas(data.value);
        setobjBodegas(data) 
    }

    const onClick = () => {

    }
    const { values, handleChange, handleBlur, errors, touched, submitCount } = props;

    const loginContainer = {
        // backgroundImage: `url(${loginBack})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        position: "fixed",
        overflow: "auto",
        top: 0,
        bottom: 0,
    };
    const logoLogin = {
        margin: "50px"
    };
 

    const Error = props => {
        const field1 = props.field;
        if ((errors[field1] && touched[field1]) || submitCount > 0) {
            return (
                <span className={props.class ? props.class : "error-msg"}>
                    {errors[field1]}
                </span>
            );
        } else {
            return <span />;
        }
    };

    return (
        <div className="container-fluid" style={loginContainer}>
            <form className="" onSubmit={handleLogin}>
                <div className="row">
                    <div className="col-md-8 " style={{ paddingLeft: 0, paddingRight: 0 }} >
                        <img className="d-none d-md-block" src={LoginFarmacia} alt="icon" width="100%" />
                    </div>

                    <div className="col s4">
                        <div className="login-icon text-center" >
                            <img src={iconDemo} alt="icon" style={logoLogin} height="100px" />
                        </div>

                        <h2>Iniciar sesión</h2>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                className="form-control react-form-input"
                                id="email"
                                onChange={handleChange}
                                value={values.email}
                                onBlur={handleBlur}
                                placeholder="Usuario"
                            />
                            <Error field="text" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control react-form-input"
                                id="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Password"
                            />
                            <Error field="password" />
                        </div>
                        {EstadoSede ? <div className="form-group">
                            <label>Sede</label>
                            <Select
                                id="Sedes"
                                name="SedesSelect"
                                value={objSede}
                                onChange={SelecthandleChange}
                                options={DataSedes}
                            />
                            <Error field="password" />
                        </div> : ""}
                        {EstadoBodega ? <div className="form-group">
                            <label>Bodegas</label>
                            <Select
                                id="Bodega"
                                name="BodegaSelect"
                                value={objBodegas}
                                onChange={SelecthandleChangeBodega}
                                options={DataBodega}
                            />
                            <Error field="Bodega" />
                        </div> : ""}
                        <button type="submit" className="btn form-button btn-primary">
                            Iniciar Sesión
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default compose(
    withRouter,
    enhancer,
    connect(
        null,
        { login }
    )
)(Login);
