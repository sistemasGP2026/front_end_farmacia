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
import TablePagination from '@material-ui/core/TablePagination';
import { gsUrlApi } from "../../config/configServer";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Input } from "reactstrap";
import Button from "components/button/Button";
import { confirmAlert } from "react-confirm-alert";

class TablaModelo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EstadoOpen: false,
      rowsPerPage: 10,
      page: 0,
      DataLength: 0,
      Userlists: []
    };
  }

  componentDidMount = () => {
    this.ListarRelaciones();
  }
  setOpen = () => {
    this.setState((state) => ({
      ...state,
      open: !this.state.open,
    }));
  };

  handleChangePage = (event, value) => {
		this.ListarRelaciones(value);
    this.setState((state) => ({
      ...state,page: value
    }));

  }

  alertaEliminado  = idEliminar => {
    confirmAlert({
      title: "Registro Eliminado Exitoso",
      buttons: [
        {
          label: "Aceptar",
          onClick: '',
        }
      ]
    });
  };

  deleteSelected = async (Item) => {
    var objAuditor = new Object();
    objAuditor._id = Item._id ;
    fetch(gsUrlApi + "/medicamentos/eliminar/", {
      method: "POST",
      body: JSON.stringify(objAuditor),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .then((data) => { 
         this.alertaEliminado()
         this.componentDidMount()
      })
      .catch((err) => console.log("err", err));
  };


  alertaEliminar = (accion, Item) => {
    confirmAlert({
      title: "Eliminar registro",
      message: "¿Desea eliminar el registro seleccionado?",
      buttons: [
        {
          label: "Si",
          onClick: () => this.deleteSelected(Item),
        },
        {
          label: "No",
          onClick:  "",
        }
      ]
    });
  };
  ListarRelaciones = data => {
		let pagina = 0 ;
		if (data) {
			pagina = data
		} else {
			pagina = this.state.page
		}
    console.log("1 , 2 , 3", gsUrlApi , pagina, this.state.rowsPerPage);
		fetch(gsUrlApi + '/medicamentos/listar/', {
			method: 'POST',
			body: JSON.stringify({start: pagina * this.state.rowsPerPage,  length: this.state.rowsPerPage}),
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				Accept: 'application/json'
			}
		})
			.then(res => res.json())
			.then(data => data)
			.then(data => {
				if (data.datos) {
          this.state.DataLength = data.recordsFiltered
          this.setState((state) => ({
            ...state,Userlists: data.datos
          }));
				}
			})
			.catch(err => console.log('err', err));
	
	}
  handleChangeRowsPerPage(event) {
    this.setState((state) => ({
      ...state,rowsPerPage: event.target.value
    }));
	}

  Consultar =  data => {
    let pagina = 0 ;

		fetch(gsUrlApi + '/medicamentos/listar/', {
			method: 'POST',
			body: JSON.stringify({start: pagina * this.state.rowsPerPage,  length: this.state.rowsPerPage, search: data.target.value}),
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				Accept: 'application/json'
			}
		})
			.then(res => res.json())
			.then(data => data)
			.then(data => {
				if (data.datos) {
          this.state.DataLength = data.recordsFiltered
          this.setState((state) => ({
            ...state,Userlists: data.datos
          }));
				}
			})
			.catch(err => console.log('err', err));
  }
  
  AbrirCabeceraPrincipal = data => {
    if (this.state.Userlists[data].EstadoOpen == true) {
      this.state.Userlists[data].EstadoOpen = false;
      this.setState((state) => ({
        ...state, Userlists: this.state.Userlists
      }));
    } else {
      this.state.Userlists[data].EstadoOpen = true;
      this.setState((state) => ({
        ...state, Userlists: this.state.Userlists
      }));
    };
  }
  render() {
    return (
      <TableContainer component={Paper}>
          <div style={{padding: '10px'}}>
          <div className="row  col-sm-12 col-md-12">
          <div className="form-group col-md-5">
            <h5>
              <i className="fas fa-notes-medical" /> Relación Medicamento
              Productos
            </h5>
          </div>
          <>
            <div className="form-group  col-sm-9 col-md-10" >
              <div className="searchStyle pos-relative mr-3">
                <i className="fas fa-search close-search"></i>
                <Input
                  value={this.state.value}
                  placeholder="Buscar "
                  className="react-form-search-input"
                  onChange={(ev) => this.Consultar(ev)}
                />
              </div>
            </div>
            <div className="form-group col-sm-3 col-md-2 text-right">
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

            {this.state.Userlists.map((row, i) => (
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
                            this.alertaEliminar("delete", row)
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
                              <TableCell>Id </TableCell>
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
                            
                            {this.state.Userlists[i]["Productos"].map((historyRow ) => (

                              <TableRow>
                                 <TableCell>
                                  {historyRow.Id}
                                </TableCell>
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
        <TablePagination
				className="overflow-hidden"
				component="div"
				count={this.state.DataLength}
				rowsPerPage={this.state.rowsPerPage}
				page={this.state.page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={this.handleChangePage}
				onChangeRowsPerPage={this.handleChangeRowsPerPage}
			/>
      </TableContainer>
    );
  }
}



export default compose(enhancer)(TablaModelo);
