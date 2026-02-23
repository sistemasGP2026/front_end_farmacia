import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
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
import Select from "react-select";

let piso = '';
let pabellon = '';
let Erp = '';
let Caso = ""
let UnidadFuncionalIN = ""
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
            DevolucionesSelect: {},
            arrayDevoluciones: []
        }
    }

    async componentDidMount() {
        this.setState(state => ({
            ...state, EstadoImprimir: false
        }))
        let IdPaciente = this.props.values.IdPaciente
        //  let dataFiltros = this.props.value;
        let dataFiltros = {};
        let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
        let Sede = ObjSesion.Usuario.Sede;
        let Permisos = ObjSesion.Usuario.Rol.Permisos;
        if (!Permisos.includes("10_1")) {
            this.setState(state => ({
                ...state, EstadoGuardado: true
            }))
        }
        dataFiltros.IdPaciente = IdPaciente;
        dataFiltros.Sede = Sede.value;
        dataFiltros.IdDevolucion = this.state.DevolucionesSelect?.value;
        this.setState(state => ({
            ...state, DataPaciente: this.props.values
        }))
        fetch(gsUrlApi + '/devoluciones/listarPorPacientes/', {
            method: 'POST',
            body: JSON.stringify(dataFiltros),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                var objData = data.datos;
                var arrayTempP = [];
                if (objData.length > 0) {
                    let indexFinal = objData.length - 1;
                    for (let i = 0; i < objData.length; i++) {
                        objData[i].Estado = ""
                        objData[i].SolicitadoDevolver = objData[i].CantidadDevolver
                        objData[i].CantidadDevolver = 0
                        objData[i].Pendiente = objData[i].SolicitadoDevolver
                        const exists = arrayTempP.some(item => item.value === objData[i].IdDevolucion);
                        if (!exists) {
                            arrayTempP.push({
                                value: objData[i].IdDevolucion, 
                                label: objData[i].IdDevolucion+ " - "+ objData[i].CodigoUnidadFuncional + " - " +objData[i].UnidadFuncional,
                            })
                        }
                    }
                    this.setState(state => ({
                        ...state, arrayDevoluciones: arrayTempP,
                    }))
                    UnidadFuncionalIN = objData[indexFinal].UnidadFuncional
                    piso = objData[indexFinal].NombrePiso;
                    pabellon = objData[indexFinal].NombrePabellon;
                    Erp = objData[indexFinal].NombreAdministradora
                    Caso = objData[indexFinal].Caso
                }

                this.setState(state => ({
                    ...state, ListaPedido: data.datos
                }))

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
            objDevolucion.IdentificacionUsuario = ObjSesion.Usuario.Identificacion
            objDevolucion.NombreCompleto = this.state.DataPaciente.NombrePaciente
            objDevolucion.NombreCama = this.state.DataPaciente.NombreCama
            objDevolucion.Sexo = this.state.DataPaciente.Sexo
            objDevolucion.Edad = this.state.DataPaciente.Edad
            objDevolucion.UnidadFuncional = this.state.DataPaciente.UnidadFuncional
            objDevolucion.CodigoUnidadFuncional = this.props.data.CodigoUnidadFuncional
            objDevolucion.Piso = piso
            objDevolucion.Erp = Erp
            objDevolucion.CodigoErp = this.props.data.CodigoAdministradora
            objDevolucion.NombreCentroAtencion = this.props.data.NombreCentroAtencion
            objDevolucion.CodigoCentroAtencion = this.props.data.CodigoCentroAtencion
            objDevolucion.Pabellon = pabellon
            objDevolucion.IdentificacionPaciente = this.props.data.Identificacion
            objDevolucion.Origen = this.props.data.Origen
            objDevolucion.IdPlan = this.props.data.CodigoPlan
            objDevolucion.NombrePlan = this.props.data.NombrePlan
            objDevolucion.Caso = this.props.data.Caso
            objDevolucion.TipoDocumento = this.props.data.TipoID
            objDevolucion.FechaRegistro =  fechaActual.substr(0,10)+" "+fechaActual.substr(11)+".000Z";;
            objDevolucion.IdPaciente = this.state.DataPaciente.IdPaciente
            if(this.state.ListaMedicamentos.length > 0){
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
                let ArrayPeticion = [];
                for (let i = 0; i < arrayDisensacion.length; i++) {
                    let ObjPeticion = {}
                    ObjPeticion.Caso = this.props.data.Caso
                    ObjPeticion.CodigoPrescripcion = arrayDisensacion[i].CodigoPrescripcion
                    ObjPeticion.FechaDevolucion = new Date()
                    ObjPeticion.IdMovimiento = ""
                    ObjPeticion.IdPaciente = this.props.data.IdPaciente
                    ObjPeticion.IdPrescripcion = arrayDisensacion[i].IdPrescripcion
                    ObjPeticion.IdentificacionUsuario = arrayDisensacion[i].IdentificacionUsuario
                    // ObjPeticion.TipoIdentificacionUsuario
                    ObjPeticion.Modulo = arrayDisensacion[i].CodigoModulo
                    ObjPeticion.Origen = arrayDisensacion[i].Origen
                    ObjPeticion.IdDetallePrescripcion = arrayDisensacion[i].IdDetallePrescripcion
        
                    let objMedicamento = {}
                    if (arrayDisensacion[i].Codigo) {
                        objMedicamento.Codigo = arrayDisensacion[i].Codigo
                    } else {
                        objMedicamento.Codigo = ""
                    }
                    if (arrayDisensacion[i].CodigoCum) {
                        objMedicamento.CodigoCum = arrayDisensacion[i].CodigoCum
                    } else {
                        objMedicamento.CodigoCum = ""
                    }
                    if (arrayDisensacion[i].CodigoCum) {
                        objMedicamento.CodigoCum = arrayDisensacion[i].CodigoCum
                    } else {
                        objMedicamento.CodigoCum = ""
                    }
                    if (arrayDisensacion[i].idGestionSolicitudDetalles) {
                        objMedicamento.idGestionSolicitudDetalles = arrayDisensacion[i].idGestionSolicitudDetalles
                    } else {
                        objMedicamento.idGestionSolicitudDetalles = ""
                    }
                    if (arrayDisensacion[i].IdGestionSolicitudes) {
                        objMedicamento.IdGestionSolicitudes = arrayDisensacion[i].IdGestionSolicitudes
                    } else {
                        objMedicamento.IdGestionSolicitudes = ""
                    }
                    objMedicamento.Nombre = arrayDisensacion[i].Generico
                    objMedicamento.RegistroInvima = arrayDisensacion[i].RegistroInvima
                    objMedicamento.IdDetallePrescripcion = arrayDisensacion[i].IdDetallePrescripcion
                    objMedicamento.Descripcion = arrayDisensacion[i].Posologia
                    objMedicamento.Equivalencia = arrayDisensacion[i].CantidadUnidadEquivalente
                    objMedicamento.Volumen = 0
                    objMedicamento.Tipo = ""
                    objMedicamento.CantidadUnidadEquivalente = arrayDisensacion[i].CantidadUnidadEquivalente
                    objMedicamento.Lote = arrayDisensacion[i].Lote
                    objMedicamento.Costo = arrayDisensacion[i].Costo
                    objMedicamento.CantidadDevolver = arrayDisensacion[i].CantidadDevolver
                    objMedicamento.Producto = arrayDisensacion[i].Producto
                    objMedicamento.CodigoEntrega = arrayDisensacion[i].MovimientoEntrega
                    objMedicamento.IdMovimientoDetalle = arrayDisensacion[i].IdMovDetalle
                    objMedicamento.IdDevolucion = arrayDisensacion[i].IdDevolucion
                    ObjPeticion.lstMedicamentos = [objMedicamento];
                    ArrayPeticion.push(ObjPeticion)
                }
                this.state.objDevolucion = objDevolucion
                this.RealizarPeticion(ArrayPeticion)
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

    RealizarPeticion = ObjData => {
        let ObjJson = {
            "Json": JSON.stringify(ObjData[this.state.Contador])
        }
        let ObjDataPeticion2 = JSON.stringify(ObjJson)
        fetch(ApiSios + '/DevolucionEntrega/', {
            method: 'POST',
            body: ObjDataPeticion2,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                this.state.Contador++;
                if (data.Error == false) {
                    if (ObjData.length > this.state.Contador) {
                        this.RealizarPeticion(ObjData);

                    } else {
                        this.GuradarDevolucion(ObjData);

                    }
                } else {
                    this.state.Contador = this.state.Contador - 1
                    this.AlertaDispensacion(data.Mensaje);
                }

            })
            .catch(err => {
                this.AlertaDispensacion(err.message);
            });
    }

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
        fetch(gsUrlApi + '/farmacia_devoluciones/' + this.state.action + '/', {
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
                    this.EliminarDevoluciones(objDevolucion)
                    
                }
            })
            .catch(err => console.log("err", err));


    }

    EliminarDevoluciones = (ObjData) => {

        fetch(gsUrlApi + '/devoluciones/eliminar/', {
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
        let listaTemp = this.state.ListaPedido;
        let Pendiente = Number(listaTemp[event.target.id].SolicitadoDevolver) 
        if (Pendiente < event.target.value || event.target.value < 0 && event.target.value != "" ) {
            this.AlertaValor()
        } else {
            if (event.target) {
                let listaTemp = this.state.ListaPedido;
                listaTemp[event.target.id].CantidadDevolver = event.target.value
                listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].SolicitadoDevolver - event.target.value
                if (listaTemp[event.target.id].EstadoAprovechamiento === false) {
                    listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento

                } else {
                    listaTemp[event.target.id].Aprovechamiento = ""
                }
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
            }
        }

        // this.setState({Cantidad: event.target.value});
    }

    Cancelar = e => {
        this.props.CancelarDispensacion("cancelar")
    }
    checkedMedicamento = (data, key) => {
        key = key - 1;
        let estado = false;
        let arrayTemp = this.state.ListaMedicamentos;
        let arrayTempSelect = this.state.selected;
        
        for (let i = 0; i < this.state.ListaMedicamentos.length; i++) {
            if (this.state.ListaMedicamentos[i]._id === data._id) {
                estado = true;
                arrayTemp.splice(i, 1)
                arrayTempSelect.splice(i, 1)
                this.setState(state => ({
                    ...state, ListaMedicamentos: arrayTemp
                }))
                this.setState(state => ({
                    ...state, selected: arrayTempSelect
                }))
            }
        }
       
        if (estado === false) {
            this.setState(state => ({
                ...state, UnidadFuncionalImpr: data.NombreUnidadFuncional
            }))  
            this.setState(state => ({
                ...state,CodigoUnidadFuncionalImpr: data.CodigoUnidadFuncional
            }))
            arrayTemp.push(data)
            arrayTempSelect.push(data._id)
            this.setState(state => ({
                ...state, ListaMedicamentos: arrayTemp
            }))
            this.setState(state => ({
                ...state, selected: arrayTempSelect
            }))
        }


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

    DevolucionesSelect = (data) => {
        if (data?.value === null) {
          this.setState((state) => ({
            ...state,
            DevolucionesSelect: "",
          }));
        } else {
            this.setState((state) => ({
                ...state,
                DevolucionesSelect: data,
            })); 
        }
      }

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
                                    <i className="far  fa-user-circle"></i>{this.state.DataPaciente.NombrePaciente}-
                                </div>
                                <div className="">
                                    {this.state.DataPaciente.LogoSexo}
                                </div>
                                -{this.state.DataPaciente.Edad + "  Años"}
                            </div>
                            <div className="col-md-2 row">
                                <div className="font-weight-bold">
                                    Piso:
                                </div>
                                <div className="ml-2">
                                    {piso}
                                </div>
                            </div>
                            <div className="col-md-4 row">
                                <div className="font-weight-bold">
                                    Unidad Funcional:
                                </div>
                                <div className="ml-2">
                                    {UnidadFuncionalIN}
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-3 pl-3 row">
                                <div className="font-weight-bold">
                                    Erp:
                                </div>
                                <div className=" ml-2">
                                    {Erp}
                                </div>
                            </div>
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    Pabellon:
                                </div>
                                <div className=" ml-2">
                                    {pabellon}
                                </div>
                                <i style={{ color: "green" }} className="fas fa-procedures mt-1 ml-4 mr-1">:</i>
                                {this.state.DataPaciente.NombreCama}
                            </div>
                            <div className="col-md-3 row">
                                <div className="font-weight-bold">
                                    Caso:
                                </div>
                                <div className=" ml-2">
                                    {Caso}
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
                                    disabled={this.state.EstadoImprimir ? false  : true}
                                    className="btn btn-success ml-2 cursor-pointer">
                                    <ReactToPrint
                                        id="Impresion"
                                        content={this.state.EstadoImprimir ? (env) =>  this.reactToPrintContent2(env) : ""}
                                        documentTitle="Dispensacion"
                                        onAfterPrint={this.state.EstadoImprimir ? (env) =>  this.handleAfterPrint(env) : ""}
                                        onBeforeGetContent={this.state.EstadoImprimir ?(env) =>  this.handleOnBeforeGetContent2(env) : ""}
                                        onBeforePrint={this.state.EstadoImprimir ? (env) =>  this.handleBeforePrint(env) : ""}
                                        removeAfterPrint
                                        trigger={this.reactToPrintTrigger2}
                                    >  </ReactToPrint>
                                </Button>
                                <div hidden={true}>
                                    <Constancia
                                        ref={(env) => this.setComponentRef2(env)}
                                        UnidadFuncionalImpr={this.state.UnidadFuncionalImpr}
                                        CodigoUnidadFuncionalImpr={this.state.CodigoUnidadFuncionalImpr}
                                        objDatos={this.state.objDevolucion} 
                                    />
                                </div>
                                {this.state.isLoading2 && <p className="indicator">Generando Constancia...</p>} 

                            </div>
                            <label>Filtro :</label>
                            <div className="form-group" style={{minWidth: "400px"}}>
                                
                                <Select
                                id="Prescripciones"
                                name="DevolucionesSelect"
                                style={{minWidth: "400px"}}
                                value={this.state.DevolucionesSelect}
                                onChange={this.DevolucionesSelect}
                                options={this.state.arrayDevoluciones}
                                />
                            </div> 
                            <Button
                                type="button"
                                style={{ height: '80%' }}
                                onClick={() => this.componentDidMount()}
                                className="btn btn-info ml-2 cursor-pointer">
                                Filtrar
                            </Button>

                        </div>
                        <div className="text-right mt-1">
                            <Button
                                type="link"
                                onClick={() => this.Cancelar(this.state.ListaPedido)}
                                 className="btn btn-link ml-2 ">
                                <i class="fa fa-chevron-left"> Atras</i>
                            </Button>
                        </div>
                        
                    </div>


                    <div
                        className="right-panel roe-box-shadow"
                    >

                        <div className="contact-table">
                            {this.state.ListaPedido && this.state.ListaPedido.length ? (
                                <Table hover className="mb-0 border">
                                    <thead className="">
                                        <tr>
                                            <th className=""></th>
                                            <th>Productos</th>
                                            <th>Médico/Enfermera</th>
                                            <th>No. Entrega</th>
                                            <th>Solicitado Devolver</th>
                                            <th>Cant. Devolver</th>
                                            <th>Pendiente</th>
                                            <th>Fecha/Hora Devolución</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {this.state.ListaPedido.map((e, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="pretty p-svg p-curve contact-selection">
                                                            <input
                                                                type="checkbox"
                                                                value={e._id}
                                                                onChange={() => this.checkedMedicamento(e, i)}
                                                                checked={this.state.selected ? this.state.selected.includes(e._id) : false}
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
                                                    <td>{e.Medicamento}</td>
                                                    <td>{e.NombreUsuario}</td>
                                                    <td>{e.MovimientoEntrega}</td>
                                                    <td style={{ width: "100px" }}><input className="form-control" value={e.SolicitadoDevolver} disabled type="text" /></td>
                                                    <td style={{ width: "100px" }}><input className="form-control" id={i} value={e.CantidadDevolver} onChange={this.handleChange} type="Number" /></td>
                                                    <td style={{ width: "100px" }}><input className="form-control" value={e.Pendiente} disabled type="text" /></td>
                                                    <td style={{ width: "150px" }}>
                                                        <div className="">{e.FechaRegistro.substring(0, 10)} Hora: {e.FechaRegistro.substring(11, 16)}</div>
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
