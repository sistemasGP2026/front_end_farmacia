import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import Select from "react-select";
import { Table } from "reactstrap";
import { ApiSios } from "config/confiSios"
import { gsUrlApi } from "config/configServer"
import Constancia from './PrintDataIndv';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from '../Imprimir/Print';
import Icon from '@material-ui/core/Icon';
import { Ring } from "react-awesome-spinners";
import { Modal } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
let piso = '';
let pabellon = '';
let Erp = '';
let Caso = ""
class RequisicionesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Medicamento: '',
            Cantidad: '',
            Destino: '',
            Contador: 0,
            Contador2: 0,
            TotalProductos: '',
            ListaPedido: [],
            ArrayMotivos: [],
            ListaMedicamentos: [],
            handleChange: '',
            handleBlur: '',
            errors: '',
            touched: '',
            values: '',
            submitCount: '',
            isValid: '',
            selected: [],
            DataPaciente: '',
            objDevolucion: {},
            Preload: false,
            isLoading2: false,
            EstadoImprimir: false,
            EstadoGuardado: false,
            MotivoDevolucion: ""
        }
    }

    async componentDidMount() {
        this.setState(state => ({
            ...state, EstadoImprimir: false
        }))
        if (this.props.data) {
            for (let i = 0; i < this.props.data.ArrayMedicamentos.length; i++) {
                this.props.data.ArrayMedicamentos[i].Estado = ""
                this.props.data.ArrayMedicamentos[i].SolicitadoDevolver = this.props.data.ArrayMedicamentos[i].CantidadDevolver
                this.props.data.ArrayMedicamentos[i].CantidadDevolver = 0
                this.props.data.ArrayMedicamentos[i].Pendiente = this.props.data.ArrayMedicamentos[i].SolicitadoDevolver
            }
            if (this.props.data.ArrayMedicamentos.length > 0) {
                piso = this.props.data.ArrayMedicamentos[0].NombrePiso;
                pabellon = this.props.data.ArrayMedicamentos[0].NombrePabellon;
                Erp = this.props.data.ArrayMedicamentos[0].NombreAdministradora
                Caso = this.props.data.ArrayMedicamentos[0].Caso
            }

            this.setState(state => ({
                ...state, ListaPedido: this.props.data
            }))
        }


        fetch(gsUrlApi + '/motivoDevolicon/listar', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                var lstDatos = data.datos;
                if (lstDatos.length > 0) {
                    for (let i = 0; i < lstDatos.length; i++) {
                        lstDatos[i].value = lstDatos[i].Nombre;
                        lstDatos[i].label = lstDatos[i].Nombre;
                    }
                    this.setState(state => ({
                        ...state, ArrayMotivos: lstDatos
                    }))
                }



            })
            .catch(err => console.log("err", err));



    }

    Guardar = e => {
        e.preventDefault()
        if (this.state.EstadoGuardado === false) {
            this.setState(state => ({
                ...state, EstadoGuardado: true
            }))
            var dt = new Date();

            let fechaActual = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`

            this.state.Contador = 0;
            this.state.Contador2 = 0;
            let objDevolucion = {};
            let arrayDisensacion = []
            let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
            let Sede = ObjSesion.Usuario.Sede;
            let Bodega = ObjSesion.Usuario.Bodega;
            objDevolucion.Sede = Sede.value
            objDevolucion.CodigoBodegaUsuario = Bodega?.value
            objDevolucion.NombreBodegaUsuario = Bodega?.label
            objDevolucion.UsuarioFarmacia = ObjSesion.Usuario.NombreCompleto
            objDevolucion.IdentificacionUsuario = ObjSesion.Usuario.IdentificacionUsuario
            objDevolucion.NombreCompleto = this.props.data.NombrePaciente
            objDevolucion.NombreCama = this.props.data.NombreCama
            objDevolucion.Sexo = this.props.data.Sexo
            objDevolucion.Edad = this.props.data.Edad
            objDevolucion.UnidadFuncional = this.props.data.NombreUnidadFuncional
            objDevolucion.CodigoUnidadFuncional = this.props.data.CodigoUnidadFuncional
            objDevolucion.Piso = this.props.data.Piso
            objDevolucion.Erp = "";
            objDevolucion.CodigoErp = this.props.data.CodigoAdministradora
            objDevolucion.NombreCentroAtencion = this.props.data.NombreCentroAtencion
            objDevolucion.CodigoCentroAtencion = this.props.data.CodigoCentroAtencion
            objDevolucion.Pabellon = pabellon
            objDevolucion.IdentificacionPaciente = this.props.data.IdentificacionPaciente
            objDevolucion.Origen = this.props.data.Origen
            objDevolucion.IdPlan = this.props.data.CodigoPlan
            objDevolucion.NombrePlan = this.props.data.NombrePlan
            objDevolucion.Caso = this.props.data.Caso
            objDevolucion.TipoDocumento = this.props.data.TipoDocumento
            objDevolucion.MotivoDevolucion = this.state.MotivoDevolucion
            objDevolucion.FechaRegistro = fechaActual.substr(0, 10) + " " + fechaActual.substr(11) + ".000Z";;
            objDevolucion.IdPaciente = this.state.DataPaciente.IdPaciente
            if (this.state.ListaMedicamentos.length > 0) {
                for (let i = 0; i < this.state.ListaMedicamentos.length; i++) {
                    arrayDisensacion.push(this.state.ListaMedicamentos[i])
                }

                if (this.state.EstadoBorrador) {
                    objDevolucion.Borrador = true

                } else {
                    objDevolucion.Borrador = false

                }

                objDevolucion.CantidadMedicamentos = arrayDisensacion.length;
                let action = "insertar";
                objDevolucion.ArrayMedicamentos = arrayDisensacion

                this.state.action = action;
                this.setState(state => ({
                    ...state, Preload: true
                }))
                this.state.objDevolucion = objDevolucion
                this.GuradarDevolucion()
            } else {
                this.AlertaSeleccion("No hay productos seleccionados!")
                this.setState(state => ({
                    ...state, EstadoGuardado: false
                }))
            }

        } else {
            this.AlertaSeleccion("El registro Ya se encuentra Guardado!")
        }
    }

    AlertaSeleccion = Mensaje => {
        confirmAlert({
            title: "Alerta!",
            message: Mensaje,
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    };

    AlertaDispensacion = (Mensaje) => {
        this.setState(state => ({
            ...state, Preload: false
        }))
        confirmAlert({
            title: "Error!",
            message: Mensaje,
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    };


    GuradarDevolucion = () => {
        let objDevolucion = this.state.objDevolucion;
        fetch(gsUrlApi + '/devolucionesAprovechamientoConfirmadas/' + this.state.action + '/', {
            method: 'POST',
            body: JSON.stringify(objDevolucion),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.error) {

                } else {
                    this.EliminarDevoluciones(this.props.data)

                }
            })
            .catch(err => console.log("err", err));


    }

    EliminarDevoluciones = (ObjData) => {

        fetch(gsUrlApi + '/solicitudes_devoluciones/eliminar/', {
            method: 'POST',
            body: JSON.stringify(ObjData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.error) {

                } else {
                    this.setState(state => ({
                        ...state, EstadoImprimir: true,
                    }))
                    this.setState(state => ({
                        ...state, Preload: false
                    }))

                }
            })
            .catch(err => console.log("err", err));
    }

    AlertaValor = () => {
        confirmAlert({
            message: "El valor ingresado no es permitido!",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    }

    handleChange = (event) => {
        let listaTemp = this.state.ListaPedido.ArrayMedicamentos;

        let Pendiente = Number(listaTemp[event.target.id].SolicitadoDevolver)
        if (Pendiente < event.target.value || event.target.value < 0 && event.target.value != "") {
            this.AlertaValor()
        } else {
            if (event.target) {
                let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
                listaTemp[event.target.id].CantidadDevolver = event.target.value
                listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].SolicitadoDevolver - event.target.value
                this.props.data.ArrayMedicamentos.Pendiente = listaTemp[event.target.id].Pendiente
                this.props.data.ArrayMedicamentos.CantidadDevolver = listaTemp[event.target.id].CantidadDevolver
                if (listaTemp[event.target.id].EstadoAprovechamiento === false) {
                    listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento

                } else {
                    listaTemp[event.target.id].Aprovechamiento = ""
                }
                this.state.ListaPedido.ArrayMedicamentos = listaTemp
                this.setState(state => ({
                    ...state, ListaPedido: this.state.ListaPedido
                }))
            }
        }

        // this.setState({Cantidad: event.target.value});
    }

    Cancelar = e => {
        this.props.CancelarDispensacion("cancelar")
    }
    checkedMedicamento = (data, key) => {
        let estado = false;
        for (let i = 0; i < this.state.ListaMedicamentos.length; i++) {
            if (this.state.ListaMedicamentos[i].Producto === data.Producto) {
                estado = true;
            }
        }
        let arrayTemp = this.state.ListaMedicamentos;
        let arrayTempSelect = this.state.selected;
        if (estado === false) {
            arrayTemp.push(data)
            arrayTempSelect.push(data.Producto)
            this.setState(state => ({
                ...state, ListaMedicamentos: arrayTemp
            }))
            this.setState(state => ({
                ...state, selected: arrayTempSelect
            }))
        } else {
            arrayTemp.splice(key, 1)
            arrayTempSelect.splice(key, 1)
            this.setState(state => ({
                ...state, ListaMedicamentos: arrayTemp
            }))
            this.setState(state => ({
                ...state, selected: arrayTempSelect
            }))
        }


    }
    SeleccionarMotivo = data => {
        let value = data.value
        this.setState(state => ({
            ...state, MotivoDevolucion: value
        }))
    }
    Agregar = e => {
        e.preventDefault();
        let Medicamento = e.target.Medicamento.value;
        let Cantidad = e.target.Cantidad.value;
        let Destino = e.target.Destino.value;
        let obj = {};
        obj.Medicamento = Medicamento;
        obj.Cantidad = Cantidad;
        obj.Destino = Destino;
        const filteredContactlistsTem = this.state.ListaPedido;

        filteredContactlistsTem.splice(0, 0, obj);
        this.setState(state => ({
            ...state, ListaPedido: filteredContactlistsTem
        }))

    };

    handleAfterPrint = () => { };

    handleBeforePrint = () => { };

    handleOnBeforeGetContent2 = () => {
        this.setState({ text: 'Loading new text...', isLoading2: true });

        return new Promise((resolve, any) => {
            setTimeout(() => {
                this.setState({ text: 'New, Updated Text!', isLoading2: false }, resolve);
            }, 2000);
        });
    };

    setComponentRef2 = (ref = ComponentToPrint) => {
        this.componentRef2 = ref;
    };

    reactToPrintContent2 = () => {
        return this.componentRef2;
    };

    reactToPrintTrigger2 = () => {
        return <Icon className="text-20">print</Icon>;
    };

    render() {
        return (
            <div className="container">
                <Modal
                    centered
                    isOpen={this.state.Preload}
                    fade={false}
                    className={this.props.className}
                    style={{ maxWidth: "700px" }}
                >
                    <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                        <h3 className="mt-5 pt-3 text-white">Confirmando Devolución...</h3></div>


                </Modal>
                <form onSubmit={this.Guardar}>
                    <div style={{ padding: "15px" }}>
                        <div className="row">
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    <i className="far  fa-user-circle"></i>{this.props.data.NombrePaciente}{" - "}{this.props.data.IdentificacionPaciente}
                                </div>
                                {/* <div className="">
                                    {this.props.data.LogoSexo}
                                </div>
                                -{this.props.data.Edad + "  Años"} */}
                            </div>
                            <div className="col-md-2 row">
                                <div className="font-weight-bold">
                                    Piso:
                                </div>
                                <div className="ml-2">
                                    {this.props.data.Piso}
                                </div>
                            </div>
                            <div className="col-md-4 row">
                                {this.props.data.UnidadFuncional}

                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-3 pl-3 row">
                                <div className="font-weight-bold">
                                    Plan:
                                </div>
                                <div className=" ml-2">
                                    {this.props.data.NombrePlan}
                                </div>
                            </div>
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    Pabellon:
                                </div>
                                <div className=" ml-2">
                                    {this.props.data.pabellon}
                                </div>
                                <i style={{ color: "green" }} className="fas fa-procedures mt-1 ml-4 mr-1">:</i>
                                {this.props.data.NombreCama}
                            </div>
                            <div className="col-md-3 row">
                                <div className="font-weight-bold">
                                    Caso:
                                </div>
                                <div className=" ml-2">
                                    {this.props.data.Caso}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row col-md-11">


                            <div>
                                <Button
                                    type="button"
                                    style={{ height: '80%' }}
                                    onClick={() => this.Cancelar(this.state.ListaPedido)}
                                    className="btn btn-danger ml-2 ">
                                    Cancelar
                                </Button>
                            </div>
                            <div>
                                <Button
                                    type="link"
                                    style={{ height: '80%' }}
                                    disabled={this.state.EstadoGuardado}
                                    className="btn btn-success ml-2 ">
                                    Confirmar Devolución
                                </Button>
                            </div>
                            <div>

                                <Button
                                    type="button"
                                    style={{ height: '80%' }}
                                    for="Impresion"
                                    disabled={this.state.EstadoImprimir ? false : true}
                                    className="btn btn-success ml-2 cursor-pointer">
                                    <ReactToPrint
                                        id="Impresion"
                                        content={this.state.EstadoImprimir ? (env) => this.reactToPrintContent2(env) : ""}
                                        documentTitle="Dispensacion"
                                        onAfterPrint={this.state.EstadoImprimir ? (env) => this.handleAfterPrint(env) : ""}
                                        onBeforeGetContent={this.state.EstadoImprimir ? (env) => this.handleOnBeforeGetContent2(env) : ""}
                                        onBeforePrint={this.state.EstadoImprimir ? (env) => this.handleBeforePrint(env) : ""}
                                        removeAfterPrint
                                        trigger={this.reactToPrintTrigger2}
                                    >  </ReactToPrint>
                                </Button>
                                <div hidden={true}>
                                    <Constancia
                                        ref={(env) => this.setComponentRef2(env)}
                                        objDatos={this.state.objDevolucion}
                                    />
                                </div>
                                {this.state.isLoading2 && <p className="indicator">Generando Constancia...</p>}

                            </div>
                            <div className="form-group col-md-5 col-xs-5" style={{ marginBottom: "0px" }}>
                                <Select
                                    id="Motivo"
                                    onChange={this.SeleccionarMotivo}
                                    placeholder="Motivo Devolución"
                                    className="react-form-search-input"
                                    options={this.state.ArrayMotivos}
                                />
                            </div>
                        </div>
                        <div className="text-right mt-1">
                            <Button
                                type="link"
                                onClick={() => this.Cancelar(this.state.ListaPedido)}
                                className="btn btn-link ml-2 ">
                                <i className="fa fa-chevron-left"> Atras</i>
                            </Button>
                        </div>

                    </div>


                    <div
                        className="right-panel roe-box-shadow"
                    >

                        <div className="contact-table">
                            {this.state.ListaPedido && this.state.ListaPedido.ArrayMedicamentos ? (
                                <Table hover className="mb-0 border">
                                    <thead className="">
                                        <tr>
                                            <th className=""></th>
                                            <th>Productos</th>
                                            <th>Médico/Enfermera</th>
                                            <th>Solicitado Devolver</th>
                                            <th>Cant. Devolver</th>
                                            <th>Pendiente</th>
                                            <th>Fecha/Hora Devolución</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {this.state.ListaPedido.ArrayMedicamentos.map((e, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="pretty p-svg p-curve contact-selection">
                                                            <input
                                                                type="checkbox"
                                                                value={e.Producto}
                                                                onChange={() => this.checkedMedicamento(e, i)}
                                                                checked={this.state.selected ? this.state.selected.includes(e.Producto) : false}
                                                            />
                                                            <div className="state p-primary">
                                                                {/* <!-- svg path --> */}
                                                                <svg className="svg svg-icon" viewBox="0 0 20 20">
                                                                    <path
                                                                        d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                                                        style={{
                                                                            stroke: "white",
                                                                            fill: "white"
                                                                        }}
                                                                    />
                                                                </svg>
                                                                <label />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{e.Producto}</td>
                                                    <td>{e.NombreUsuario}</td>
                                                    <td style={{ width: "100px" }}><input className="form-control" value={e.SolicitadoDevolver} disabled type="text" /></td>
                                                    <td style={{ width: "100px" }}><input className="form-control" id={i} value={e.CantidadDevolver} onChange={this.handleChange} type="Number" /></td>
                                                    <td style={{ width: "100px" }}><input className="form-control" value={e.Pendiente} disabled type="text" /></td>
                                                    <td style={{ width: "150px" }}>
                                                        <div className="">{this.state.ListaPedido.FechaRegistro ? this.state.ListaPedido.FechaRegistro.substring(0, 10) : ""} Hora: {this.state.ListaPedido.FechaRegistro ? this.state.ListaPedido.FechaRegistro.substring(11, 16) : ""}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center no-found-message">
                                    <br /><br /><br /><br />
                                    Cargando Datos....
                                </div>
                            )}
                        </div>
                    </div>
                    {/* <div className=" text-center pt-5">
                        <Button  
                        type="submit" 
                        className="c-btn ml-2 c-success">
                        Guardar
                        </Button>
                        <Button  
                        onClick={() => this.Cancelar("cancelar")}
                        className="c-btn ml-2 c-danger ml-4">
                        Cancelar
                        </Button>
                    </div> */}
                </form>
            </div>
        )
    }

}

export default compose(enhancer)(RequisicionesForm);
