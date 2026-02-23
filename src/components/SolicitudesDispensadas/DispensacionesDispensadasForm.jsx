import React from "react";
import enhancer from "components/SolicitudesDispensadas/DispensacionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import { Table } from "reactstrap";
import { Ring } from "react-awesome-spinners";
import { gsUrlApi } from "config/configServer"
import { ApiSios } from "config/confiSios"
import ReactToPrint from "react-to-print";
import Constancia from "./PrintDataIndv";
import SweetAlert from 'react-bootstrap-sweetalert'
import { ComponentToPrint } from "../Imprimir/Print";
import FormModal from "./FormModal"
import Icon from "@material-ui/core/Icon";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
let piso = '';
let pabellon = '';
let Erp = '';
let IndexMedicamento = ""
let fechaActual = ""
class RequisicionesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Medicamento: '',
            Cantidad: '',
            Destino: '',
            TotalProductos: '',
            ListaPedido: {},
            handleChange: '',
            handleBlur: '',
            errors: '',
            touched: '',
            values: '',
            submitCount: '',
            isValid: '',
            selected: [],
            listPacientes: [],
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
        }
    }

    async componentDidMount() {
        let fecha = new Date(); //Fecha actual
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear();
        if (dia < 10) {
            dia = '0' + dia; //agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = '0' + mes //agrega cero si el menor de 10
        }
        fechaActual = +ano + "-" + mes + "-" + dia;
        if (this.props.data) {
            this.setState(state => ({
                ...state, ListaPedido: this.props.data
            }))
        }
        fetch(gsUrlApi + '/solicitudes_requisiciones/listar/5cac12055d717e661ea7b95b', {
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
                for (let i = 0; i < objData.length; i++) {
                    for (let k = 0; k < objData[i].ArrayMedicamentos.length; k++) {
                        objData[i].ArrayMedicamentos[k].Entrega = 0
                        objData[i].ArrayMedicamentos[k].Pendiente = objData[i].ArrayMedicamentos[k].Cantidad
                        objData[i].ArrayMedicamentos[k].Aprovechamiento = ""
                        objData[i].ArrayMedicamentos[k].EstadoAprovechamiento = true
                        objData[i].ArrayMedicamentos[k].Productos = []
                        objData[i].ArrayMedicamentos[k].Estado = "Dispensado"
                    }
                }
                this.setState(state => ({
                    ...state, ListaPedidos: objData
                }))
            })
            .catch(err => console.log("err", err));
    }

    Cancelar = e => {
        this.props.CancelarDispensacion("cancelar")
    }


    checkedMedicamento = e => {
        const selectedTem = this.state.selected ? this.state.selected : [];
        if (selectedTem.includes(e.target.value)) {
            let index = selectedTem.indexOf(e.target.value);
            if (index > -1) {
                selectedTem.splice(index, 1);
            }
            this.setState(state => ({
                ...state, selected: null,
                ...state, selected: selectedTem
            }))
        } else {
            selectedTem.push(e.target.value);
            this.setState(state => ({
                ...state, selected: null,
                ...state, selected: selectedTem
            }))
        }
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
    dleChange = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
            listaTemp[event.target.id].Entrega = event.target.value
            listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Cantidad - event.target.value
            if (listaTemp[event.target.id].EstadoAprovechamiento === false) {
                listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento

            } else {
                listaTemp[event.target.id].Aprovechamiento = ""
            }
            this.state.ListaPedido.ArrayMedicamentos = listaTemp;
            this.setState(state => ({
                ...state, ListaPedido: this.state.ListaPedido
            }))
        }

        // this.setState({Cantidad: event.target.value});
    }

    AprovechamientoBorrador = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
            if (event.target.checked === true) {
                if (listaTemp[event.target.id].Cantidad === 1) {
                    listaTemp[event.target.id].Aprovechamiento = 1
                    listaTemp[event.target.id].Pendiente = 0
                    listaTemp[event.target.id].Entrega = 0
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
                } else {
                    listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento
                    listaTemp[event.target.id].EstadoAprovechamiento = false
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
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

    Aprovechamiento = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
            if (event.target.checked === true) {
                if (listaTemp[event.target.id].Cantidad === 1) {
                    listaTemp[event.target.id].Aprovechamiento = 1
                    listaTemp[event.target.id].Pendiente = 0
                    listaTemp[event.target.id].Entrega = 0
                    this.state.ListaPedido.ArrayMedicamentos = listaTemp;
                    this.setState(state => ({
                        ...state, ListaPedido: this.state.ListaPedido
                    }))
                } else {
                    listaTemp[event.target.id].Aprovechamiento = listaTemp[event.target.id].Pendiente
                    listaTemp[event.target.id].Pendiente = listaTemp[event.target.id].Pendiente - listaTemp[event.target.id].Aprovechamiento
                    listaTemp[event.target.id].EstadoAprovechamiento = false
                    this.state.ListaPedido.ArrayMedicamentos = listaTemp;
                    this.setState(state => ({
                        ...state, ListaPedido: this.state.ListaPedido
                    }))
                }

            } else {
                listaTemp[event.target.id].Entrega = listaTemp[event.target.id].Cantidad
                listaTemp[event.target.id].Pendiente = 0
                listaTemp[event.target.id].Aprovechamiento = ""
                listaTemp[event.target.id].EstadoAprovechamiento = true
                this.state.ListaPedido.ArrayMedicamentos = listaTemp;
                this.setState(state => ({
                    ...state, ListaPedido: this.state.ListaPedido
                }))
            }

        }
    }

    AgregarMedicamento = data => {
        this.state.ListaItemMedicamentos = data;
    }
    ConfirmarMedicamento = () => {
        this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Productos = this.state.ListaItemMedicamentos;
        this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].ColorBorder = "#5fff9e";
        let Cantidad = 0;
        for (let i = 0; i < this.state.ListaItemMedicamentos.length; i++) {
            Cantidad = Cantidad + Number(this.state.ListaItemMedicamentos[i].Cantidad)

        }
        this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Entrega = Cantidad;
        this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Pendiente = this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Cantidad - Cantidad
        this.setState(state => ({
            ...state, DispensModel: !this.state.DispensModel
        }))


    }

    Guardar = e => {
        e.preventDefault()
        let objDisensacion = {};
        let arrayDisensacion = []
        let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
        let Sede = ObjSesion.Usuario.Sede;
        objDisensacion.Sede = Sede.value
        objDisensacion.Usuario = this.state.ListaPedido.Usuario;
        objDisensacion.Observaciones = this.state.ListaPedido.Observaciones;
        objDisensacion.Destino = this.state.ListaPedido.SedeDestino;
        objDisensacion.FechaRegistroSolicitudRequisicion = this.state.ListaPedido.Fecha;
        objDisensacion.txtFechaRegistroSolicitudRequisicion = this.state.ListaPedido.txtFecha;
        objDisensacion.FechaRegistroDispensacion = fechaActual;
        objDisensacion.txtFechaRegistroDispensacion = fechaActual.substring(0, 10);
        objDisensacion.Unidades = this.state.ListaPedido.Unidades;
        objDisensacion.Estado = "Dispensado";

        // objDisensacion.ArrayMedicamentos = this.state.ArrayMedicamentos

        if (this.state.EstadoCargueBorrador) {
            for (let i = 0; i < this.state.ListaPedido.ArrayMedicamentos.length; i++) {
                if (this.state.ListaPedido.ArrayMedicamentos[i].Productos.length > 0) {
                    arrayDisensacion.push(this.state.ListaPedido.ArrayMedicamentos[i])
                }
            }
        } else {
            for (let i = 0; i < this.state.ListaPedido.ArrayMedicamentos.length; i++) {
                    arrayDisensacion.push(this.state.ListaPedido.ArrayMedicamentos[i])
                
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
        if (this.state.EstadoCargueBorrador === true) {
            action = "actualizar";
        }
        if (this.state.EstadoBorrador === true) {
            if (this.state.arrayBorrador.length > 0) {
                action = "actualizar";
            }
        }
        this.setState(state => ({
            ...state, Preload: true
        }))

        fetch(gsUrlApi + '/dispensaciones_requisiciones/' + action + '/', {
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
                    if (this.state.EstadoBorrador == false) {
                        let Data = this.state.ListaPedido;
                        this.EliminarSolicitudes(Data)
                        /* this.setState(state => ({
                            ...state, Preload: false
                        }))
                        this.props.OcultarFormulario() */
                    } else {
                        this.setState(state => ({
                            ...state, Preload: false
                        }))
                        this.props.OcultarFormulario()
                    }
                }
            })
            .catch(err => console.log("err", err));

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

    AlertaRelacion = () => {
        confirmAlert({
            title: "Aviso!",
            message: "Relación de medicamento no encontrada",
            buttons: [
                {
                    label: "Aceptar",
                    onClick: () => this.onClick2(),
                }
            ]
        });
    };

    onClick = Datos => {
        for (let i = 0; i < this.state.arrayBorrador.length; i++) {
            if (this.state.arrayBorrador[i].Aprovechamiento) {
                this.state.arrayBorrador[i].ArrayMedicamentos.EstadoAprovechamiento = false
            } else {
                this.state.arrayBorrador[i].ArrayMedicamentos.EstadoAprovechamiento = true
            }

        }
        this.setState(state => ({
            ...state, ListaPedido: this.state.arrayBorrador,
        }))
        this.setState(state => ({
            ...state, EstadoCargueBorrador: true
        }))

    }
    ListarProductos = (data, index) => {
        IndexMedicamento = index
        fetch(gsUrlApi + '/medicamentos/listarPorCodMed/' + data + "/1", {
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
                if (lstDatos.length > 0) {
                    for (let i = 0; i < lstDatos[0].Productos.length; i++) {
                        array.push(lstDatos[0].Productos[i].Id)
                    }
                    this.DispensacionToggleModel(array)
                } else {
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
    EliminarSolicitudes = dataDispensacion => {
        fetch(gsUrlApi + '/solicitudes_requisiciones/eliminar/', {
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
                    this.props.OcultarFormulario()
                }
            })
            .catch(err => console.log("err", err));
    }

    ValorAprovechamiento = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
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
    ValorAprovechamientoBorrador = (event) => {
        if (event.target) {
            let listaTemp = this.state.ListaPedido.ArrayMedicamentos;
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
    DispensacionToggleModel = (array) => {

        if (array) {
            array = array.toString()
            if (array) {

                fetch(ApiSios + '/consultarStockMedicamentos', {
                    method: 'POST',
                    body: JSON.stringify({ "Filtro": array, "Software": "ZEUS" }),
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json',
                    }
                }).then(res => res.json())
                    .then(data => data)
                    .then((data) => {
                        if (data.error) {

                        } else {
                            let LstDatos = data.Datos
                            this.setState(state => ({
                                ...state, ValueMedicamento: this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento]
                            }))
                            this.setState(state => ({
                                ...state, ListaMedicamentos: LstDatos
                            }))
                            if (this.state.EstadoCargueBorrador) {
                                if (this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Productos) {
                                    this.setState(state => ({
                                        ...state, MedicamentoZeus: this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Productos
                                    }))
                                }
                                this.setState(state => ({
                                    ...state, DispensModel: !this.state.DispensModel
                                }))
                            } else {
                                if (this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Productos) {
                                    this.setState(state => ({
                                        ...state, MedicamentoZeus: this.state.ListaPedido.ArrayMedicamentos[IndexMedicamento].Productos
                                    }))
                                }
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
            }
        } else {
            this.setState(state => ({
                ...state, DispensModel: !this.state.DispensModel
            }))
        }

    };

    ActivarBorrador = () => {
        this.setState(state => ({
            ...state, EstadoBorrador: !this.state.EstadoBorrador
        }))
    }

    resta = (event) => {
        if (event.target) {
            // this.state.ListaPedido.ArrayMedicamentos[event.target.id].Entrega = "";
            let listaTemporal = this.state.ListaPedido.ArrayMedicamentos;
            if (event.target.value != "") {
                if (listaTemporal[event.target.id].Cantidad === 1) {
                    listaTemporal[event.target.id].Aprovechamiento = 1
                    listaTemporal[event.target.id].Pendiente = 0
                    listaTemporal[event.target.id].Entrega = 0
                    this.state.ListaPedido.ArrayMedicamentos = listaTemporal;
                    this.setState(state => ({
                        ...state, ListaPedido: this.state.ListaPedido
                    }))
                } else {
                    // listaTemporal[event.target.id].Aprovechamiento = listaTemporal[event.target.id].Pendiente
                    listaTemporal[event.target.id].Entrega = event.target.value; 
                    listaTemporal[event.target.id].Pendiente = listaTemporal[event.target.id].Cantidad - listaTemporal[event.target.id].Entrega
                    // listaTemporal[event.target.id].Pendiente = listaTemporal[event.target.id].Entrega - listaTemporal[event.target.id].Cantidad
                    // listaTemporal[event.target.id].EstadoAprovechamiento = false
                    this.state.ListaPedido.ArrayMedicamentos = listaTemporal;
                    this.setState(state => ({
                        ...state, ListaPedido: this.state.ListaPedido
                    }))
                }

            } else {
                listaTemporal[event.target.id].Entrega = listaTemporal[event.target.id].Cantidad
                listaTemporal[event.target.id].Pendiente = 0
                listaTemporal[event.target.id].Aprovechamiento = ""
                listaTemporal[event.target.id].EstadoAprovechamiento = true
                this.state.ListaPedido.ArrayMedicamentos = listaTemporal;
                this.setState(state => ({
                    ...state, ListaPedido: this.state.ListaPedido
                }))
            }

        }
    }


    handleAfterPrint = () => {};

  handleBeforePrint = () => {};

  handleOnBeforeGetContent2 = () => {
    this.setState({ text: "Loading new text...", isLoading2: true });

    return new Promise((resolve, any) => {
      setTimeout(() => {
        this.setState(
          { text: "New, Updated Text!", isLoading2: false },
          resolve
        );
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
            <div className="">
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

                <fieldset
          style={{
            border: "1px #dee2e6",
            padding: "revert",
            backgroundColor: "white",
            borderRadius: "10px",
            paddingBottom: "30px",
          }}
        >
                <form onSubmit={this.Guardar}>
                    <div style={{ padding: "15px" }}>
                        <div className="row">
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    <i className="far  fa-user-circle"></i>
                                        Usuario:
                                </div>
                                <div className=" ml-2">
                                    {this.state.ListaPedido.Usuario}
                                </div>
                                <div className="">
                                    {/* {this.state.DataPaciente.LogoSexo} */}
                                </div>
                                {/* -{this.state.DataPaciente.Edad + "  Años"} */}
                            </div>
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    Observaciones:
                                </div>
                                <div className="ml-2">
                                    {this.state.ListaPedido.Observaciones}
                                </div>
                            </div>
                            <div className="col-md-4 row">
                                {/* {this.state.DataPaciente.UnidadFuncional}
                                <i style={{ color: "green" }} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>
                                {this.state.DataPaciente.NombreCama} {this.state.DataPaciente.LogoMedico}
                                {this.state.DataPaciente.NombreUsuario} */}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-6 pl-3 row">
                                <div className="font-weight-bold">
                                    Fecha de la solicitud:
                                </div>
                                <div className=" ml-2">
                                    {this.state.ListaPedido.txtFechaRegistroDispensacion}
                                </div>
                            </div>
                            <div className="col-md-6 row">
                                <div className="font-weight-bold">
                                    Sede destino:
                                    </div>
                                <div className="ml-2">
                                    {this.state.ListaPedido.SedeDestino}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
              <div className="row  col-md-11">

                <div className="ml-2 mr-2">
                  <Button
                    type="button"
                    style={{ height: "80%" }}
                    for="Impresion"
                    className="btn btn-success ml-2 cursor-pointer"
                  >
                    <ReactToPrint
                      id="Impresion"
                      content={this.reactToPrintContent2}
                      documentTitle="Dispensacion"
                      onAfterPrint={this.handleAfterPrint}
                      onBeforeGetContent={this.handleOnBeforeGetContent2}
                      onBeforePrint={this.handleBeforePrint}
                      removeAfterPrint
                      trigger={this.reactToPrintTrigger2}
                    >
                      {" "}
                    </ReactToPrint>
                  </Button>
                  <div hidden={true}>
                    <Constancia
                      ref={this.setComponentRef2}
                      objDatos={this.state.ListaPedido}
                      Funcionarios={this.state.Funcionarios}
                    />
                  </div>
                  {this.state.isLoading2 && (
                    <p className="indicator">Generando Constancia...</p>
                  )}
                </div>
              </div>
              <div className="text-right mt-1">
                <Button
                  type="link"
                  onClick={() => this.Cancelar()}
                  className="btn btn-link ml-2 "
                >
                  <i className="fa fa-chevron-left"> Atrás</i>
                </Button>
              </div>
            </div>
                    

                    <div className="right-panel roe-box-shadow">
                        <div className="contact-table">
                            {this.state.ListaPedido && this.state.ListaPedido.ArrayMedicamentos ? (
                                <Table hover className="mb-0 border">
                                    <thead className="">
                                        <tr>
                                            <th height="10">Fecha</th>
                                            <th>Medicamento</th>
                                            {/*                                         <th>Médico/Enfermera</th> */}
                                            <th>Solicitado</th>
                                            <th>Entrega</th>
                                            <th>Pendiente</th>
                                            <th></th>
                                            {/* <th>Aprovecha..</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {this.state.ListaPedido.ArrayMedicamentos.map((e, i) => {
                                            return (
                                                <tr key={i} style={{ backgroundColor: e.ColorBorder }}>
                                                    <td style={{ width: "119px" }}>
                                                        <div className="">{this.state.ListaPedido.FechaRegistroDispensacion.substring(0, 10)} Hora: {this.state.ListaPedido.FechaRegistroDispensacion.substring(11, 16)}</div>
                                                    </td>
                                                    <td>{e.ArrayMedicamentos ? e.ArrayMedicamentos.Generico : e.Descripcion}</td>
                                                    {/* <td>{e.ArrayMedicamentos ? e.ArrayMedicamentos.NombreUsuario : e.Usuario}</td> */}
                                                    <td className="text-center" style={{ width: "100px" }}><input className="form-control" disabled value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Cantidad : e.Cantidad} type="text" /></td>
                                                    <td style={{ width: "100px" }}><input className="form-control" id={i} value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Entrega : e.Entrega}  disabled onChange={this.resta} type="number" /></td>
                                                    <td className="text-center" style={{ width: "100px" }}><input className="form-control" disabled value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Pendiente : e.Pendiente} type="text" /></td>
                                                    {/* <td className="text-center"><i className="far fa-2x fa-hand-point-up cursor-pointer" onClick={e.ArrayMedicamentos ? () => this.ListarProductos(e.Id, i) : () => this.ListarProductos(e.Id, i)}></i></td> */}
                                                    {/* <td className="text-center">
                                                        <div className="row">
                                                            <input className="form-control ml-3" style={{ width: "50%" }} id={i} onChange={e.ArrayMedicamentos ? this.ValorAprovechamientoBorrador : this.ValorAprovechamiento} disabled={e.ArrayMedicamentos ? e.ArrayMedicamentos.EstadoAprovechamiento : e.EstadoAprovechamiento} value={e.ArrayMedicamentos ? e.ArrayMedicamentos.Aprovechamiento : e.Aprovechamiento} type="number" />
                                                            <div className=" ml-2 mt-3 pretty cursor-pointer p-switch p-fill">
                                                                <input type="checkbox" className="cursor-pointer" id={i} onChange={e.ArrayMedicamentos ? this.AprovechamientoBorrador : this.Aprovechamiento} />
                                                                <div className="state cursor-pointer">
                                                                    <label></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td> */}
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
                    <Modal
                        centered
                        isOpen={this.state.DispensModel}
                        fade={false}
                        toggle={this.DispensacionToggleModel}
                        className={this.props.className}
                        style={{ maxWidth: "700px" }}
                    >
                        <ModalHeader toggle={this.DispensacionToggleModel}>
                            <span>{this.state.ValueMedicamento.Descripcion}</span>

                        </ModalHeader>
                        <ModalBody>
                            <FormModal
                                data={this.props.ListaPedido}
                                handleFormSubmit={data => this.handleFormSubmit(data)}
                                ListaMedicamentos={this.state.ListaMedicamentos}
                                DatosMedicamentosZeus={this.state.MedicamentoZeus}
                                AgregarMedicamento={data => this.AgregarMedicamento(data)}
                                Cantidad = {this.state.ValueMedicamento.Cantidad}
                            />
                            <div className="row">
                                <div className="col-md-6">
                                    <span>Solicitado: ({this.state.ValueMedicamento.Cantidad}) </span>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="row">
                                <i
                                    type="btn"
                                    style={{ height: '80%' }}
                                    onClick={() => this.DispensacionToggleModel()}
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
                </form>
                </fieldset>
              </div>
        )

    }

}

export default compose(enhancer)(RequisicionesForm);
