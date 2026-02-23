import React, { useState } from "react";
import { Table } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import classNames from "classnames";
import { ProfileLockScreen } from "helper/constant";
import { Input } from "reactstrap";
import Button from "components/button/Button";

const ContactList = ({
  selectValue,
  searchInput,
  handleSearch,
  listPacientes,
  actiononButton,
  selected = [],
  actiononContact,
  selectAction,
  toggleFavContact,
  deleteSelected,
  EditDispensacion,
  activePanel,
  panel,
}) => {
  const [selectDrp, SetselectDrp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [selected2, setSelectedValue] = useState(null);
  const [filterDrp, setFilterDrp] = useState(false);
  const selectContact = e => {
    selectValue(e.target.value);
  };
  const checkedMedicamento = async e => {
    const selectedTem = selected ? selected : [];
    if (selectedTem.includes(e.target.value)) {
      let index = selectedTem.indexOf(e.target.value);
      if (index > -1) {
        selectedTem.splice(index, 1);
      }
      await setSelectedValue(null);
      await setSelectedValue(selectedTem);
    } else {
      selectedTem.push(e.target.value);
      await setSelectedValue(null);
      await setSelectedValue(selectedTem);
    }
  }

  return (
    <div className="right-panel roe-box-shadow">
      <div className="contact-list-header">
      <div className="contact-action-dropdown flex-1">
          <Dropdown
            isOpen={selectDrp}
            toggle={() => SetselectDrp(!selectDrp)}
            size="sm"
          >
            <DropdownToggle caret>
              {selected && selected.length ? (
                <span>selected ( {selected.length} )</span>
              ) : (
                <span>select</span>
              )}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => selectAction("selectall")}>
                Select All
              </DropdownItem>
              <DropdownItem onClick={() => selectAction("unselectall")}>
                Unselect All
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="contact-table">
        <Scrollbars
          autoHide
          className="contact-scroll-height"
          style={{
            minHeight: "320px"
          }}
        >
          {listPacientes && listPacientes.length ? (
            <Table  hover className="mb-0">
              <tbody className="border">
                {listPacientes.map((e, i) => {
                  return (
                    <tr key={i} >
                      <td>
                        <div className="pretty p-svg p-curve contact-selection">
                          <input
                              type="checkbox"
                              value={e.Medicamento}
                              onChange={checkedMedicamento}
                              checked={selected ? selected.includes(e.Medicamento) : false}
                          />
                          <div className="state p-primary">
                              {/* <!-- svg path --> */}
                              <svg className="svg svg-icon" viewBox="0 0 20 20">
                              <path
                                  d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                  style={{
                                  stroke: "white",
                                  fill: "white"
                                  }}
                              />
                              </svg>
                              <label />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ml-10">
                          <div className="row">
                            <div className="font-weight-bold">
                              <i style={{color: "#3b83bd"}} className="fas fa-circle mt-1 mr-1"></i>{e.NombrePaciente}-
                            </div>
                            <div className="">
                              {e.LogoSexo}
                            </div>
                            -{e.Edad + "  Años"}
                          </div>
                          <div className="row">
                          {e.UnidadFuncional} <i style={{color: "green"}} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>{e.NombreCama} {e.LogoMedico}{e.NombreUsuario}<i style={{color: "#d64baa"}} className="fas fa-pills mt-1 ml-3 mr-1">:</i> {e.TotalProductos}
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
                        />
                      </td> */}
                      <td className="text-warning font-weight-bold">DISPENSADO</td>
                      <td>{e.FechaRegistro.substring(0, 10)}</td>
                      <td>
                        <i
                          className="fas fa-edit more-vert-icon cursor-pointer"
                          style={{ fontSize: 20 }}
                          onClick={() => actiononContact("edit", e)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
             </Table>
            
          ) : (
            <div className="text-center no-found-message" style={{color: "blue"}}>
              Cargando Datos....
            </div>
          )}
          
        </Scrollbars>
        <div className="pt-5 text-center">
          <div className="row justify-content-md-center">
            <div className="col-md-5">
             <Button className="form-control btn-primary">Recibir medicamentos seleccionados</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
