import React, { useState, useEffect } from "react";
import PageTitle from "components/common/PageTitle";
import { connect } from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert'
import ContactListComponent from "components/recepciones/TableRecepciones";
import ContactWrapper from "components/recepciones/Recepciones.style";
import TableGroup from "components/historialDispensaciones/tableGroup";
import { remove, findIndex, filter } from "lodash";
import RecepcionesForm from "components/historialDispensaciones/HistorialDispensacionesForm";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import { gsUrlApi } from '../../config/configServer';
import { Table } from "reactstrap";
import Button from "components/button/Button";
import { Scrollbars } from "react-custom-scrollbars";
import TextField from '@material-ui/core/TextField';

const mapStateToProps = state => {
    return {
        ...state.themeChanger,
        themeSetting: {
            toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
            footerDisplayValue: state.themeSetting.footerDisplayValue
        }
    };
};

class CargarUsuarios extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listPacientes: [],
            DataPacientes: [],
            DataPabellon: [],
            DataUnidadFuncional: [],
            DataMedicos: []
        }
    }

    async componentDidMount() {

        let fecha = new Date(); //Fecha actual
        fecha.setDate(fecha.getDate());
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear();
        if (dia < 10) {
            dia = '0' + dia; //agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = '0' + mes //agrega cero si el menor de 10
        }
        let fechaActual = +ano + "-" + mes + "-" + dia;
        this.setState(state => ({
            ...state, fechaDay: fechaActual
        }))
        this.setState(state => ({
            ...state, fechaDay2: fechaActual
        }))

        fetch(gsUrlApi + '/' + this.props.Ruta + '/consultarFiltros/', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {

                data.datos.Pabellon.sort(function (a, b) {
                    if (a.Nombre > b.Nombre) {
                        return 1;
                    }
                    if (a.Nombre < b.Nombre) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                });
                this.setState(state => ({
                    ...state, DataPabellon: data.datos.Pabellon,
                }))
                if (data.datos.Pacientes) {
                    this.setState(state => ({
                        ...state, DataPacientes: data.datos.Pacientes,
                    }))
                }


                data.datos.UnidadFuncional.sort(function (a, b) {
                    if (a.Nombre > b.Nombre) { return 1; }
                    if (a.Nombre < b.Nombre) { return -1; }
                    return 0;
                });
                this.setState(state => ({
                    ...state, DataUnidadFuncional: data.datos.UnidadFuncional
                }))
                data.datos.Medico.sort(function (a, b) {
                    if (a.Nombre > b.Nombre) {
                        return 1;
                    } if (a.Nombre < b.Nombre) {
                        return -1;
                    } return 0;
                });
                this.setState(state => ({
                    ...state, DataMedicos: data.datos.Medico
                }))
            })
            .catch(err => console.log("err", err));

    }
    CambiarFecha = data => {
        let valor = data.target.value
        if (valor) {
            this.setState(state => ({
                ...state, fechaDay: valor
            }))
        }

    }
    CambiarFecha2 = data => {
        let valor = data.target.value
        if (valor) {
            this.setState(state => ({
                ...state, fechaDay2: valor
            }))
        }
    }

    onInputchange = data => {
        if (data) {
            let name = data.target.name;
            let value = data.target.value;
            this.setState(state => ({
                ...state, [name]: value,
            }));
        }
    }
    Consultar = data => {
        if (data.key === "Enter") {
            let value = data.target.value;
            this.props.Consultar(value)
        }
    }
    LimpiarFiltros = () => {
        this.setState(state => ({ ...state, select_Funcionario: "", }));
        this.setState(state => ({ ...state, select_Pabellon: "", }));
        this.setState(state => ({ ...state, select_Paciente: "", }));
        this.setState(state => ({ ...state, select_Unidad: "", }));
    }
    OcultarFiltros = () => {
        this.setState({ EstateFiltro: !this.state.EstateFiltro });
    }

    FiltraPacientes = data => {
        data.preventDefault();
        this.props.FiltraPacientes(data)
    }

    render() {
        return (
            <div>

                <>
                    <div>
                        {
                            this.state.EstateFiltro
                                ? <form onSubmit={this.FiltraPacientes} className="plr-15">
                                    <div className="row pb-3">
                                        <div className="col-md-4">
                                            <label>Fecha Inicio</label>
                                            <input
                                                type="date"
                                                value={this.state.fechaDay}
                                                onChange={data => this.CambiarFecha(data)}
                                                className="form-control react-form-input"
                                                id="input_FechaInicio"
                                                placeholder="Fecha Inicio"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Fecha Fin</label>
                                            <input
                                                type="date"
                                                value={this.state.fechaDay2}
                                                onChange={this.CambiarFecha2}
                                                className="form-control react-form-input"
                                                id="input_FechaFin"
                                                placeholder="Fecha Fin"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Paciente</label>
                                            <select
                                                className="form-control react-form-input"
                                                style={{ width: "100%" }}
                                                id="select_Paciente"
                                                name="select_Paciente"
                                                value={this.state.select_Paciente}
                                                onChange={this.onInputchange}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {this.state.DataPacientes.map((e, key) => {
                                                    return <option key={key} value={e._id}>{e.Nombre}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row pb-4">
                                        <div className="col-md-4">
                                            <label>Pabellones</label>
                                            <select
                                                className="form-control react-form-input"
                                                style={{ width: "100%" }}
                                                id="select_Pabellon"
                                                name="select_Pabellon"
                                                value={this.state.select_Pabellon}
                                                onChange={this.onInputchange}

                                            >
                                                <option value="">Seleccionar...</option>
                                                {this.state.DataPabellon.map((e, key) => {
                                                    return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label>Unidades Funcionales</label>
                                            <select
                                                className="form-control react-form-input"
                                                style={{ width: "100%" }}
                                                id="select_Unidad"
                                                name="select_Unidad"
                                                value={this.state.select_Unidad}
                                                onChange={this.onInputchange}

                                            >
                                                <option value="">Seleccionar...</option>
                                                {this.state.DataUnidadFuncional.map((e, key) => {
                                                    return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label>Funcionario</label>
                                            <select
                                                className="form-control react-form-input"
                                                style={{ width: "100%" }}
                                                id="select_Funcionario"
                                                name="select_Funcionario"
                                                value={this.state.select_Funcionario}
                                                onChange={this.onInputchange}

                                            >
                                                <option value="">Seleccionar...</option>
                                                {this.state.DataMedicos.map((e, key) => {
                                                    return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="plr-15 mb-2 text-right">
                                        <div className=" d-inline">
                                            <Button type="submit" className="c-btn c-success">
                                                Aplicar Filtros
                                            </Button>
                                        </div>
                                        <div className=" d-inline ml-3">
                                            <i className="c-btn c-danger" onClick={this.LimpiarFiltros} >
                                                Limpiar Filtros
                                            </i>
                                        </div>
                                        <div className="d-inline ml-3">
                                            <i onClick={this.OcultarFiltros} className="c-btn c-primary">
                                                Ocultar Filtros
                                            </i>
                                        </div>

                                    </div>
                                </form>
                                : <div className="plr-15 mb-3 row">
                                    <div className="col-md-10">
                                        {/* <form  style={{ width: "100%" }} className="plr-15"> */}

                                            <TextField
                                                id="standard-full-width"
                                                style={{ margin: 8 }}
                                                placeholder="Buscar ..."
                                                fullWidth
                                                margin="normal"
                                                onKeyDown={this.Consultar}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        {/* </form> */}

                                    </div>

                                    <div className="col.md-2 mt-2 ml-4">
                                        <i onClick={this.OcultarFiltros} className="c-btn c-primary">
                                            Mostrar Filtros
                                        </i>
                                    </div>

                                </div>
                        }
                    </div>
                </>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    null
)(CargarUsuarios);

