import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { gsUrlApi } from "config/configServer"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Button from "components/button/Button";
import { Ring } from "react-awesome-spinners";
import { Modal } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import DatepickerWrapper from "components/forms/alldatepickers/datepicker.style";

class InformeRequisiciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            ArrayDispensaciones: [],
            preload: false,
            arraySedes: [],
            Sede: null,
            dueDate: null,
            startDate: new Date(),
            Aprovechamiento: true
        };
    }

    componentDidMount = () => {
        this.ListarSedes()
    }

    ListarSedes = () => {
        fetch(gsUrlApi + '/empresa_sedes/listar/1', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => {
                let items = [];
                let lstDatos = data.datos;
                for (let i = 0; i < lstDatos.length; i++) {
                    let objAcciones = {};
                    objAcciones.value = lstDatos[i].Codigo;
                    objAcciones.label = lstDatos[i].Codigo + " - " + lstDatos[i].Nombre;
                    items.push(objAcciones);
                }
                this.setState(state => ({
                    ...state, arraySedes: items
                }))

            })
            .catch(err => {
                console.log("error--->", err);
                this.setState(state => ({
                    ...state, preload: false
                }))
            });
    }

    CambiarSelect = (data) => {
        this.setState(state => ({
            ...state, Sede: data
        }))
    }

    Filtrar = () => {
        this.setState(state => ({
            ...state, preload: true
        }))
        console.log(this.state.HoraDay);
        fetch(gsUrlApi + '/requisiciones/informes', {
            method: 'POST',
            body: JSON.stringify({ FechaInicio: this.state.fechaDay, FechaFin: this.state.fechaDay2, Sede: this.state.Sede ? this.state.Sede.value : null }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => { 

                let lstDatos = data.datos; 
                this.setState(state => ({
                    ...state, ArrayDispensaciones: lstDatos
                }))  
                
                this.setState(state => ({
                    ...state, preload: false
                }))

            })
            .catch(err => { 
                this.setState(state => ({
                    ...state, preload: false
                }))
            });
    }

    CambiarFecha = data => {
        let valor = data.target.value
        if (valor) {
            this.setState(state => ({
                ...state, fechaDay: valor
            }))
        }

    }
    CambiarHora = data => {
        if (data) {
            this.setState(state => ({
                ...state, HoraDay: data
            }))
        }
    }

    CambiarHora2 = data => {
        if (data) {
            this.setState(state => ({
                ...state, HoraDay: data
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

    handleChangeDueDate = data => {

    }

    Aprovechamiento = (event) => {
        if (event.target) { 
            if (event.target.checked === true) {
                this.setState(state => ({
                    ...state, Aprovechamiento: true
                }))
            }else{
                this.setState(state => ({
                    ...state, Aprovechamiento: false
                }))
            }
        }
    }

    render() {
        return (
            <>
                <Modal
                    centered
                    isOpen={this.state.preload}
                    fade={false}
                    className={this.props.className}
                    style={{ maxWidth: "300px" }}
                >
                    <div style={{ position: "absolute", top: "50%", left: "50%" }}> <Ring className="bm-2" size="124" />
                        <h3 className="mt-5 pt-3 text-white">Cargando...</h3></div>
                </Modal>
                <div className="contact-list-header row mb-4">
                        <div className="ml-4">
                            <h4> Consolidado Requisiciones</h4>
                        </div>
                        <>

                            <div style={{ marginLeft: "55%" }}>
                                <button className="c-btn c-secundary">
                                    <ReactHTMLTableToExcel
                                        id="botonexportarexcel"
                                        className="botontransparente"
                                        table="Identificacion"
                                        filename="reporte"
                                        sheet="pagina 1"
                                        buttonText="Exportar Excel"
                                    ></ReactHTMLTableToExcel>
                                </button>
                            </div>
                        </>
                    </div>
                <div className="row pb-3">
                    <div className="col-md-2">
                        <label>Fecha Inicio</label>
                        <input
                            type="datetime-local"
                            value={this.state.fechaDay}
                            onChange={this.CambiarFecha}
                            className="form-control react-form-input"
                            id="input_FechaFin"
                            placeholder="Fecha Fin"
                        />
                        {/* <input className="form-control" type="datetime-local" /> */}
                    </div>


                    <div className="col-md-2">
                        <label>Fecha Fin</label>
                        <input
                            type="datetime-local"
                            value={this.state.fechaDay2}
                            onChange={this.CambiarFecha2}
                            className="form-control react-form-input"
                            id="input_FechaFin"
                            placeholder="Fecha Fin"
                        />
                    </div>

                    <div className="col-md-3">
                        <label>Sedes</label>
                        <Select
                            id="Sedes"
                            onChange={this.CambiarSelect}
                            placeholder="Sedes"
                            className="react-form-search-input"
                            value={this.state.Sede}
                            options={this.state.arraySedes}
                        />
                    </div> 
                    <div className=" col-md-2">
                        <Button type="button" style={{ marginTop: "32px" }} onClick={() => this.Filtrar()} className="c-btn c-success">
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
                <div className="right-panel roe-box-shadow">
                    
                    <div className="contact-table">
                        <Scrollbars
                            autoHide
                            className="contact-scroll-height"
                            style={{
                                minHeight: "420px",
                            }}
                        >
                            {this.state.ArrayDispensaciones && this.state.ArrayDispensaciones.length ? (
                                <Table striped bordered hover className="mb-0" id={["Identificacion"]}>
                                    <thead className="">
                                        <tr className="border-bottom"> 
                                            <th>Unidad Funcional</th>
                                            <th>Sede</th>
                                            <th>Codigo Medicamento</th>
                                            <th>Medicamento</th>
                                            <th>Total Solicitado</th>
                                            <th>Total Pendiente</th> 
                                            <th>Código Producto</th>
                                            <th>Producto</th> 
                                            <th>Total Dispensado</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.ArrayDispensaciones.map((e, i) => {
                                            return (
                                                <tr key={i} className="border-bottom">
                                                    <td>{e.Unidades}</td>
                                                    <td>{e.SedeDestino}</td>
                                                    <td>{e.CodigoMedicamento}</td>
                                                    <td>{e.Medicamento}</td>
                                                    <td>{e.TotalPendiente + e.CantidadDispensada}</td>
                                                    <td>{e.TotalPendiente}</td>
                                                    <td>{e.CodigoProducto}</td>
                                                    <td>{e.Producto}</td>
                                                    <td>{e.CantidadDispensada}</td>   
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center no-found-message">
                                    No se encontraron datos....
                                </div>
                            )}
                        </Scrollbars>
                    </div>
                </div>
            </>
        );
    }
}

export default InformeRequisiciones;