import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import ModalRelacionMedicamneto from "components/RelacionMedicamentoProducto/RelacionMedicamentoProductoForm";
import { compose } from "redux";
import Button from "components/button/Button";
import { Table } from "reactstrap";
import { Ring } from "react-awesome-spinners";
import { gsUrlApi } from "config/configServer"
import { ApiSios } from "config/confiSios"
import SweetAlert from 'react-bootstrap-sweetalert'
import FormModal from "./FormModal"
import Constancia from './PrintDataIndv';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateOutlined from '@material-ui/icons/UpdateOutlined';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from '../Imprimir/Print';
import Icon from '@material-ui/core/Icon';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import "./EstilosDispensaciones.css";
import Select from "react-select";

let piso = '';
let pabellon = '';
let Erp = '';
let IndexMedicamento = ""
let Caso = ""
let IdMedicamento = ""
let CodigoModulo = ""
let NombreModulo = ""
let UnidadFuncionalIN = ""
class RequisicionesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Medicamento: '',
            Cantidad: '',
            Destino: '',
            TotalProductos: '',
            ListaPedido: [],
            handleChange: '',
            handleBlur: '',
            errors: '',
            touched: '',
            values: '',
            submitCount: '',
            isValid: '',
            selected: [],
            listPacientes: [],
            arrayMotivoArchivacion: [
                { Nombre: "DOBLE PRESCRIPCION" },
                { Nombre: "ERROR EN MX Y/O DM" },
                { Nombre: "PACIENTE EQUIVOCADO" },
                { Nombre: "CANTIDAD EQUIVOCADA" },
                { Nombre: "VALOR NO PARAMETRIZADO" },
                { Nombre: "PRODUCTO DESABASTECIDO" },
                { Nombre: "PROBLEMAS DE CARTERA" },
                { Nombre: "NO RECLAMADO (MEDICAMENTO O INSUMO)" },
                { Nombre: "ESTANCIA EQUIVOCADA" }
            ],
            DataPaciente: '',
            selectDrp: false,
            ValueMedicamento: '',
            ListaMedicamentos: [],
            ListaItemMedicamentos: [],
            Preload: false,
            Alerta: false,
            EstadoBorrador: false,
            Alerta2: false,
            arrayBorrador: [],
            EstadoCargueBorrador: false,
            objDisensacion: {},
            Contador: 0,
            action: '',
            ListaRelacionProductos: [],
            Prefijo: '',
            Mascara: '',
            Valor: 0,
            ObjConsecutivo: {},
            IdConsecutivo: "",
            OpenModal2: false,
            EstadoImpresion: false,
            isLoading2: false,
            EstadoGuardado: false,
            EstadoImprimir: false,
            PreloadRelcaion: false,
            Funcionarios: [],
            ArrayEntregados: [],
            Sede: "",
            arrayPrescripciones: [],
            DataUnidades: [],
            EstadoDispensacion: false
        }
    }

    CargarSedes = async () => {

        fetch(gsUrlApi + '/empresa_sedes/listar/5cac12055d717e661ea7b95b', {
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
                this.setState(state => ({
                    ...state,DataSedes: lstDatos
                }))
              
            })
        .catch(err => console.log("err", err));
    };

    async componentDidMount() {
        this.CargarUnidades();
        this.CargarSedes();
        this.setState(state => ({
            ...state, PreloadRelcaion: true
        }))
        this.setState(state => ({
            ...state, EstadoImprimir: false
        }))
        let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
        let Sede = ObjSesion.Usuario.Sede;
        this.setState(state => ({
            ...state, BloqueoDispensacion: ObjSesion?.Usuario?.Rol?.Dispensacion 
        }))
        this.setState(state => ({
            ...state, Sede: Sede.label
        }))
        let Permisos = ObjSesion.Usuario.Rol.Permisos;
        if (!Permisos.includes("8_1")) {
            this.setState(state => ({
                ...state, EstadoGuardado: true
            }))
        }
        let IdPaciente = this.props.values.IdPaciente
        let dataFiltros = this.props.value;
        dataFiltros.IdPaciente = IdPaciente;
        dataFiltros.Sede = Sede.value;
        dataFiltros.IdPrescripcion = this.state.PrescripcionesSelect?.value;

        this.BuscarConsecutivo()
        this.ConsultarBorrador(this.props.data.Identificacion)
        this.setState(state => ({
            ...state, DataPaciente: this.props.values
        }))
        fetch(gsUrlApi + '/prescripciones/listarPorPacientes/', {
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
                    piso = objData[indexFinal].NombrePiso;
                    pabellon = objData[indexFinal].NombrePabellon;
                    Erp = objData[indexFinal].NombreAdministradora
                    Caso = objData[indexFinal].Caso
                    CodigoModulo = objData[indexFinal].CodigoModulo
                    NombreModulo = objData[indexFinal].NombreModulo
                    let CodigoUnidadFuncional = objData[indexFinal].CodigoUnidadFuncional
                    UnidadFuncionalIN = objData[indexFinal].UnidadFuncional
                    for (let i = 0; i < objData.length; i++) {
                        objData[i].Entrega = 0
                        objData[i].Pendiente = objData[i].Cantidad - objData[i].Entrega 
                        objData[i].AprovechamientoSIOS = objData[i].Aprovechamiento
                        objData[i].Aprovechamiento = ""
                        objData[i].EstadoAprovechamiento = true
                        objData[i].Productos = []
                        objData[i].IdPrescripcion = objData[i].IdPrescripcion
                        objData[i].CodigoPrescripcion = objData[i].CodigoPrescripcion
                        objData[i].IdDetallePrescripcion = objData[i].IdDetallePrescripcion
                        objData[i].Origen = objData[i].Origen
                        objData[i].CodigoServicio = objData[i].CodigoServicio
                        objData[i].Estado = "Dispensado"
                        if (objData[i].NoPos == "1") {
                            objData[i].ColorBorder = "#FEC180";
                        }
                        if (objData[i].AprovechamientoSIOS == "true") {
                            objData[i].ColorBorder = "#eba4a4";
                        }
                        
                        const exists = arrayTempP.some(item => item.value === objData[i].IdPrescripcion);
                        if (!exists) {
                            arrayTempP.push({
                                value: objData[i].IdPrescripcion,
                                label: objData[i].IdPrescripcion + " - " + objData[i].CodigoUnidadFuncional + " - " + objData[i].UnidadFuncional,
                            })
                        }

                    }
                    this.setState(state => ({
                        ...state, arrayPrescripciones: arrayTempP,
                    }))
                    this.setState(state => ({
                        ...state, ListaPedido: objData,
                    }))

                    this.setState(state => ({
                        ...state, PreloadRelcaion: false
                    }))
                    let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
                    this.listarBodegaPorSede(CodigoUnidadFuncional, ObjSesion?.Usuario?.Sede?.value)
                } else {
                    this.setState(state => ({
                        ...state, PreloadRelcaion: false
                    }))
                }

            })
            .catch(err => {
                this.setState(state => ({
                    ...state, PreloadRelcaion: false
                }))
            });

    }

    CargarUnidades = async () => {
        fetch(gsUrlApi + "/empresa_unidades/listar/5cac12055d717e661ea7b95b", {
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
                    let objUnidades = {};
                    objUnidades.value = lstDatos[i].Codigo;
                    objUnidades.label = lstDatos[i].Nombre;
                    objUnidades.Codigo = lstDatos[i].Codigo;
                    objUnidades.Empresa = lstDatos[i].Empresa;
                    items.push(objUnidades);
                }
                this.setState((state) => ({
                    ...state,
                    DataUnidades: items,
                }));
            })
            .catch((err) => console.log("err", err));
    };

    listarBodegaPorSede = (CodigoUnidadFuncional, CodigoSede) => {
        fetch(gsUrlApi + '/homologacionBodegasPorSedes/listar', {
            method: 'POST',
            body: JSON.stringify({ CodigoUnidadFuncional: CodigoUnidadFuncional, CodigoSede: CodigoSede }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.datos.length > 0) {
                    let Datos = data?.datos[0];
                    this.setState(state => ({
                        ...state, CodigoBodega: Datos?.CodigoBodega,
                        NombreBodega: Datos?.NombreBodega
                    }))
                }
            })
            .catch(err => console.log("err", err));
    }

    buscarinfomedicamentos = IdData => {
        fetch(ApiSios + "/ConsultarMedicamentos/", {
            method: "POST",
            body: JSON.stringify({
                Filtro: IdData,
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
                let objAcciones = {};
                objAcciones.value = lstDatos[0].Id;
                objAcciones.Atc = lstDatos[0].Codigo;
                objAcciones.label = lstDatos[0].Nombre;
                objAcciones.Forma = lstDatos[0].Forma;
                objAcciones.Concentracion = lstDatos[0].Concentracion;
                objAcciones.Descripcion = lstDatos[0].Descripcion;
                objAcciones.CodMed = lstDatos[0].Id;
                objAcciones.Grupo = lstDatos[0].Grupo;
                items.push(objAcciones);
                this.setState((state) => ({
                    ...state,
                    listamedicamentos: items,
                }));
            })
            .catch((err) => console.log("err", err));
    }

    BuscarConsecutivo = () => {
        fetch(gsUrlApi + '/consecutivos/listar', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.datos.length > 0) {
                    let Datos = data.datos[0];
                    this.setState(state => ({
                        ...state, Prefijo: Datos.Prefijo,
                    }))
                    this.setState(state => ({
                        ...state, Mascara: Datos.Mascara,
                    }))
                    this.setState(state => ({
                        ...state, Valor: Datos.Valor,
                    }))
                    this.setState(state => ({
                        ...state, IdConsecutivo: Datos._id,
                    }))
                }
            })
            .catch(err => console.log("err", err));
    }
    Cancelar = e => {
        this.props.CancelarDispensacion("cancelar")
    }




    Agregar = e => {
        e.preventDefault();
        let obj = {};
        obj.Medicamento = e.target.Medicamento.value;
        obj.Cantidad = e.target.Cantidad.value;
        obj.Destino = e.target.Destino.value;
        const filteredContactlistsTem = this.state.ListaPedido;

        filteredContactlistsTem.splice(0, 0, obj);
        this.setState(state => ({
            ...state, ListaPedido: filteredContactlistsTem
        }))
    };
    SetselectDrp = () => {
        this.setState(state => ({
            ...state, selectDrp: !this.state.selectDrp
        }))
    }

    handleChange = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido;
            listaTemp[event.target.id].Entrega = event.target.value
            listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Cantidad - event.target.value
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

        // this.setState({Cantidad: event.target.value});
    }

    AprovechamientoBorrador = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido;
            if (event.target.checked === true) {
                if (listaTemp[event.target.id].ArrayMedicamentos.Cantidad === 1) {
                    listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento = 1
                    listaTemp[event.target.id].ArrayMedicamentos.Pendiente = 0
                    listaTemp[event.target.id].ArrayMedicamentos.Entrega = 0
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
                } else {
                    if (listaTemp[event.target.id].ArrayMedicamentos.Pendiente < event.target.value || event.target.value < 1) {
                        this.AlertaValor()
                    } else {
                        listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento = listaTemp[event.target.id].ArrayMedicamentos.Pendiente
                        listaTemp[event.target.id].ArrayMedicamentos.Pendiente = listaTemp[event.target.id].ArrayMedicamentos.Pendiente - listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento
                        listaTemp[event.target.id].ArrayMedicamentos.EstadoAprovechamiento = false
                        this.setState(state => ({
                            ...state, ListaPedido: listaTemp
                        }))
                    }
                }

            } else {
                listaTemp[event.target.id].ArrayMedicamentos.Entrega = listaTemp[event.target.id].ArrayMedicamentos.Cantidad
                listaTemp[event.target.id].ArrayMedicamentos.Pendiente = 0
                listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento = ""
                listaTemp[event.target.id].ArrayMedicamentos.EstadoAprovechamiento = true
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
            }

        }
    }
    Aprovechamiento = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido;
            if (event.target.checked === true) {
                if (listaTemp[event.target.id].Cantidad === 1) {
                    listaTemp[event.target.id].Aprovechamiento = 1
                    listaTemp[event.target.id].Pendiente = 0
                    listaTemp[event.target.id].Entrega = 0
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
                } else {
                    if (listaTemp[event.target.id].Pendiente < event.target.value || event.target.value < 1) {
                        this.AlertaValor()
                    } else {
                        listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                        listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento
                        listaTemp[event.target.id].EstadoAprovechamiento = false
                        this.setState(state => ({
                            ...state, ListaPedido: listaTemp
                        }))
                    }

                }

            } else {
                listaTemp[event.target.id].Entrega = listaTemp[event.target.id].Cantidad
                listaTemp[event.target.id].Pendiente = 0
                listaTemp[event.target.id].Aprovechamiento = ""
                listaTemp[event.target.id].EstadoAprovechamiento = true
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
            }

        }
    }

    AgregarMedicamento = data => {
        this.state.ListaItemMedicamentos = data;

    }

    ModificarListaMedicamentos = (event) => {
        if (event) {
            let value = event.target.value
            let Index = event.target.id
            let Name = event.target.name
            this.state.ListaMedicamentos[Index][Name] = value
            for (const iterator of this.state.ListaItemMedicamentos) {
                if (this.state.ListaMedicamentos[Index].Bodega == iterator.Bodega) {
                    iterator[Name] = value;
                }
            }
            this.setState(state => ({
                ...state, ListaMedicamentos: this.state.ListaMedicamentos
            }))
        }
    }

    ConfirmarMedicamento = () => {
        let Cantidad = 0;

        for (let i = 0; i < this.state.ListaItemMedicamentos.length; i++) {
            Cantidad = Cantidad + Number(this.state.ListaItemMedicamentos[i].Cantidad)
        }
        let CantidadUnidadEquivalente = this.state.ListaPedido[IndexMedicamento].CantidadUnidadEquivalente
        let Concentracion = this.state.ListaPedido[IndexMedicamento].Concentracion

        this.setState(state => ({
            ...state, UnidadFuncionalImpr: this.state.ListaPedido[IndexMedicamento].UnidadFuncional
        }))
        this.setState(state => ({
            ...state, CodigoUnidadFuncionalImpr: this.state.ListaPedido[IndexMedicamento].CodigoUnidadFuncional
        }))

        if (CantidadUnidadEquivalente !== 0 && CantidadUnidadEquivalente < 5 && Concentracion < 5) {
            let Resultado = Cantidad % CantidadUnidadEquivalente
            if (Resultado !== 0) {
                this.state.ListaPedido[IndexMedicamento].Productos = []
                this.state.ListaItemMedicamentos = []
                this.AlertaCantidad("El Medicamneto " + IdMedicamento + " - " + this.state.ListaPedido[IndexMedicamento].Generico + " Tiene una cantidad de " + Cantidad + " el cual deja aplicaciones incompletas")
            } else {
                this.state.ListaPedido[IndexMedicamento].Productos = this.state.ListaItemMedicamentos;
                this.state.ListaPedido[IndexMedicamento].CodMed = IdMedicamento;
                this.state.ListaPedido[IndexMedicamento].ColorBorder = "#5fff9e";
                this.state.ListaPedido[IndexMedicamento].Entrega = Cantidad;
                this.state.ListaPedido[IndexMedicamento].Pendiente = this.state.ListaPedido[IndexMedicamento].Cantidad - Cantidad
            }
        } else {
            this.state.ListaPedido[IndexMedicamento].Productos = this.state.ListaItemMedicamentos;
            this.state.ListaPedido[IndexMedicamento].CodMed = IdMedicamento;
            this.state.ListaPedido[IndexMedicamento].ColorBorder = "#5fff9e";
            this.state.ListaPedido[IndexMedicamento].Entrega = Cantidad;
            this.state.ListaPedido[IndexMedicamento].Pendiente = this.state.ListaPedido[IndexMedicamento].Cantidad - Cantidad
        }

        this.setState(state => ({
            ...state, DispensModel: !this.state.DispensModel
        }))
    }

    Guardar = e => {
        e.preventDefault()

        if (this.state.EstadoGuardado === false) {

            var dt = new Date();

            let fechaActual = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`

            let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
            let Sede = ObjSesion.Usuario.Sede;
            let Bodega = ObjSesion.Usuario.Bodega;
            let objDisensacion = {};
            let arrayDisensacion = []
            objDisensacion.Sede = Sede.value
            objDisensacion.CodigoBodegaUsuario = Bodega?.value
            objDisensacion.NombreBodegaUsuario = Bodega?.label
            objDisensacion.UsuarioFarmacia = ObjSesion.Usuario.NombreCompleto
            objDisensacion.IdentificacionUsuario = ObjSesion.Usuario.Identificacion
            objDisensacion.NombreCompleto = this.state.DataPaciente.NombrePaciente
            objDisensacion.NombreCama = this.state.DataPaciente.NombreCama
            objDisensacion.Sexo = this.state.DataPaciente.Sexo
            objDisensacion.Edad = this.state.DataPaciente.Edad
            objDisensacion.FechaPrescripcion = fechaActual.substr(0, 10) + " " + fechaActual.substr(11) + ".000Z";
            objDisensacion.FechaImpresion = fechaActual;
            objDisensacion.UnidadFuncional = this.state.DataPaciente.UnidadFuncional
            objDisensacion.CodigoUnidadFuncional = this.props.data.CodigoUnidadFuncional
            objDisensacion.Piso = piso
            objDisensacion.Erp = Erp
            objDisensacion.CodigoErp = this.props.data.CodigoAdministradora
            objDisensacion.NombreCentroAtencion = this.props.data.NombreCentroAtencion
            objDisensacion.CodigoCentroAtencion = this.props.data.CodigoCentroAtencion
            objDisensacion.Pabellon = pabellon
            objDisensacion.IdentificacionPaciente = this.props.data.Identificacion
            objDisensacion.Origen = this.props.data.Origen
            objDisensacion.IdPlan = this.props.data.CodigoPlan
            objDisensacion.NombrePlan = this.props.data.NombrePlan
            objDisensacion.Caso = this.props.data.Caso
            objDisensacion.TipoDocumento = this.props.data.TipoID
            objDisensacion.FechaRegistro = fechaActual.substr(0, 10) + " " + fechaActual.substr(11) + ".000Z";
            objDisensacion.IdPaciente = this.state.DataPaciente.IdPaciente
            objDisensacion.CodigoModulo = CodigoModulo
            objDisensacion.NombreModulo = NombreModulo
            if (this.state.EstadoCargueBorrador) {
                for (let i = 0; i < this.state.ListaPedido.length; i++) {
                    if (this.state.ListaPedido[i].ArrayMedicamentos) {
                        if (this.state.ListaPedido[i].ArrayMedicamentos.Productos.length > 0) {
                            arrayDisensacion.push(this.state.ListaPedido[i].ArrayMedicamentos)
                        }
                    } else {
                        if (this.state.ListaPedido[i].Productos.length > 0) {
                            arrayDisensacion.push(this.state.ListaPedido[i])
                        }
                    }

                }
            } else {
                for (let i = 0; i < this.state.ListaPedido.length; i++) {
                    if (this.state.ListaPedido[i].Productos.length > 0) {
                        arrayDisensacion.push(this.state.ListaPedido[i])
                    }
                }
            }

            if (this.state.EstadoBorrador) {
                objDisensacion.Borrador = true

            } else {
                objDisensacion.Borrador = false

            }


            objDisensacion.CantidadMedicamentos = arrayDisensacion.length;
            let action = "insertar";
            objDisensacion.ArrayMedicamentos = arrayDisensacion
            if (arrayDisensacion.length === 0) {
                this.AlertaArray()
                return true;
            }
            let hash = {};
            let array = [];
            array = arrayDisensacion.filter(function (current) {
                var exists = !hash[current.NombreUsuario];
                hash[current.NombreUsuario] = true;
                return exists;
            });
            this.setState(state => ({
                ...state, Funcionarios: array
            }))

            if (this.state.EstadoCargueBorrador === true) {
                action = "actualizar";
            }
            if (this.state.EstadoBorrador === true) {
                if (this.state.arrayBorrador.length > 0) {
                    action = "actualizar";
                }
            }
            this.state.action = action;
            this.setState(state => ({
                ...state, Preload: true
            }))
            let ArrayPeticion = [];

            for (let i = 0; i < arrayDisensacion.length; i++) {
                let ObjPeticion = {}
                ObjPeticion.IdPrescripcion = arrayDisensacion[i].IdPrescripcion
                ObjPeticion.IdPaciente = this.props.data.IdPaciente
                ObjPeticion.Caso = arrayDisensacion[i].Caso
                ObjPeticion.InformarEnfermeria = 0
                ObjPeticion.IdMovimiento = ""
                ObjPeticion.Origen = arrayDisensacion[i].Origen
                ObjPeticion.CodigoPrescripcion = arrayDisensacion[i].CodigoPrescripcion
                ObjPeticion.Usuario = arrayDisensacion[i].NombreUsuario
                ObjPeticion.Modulo = arrayDisensacion[i].CodigoModulo
                ObjPeticion.FechaEntrega = new Date()
                ObjPeticion.IdentificacionUsuario = arrayDisensacion[i].IdentificacionUsuario
                ObjPeticion.IdDetallePrescripcion = arrayDisensacion[i].IdDetallePrescripcion


                for (let j = 0; j < arrayDisensacion[i].Productos.length; j++) {
                    let objMedicamento = {}
                    objMedicamento = arrayDisensacion[i].Productos[j]
                    objMedicamento.Id = arrayDisensacion[i].CodMed
                    objMedicamento.IdDetallePrescripcion = arrayDisensacion[i].IdDetallePrescripcion
                    let Diguito = ""
                    if (this.state.Valor && this.state.Mascara) {
                        this.state.Valor = Number(this.state.Valor) + 1;
                        Diguito = this.state.Valor
                    }
                    objMedicamento.CodigoEntrega = this.state.Prefijo + Diguito
                    ObjPeticion.lstMedicamentos = [objMedicamento];
                    ArrayPeticion.push(ObjPeticion)
                }
            }
            let ObjTemp = {}
            ObjTemp.Valor = this.state.Valor
            ObjTemp._id = this.state.IdConsecutivo
            this.setState(state => ({
                ...state, ObjConsecutivo: ObjTemp
            }))
            this.RealizarPeticion(ArrayPeticion)
            this.state.objDisensacion = objDisensacion
        } else {
            this.AlertaGuardado()
        }

        this.setState(state => ({
            ...state, EstadoGuardado: true
        }))

    }
    AlertaCantidad = (Mensaje) => {
        confirmAlert({
            message: Mensaje,
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    }

    AlertaArray = () => {
        confirmAlert({
            message: "No hay Registros Seleccionados!",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    }
    AlertaGuardado = () => {
        confirmAlert({
            message: "El registro ya fue Guardado!",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    }

    ActualizarConsecutivo = () => {
        fetch(gsUrlApi + '/consecutivos/actualizar', {
            method: 'POST',
            body: JSON.stringify(this.state.ObjConsecutivo),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.datos.length > 0) {
                    let Datos = data.datos[0];
                    this.setState(state => ({
                        ...state, Prefijo: Datos.Prefijo,
                    }))
                    this.setState(state => ({
                        ...state, Mascara: Datos.Mascara,
                    }))
                    this.setState(state => ({
                        ...state, Valor: Datos.Valor,
                    }))
                }
            })
            .catch(err => console.log("err", err));
    }

    RealizarPeticion = ObjData => {
        let ObjJson = {
            "Json": JSON.stringify(ObjData[this.state.Contador])
        }
        let ObjDataPeticion2 = JSON.stringify(ObjJson)
        fetch(ApiSios + '/realizarEntrega/', {
            method: 'POST',
            body: ObjDataPeticion2,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {

                if (data.Error == false) {
                    this.state.ArrayEntregados.push(ObjData[this.state.Contador])
                    this.state.Contador++;
                    if (ObjData.length > this.state.Contador) {
                        this.RealizarPeticion(ObjData);
                    } else {
                        this.GuradarDispensacion(ObjData);
                        this.setState(state => ({
                            ...state, EstadoImprimir: true,
                        }))
                    }
                } else {
                    if (data.Status === 501) {
                        this.state.ArrayEntregados.push(ObjData[this.state.Contador])
                        this.state.Contador++;
                        if (ObjData.length > this.state.Contador) {
                            this.RealizarPeticion(ObjData);
                        } else {
                            this.GuradarDispensacion(ObjData);
                            this.setState(state => ({
                                ...state, EstadoImprimir: true,
                            }))
                        }
                    } else {
                        this.AlertaDispensacion(data.Mensaje);

                    }
                }

            })
            .catch(err => this.AlertaDispensacion(err));
    }

    Imprimir = () => {
        this.setState(state => ({
            ...state, EstadoImpresion: !this.state.EstadoImpresion,
        }))
    };

    AlertaDispensacion = Mensaje => {
        if (this.state.Contador === 0) {
            this.setState(state => ({
                ...state, Preload: false
            }))
            this.setState(state => ({
                ...state, objDisensacion: []
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
        } else {
            this.GuradarDispensacionIncompleta(Mensaje);
        }

    };


    GuradarDispensacionIncompleta = (Mensaje) => {
        let objDisensacion = this.state.objDisensacion;
        for (let i = 0; i < objDisensacion.ArrayMedicamentos.length; i++) {
            let ArrayTemp = [];
            for (let j = 0; j < objDisensacion.ArrayMedicamentos[i].Productos.length; j++) {
                let estado = false;
                ArrayTemp = [];
                for (let k = 0; k < this.state.ArrayEntregados.length; k++) {
                    for (let p = 0; p < this.state.ArrayEntregados[k].lstMedicamentos.length; p++) {
                        if (objDisensacion.ArrayMedicamentos[i].Productos[j].Codigo === this.state.ArrayEntregados[k].lstMedicamentos[p].Codigo && objDisensacion.ArrayMedicamentos[i].Productos[j].Lote === this.state.ArrayEntregados[k].lstMedicamentos[p].Lote) {
                            estado = true;
                        }
                    }
                }
                if (estado === true) {
                    ArrayTemp.push(objDisensacion.ArrayMedicamentos[i].Productos[j])
                }

            }
            objDisensacion.ArrayMedicamentos[i].Productos = ArrayTemp;
        }
        this.state.objDisensacion = objDisensacion;
        fetch(gsUrlApi + '/dispensaciones/' + this.state.action + '/', {
            method: 'POST',
            body: JSON.stringify(objDisensacion),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.error) {

                } else {
                    this.EliminarPrescripciones(objDisensacion)
                    this.ActualizarConsecutivo()
                    // if (this.state.EstadoBorrador == false) {

                    // } else { 
                    //     this.AlertaControlError(Mensaje)
                    //  }
                }
            })
            .catch(err => console.log("err", err));


    }


    AlertaControlError = Mensaje => {
        this.setState(state => ({
            ...state, Preload: false
        }))
        this.setState(state => ({
            ...state, objDisensacion: []
        }))
        confirmAlert({
            title: "Error!",
            message: "Dispensación Guardada incompleta : " + Mensaje,
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    };

    GuradarDispensacion = () => {
        let objDisensacion = this.state.objDisensacion;
        fetch(gsUrlApi + '/dispensaciones/' + this.state.action + '/', {
            method: 'POST',
            body: JSON.stringify(objDisensacion),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data.error) {
                    this.AlertaError(data.error.message)
                } else {
                    if (this.state.EstadoBorrador == false) {
                        this.EliminarPrescripciones(objDisensacion)
                        this.ActualizarConsecutivo()
                    } else {
                        this.setState(state => ({
                            ...state, Preload: false
                        }))
                        this.props.OcultarFormulario()
                    }
                }
            })
            .catch(err => {
                this.AlertaError(err)
            });


    }

    AlertaError = Mensaje => {
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
    }
    AlertaBorrador = () => {
        confirmAlert({
            title: "Aviso!",
            message: "¿Desea continuar con el borrador guardado?",
            buttons: [
                {
                    label: "Si",
                    onClick: () => this.onClick(),
                },
                {
                    label: "No",
                    onClick: () => this.onClick2("Click no"),
                }
            ]
        });
    };

    AlertaRelacionGuardada = () => {
        confirmAlert({
            title: "",
            message: "Registro guardado con Exíto",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: "",
                },

            ]
        });
    };
    AlertaRelacion = () => {
        confirmAlert({
            title: "Aviso!",
            message: "Relación de medicamento no encontrada",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: () => this.onClick2(),
                },
                {
                    label: "Crear Relacicón",
                    onClick: () => this.CrearRelacion(),
                }
            ]
        });
    };

    CrearRelacion = () => {
        this.setState(state => ({
            ...state, OpenModal2: true
        }))
    }

    onClick = Datos => {
        let arrayBorrador = this.state.arrayBorrador;
        for (let i = 0; i < arrayBorrador.length; i++) {
            if (arrayBorrador[i].ArrayMedicamentos.Aprovechamiento) {
                arrayBorrador[i].ArrayMedicamentos.EstadoAprovechamiento = false
            } else {
                arrayBorrador[i].ArrayMedicamentos.EstadoAprovechamiento = true
            }
            for (let k = 0; k < this.state.ListaPedido.length; k++) {
                if (Number(arrayBorrador[i].ArrayMedicamentos.IdDetallePrescripcion) === this.state.ListaPedido[k].IdDetallePrescripcion) {
                    arrayBorrador[i].ColorBorder = "#5fff9e";
                    this.state.ListaPedido[k] = arrayBorrador[i];
                    break;
                }
            }

        }

        this.setState(state => ({
            ...state, ListaPedido: this.state.ListaPedido,
        }))
        this.setState(state => ({
            ...state, EstadoCargueBorrador: true
        }))

        // this.selectAction("selectall")

    }
    ListarProductos = (IdDato, index, Nombre) => {
        // this.armarXml();
        this.setState(state => ({
            ...state, PreloadRelcaion: true
        }))

        IndexMedicamento = index
        IdMedicamento = IdDato

        this.setState(state => ({
            ...state, IdMedicamento: IdMedicamento
        }))
        fetch(gsUrlApi + '/medicamentos/listarPorCodMed/' + IdDato + "/1", {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                let lstDatos = data.datos;
                let array = [];
                this.state.ListaRelacionProductos = lstDatos;
                if (lstDatos.length > 0) {
                    for (let i = 0; i < lstDatos[0].Productos.length; i++) {
                        array.push(lstDatos[0].Productos[i].Id)
                    }

                    this.DispensacionToggleModel(array, lstDatos)
                    const result = array.join(",")
                    this.setState(state => ({
                        ...state, ArrayMedicamentoList: result
                    }))
                } else {
                    this.setState(state => ({
                        ...state, PreloadRelcaion: false
                    }))
                    this.buscarinfomedicamentos(IdDato)
                    this.AlertaRelacion()
                }

            })
            .catch(err => console.log("err", err));

    }

    ConsultarBorrador = Data => {
        fetch(gsUrlApi + '/dispensaciones/buscarBorrador/' + Data + "/1", {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                var objData = data.datos;
                if (objData.length > 0) {
                    this.setState(state => ({
                        ...state, arrayBorrador: objData
                    }))
                    this.AlertaBorrador()
                }
            })
            .catch(err => console.log("err", err));

    }
    onClick2 = () => {
        this.setState(state => ({
            ...state, Alerta2: false
        }))
    }
    EliminarPrescripciones = dataDispensacion => {

        fetch(gsUrlApi + '/prescripciones/eliminar/', {
            method: 'POST',
            body: JSON.stringify(dataDispensacion),
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
                        ...state, Preload: false
                    }))
                    this.AlertaRelacionGuardada()
                }
            })
            .catch(err => console.log("err", err));
    }

    ValorAprovechamiento = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido;
            let Pendiente = Number(listaTemp[event.target.id].Pendiente)
            if (listaTemp[event.target.id].Aprovechamiento) {
                Pendiente = Pendiente + Number(listaTemp[event.target.id].Aprovechamiento)
            }
            if (Pendiente < event.target.value || event.target.value < 1) {
                this.AlertaValor()
            } else {
                listaTemp[event.target.id].Aprovechamiento = event.target.value

                if (event.target.value) {
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Cantidad - (parseInt(listaTemp[event.target.id].Aprovechamiento) + parseInt(listaTemp[event.target.id].Entrega))
                } else {
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Cantidad - listaTemp[event.target.id].Entrega
                }
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
            }

        }
    }

    AlertaValor = () => {
        confirmAlert({
            message: "El valor total supera al solicitado!",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: '',
                }
            ]
        });
    }
    ValorAprovechamientoBorrador = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido;
            // validacion Cantidad---------------------

            if (listaTemp[event.target.id].ArrayMedicamentos.Pendiente < event.target.value || event.target.value < 1) {
                this.AlertaValor()
            } else {
                listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento = event.target.value
                if (event.target.value) {
                    listaTemp[event.target.id].ArrayMedicamentos.Pendiente = listaTemp[event.target.id].ArrayMedicamentos.Cantidad - (parseInt(listaTemp[event.target.id].ArrayMedicamentos.Aprovechamiento) + parseInt(listaTemp[event.target.id].ArrayMedicamentos.Entrega))
                } else {
                    listaTemp[event.target.id].ArrayMedicamentos.Pendiente = listaTemp[event.target.id].ArrayMedicamentos.Cantidad - listaTemp[event.target.id].ArrayMedicamentos.Entrega
                }
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
            }
            // -------

        }
    }
    DispensacionToggleModel = (array, lstDatos) => {

        this.setState(state => ({
            ...state, PreloadRelcaion: false
        }))

        //codigo para error de conexion --------------------------------
        // var array2 = []
        // for (let i = 0; i < lstDatos[0].Productos.length; i++) {
        //     lstDatos[0].Productos[i].RegistroInvima = "REG001"
        //     lstDatos[0].Productos[i].vencimientoinvima = ""
        //     lstDatos[0].Productos[i].CodigoCum = ""
        //     lstDatos[0].Productos[i].Lote = "FSA20415"
        //     lstDatos[0].Productos[i].FechaVencimiento = "2024-12-31"
        //     lstDatos[0].Productos[i].Stock = "100"
        //     array2.push(lstDatos[0].Productos[i])
        // }
        // this.state.ListaMedicamentos = array2
        // this.setState(state => ({
        //     ...state, ValueMedicamento: this.state.ListaPedido[IndexMedicamento]
        // }))
        // if (this.state.ListaPedido[IndexMedicamento].Productos) {
        //     this.setState(state => ({
        //         ...state, MedicamentoZeus: this.state.ListaPedido[IndexMedicamento].Productos
        //     }))
        // }
        // this.setState(state => ({
        //     ...state, PreloadRelcaion: false
        // }))
        // this.setState(state => ({
        //     ...state, DispensModel: !this.state.DispensModel
        // }))
        //----------------------------------
        if (array) {
            array = array.toString()
            if (array) {

                fetch(ApiSios + '/consultarStockMedicamentos', {
                    method: 'POST',
                    body: JSON.stringify({ "Filtro": array, "Software": "ZEUS", "Parametro1": this.state.CodigoBodega }),
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json',
                    }
                }).then(res => res.json())
                    .then(data => data)
                    .then((data) => {
                        this.state.MedicamentoZeus = []
                        if (data.error || data.Datos == undefined) {
                            this.setState(state => ({
                                ...state, PreloadRelcaion: false
                            }))

                        } else {
                            let LstDatos = data.Datos
                            LstDatos = LstDatos.sort(function (a, b) {
                                return a.FechaVencimiento - b.FechaVencimiento;
                            });
                            this.setState(state => ({
                                ...state, ValueMedicamento: this.state.ListaPedido[IndexMedicamento]
                            }))
                            this.state.ListaMedicamentos = LstDatos
                            if (this.state.EstadoCargueBorrador) {
                                if (this.state.ListaPedido[IndexMedicamento].ArrayMedicamentos) {
                                    if (this.state.ListaPedido[IndexMedicamento].ArrayMedicamentos.Productos) {
                                        this.setState(state => ({
                                            ...state, MedicamentoZeus: this.state.ListaPedido[IndexMedicamento].ArrayMedicamentos.Productos
                                        }))
                                    }
                                } else {
                                    if (this.state.ListaPedido[IndexMedicamento].Productos) {
                                        this.setState(state => ({
                                            ...state, MedicamentoZeus: this.state.ListaPedido[IndexMedicamento].Productos
                                        }))
                                    }
                                }
                                this.setState(state => ({
                                    ...state, DispensModel: !this.state.DispensModel
                                }))
                                this.setState(state => ({
                                    ...state, PreloadRelcaion: false
                                }))
                            } else {
                                if (this.state.ListaPedido[IndexMedicamento].Productos) {
                                    this.setState(state => ({
                                        ...state, MedicamentoZeus: this.state.ListaPedido[IndexMedicamento].Productos
                                    }))
                                }
                                this.setState(state => ({
                                    ...state, PreloadRelcaion: false
                                }))
                                this.setState(state => ({
                                    ...state, DispensModel: !this.state.DispensModel
                                }))
                            }
                        }
                    })
                    .catch(err => console.log("err", err));
            } else {
                this.setState(state => ({
                    ...state, DispensModel: !this.state.DispensModel
                }))
                this.setState(state => ({
                    ...state, PreloadRelcaion: false
                }))
            }
        } else {
            this.setState(state => ({
                ...state, DispensModel: !this.state.DispensModel
            }))
            this.setState(state => ({
                ...state, PreloadRelcaion: false
            }))
        }

    };

    ActivarBorrador = () => {
        this.setState(state => ({
            ...state, EstadoBorrador: !this.state.EstadoBorrador
        }))
    }

    handleFormSubmit = (data) => {
        fetch(gsUrlApi + "/medicamentos/insertar/", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => data)
            .then((data) => {
                if (data.roles.length > 0) {
                    this.setState(state => ({
                        ...state, OpenModal2: false
                    }))
                    this.AlertaRelacionGuardada()

                }
            })
            .catch((err) => console.log("err", err));
    };


    actiononButton = () => {
        this.setState(state => ({
            ...state, OpenModal2: false
        }))

    }

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

    QuitarMedicamento = index => {
        this.state.ListaPedido[index].Productos = [];
        this.state.ListaPedido[index].ColorBorder = " ";
        this.state.ListaPedido[index].Entrega = 0;
        this.state.ListaPedido[index].Pendiente = this.state.ListaPedido[index].Cantidad
        this.setState(state => ({}))
    }

    CerrarModal = () => {
        this.state.ListaPedido[IndexMedicamento].Productos = []
        this.state.ListaItemMedicamentos = []
        this.setState(state => ({
            ...state, DispensModel: false
        }))
    }
    CerrarModalArchivacion = () => {
        this.setState(state => ({
            ...state, ModelEliminacion: false
        }))
    }
    EliminarMedicamento = (data) => {
        this.setState(state => ({
            ...state, ModelEliminacion: true
        }))
        this.setState(state => ({
            ...state, objetoEliminacion: data
        }))
    }



    procesarMedicamentoEliminar = () => {
        let medicamento = this.state.objetoEliminacion;
        let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
        let NombreUsuario = ObjSesion.Usuario.NombreCompleto;
        let objMedicamento = medicamento
        objMedicamento.UsuarioEliminacion = NombreUsuario
        objMedicamento.FechaEliminacion = new Date()
        objMedicamento.MotivoEliminacion = this.state.MotivoArchivacion
        objMedicamento.objetivo = this.state.objetivo
        let IdMecicamento = medicamento._id

        let nuevoArray = this.state.ListaPedido.filter((elemento) => elemento._id !== IdMecicamento);
        this.setState(state => ({
            ...state, ListaPedido: nuevoArray,
        }))

        fetch(gsUrlApi + '/prescripciones/eliminarPorId', {
            method: 'POST',
            body: JSON.stringify(objMedicamento),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Accept: 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => data)
            .then(data => {
                fetch(gsUrlApi + '/prescripcioneslogs/insertar', {
                    method: 'POST',
                    body: JSON.stringify(objMedicamento),
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        Accept: 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => data)
                    .then(data => {
                        this.CerrarModalArchivacion();
                        confirmAlert({
                            message: "Eliminado exitosamente",
                            buttons: [
                                {
                                    label: "Aceptar",
                                    onClick: '',
                                }
                            ]
                        });
                    })
                    .catch(err => console.log('err', err));

            })
            .catch(err => console.log('err', err));


    }

    onInputchangeMotivo = data => {
        if (data) {
            let name = data.target.name;
            let value = data.target.value;
            this.setState(state => ({
                ...state, [name]: value,
            }));
        }
    }

    PrescripcionesSelect = (data) => {
        if (data?.value === null) {
            this.setState((state) => ({
                ...state,
                PrescripcionesSelect: "",
            }));
        } else {
            this.setState((state) => ({
                ...state,
                PrescripcionesSelect: data,
            }));
        }
    }

    UnidadFuncionalSelect = (data) => {
        if (data?.value === null) {
            this.setState((state) => ({
                ...state,
                UnidadFuncionalSelect: "",
            }));
        } else {
            this.setState((state) => ({
                ...state,
                UnidadFuncionalSelect: data,
            }));
        }
    }

    ActualizarUnidad = () => {
        if (!this.state.PrescripcionesSelect?.value) {
            alert('Debe filtrarpor una prescripcion antes de actualizar')
            return true;
        }

        fetch(gsUrlApi + '/prescripciones/ActualizarUnidad/', {
            method: 'POST',
            body: JSON.stringify({ IdPrescripcion: this.state.PrescripcionesSelect?.value, unidad: this.state.UnidadFuncionalSelect }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                this.componentDidMount()
            })
            .catch(err => console.log("err", err));
    }

    consultarEstadoPaciente = async () => {

        fetch("http://10.10.1.15/ArmadoCuentas/api/ArmadoCuentas/obtenerDatosSios", {
            method: 'POST',
            body: JSON.stringify({"Parametro1":Caso,"Consulta":"Farmacia_ConsultaEstadoCaso"}),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': "Basic " + btoa("caminosips" + ":" + "caminos1_xxxx")
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                if (data?.Datos?.length > 0) {
                    let mensaje = "El paciente"
                    let DataUnidades = null;
                    for (const iterator of this.state.DataUnidades) {
                        if(iterator?.value == data?.Datos[0].UnidadFuncionalActual){
                            DataUnidades = iterator?.label;
                            break
                        }
                    }
                    if (data?.Datos[0].EstadoCaso == true) {
                        mensaje = mensaje  + " aun se encuentra en el centro de atención, La unidad funcional actual es " + DataUnidades + " Sede: " + this.state.DataSedes?.find(dt => dt.Codigo?.toString() === data?.Datos[0]?.CentroAtencion?.toString())?.Nombre || ''
                    } else {
                        mensaje = mensaje  + " ya NO se encuentra en el centro de atención, La ultima unidad funcional del paciente fue " + DataUnidades
                    }
                    confirmAlert({
                        title: "Información",
                        message: mensaje,
                        buttons: [
                            {
                                label: "Aceptar",
                                onClick: '',
                            }
                        ]
                    });
                }
            })
            .catch(err => console.log("err", err));
        
    }

    render() {
        return (
            <div className="" >
                <SweetAlert
                    title="Desa continuar con el borrador!"
                    onConfirm={this.onClick2}
                    show={this.state.Alerta2}
                />
                <Modal
                    centered
                    isOpen={this.state.Preload}
                    fade={false}
                    className={this.props.className}
                    style={{ maxWidth: "700px" }}
                >
                    <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                        <h3 className="mt-5 pt-3 text-white">Confirmando Dispensación...</h3></div>
                </Modal>

                <Modal
                    centered
                    isOpen={this.state.PreloadRelcaion}
                    fade={false}
                    className={this.props.className}
                    style={{ maxWidth: "300px" }}
                >
                    <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                        <h3 className="mt-5 pt-3 text-white">Cargando...</h3></div>


                </Modal>

                <Modal
                    centered
                    isOpen={this.state.OpenModal2}
                    fade={false}
                    className={this.props.className}
                    style={{ maxWidth: "850px" }}
                >
                    <ModalRelacionMedicamneto
                        listamedicamentos={this.state.listamedicamentos}
                        actiononButton={() => this.actiononButton()}
                        handleFormSubmit={data => this.handleFormSubmit(data)}
                    />

                </Modal>


                <form onSubmit={this.Guardar}>
                    <div style={{ padding: "15px" }}>
                        <div className="row mb-2">
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

                        <div className="row mt-3 mb-2">
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
                                <div className=" ml-2 mr-2">
                                    {pabellon}
                                </div>
                                <i style={{ color: "green" }} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>
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
                        <div className="row  col-md-11">
                            <div className="ml-2 mr-2">
                                <Button
                                    type="btn"
                                    style={{ height: '80%', cursor: "pointer" }}
                                    onClick={() => this.ActivarBorrador()}
                                    disabled="true"
                                    className="btn btn-warning ml-2 cursor-pointer">
                                    Guardar borrador
                                </Button>
                            </div>
                            <div className=" mr-4">
                            {this.state.BloqueoDispensacion
                                ?""
                                : <Button
                                    type="submit"
                                    style={{ height: '80%' }}
                                    disabled={this.state.EstadoGuardado}
                                    // onClick={() => actiononButton("nuevo")}
                                    className="btn btn-success ml-2 cursor-pointer">
                                    Confirmar dispensación
                                </Button> }
                            </div>

                            <div>

                                <Button
                                    type="button"
                                    style={{ height: '80%' }}
                                    for="Impresion"
                                    disabled={this.state.EstadoImprimir ? false : true}
                                    className="btn btn-success mx-2 cursor-pointer">
                                    <ReactToPrint
                                        id="Impresion"
                                        content={this.state.EstadoImprimir ? this.reactToPrintContent2 : ""}
                                        documentTitle="Dispensacion"
                                        onAfterPrint={this.state.EstadoImprimir ? this.handleAfterPrint : ""}
                                        onBeforeGetContent={this.state.EstadoImprimir ? this.handleOnBeforeGetContent2 : ""}
                                        onBeforePrint={this.state.EstadoImprimir ? this.handleBeforePrint : ""}
                                        removeAfterPrint
                                        trigger={this.reactToPrintTrigger2}
                                    >  </ReactToPrint>
                                </Button>
                                <div hidden={true}>
                                    <Constancia
                                        ref={this.setComponentRef2}
                                        UnidadFuncionalImpr={this.state.UnidadFuncionalImpr}
                                        CodigoUnidadFuncionalImpr={this.state.CodigoUnidadFuncionalImpr}
                                        objDatos={this.state.objDisensacion}
                                        Funcionarios={this.state.Funcionarios}
                                        DataPaciente={this.state.DataPaciente}
                                    />
                                </div>
                                {this.state.isLoading2 && <p className="indicator">Generando Constancia...</p>}

                            </div>
                            <div className="form-group" style={{ minWidth: "240px" }}>

                                <Select
                                    id="Prescripciones"
                                    name="PrescripcionesSelect"
                                    style={{ minWidth: "240px" }}
                                    value={this.state.PrescripcionesSelect}
                                    onChange={this.PrescripcionesSelect}
                                    options={this.state.arrayPrescripciones}
                                />
                            </div>
                            <Button
                                type="button"
                                style={{ height: '80%' }}
                                onClick={() => this.componentDidMount()}
                                className="btn btn-info mx-2 cursor-pointer">
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                style={{ height: '80%' }}
                                onClick={() => this.consultarEstadoPaciente()}
                                className="btn btn-info mx-2 cursor-pointer">
                                Consultar Estado Paciente
                            </Button>
                            {/* <div className="form-group" style={{minWidth: "240px"}}>
                                <Select
                                id="UnidadFuncional"
                                name="UnidadFuncionalSelect"
                                style={{minWidth: "240px"}}
                                value={this.state.UnidadFuncionalSelect}
                                onChange={this.UnidadFuncionalSelect}
                                options={this.state.DataUnidades}
                                />
                            </div> 
                            <Button
                                type="button"
                                style={{ height: '80%' }}
                                onClick={() => this.ActualizarUnidad()}
                                className="btn btn-info ml-2 cursor-pointer">
                                <UpdateOutlined />
                            </Button> */}
                        </div>
                        <div className="text-right mt-1">
                            <Button
                                type="link"
                                onClick={() => this.Cancelar()}
                                className="btn btn-link ml-2 ">
                                <i className="fa fa-chevron-left"> Atras</i>
                            </Button>
                        </div>
                    </div>


                    <div className="right-panel roe-box-shadow">

                        <div className="contact-table">
                            {this.state.ListaPedido && this.state.ListaPedido.length ? (
                                <Table hover className="mb-0 border">
                                    <thead className="">
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Medicamento</th>
                                            <th>Unidad Funcional</th>
                                            <th>Médico/Enfermera</th>
                                            <th>Solicitado</th>
                                            <th>Entrega</th>
                                            <th>Pendiente</th>
                                            {this.state.BloqueoDispensacion
                                                            ?""
                                                            :  <th></th>}
                                            <th>Aprovecha..</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {this.state.ListaPedido.map((e, i) => {
                                            return (
                                                <tr key={i} style={{ backgroundColor: e.ColorBorder }}>
                                                    <td style={{ width: "120px" }}>
                                                        <div className="">{e.FechaRegistro.substring(0, 10)} Hora: {e.FechaRegistro.substring(11, 16)}</div>
                                                        <div className="">{"Tipo: "}
                                                            {e.Pedido24horas == "true" ? <label className="font-weight-bold" style={{ color: "#DC5B00" }}>24hora</label> : <label className="font-weight-bold">Normal</label>}
                                                        </div>
                                                    </td>
                                                    <td>{e.CodigoServicio + " - "}{e.ArrayMedicamentos ? e.ArrayMedicamentos.Generico : e.Medicamento} <div><div className="font-weight-bold">{"Posología: "}</div>{e.ArrayMedicamentos ? e.ArrayMedicamentos.Posologia.replace(e.ArrayMedicamentos.Medicamento, '') : e.Posologia.replace(e.Medicamento, '')}</div></td>
                                                    <td>{e.ArrayMedicamentos ? e.ArrayMedicamentos.NombreUnidadFuncional : e.NombreUnidadFuncional}</td>
                                                    <td>{e.ArrayMedicamentos ? e.ArrayMedicamentos.NombreUsuario : e.NombreUsuario}</td>
                                                    <td className="text-center" ><input className="form-control" disabled value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Cantidad : e.Cantidad} type="text" /></td>
                                                    <td><input className="form-control" id={i} value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Entrega : e.Entrega} disabled onChange={this.handleChange} type="number" /></td>
                                                    <td className="text-center" ><input className="form-control" disabled value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Pendiente : e.Pendiente} type="text" /></td>
                                                    {this.state.BloqueoDispensacion
                                                            ?""
                                                            :  <td className="text-center"><i className="far fa-2x fa-hand-point-up cursor-pointer" disabled="true" onClick={e.ArrayMedicamentos 
                                                        ? () => this.ListarProductos(e.ArrayMedicamentos.CodigoServicio, i, e.ArrayMedicamentos.Generico) 
                                                        : () => this.ListarProductos(e.CodigoServicio, i, e.Generico)}></i></td>}
                                                    <td className="text-center" style={{ minWidth: "151px" }}>
                                                        <div className="row" >
                                                            <input className="form-control ml-3" style={{ width: "40%" }} id={i} onChange={e.ArrayMedicamentos ? this.ValorAprovechamientoBorrador : this.ValorAprovechamiento} disabled={e.ArrayMedicamentos ? e.ArrayMedicamentos.EstadoAprovechamiento : e.EstadoAprovechamiento} value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Aprovechamiento : e.Aprovechamiento} type="number" />
                                                            <div className=" ml-2 mt-3 pretty cursor-pointer p-switch p-fill" >
                                                                <input type="checkbox" className="cursor-pointer" id={i} onChange={e.ArrayMedicamentos ? this.AprovechamientoBorrador : this.Aprovechamiento} />
                                                                <div className="state cursor-pointer">
                                                                    <label></label>
                                                                </div>
                                                            </div>
                                                            {e.ArrayMedicamentos
                                                                ? <> {e.ArrayMedicamentos.Entrega !== 0
                                                                    ? <div className="btn ml-1 mt-1" style={{ padding: "1px" }}><i className="fas m-1 text-danger fa-eraser cursor-pointer" style={{ fontSize: "20px" }} disabled="true" onClick={() => this.QuitarMedicamento(i)}></i></div>
                                                                    : ""}
                                                                </>
                                                                : <>{e.Entrega !== 0
                                                                    ? <div className="btn ml-1 mt-1" style={{ padding: "1px" }}><i className="fas m-1 text-danger fa-eraser cursor-pointer" style={{ fontSize: "20px" }} disabled="true" onClick={() => this.QuitarMedicamento(i)}></i></div>
                                                                    : ""}
                                                                </>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td style={{ minWidth: "1px", paddingRight: "0px", paddingLeft: "0px" }}>
                                                        <div className="btn ml-1 mt-1">
                                                            <span
                                                                class="material-symbols-outlined text-danger"
                                                                onClick={() => this.EliminarMedicamento(e)}
                                                            >
                                                                <DeleteIcon />
                                                            </span></div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center no-found-message">
                                    <br /><br /><br /><br />
                                    <h3>Datos No Encontrados....</h3>
                                </div>
                            )}
                            {/* </Scrollbars> */}
                        </div>
                    </div>
                    <Modal
                        centered
                        isOpen={this.state.DispensModel}
                        fade={false}
                        toggle={this.DispensacionToggleModel}
                        className={this.props.className}
                        style={{ maxWidth: "80%" }}
                    >
                        <ModalHeader >
                            <span>{this.state.ValueMedicamento.Medicamento}</span>

                        </ModalHeader>
                        <ModalBody>
                            <FormModal
                                data={this.props.values.IdPaciente}
                                handleFormSubmit={data => this.handleFormSubmit(data)}
                                ListaMedicamentos={this.state.ListaMedicamentos}
                                ModificarListaMedicamentos={(data) => this.ModificarListaMedicamentos(data)}
                                ListaRelacionProductos={this.state.ListaRelacionProductos}
                                DatosMedicamentosZeus={this.state.MedicamentoZeus}
                                AgregarMedicamento={data => this.AgregarMedicamento(data)}
                                Cantidad={this.state.ValueMedicamento.Cantidad}
                            />
                            <div className="row">
                                <div className="col-md-6">
                                    <span>Solicitados: ({this.state.ValueMedicamento.Cantidad}) </span>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div style={{ width: '100%', display: 'flex', textAlign: 'left', alignItems: 'left' }}>
                                <lable >Sede: {this.state.Sede} , UnidadFuncional: {this.props.data.CodigoUnidadFuncional} - {this.state.DataPaciente.UnidadFuncional}, Bodega: {this.state.CodigoBodega} - {this.state.NombreBodega},  IdArticulo :({this.state.ArrayMedicamentoList})</lable>
                            </div>
                            <div className="row">
                                <i
                                    type="btn"
                                    style={{ height: '80%' }}
                                    onClick={() => this.CerrarModal()}
                                    className="btn btn-danger ml-2 cursor-pointer">
                                    Cancelar
                                </i>
                                <Button
                                    type="btn"
                                    style={{ height: '80%' }}
                                    onClick={() => this.ConfirmarMedicamento()}
                                    className="btn btn-success ml-2 cursor-pointer">
                                    Confirmar
                                </Button>
                            </div>

                        </ModalFooter>
                    </Modal>
                    <Modal
                        centered
                        isOpen={this.state.ModelEliminacion}
                        fade={false}
                        className={this.props.className}
                        style={{ maxWidth: "750px" }}
                    >
                        <ModalHeader >
                            <span>{"Archivación de prescripción"}</span>

                        </ModalHeader>
                        <ModalBody>
                            <div className="col-md-12">
                                <label>Motivo de Archivación</label>
                                <select
                                    className="form-control react-form-input"
                                    style={{ width: "100%" }}
                                    id="MotivoArchivacion"
                                    name="MotivoArchivacion"
                                    value={this.state.MotivoArchivacion}
                                    onChange={this.onInputchangeMotivo}

                                >
                                    <option value="">Seleccionar...</option>
                                    {this.state.arrayMotivoArchivacion.map((e, key) => {
                                        return <option key={key} value={e.Nombre}>{e.Nombre}</option>;
                                    })}
                                </select>
                                <label className="mt-3">Objetivo</label>
                                <input className="form-control react-form-input"
                                    style={{ width: "100%" }}
                                    id="objetivo"
                                    name="objetivo" onChange={this.onInputchangeMotivo}></input>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="row">
                                <i
                                    type="btn"
                                    style={{ height: '80%' }}
                                    onClick={() => this.CerrarModalArchivacion()}
                                    className="btn btn-danger ml-2 cursor-pointer">
                                    Cancelar
                                </i>
                                <Button
                                    type="btn"
                                    style={{ height: '80%' }}
                                    onClick={() => this.procesarMedicamentoEliminar()}
                                    className="btn btn-success ml-2 cursor-pointer">
                                    Si, Archivar
                                </Button>
                            </div>

                        </ModalFooter>
                    </Modal>
                </form>
            </div>
        )

    }

}

export default compose(enhancer)(RequisicionesForm);
