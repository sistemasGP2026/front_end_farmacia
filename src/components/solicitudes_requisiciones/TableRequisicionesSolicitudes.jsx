import React from "react";
import { Table } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { Input } from "reactstrap";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Button from "components/button/Button";
import { confirmAlert } from "react-confirm-alert";

class Userlists extends React.Component {
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
      <div className="right-panel roe-box-shadow">
        <div className="contact-list-header">
          <div>
          <h4><i className="fas fa-notes-medical" />   Requisiciones Solicitudes</h4></div>
          <>
            <div className="searchStyle pos-relative mr-3">
              <i
                className="fas fa-search close-search"
              ></i>
              <Input
                value={this.state.value}
                placeholder="Escriba aquí para buscar registros... "
                className="react-form-search-input"
                onChange={(ev) => this.props.Consultar(ev)}
                style={{'width':'300px'}}
              />
            </div>
            <div>
              <Button
                className="btn text-white btn-sm cursor-pointer"
                style={{ "background-color": "rgb(86, 60, 145)" }}
                onClick={() => this.props.actiononButton("nuevo")}
              >
                <i className="fas mr-1 fa-plus text-white"/>
                Nuevo
              </Button>
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
            {this.props.Userlists && this.props.Userlists.length ? (
                          <Table striped bordered hover className="mb-0"
                          id={["Identificacion"]}>
                <thead className="">
                  <tr className="border-bottom">
                    {this.props.headerLista.map((e, i) => {
                      let total = this.props.headerLista.length - 1;
                      let porcentaje = 0;
                      if (this.props.Acciones === true) {
                        porcentaje = 70 / total;
                      } else {
                        porcentaje = 70 / total;
                      }

                      if (i < 1) {
                        return (
                          <>
                            <th style={{ width: "15%" }}>{e} </th>
                          </>
                        );
                      } else {
                        return (
                          <th style={{ width: porcentaje + "%" }}>{e} </th>
                        );
                      }
                    })}
                    {this.props.Acciones === true ? (
                      <th className="" style={{ width: "15%", textAlign: "center"}}>
                        Acciones
                      </th>
                    ) : (
                      ""
                    )}
                  </tr>
                </thead>
                <tbody>
                  {this.props.Userlists.map((e, i) => {
                    return (
                      <tr key={i} className="border-bottom">
                        {this.props.bodyLista.map((k, i) => {
                          if (i < 1) {
                            return (
                              <>
                                <td>{e[k]}</td>
                              </>
                            );
                          } else {
                            return <td>{e[k]}</td>;
                          }
                        })}
                        {this.props.Acciones === true ? (
                          <td align="center">
                            <div className="">
                            <button
                                className="btn text-center mr-1"
                                style={{
                                  "background-color": "rgb(77, 77, 253)",
                                  width: "39px",
                                }}
                                onClick={() =>
                                  this.props.actiononContact("clone", e)
                                }
                              >
                                <i className="fas fa-clone text-white" />
                              </button>
                              <button
                                className="btn text-center mr-1"
                                style={{
                                  "background-color": "rgb(0, 196, 134)",
                                  width: "39px",
                                }}
                                onClick={() =>
                                  this.props.actiononContact("edit", e)
                                }
                              >
                                <i className="fas fa-edit text-white" />
                              </button>
                              <button
                                className="btn text-center"
                                style={{
                                  "background-color": "rgb(255, 50, 121)",
                                  width: "39px",
                                }}
                                onClick={() =>
                                  this.props.actiononContact("delete", e)
                                }
                              >
                                <i className="fas fa-trash text-white" />
                              </button>
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
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
    );
  }
}

export default Userlists;