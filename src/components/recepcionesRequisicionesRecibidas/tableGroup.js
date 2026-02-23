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
  DropdownItem,
} from "reactstrap";
import { toNumber } from "reactstrap/lib/utils";

class TablaModelo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      Lista1: [],
      selected: [],
      selectDrp: false,
      SelectedMedicamento: [],
      SelectedIdMedicamento: [],
      recibido: [],
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
        ...state,
        Lista1: this.props.Userlists,
      }));
    }
  };

  selectAction = (action) => {
    if (action === "selectall") {
      const ids = this.props.Userlists.map((a) => a._id);
      this.setState((state) => ({
        ...state,
        selected: ids,
      }));
    } else if (action === "unselectall") {
      this.setState((state) => ({
        ...state,
        selected: null,
      }));
    }
  };

  checkedMedicamento = (e) => {
    const selectedTem = this.state.SelectedMedicamento
      ? this.state.SelectedMedicamento
      : [];
    const selectedTemId = this.state.SelectedIdMedicamento
      ? this.state.SelectedIdMedicamento
      : [];
    if (selectedTem.includes(e.target.value)) {
      let index = selectedTem.indexOf(e.target.value);
      if (index > -1) {
        selectedTem.splice(index, 1);
        selectedTemId.splice(index, 1);
      }
      this.setState((state) => ({
        ...state,
        SelectedMedicamento: null,
        ...state,
        SelectedMedicamento: selectedTem,
      }));
      this.setState((state) => ({
        ...state,
        SelectedIdMedicamneto: null,
        ...state,
        SelectedIdMedicamneto: selectedTemId,
      }));
    } else {
      selectedTem.push(e.target.value);
      selectedTemId.push(this.props.Userlists[e.target.id]._id);
      this.setState((state) => ({
        ...state,
        SelectedMedicamento: null,
        ...state,
        SelectedMedicamento: selectedTem,
      }));
      this.setState((state) => ({
        ...state,
        SelectedIdMedicamneto: null,
        ...state,
        SelectedIdMedicamneto: selectedTemId,
      }));
    }
    this.props.ObtenerSelecionados(selectedTemId, selectedTem);
  };

  checkedPaciente = (e) => {
    let selectedTem = this.state.selected ? this.state.selected : [];
    let ArrayTemp = this.state.SelectedMedicamento
      ? this.state.SelectedMedicamento
      : [];
    let ArrayTempId = this.state.SelectedIdMedicamento
      ? this.state.SelectedIdMedicamento
      : [];
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
      ArrayTempId = ArrayTempId.filter((data) => {
        return data != "";
      });
      ArrayTemp = ArrayTempId.filter((data) => {
        return data != "";
      });
      this.setState((state) => ({
        ...state,
        SelectedMedicamento: null,
        ...state,
        SelectedMedicamento: ArrayTemp,
      }));
      this.setState((state) => ({
        ...state,
        SelectedIdMedicamneto: null,
        ...state,
        SelectedIdMedicamneto: ArrayTempId,
      }));
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
    } else {
      selectedTem.push(e.target.value);
      for (let i = 0; i < this.props.Userlists.length; i++) {
        if (this.props.Userlists[i]._id == e.target.value) {
          for (
            let k = 0;
            k < this.props.Userlists[i].ArrayMedicamentos.length;
            k++
          ) {
            ArrayTemp.push(
              this.props.Userlists[i].ArrayMedicamentos[k].Consecutivo
            );
            ArrayTempId.push(this.props.Userlists[i]._id);
          }
          break;
        }
      }
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        selected: selectedTem,
      }));
      this.setState((state) => ({
        ...state,
        SelectedIdMedicamneto: null,
        ...state,
        SelectedIdMedicamneto: ArrayTempId,
      }));
      this.setState((state) => ({
        ...state,
        selected: null,
        ...state,
        SelectedMedicamento: ArrayTemp,
      }));
    }
    this.props.ObtenerSelecionados(selectedTem, ArrayTemp);
  };

  SetselectDrp = () => {
    this.setState((state) => ({
      ...state,
      selectDrp: !this.state.selectDrp,
    }));
  };

  onInputchange = (data) => {
    if (data) {
      let name = data.target.name;
      let value = data.target.value;
      this.setState((state) => ({
        ...state,
        [name]: value,
      }));
    }
  };

  AbrirCabeceraPrincipal = (data) => {
    if (this.props.Userlists[data].EstadoOpen == true) {
      this.props.Userlists[data].EstadoOpen = false;
      this.setState((state) => ({
        ...state,
        Userlists: this.props.Userlists,
      }));
    } else {
      this.props.Userlists[data].EstadoOpen = true;
      this.setState((state) => ({
        ...state,
        Userlists: this.props.Userlists,
      }));
    }
  };

  AbrirCabeceraSegundaria = (data, k) => {
    if (this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen == true) {
      this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen = false;
      this.setState((state) => ({
        ...state,
        Userlists: this.props.Userlists,
      }));
    } else {
      this.props.Userlists[data].ArrayMedicamentos[k].EstadoOpen = true;
      this.setState((state) => ({
        ...state,
        Userlists: this.props.Userlists,
      }));
    }
  };

  ObtenerValorParcial = (ObjValor, index, k) => {
    this.props.Userlists[index]["ArrayMedicamentos"][k].ValorParcial =
      ObjValor.target.value;
    let recibido =
      this.props.Userlists[index]["ArrayMedicamentos"][k].Cantidad -
      this.props.Userlists[index]["ArrayMedicamentos"][k].ValorParcial;
    this.props.Userlists[index]["ArrayMedicamentos"][k].Pendiente = recibido;
    this.componentDidMount();
  };

  render() {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: "10px" }}>
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
                  <DropdownItem
                    onClick={() => this.selectAction("unselectall")}
                  >
                    Unselect All
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <h5 className="ml-2">
                <i className="fas fa-notes-medical" />{" "}
                {this.props.TextoTablaCabecera}
              </h5>
            </div>

            <>
              <div className="form-group col-md-7"></div>
            </>
          </div>
        </div>
        <Table aria-label="collapsible table">
          <TableBody>
            {this.props.Userlists.map((row, i) => (
              <>
                <TableRow>
                  <TableCell>
                    {/* <input
                      type="checkbox"
                      value={row._id}
                      onChange={this.checkedPaciente}
                      checked={
                        this.state.selected
                          ? this.state.selected.includes(row._id)
                          : false
                      }
                    /> */}
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
                        <i
                          style={{ color: "#3b83bd" }}
                          className="fas fa-circle mt-1 mr-2"
                        ></i>
                        {row.Usuario}
                      </div>
                      {" - Sede:"}
                      {row.Destino}
                      {"    - "} {row.Unidades} - {row.Estado}
                    </div>
                    <div className="row">
                      {row.UnidadFuncional} -{" "}
                      <i
                        style={{ color: "#d64baa" }}
                        className="fas fa-pills mt-1 ml-3 mr-1"
                      >
                        :
                      </i>{" "}
                      {row.ArrayMedicamentos.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="row">
                      {row.txtFechaRegistroDispensacion
                        ? row.txtFechaRegistroDispensacion
                        : ""}
                    </div>
                    <div className="row">
                      Hora:{" "}
                      {row.txtHoraRegistroDispensacion
                        ? row.txtHoraRegistroDispensacion
                        : ""}
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
                            <TableRow>
                              <TableCell>Código</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Recibido</TableCell>
                              <TableCell>Restante</TableCell>
                            </TableRow>
                          </TableHead>
                          {row["ArrayMedicamentos"].map((historyRow, k) => (
                            <TableBody>
                              {historyRow["Productos"].map((RowProducto) => (
                                <TableRow>
                                  {historyRow.Estado === "Recibido" ? (
                                    <TableCell>{historyRow.Codigo}</TableCell>
                                  ) : (
                                    ""
                                  )}
                                  {historyRow.Estado === "Recibido" ? (
                                    <TableCell>
                                      {historyRow.Descripcion}
                                    </TableCell>
                                  ) : (
                                    ""
                                  )}
                                  {historyRow.Estado === "Recibido" ? (
                                    <TableCell>
                                      {historyRow.ValorParcial}
                                    </TableCell>
                                  ) : (
                                    ""
                                  )}
                                  {historyRow.Estado === "Recibido" ? (
                                    <TableCell>
                                      {historyRow.Pendiente}
                                    </TableCell>
                                  ) : (
                                    ""
                                  )}
                                  {historyRow.Estado === "Recibido" ? (
                                    <TableCell className="text-center">
                                      {historyRow.Estado === "Dispensado" ? (
                                        <button
                                          type="button"
                                          className="text-white text-12"
                                          disabled
                                          style={{
                                            background: "blueviolet",
                                            border: "0px",
                                            padding: "5px",
                                            borderRadius: "15px",
                                          }}
                                        >
                                          {historyRow.Estado}
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="text-12 text-white"
                                          disabled
                                          style={{
                                            background: "limegreen",
                                            border: "0px",
                                            padding: "5px",
                                            borderRadius: "15px",
                                          }}
                                        >
                                          {historyRow.Estado}
                                        </button>
                                      )}
                                    </TableCell>
                                  ) : (
                                    ""
                                  )}

                                  {/* <TableCell className="text-left">
                                    {historyRow.Estado === "Recibido" ? (
                                      ""
                                    ) : (
                                      <input
                                        type="checkbox"
                                        value={historyRow.Consecutivo}
                                        onChange={this.checkedMedicamento}
                                        Id={i}
                                        checked={
                                          this.state.SelectedMedicamento
                                            ? this.state.SelectedMedicamento.includes(
                                                historyRow.Consecutivo
                                              )
                                            : false
                                        }
                                      />
                                    )}
                                  </TableCell> */}
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
      </TableContainer>
    );
  }
}

export default compose(enhancer)(TablaModelo);
