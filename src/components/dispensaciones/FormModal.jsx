import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import { compose } from "redux";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { confirmAlert } from "react-confirm-alert";

let ArrayMedicamentos = [];
class FormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ListaPedido: [],
            selected: [],
            selectDrp: false,
            listaData: [],
            Cantidad: 0
        }
    }

    async componentDidMount() {
        let Estado = false;
        ArrayMedicamentos = [];
        if (this.props.DatosMedicamentosZeus) {
            ArrayMedicamentos = this.props.DatosMedicamentosZeus;
            for (let i = 0; i < this.props.DatosMedicamentosZeus.length; i++) {
                for (let k = 0; k < this.props.ListaMedicamentos.length; k++) {
                    if (this.props.ListaMedicamentos[k].Lote === this.props.DatosMedicamentosZeus[i].Lote && this.props.ListaMedicamentos[k].Codigo === this.props.DatosMedicamentosZeus[i].Codigo) {
                        this.props.ListaMedicamentos[k].Cantidad = this.props.DatosMedicamentosZeus[i].Cantidad
                        Estado = true;
                    }
                }
            }
        }
        let Total = this.props.Cantidad;
        this.state.listaData = this.props.ListaMedicamentos
        if (Estado === false) {
            for (let k = 0; k < this.props.ListaMedicamentos.length; k++) {
                let Stock = Number(this.props.ListaMedicamentos[k].Stock)
                if (Stock >= Total) {
                    this.props.ListaMedicamentos[k].Cantidad = Total

                    let listaTemp = this.props.ListaMedicamentos;
                    let objMedicamento = {};
                    objMedicamento.Codigo = listaTemp[k].Codigo
                    objMedicamento.Nombre = listaTemp[k].Nombre
                    objMedicamento.FechaVencimiento = listaTemp[k].FechaVencimiento
                    objMedicamento.Descripcion = listaTemp[k].Descripcion
                    let Producto = this.props.ListaRelacionProductos[0].Productos.filter((data) => {
                        if (data.Codigo === listaTemp[k].Codigo) {
                            return data
                        }
                    })
                    objMedicamento.Equivalencia = Producto[0].Equivalencia
                    if (listaTemp[k].CodigoBarra) {
                        objMedicamento.CodigoBarra = listaTemp[k].CodigoBarra
                    } else {
                        objMedicamento.CodigoBarra = ""
                    }
                    if (listaTemp[k].Volumen) {
                        objMedicamento.Volumen = listaTemp[k].Volumen
                    } else {
                        objMedicamento.Volumen = 0
                    }
                    if (listaTemp[k].Marca) {
                        objMedicamento.Marca = listaTemp[k].Marca
                    } else {
                        objMedicamento.Marca = ""
                    }
                    if (listaTemp[k].Tipo) {
                        objMedicamento.Tipo = listaTemp[k].Tipo
                    } else {
                        objMedicamento.Tipo = ""
                    }
                    if (listaTemp[k].IdMovimientoDetalle) {
                        objMedicamento.IdMovimientoDetalle = listaTemp[k].IdMovimientoDetalle
                    } else {
                        objMedicamento.IdMovimientoDetalle = ""
                    }
                    objMedicamento.CodigoCum = listaTemp[k].CodigoCum
                    objMedicamento.Bodega = listaTemp[k].Bodega
                    objMedicamento.RegistroInvima  = listaTemp[k].RegistroInvima
                    objMedicamento.CantidadUnidadEquivalente = listaTemp[k].CantidadUnidadEquivalente
                    objMedicamento.Lote = listaTemp[k].Lote
                    objMedicamento.Costo = listaTemp[k].Costo
                    objMedicamento.Cantidad = Total
                    ArrayMedicamentos.push(objMedicamento)
                    this.props.AgregarMedicamento(ArrayMedicamentos)
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
                    this.state.listaData[k].Cantidad = Total
                    break;
                } else {
                    Total = Total - Stock
                    this.props.ListaMedicamentos[k].Cantidad = Stock

                    let listaTemp = this.props.ListaMedicamentos;
                    let objMedicamento = {};
                    objMedicamento.Codigo = listaTemp[k].Codigo
                    objMedicamento.Nombre = listaTemp[k].Nombre
                    objMedicamento.FechaVencimiento = listaTemp[k].FechaVencimiento
                    objMedicamento.Descripcion = listaTemp[k].Descripcion
                    let Producto = this.props.ListaRelacionProductos[0].Productos.filter((data) => {
                        if (data.Codigo === listaTemp[k].Codigo) {
                            return data
                        }
                    })
                    objMedicamento.Equivalencia = Producto[0].Equivalencia
                    if (listaTemp[k].CodigoBarra) {
                        objMedicamento.CodigoBarra = listaTemp[k].CodigoBarra
                    } else {
                        objMedicamento.CodigoBarra = ""
                    }
                    if (listaTemp[k].Volumen) {
                        objMedicamento.Volumen = listaTemp[k].Volumen
                    } else {
                        objMedicamento.Volumen = 0
                    }
                    if (listaTemp[k].Marca) {
                        objMedicamento.Marca = listaTemp[k].Marca
                    } else {
                        objMedicamento.Marca = ""
                    }
                    if (listaTemp[k].Tipo) {
                        objMedicamento.Tipo = listaTemp[k].Tipo
                    } else {
                        objMedicamento.Tipo = ""
                    }
                    if (listaTemp[k].IdMovimientoDetalle) {
                        objMedicamento.IdMovimientoDetalle = listaTemp[k].IdMovimientoDetalle
                    } else {
                        objMedicamento.IdMovimientoDetalle = ""
                    }
                    objMedicamento.CodigoCum = listaTemp[k].CodigoCum
                    objMedicamento.Bodega = listaTemp[k].Bodega
                    objMedicamento.RegistroInvima  = listaTemp[k].RegistroInvima
                    objMedicamento.CantidadUnidadEquivalente = listaTemp[k].CantidadUnidadEquivalente
                    objMedicamento.Lote = listaTemp[k].Lote
                    objMedicamento.Costo = listaTemp[k].Costo
                    objMedicamento.Cantidad = Stock
                    ArrayMedicamentos.push(objMedicamento)
                    this.props.AgregarMedicamento(ArrayMedicamentos)
                    this.setState(state => ({
                        ...state, ListaPedido: listaTemp
                    }))
                    this.state.listaData[k].Cantidad = Stock
                }
            }
        }

        this.setState(state => ({
            ...state, listaData: this.props.ListaMedicamentos
        }))
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
    selectAction = action => {
        if (action === "selectall") {
            const ids = this.state.ListaPedido.map(a => a.Medicamento);
            this.setState(state => ({
                ...state, selected: ids
            }))
        } else if (action === "unselectall") {
            this.setState(state => ({
                ...state, selected: null
            }))
        }

    }
    handleChange = (event) => {
        if (event.target) {
            let listaTemp = this.props.ListaMedicamentos;
            let value = 0;
            // validacion Cantidad---------------------
            for (let i = 0; i < ArrayMedicamentos.length; i++) {
                if (ArrayMedicamentos[i].Codigo === listaTemp[event.target.id].Codigo && ArrayMedicamentos[i].Costo === listaTemp[event.target.id].Costo) {
                    value = ArrayMedicamentos[i].Cantidad;
                    break;
                }
            }
            let TotalSuma = 0;
            for (let p = 0; p < ArrayMedicamentos.length; p++) {
                TotalSuma = Number(ArrayMedicamentos[p].Cantidad) + TotalSuma
            }
            TotalSuma = TotalSuma - Number(value)
            TotalSuma = TotalSuma + Number(event.target.value)
            if (TotalSuma > this.props.Cantidad || event.target.value < 0 || listaTemp[event.target.id].Stock < TotalSuma) {

            } else {
                for (let i = 0; i < ArrayMedicamentos.length; i++) {
                    if (ArrayMedicamentos[i].Codigo === listaTemp[event.target.id].Codigo && ArrayMedicamentos[i].Costo === listaTemp[event.target.id].Costo) {
                        ArrayMedicamentos.splice(i, 1)
                        break;
                    }
                }
                let objMedicamento = {};
                objMedicamento.Codigo = listaTemp[event.target.id].Codigo
                objMedicamento.Nombre = listaTemp[event.target.id].Nombre
                objMedicamento.FechaVencimiento = listaTemp[event.target.id].FechaVencimiento
                objMedicamento.Descripcion = listaTemp[event.target.id].Descripcion
                let Producto = this.props.ListaRelacionProductos[0].Productos.filter((data) => {
                    if (data.Codigo === listaTemp[event.target.id].Codigo) {
                        return data
                    }
                })
                objMedicamento.Equivalencia = Producto[0].Equivalencia
                if (listaTemp[event.target.id].CodigoBarra) {
                    objMedicamento.CodigoBarra = listaTemp[event.target.id].CodigoBarra
                } else {
                    objMedicamento.CodigoBarra = ""
                }
                if (listaTemp[event.target.id].Volumen) {
                    objMedicamento.Volumen = listaTemp[event.target.id].Volumen
                } else {
                    objMedicamento.Volumen = 0
                }
                if (listaTemp[event.target.id].Marca) {
                    objMedicamento.Marca = listaTemp[event.target.id].Marca
                } else {
                    objMedicamento.Marca = ""
                }
                if (listaTemp[event.target.id].Tipo) {
                    objMedicamento.Tipo = listaTemp[event.target.id].Tipo
                } else {
                    objMedicamento.Tipo = ""
                }
                if (listaTemp[event.target.id].IdMovimientoDetalle) {
                    objMedicamento.IdMovimientoDetalle = listaTemp[event.target.id].IdMovimientoDetalle
                } else {
                    objMedicamento.IdMovimientoDetalle = ""
                }
                objMedicamento.CodigoCum = listaTemp[event.target.id].CodigoCum
                objMedicamento.RegistroInvima  = listaTemp[event.target.id].RegistroInvima
                objMedicamento.CantidadUnidadEquivalente = listaTemp[event.target.id].CantidadUnidadEquivalente
                objMedicamento.Bodega = listaTemp[event.target.id].Bodega
                objMedicamento.Lote = listaTemp[event.target.id].Lote
                objMedicamento.Costo = listaTemp[event.target.id].Costo
                objMedicamento.Cantidad = event.target.value
                if( event.target.value > 0){
                    ArrayMedicamentos.push(objMedicamento)
                    this.props.AgregarMedicamento(ArrayMedicamentos)
                }
                
                this.setState(state => ({
                    ...state, ListaPedido: listaTemp
                }))
                this.state.listaData[event.target.id].Cantidad = event.target.value

            }


        }
    } 
    DispensacionToggleModel = () => {
        this.setState(state => ({
            ...state, DispensModel: !this.state.DispensModel,
        }))
    };

    render() {
        return (
            <div className="">
                <form onSubmit={this.Guardar}>
                    <div className="right-panel roe-box-shadow">
                        <div className="contact-list-header">

                        </div>
                        <div className="contact-table">
                            <Scrollbars
                                autoHide
                                className="contact-scroll-height"
                                style={{
                                    minHeight: "330px"
                                }}
                            >
                                {this.state.listaData && this.state.listaData.length ? (
                                    <Table hover className="mb-0 border">
                                        <thead className="">
                                            <tr>
                                                <th >Código</th>
                                                <th height="10">Nombre</th>
                                                <th height="10">Invima</th>
                                                <th height="10" style={{minWidth: "143px"}}>V. Invima</th>
                                                <th>CUM</th>
                                                {/* <th>IUM</th> */}
                                                <th style={{width: "165px"}}>Lote</th>
                                                <th style={{minWidth: "143px"}}>Vencimiento</th>
                                                <th>Stock</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {this.state.listaData.map((e, i) => {
                                                return (
                                                    <tr key={i}> 
                                                        <td> {e.Codigo}  </td>
                                                        <td> {e.Nombre}  </td>
                                                        <td>
                                                          {e.RegistroInvima}
                                                        </td>
                                                        <td>
                                                         {e.vencimientoinvima  && e.vencimientoinvima != "2034-02-23T00:00:00" ? e.vencimientoinvima.substring(0,10): ""} 
                                                        </td>
                                                        <td>
                                                            {e.CodigoCum}
                                                        </td>
                                                        {/* <td>
                                                            <input className="form-control" name="IUM" id={i} value={e.IUM} onChange={(env) => this.props.ModificarListaMedicamentos(env)} type="text" /> 
                                                        </td>  */}
                                                        <td>
                                                            <input className="form-control" name="Lote" id={i} value={e.Lote} onChange={(env) => this.props.ModificarListaMedicamentos(env)} type="text" /> 
                                                        </td>
                                                        <td style={{ width: "119px" }}>
                                                            <input className="form-control" id={i} value={e.FechaVencimiento ? e.FechaVencimiento.substring(0,10): ""}  onChange={(env) => this.props.ModificarListaMedicamentos(env)}  type="text" />
                                                            {/* <div className="">{e.FechaVencimiento.substring(0, 10)}</div> */}
                                                        </td>
                                                        <td>{e.Stock}</td>
                                                        <td style={{ width: "100px" }}>
                                                        <input className="form-control" id={i} value={e.Cantidad} onChange={this.handleChange} type="number" />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center no-found-message">
                                        <br /><br /><br /><br />
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                </form>
            </div>
        )

    }

}

export default compose(enhancer)(FormModal);
