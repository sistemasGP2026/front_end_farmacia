import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { Input } from "reactstrap";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../tables/App.css";
import "../../views/app/RelacionMedicamentoProducto";
import { gsUrlApi } from "../../config/configServer";

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

  onClick2 = () => {};


  render() {
    let FechaCorta = "";
    if (this.props.ComplementoFcha) {
      FechaCorta = this.props.ComplementoFcha;
    }
    return (
      <div className="right-panel roe-box-shadow" >
        <div className="contact-table">
          <Scrollbars
            autoHide
            // className="contact-scroll-height"
            style={{
              minHeight: "140px",
            }}
          >
            {this.props.Userlists && this.props.Userlists.length ? (
              <Table borderless>
                <thead>
                  <tr>
                    <th>CodMed</th>
                    <th>Nombre</th>
                    <th>Atc</th>
                    <th>Tipo</th>
                    <th>Forma</th>
                    <th>Concentracion</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.Userlists.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <div className="ml-1">{e.CodMed}</div>
                        </td>
                        <td>
                          <div className="ml-1">{e.Descripcion}</div>
                        </td>
                        <td>
                          <div className="flex center">
                            <div className="ml-1">{e.Atc}</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex center">
                            <div className="ml-1">{e.Grupo}</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex center">
                            <div className="ml-1">{e.Forma}</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex center">
                            <div className="ml-1">{e.Concentracion}</div>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center no-found-message">
                No se encontraron datos...
              </div>
            )}

          
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default ContactList;
