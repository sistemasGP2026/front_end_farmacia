import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import { compose } from "redux";
import { Table } from "reactstrap";

let ArrayMedicamentos = [];
class FormModal extends React.Component {
    constructor(props){
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
            DataPaciente: '',
            selectDrp: false,
            listaData: []
        }
    }
    
    async componentDidMount() {
         ArrayMedicamentos = [];
        if (this.props.DatosMedicamentosZeus) {
            ArrayMedicamentos = this.props.DatosMedicamentosZeus;
            for (let i = 0; i < this.props.DatosMedicamentosZeus.length; i++) {
                for (let k = 0; k < this.props.ListaMedicamentos.length; k++) {
                    if (this.props.ListaMedicamentos[k].Lote === this.props.DatosMedicamentosZeus[i].Lote) {
                        this.props.ListaMedicamentos[k].Cantidad =  this.props.DatosMedicamentosZeus[i].Cantidad
                    }
                }
            }
        }
        this.setState(state => ({
            ...state,listaData: this.props.ListaMedicamentos
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
            ...state,selected: null,
            ...state,selected: selectedTem
          }))
        } else {
          selectedTem.push(e.target.value);
          this.setState(state => ({
            ...state,selected: null,
            ...state,selected: selectedTem
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
            ...state,ListaPedido: filteredContactlistsTem
          }))        
      };
      SetselectDrp = () => {
        this.setState(state => ({
            ...state,selectDrp: !this.state.selectDrp
          }))
      }
      selectAction = action => {
        if (action === "selectall") {
            const ids = this.state.ListaPedido.map(a => a.Medicamento);
            this.setState(state => ({
                ...state,selected: ids
            }))
          } else if (action === "unselectall") {
            this.setState(state => ({
                ...state,selected: null
            }))
          }

      }
      handleChange = (event) => {
          if (event.target) {
              
              if (event.target.value !== "") {
                let listaTemp = this.props.ListaMedicamentos;
                for (let i = 0; i < ArrayMedicamentos.length; i++) {
                    if (ArrayMedicamentos[i].Codigo === listaTemp[event.target.id].Codigo && ArrayMedicamentos[i].Costo === listaTemp[event.target.id].Costo) {
                        ArrayMedicamentos.splice(i, 1)
                        break;
                    }                  
                }
                let objMedicamento = {};
                objMedicamento.Codigo = listaTemp[event.target.id].Codigo
                objMedicamento.Nombre = listaTemp[event.target.id].Nombre
                objMedicamento.Lote = listaTemp[event.target.id].Lote
                objMedicamento.Costo = listaTemp[event.target.id].Costo
                objMedicamento.Cantidad = event.target.value
                ArrayMedicamentos.push(objMedicamento)
                this.props.AgregarMedicamento(ArrayMedicamentos)
                this.setState(state => ({
                    ...state,ListaPedido: listaTemp
                }))
                this.state.listaData[event.target.id].Cantidad = event.target.value
              
              } else {

              }
            
          }
       
        // this.setState({Cantidad: event.target.value});
      }

      DispensacionToggleModel = () => {
        this.setState(state => ({
            ...state,DispensModel: !this.state.DispensModel,
        }))
      };

    render(){
        return(
            <div className="">
               <form onSubmit={this.Guardar}>
                    <div className="right-panel roe-box-shadow">
                      <div className="contact-list-header">
                        
                      </div>
                        <div className="contact-table">
                            {this.state.listaData && this.state.listaData.length ? (
                                <Table  hover className="mb-0 border">
                                <thead className="">
                                    <tr>
                                    <th className="pl-4">Código</th>
                                    <th  height="10">Nombre</th>
                                    <th>Lote</th>
                                    <th>Vencimiento</th>
                                    <th>Stock</th>
                                    <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {this.state.listaData.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                        <td>{e.Codigo}</td> 
                                        <td>{e.Nombre}</td> 
                                        <td >{e.Lote}</td> 
                                        <td style={{width: "119px"}}>
                                            <div className="">{e.FechaVencimiento.substring(0, 10)}</div>
                                        </td>
                                        <td>{e.Stock}</td> 
                                        <td style={{width: "100px"}}><input className="form-control" id={i} value={e.Cantidad} onChange={this.handleChange} type="number"/></td>
                                        </tr>
                                    );
                                    })}
                                </tbody>
                                </Table>
                            ) : (
                                <div className="text-center no-found-message">
                                    <br/><br/><br/><br/>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        )
        
    }

}

export default compose(enhancer)(FormModal);
