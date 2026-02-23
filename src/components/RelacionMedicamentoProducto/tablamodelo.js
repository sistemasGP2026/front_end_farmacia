import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import enhancer from "components/RelacionMedicamentoProducto/RelacionMedicamentoProductoEnhancer";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Input } from "reactstrap";
import Button from "components/button/Button";
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: "2020-01-05", customerId: "11091700", amount: 3 },
      { date: "2020-01-02", customerId: "Anonymous", amount: 1 },
    ],
  };
}


class TablaModelo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EstadoOpen: false,
      Lista1: [this.props.Userlists],
    };
  }

  setOpen = () => {
    this.setState((state) => ({
      ...state,
      open: !this.state.open,
    }));
  };

  
  AbrirCabeceraPrincipal = data => {
    if (this.props.Userlists[data].EstadoOpen == true) {
      this.props.Userlists[data].EstadoOpen = false;
      this.setState((state) => ({
        ...state, Userlists: this.props.Userlists
      }));
    } else {
      this.props.Userlists[data].EstadoOpen = true;
      this.setState((state) => ({
        ...state, Userlists: this.props.Userlists
      }));
    };
  }
  render() {
    return (
      <TableContainer component={Paper}>
          <div style={{padding: '10px'}}>
          <div className="row col-md-12">
          <div className="form-group col-md-5">
            <h5>
              <i className="fas fa-notes-medical" /> Relación Medicamento
              Productos
            </h5>
          </div>
          <>
            <div className="form-group col-md-5" style={{ width: "500px" }}>
              <div className="searchStyle pos-relative mr-3">
                <i className="fas fa-search close-search"></i>
                <Input
                  value={this.state.value}
                  placeholder="Buscar "
                  className="react-form-search-input"
                  onChange={(ev) => this.props.Consultar(ev)}
                />
              </div>
            </div>
            <div className="form-group col-md-2">
              <Button
                className="btn text-white btn-sm cursor-pointer"
                style={{ "background-color": "rgb(86, 60, 145)" }}
                onClick={() => this.props.actiononButton("nuevo")}
              >
                <i className="fas mr-1 fa-plus text-white" />
                Agregar
              </Button>
            </div>
          </>
          </div>
        </div>
        <Table aria-label="collapsible table">
          {/* header superior de table  */}
          <TableHead>
            <TableRow>
              {this.props.headerSuperior.map((row) => (
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* header de table interna */}

            {this.props.Userlists.map((row, i) => (
              <>
                 <TableRow component="th" score="row">
                    <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.AbrirCabeceraPrincipal(i)}
                    >
                      {row.EstadoOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.CodMed}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.Descripcion}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.Grupo}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <td align="right">
                      <div className="row">
                        <button
                          className="btn text-center mr-1"
                          style={{
                            "background-color": "rgb(0, 196, 134)",
                            width: "39px",
                          }}
                          onClick={() =>
                            this.props.actiononContact("edit", row)
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
                            this.props.actiononContact("delete", row)
                          }
                        >
                          <i className="fas fa-trash text-white" />
                        </button>
                      </div>
                    </td>
                  </TableCell>
                </TableRow>
                <TableRow component="th" score="row">
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse in={row.EstadoOpen} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Productos
                        </Typography>

                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Código</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Equivalencia</TableCell>

                              {/* <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">
                                  Total price ($)
                                </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            
                            {this.props.Userlists[i]["Productos"].map((historyRow ) => (

                              <TableRow>
                                <TableCell>
                                  {historyRow.Codigo}
                                </TableCell>
                                <TableCell>
                              {historyRow.Nombre} 
                                </TableCell>
                                <TableCell>
                              {historyRow.Equivalencia} 
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}



export default compose(enhancer)(TablaModelo);
