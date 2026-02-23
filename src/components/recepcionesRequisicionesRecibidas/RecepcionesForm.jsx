import React from "react";
import enhancer from "components/dispensaciones/DispensacionesEnhancer";
import { compose } from "redux";
import Button from "components/button/Button";
import { Table } from "reactstrap";

class RequisicionesForm extends React.Component {
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
        }
    }
    
    async componentDidMount() {
        

    }
    Cancelar = e => {
        this.props.CancelarDispensacion("cancelar");
    };

  
    checkedMedicamento = () => {

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
            ...state,ListaPedido: filteredContactlistsTem
          }))
        //   window.location.reload(false);
        //   setFilteredContactlists(filteredContactlistsTem);
        //   contactToggleModel();
        
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

    render(){
        return(
            <div className="container">
               <form onSubmit={this.Guardar}>
                    <div style={{padding: "15px"}}>
                        <div className="row">
                        <div className="font-weight-bold">
                            <i style={{color: "#3b83bd"}} className="fas fa-circle mt-1 mr-1"></i>{this.props.data.NombreCompleto}-
                        </div>
                        <div className="">
                            {/* {this.state.DataPaciente.LogoSexo} */}
                        </div>
                            -{this.props.data.Edad + "  Años"}
                        </div>
                        <div className="row">
                            {this.props.data.UnidadFuncional} 
                            <i style={{color: "green"}} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>
                            {this.props.data.NombreCama} 
                            {/* {this.props.data.LogoMedico} */}
                            {this.props.data.NombreUsuario}
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="row col-md-11">
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
                   
                    
                    <div className="right-panel roe-box-shadow" >
                        
                        <div className="contact-table">
                            {this.props.data.ArrayMedicamentos && this.props.data.ArrayMedicamentos.length ? (
                                <Table  hover className="mb-0 border">
                                <thead className="">
                                    <tr>
                                    {/* <th className="pl-4"></th> */}
                                    <th>MEDICAMENTO</th>
                                    <th>Médico/Enfermera</th>
                                    <th>SOLICITADO</th>
                                    <th>ENTREGA</th>
                                    <th>PENDIENTE</th>
                                    <th>Fecha/Hora Dispensación</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {this.props.data.ArrayMedicamentos.map((e, i) => {
                                    return (
                                        <>
                                        
                                        <tr key={i}>
                                        <td>{e.Generico}</td> 
                                        <td>{e.NombreUsuario}</td> 
                                        <td className="text-center"  style={{width: "100px"}}><input className="form-control" disabled value={e.Cantidad} type="text"/></td>
                                        <td style={{width: "100px"}}><input className="form-control" disabled value={""} type="text"/></td>
                                        <td className="text-center" style={{width: "100px"}}><input className="form-control" disabled value={e.Pendiente} type="text"/></td>
                                        <td  style={{width: "150px"}}>
                                            <div className="">{this.props.data.FechaRegistro.substring(0, 10)} Hora: {this.props.data.FechaRegistro.substring(11, 16)}</div>
                                        </td>
                                        </tr>
                                        </>
                                    );
                                    })}
                                </tbody>
                                </Table>
                            ) : (
                                <div className="text-center no-found-message">
                                    <br/><br/><br/><br/>
                                Cargando Datos....
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        )
    }

}

export default compose(enhancer)(RequisicionesForm);
