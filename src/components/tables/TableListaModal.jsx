import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { Input } from "reactstrap";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../tables/App.css";
import Button from "components/button/Button";
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
      <div className="right-panel roe-box-shadow">
        <div className="contact-table">
          <Scrollbars
            autoHide
            // className="contact-scroll-height"
            style={{
              minHeight: "350px",
            }}
          >
            {/* {this.props.Userlists && this.props.Userlists.length ? (
              <Table borderless hover className="mb-0">
                <thead>
                  <tr>
                    <th>Codigo Medicina</th>
                    <th>Nombre Generico</th>
                    <th>Cod Pos</th>
                    <th>Tipo</th>
                    <th>Forma</th>
                    <th>Concentracion</th>
                    <th>Comercial</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.Userlists.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex center">
                            <div className="ml-10">
                              {e.TipoIdentificacion}-{e.Identificacion}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="">
                            <div className="row">{e.NombreCompleto}</div>
                            <div className="row">{e.Identificacion}</div>
                          </div>
                        </td>
                        <td>{e.Email}</td>
                        <td>{e.Email}</td>
                        <td>{e.Celular}</td>
                        <td>{e.Celular}</td>
                        <td>{e.Celular}</td>
                        <td>{e.Activo}</td>
                        <td>
                          <i
                            className="fas fa-edit more-vert-icon cursor-pointer"
                            style={{ fontSize: 20 }}
                            onClick={() =>
                              this.props.actiononContact("edit", e)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center no-found-message">
                No Roles Found....
              </div>
            )} */}

            <Table borderless>
            <thead>
                <tr>
                    <th></th>
                    <th>Codigo Medicina</th>
                    <th>Nombre Generico</th>
                    <th>Cod Pos</th>
                    <th>Tipo</th>
                    <th>Forma</th>
                    <th>Concentracion</th>
                    <th>Comercial</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox"></input></td>
                    <td>A001998CP</td>
                    <td>ACETAMINOFEN Tableta 500</td>
                    <td>A00410011C</td>
                    <td>Medicamento</td>
                    <td>Tableta</td>
                    <td>500</td>
                    <td>NO</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></input></td>
                    <td>A0433998CP</td>
                    <td>Omeprazol</td>
                    <td>A00010019C</td>
                    <td>Medicamento</td>
                    <td>Tableta</td>
                    <td>200</td>
                    <td>SI</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></input></td>
                    <td>A0433932CP</td>
                    <td>Amlodipina </td>
                    <td>A0001D1123</td>
                    <td>Medicamento</td>
                    <td>Tableta</td>
                    <td>200</td>
                    <td>SI</td>
                </tr>
                {/* <tr>
                <td><input type="checkbox"></input></td>
                    <td>2</td>
                    <td>B</td>
                    <td>AB2</td>
                    <td>Medicamento</td>
                    <td>Tableta</td>
                    <td>600</td>
                    <td>No</td>
                    <td>
                          <i
                            className="fas fa-edit more-vert-icon cursor-pointer"
                            style={{ fontSize: 20 }}
                            // onClick={() =>
                            //   this.props.actiononContact("edit", e)
                            // }
                          />
                        </td>
                </tr>
                <tr>
                <td><input type="checkbox"></input></td>
                    <td>3</td>
                    <td>C</td>
                    <td>AB3</td>
                    <td>Medicamento</td>
                    <td>Tableta</td>
                    <td>100</td>
                    <td>Si</td>
                    <td>
                          <i
                            className="fas fa-edit more-vert-icon cursor-pointer"
                            style={{ fontSize: 20 }}
                            // onClick={() =>
                            //   this.props.actiononContact("edit", e)
                            // }
                          />
                        </td>
                </tr> */}
            </tbody>
        </Table>
        <div className="d-flex flex-row-reverse">
            <Button
              type="submit"
              style={{ "background-color": "rgb(0, 196, 134)" }}
              className="c-btn text-white"
            >
              <i class="far fa-save text-white mr-2 fa-lg"></i>
              Aceptar
            </Button>
            <Button type="button" className="c-btn btn-outline-danger  mr-2">
              <i class="fas fa-times mr-2"></i>
              Cancelar
            </Button>
          </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default ContactList;
