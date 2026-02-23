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
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class TablaModelo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      Lista1: [],
      selected: [],
      selectDrp: false,
      SelectedMedicamento: [],
      SelectedIdMedicamento: []
    };
  }

  setOpen = () => {
    this.setState((state) => ({
      ...state,
      open: !this.state.open,
    }));
  };


  componentDidMount = () => {
    if (this.props.Userlists) {
      this.setState((state) => ({
        ...state, Lista1: this.props.Userlists
      }));
    }
  }

  selectAction = action => {
    if (action === "selectall") {
      const ids = this.props.Userlists.map(a => a._id);
      this.setState(state => ({
        ...state, selected: ids
      }))
    } else if (action === "unselectall") {
      this.setState(state => ({
        ...state, selected: null
      }))
    }

  }

  checkedMedicamento = e => {
    const selectedTem = this.state.SelectedMedicamento ? this.state.SelectedMedicamento : [];
    const selectedTemId = this.state.SelectedIdMedicamento ? this.state.SelectedIdMedicamento : [];
    if (selectedTem.includes(e.target.value)) {
      let index = selectedTem.indexOf(e.target.value);
      if (index > -1) {
        selectedTem.splice(index, 1);
        selectedTemId.splice(index, 1);
      }
      this.setState(state => ({
        ...state, SelectedMedicamento: null,
        ...state, SelectedMedicamento: selectedTem
      }))
      this.setState(state => ({
        ...state, SelectedIdMedicamneto: null,
        ...state, SelectedIdMedicamneto: selectedTemId
      }))

    } else {
      selectedTem.push(e.target.value);
      selectedTemId.push(this.props.Userlists[e.target.id]._id);
      this.setState(state => ({
        ...state, SelectedMedicamento: null,
        ...state, SelectedMedicamento: selectedTem
      }))
      this.setState(state => ({
        ...state, SelectedIdMedicamneto: null,
        ...state, SelectedIdMedicamneto: selectedTemId
      }))
    }
    this.props.ObtenerSelecionados(selectedTemId, selectedTem)
  }

  checkedPaciente = e => {
    let selectedTem = this.state.selected ? this.state.selected : [];
    let ArrayTemp = this.state.SelectedMedicamento ? this.state.SelectedMedicamento : [];
    let ArrayTempId = this.state.SelectedIdMedicamento ? this.state.SelectedIdMedicamento : [];
    if (selectedTem.includes(e.target.value)) {
      let index = selectedTem.indexOf(e.target.value);
      if (index > -1) {
        selectedTem.splice(index, 1);
      }
      ArrayTempId = this.state.SelectedIdMedicamneto;
      ArrayTemp = this.state.SelectedMedicamento;
      for (let i = 0; i < this.props.Userlists.length; i++) {
        if (this.props.Userlists[i]._id == e.target.value) {
          for (let k = 0; k < ArrayTempId.length; k++) {
            if (ArrayTempId[k] === this.props.Userlists[i]._id) {
              ArrayTemp[k] = "";
              ArrayTempId[k] = "";
            }
          }
          break;
        }
      }
      ArrayTempId = ArrayTempId.filter(data => {
        return data != ""
      })
      ArrayTemp = ArrayTempId.filter(data => {
        return data != ""
      })
      this.setState(state => ({
        ...state, SelectedMedicamento: null,
        ...state, SelectedMedicamento: ArrayTemp
      }))
      this.setState(state => ({
        ...state, SelectedIdMedicamneto: null,
        ...state, SelectedIdMedicamneto: ArrayTempId
      }))
      this.setState(state => ({
        ...state, selected: null,
        ...state, selected: selectedTem
      }))
    } else {
      selectedTem.push(e.target.value);
      for (let i = 0; i < this.props.Userlists.length; i++) {
        if (this.props.Userlists[i]._id == e.target.value) {
          for (let k = 0; k < this.props.Userlists[i].ArrayMedicamentos.length; k++) {
            ArrayTemp.push(this.props.Userlists[i].ArrayMedicamentos[k].IdDetallePrescripcion)
            ArrayTempId.push(this.props.Userlists[i]._id)
          }
          break;
        }
      }
      this.setState(state => ({
        ...state, selected: null,
        ...state, selected: selectedTem
      }))
      this.setState(state => ({
        ...state, SelectedIdMedicamneto: null,
        ...state, SelectedIdMedicamneto: ArrayTempId
      }))
      this.setState(state => ({
        ...state, selected: null,
        ...state, SelectedMedicamento: ArrayTemp
      }))

    }
    this.props.ObtenerSelecionados(selectedTem, ArrayTemp)
  }

  SetselectDrp = () => {
    this.setState(state => ({
      ...state, selectDrp: !this.state.selectDrp
    }))
  }

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

  AbrirCabeceraSegundaria = (data, k) => {
    if (this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen == true) {
      this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen = false;
      this.setState((state) => ({
        ...state, Userlists: this.props.Userlists
      }));
    } else {
      this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen = true;
      this.setState((state) => ({
        ...state, Userlists: this.props.Userlists
      }));
    };
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: '10px' }}>
          <div className="row col-md-12">
            <div className="row col-md-4">
              <Dropdown
                isOpen={this.state.selectDrp}
                toggle={() => this.SetselectDrp(!this.state.selectDrp)}
                size="sm"
              >
                <DropdownToggle caret>
                  {this.state.selected && this.state.selected.length ? (
                    <span>selected ( {this.state.selected.length} )</span>
                  ) : (
                    <span>select</span>
                  )}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => this.selectAction("selectall")}>
                    Select All
                  </DropdownItem>
                  <DropdownItem onClick={() => this.selectAction("unselectall")}>
                    Unselect All
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <h5 className="ml-2">
                <i className="fas fa-notes-medical" /> {this.props.TextoTablaCabecera}
              </h5>
            </div>


            <>
              <div className="form-group col-md-7" >
                
              </div>
            </>
          </div>
        </div>
        <Table aria-label="collapsible table">
          <TableBody>
            {this.props.Userlists.map((row, i) => (
              <>
                <TableRow>

                  <TableCell>
                    <input
                      type="checkbox"
                      value={row._id}
                      onChange={this.checkedPaciente}
                      checked={this.state.selected ? this.state.selected.includes(row._id) : false}
                    />
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
                    <div className="row">
                      <div className="font-weight-bold">
                        <i style={{ color: "#3b83bd" }} className="fas fa-circle mt-1 mr-2"></i>{row.NombreCompleto}
                      </div>{" - Edad:"}{row.Edad}{"    - "} {row.TipoDocumento} - {row.IdentificacionPaciente}
                    </div>
                    <div className="row">
                      {row.UnidadFuncional} - <i style={{ color: "green" }} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>{row.NombreCama}<i style={{ color: "#d64baa" }} className="fas fa-pills mt-1 ml-3 mr-1">:</i> {row.ArrayMedicamentos.length}<i className=" ml-3 mr-1"> Caso: {row.Caso}</i>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.NombreCentroAtencion}
                  </TableCell>
                  <TableCell>
                    <div className="row">
                      {row.FechaRegistro.substring(0, 10)}
                    </div>
                    <div className="row">
                      Hora: {row.FechaRegistro.substring(11, 16)}
                    </div>
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
                            <TableRow >
                              <TableCell></TableCell>
                              <TableCell>Referencia</TableCell>
                              <TableCell>Código</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Lote</TableCell>
                              <TableCell className="text-right">Cantidad</TableCell>
                            </TableRow>
                          </TableHead>
                          {row["ArrayMedicamentos"].map((historyRow, k) => (
                            <TableBody>
                              {historyRow["Productos"].map((RowProducto) => (
                                <TableRow>
                                  <TableCell className="text-left">
                                    {historyRow.Estado === "Recibido" ? "" : <input
                                      type="checkbox"
                                      value={historyRow.IdDetallePrescripcion}
                                      onChange={this.checkedMedicamento}
                                      Id={i}
                                      checked={this.state.SelectedMedicamento ? this.state.SelectedMedicamento.includes(historyRow.IdDetallePrescripcion) : false}
                                    />}
                                  </TableCell>
                                  <TableCell>
                                    {RowProducto.IdDetallePrescripcion}
                                  </TableCell>
                                  <TableCell>
                                    {RowProducto.Codigo}
                                  </TableCell>
                                  <TableCell>
                                    {RowProducto.Nombre}
                                  </TableCell>
                                  <TableCell>
                                    {RowProducto.Lote}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {RowProducto.Cantidad}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          ))}

                        </Table>

                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer >
    );
  }
}



export default compose(enhancer)(TablaModelo);
