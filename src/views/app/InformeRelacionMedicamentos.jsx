import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { gsUrlApi } from "config/configServer"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Button from "components/button/Button";
import { Ring } from "react-awesome-spinners";
import { Modal } from "reactstrap";
import Select from "react-select";

class Userlists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            arrayMedicamentos: [],
            preload: false,
            arraySedes: [],
            Sede: null
        };
    }

    componentDidMount = () => {
        this.Listar()
    }

    Listar = () => {
        this.setState(state => ({
            ...state, preload: true
        }))
        fetch(gsUrlApi + '/medicamentos/informe', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            }
        }).then(res => res.json())
            .then(data => data)
            .then((data) => { 
                this.setState(state => ({
                    ...state, preload: false
                }))
                let lstDatos = data.datos; 
                this.setState(state => ({
                    ...state,arrayMedicamentos: lstDatos
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
                 
                <div className="right-panel roe-box-shadow">
                    <div className="contact-list-header row">
                        <div className="ml-4">
                            <h4> Informe Relación Medicamento a Productos</h4>
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
                    <div className="contact-table">
                        <Scrollbars
                            autoHide
                            className="contact-scroll-height"
                            style={{
                                minHeight: "420px",
                            }}
                        >
                            {this.state.arrayMedicamentos && this.state.arrayMedicamentos.length ? (
                                <Table striped bordered hover className="mb-0" id={["Identificacion"]}>
                                    <thead className="">
                                        <tr className="border-bottom">
                                            <th>CodigoSIOS</th>
                                            <th>NombreSIOS</th>
                                            <th>NombreZeus</th>
                                            <th>CodigoZeus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.arrayMedicamentos.map((e, i) => {
                                            return (
                                                <tr key={i} className="border-bottom">
                                                    <td>{e.CodigoSIOS}</td>
                                                    <td>{e.NombreSIOS}</td>
                                                    <td>{e.NombreZeus}</td>
                                                    <td>{e.CodigoZeus}</td>  
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

export default Userlists;