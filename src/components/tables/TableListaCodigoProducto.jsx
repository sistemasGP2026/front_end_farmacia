import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { Input } from "reactstrap";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../tables/App.css";

class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  obtenerId = (e) => {
    const selectedTem = this.state.selected ? this.state.selected : [];
    if (selectedTem.includes(e.target.value)) {
      let index = selectedTem.indexOf(e.target.value);
      if (index > -1) {
        selectedTem.splice(index, 1);
      }
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
    } else {
      selectedTem.push(e.target.value);
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
    }
  };

  // alertaEliminar2 = (e) => {
  //   confirmAlert({
  //     title: "ATENCION",
  //     message:
  //       "No hay ningun dato seleccionado, por favor seleccione varios a eliminar",
  //     buttons: [
  //       {
  //         label: "Aceptar",
  //         onClick: () => this.onClick2("Aceptar"),
  //       },
  //     ],
  //   });
  // };

  onClick2 = () => {};

  EliminarSelected = () => {
    if (this.state.selected && this.state.selected.length > 0) {
      this.props.actiononContact("deleteAll", this.state.selected);
    } else {
      this.alertaEliminar2();
    }
  };
  render() {
    let FechaCorta = "";
    if (this.props.ComplementoFcha) {
      FechaCorta = this.props.ComplementoFcha;
    }
    return (
      <div className="right-panel roe-box-shadow"  >
        <div className="contact-table" style={{minHeight: "300px"}}>
          
            {this.props.Userlists2 && this.props.Userlists2.length ? (
              <Table borderless responsive={true}   >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Código </th>
                    <th >Nombre</th>
                    <th style={{textAlign: 'right', width: '10%'}}>Equivalencia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.Userlists2.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>
                        <div className="ml-1">{e.Id}</div>
                        </td>
                        <td> 
                          <div className="ml-1">{e.Codigo}</div>
                        </td>
                        <td> 
                          <div className="ml-1">{e.Nombre}</div>
                        </td>
                        <td style={{textAlign: 'end'}}>
                          <input
                            id={i}
                            onChange={this.props.agregarEquivalencia}
                            value={e.Equivalencia}
                            type="number"
                            className="form-control"
                            defaultValue="1"
                            style={{ border: "none", textAlign: 'right' }}
                          ></input>
                        </td>
                        <td>
                          <i
                            className="fas fa-trash more-vert-icon cursor-pointer"
                            style={{ fontSize: 20 }}
                            onClick={() =>
                              this.props.quitarCampo(e)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
               <Scrollbars
            autoHide
            className="contact-scroll-height"
            style={{
              height: "200px",
            }}
          > 
              <div className="text-center no-found-message" >
                No se encontraron datos...
              </div>
            </Scrollbars>

            )}
        </div>
      </div>
    );
  }
}

export default ContactList;
