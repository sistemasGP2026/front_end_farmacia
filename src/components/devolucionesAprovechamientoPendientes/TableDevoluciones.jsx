import React, { useState } from "react";
import { Table } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { Scrollbars } from "react-custom-scrollbars";
import { Input } from "reactstrap";
import Button from "components/button/Button";
import "./Estilos.css";

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
  panel
}) => {
  const [selectDrp, SetselectDrp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [filterDrp, setFilterDrp] = useState(false);
  const selectContact = e => {
    selectValue(e.target.value);
  };

  return (

    <div className="right-panel roe-box-shadow">
      <div className="contact-list-header">
        {/* <div>
        <Button  
          type="link" 
          onClick={() => actiononButton("nuevo")}
          className="btn btn-link ml-2 ">
          Dispensaión de Requisiciones
        </Button>
        </div> */}
        {isSearch && (
          <div className="searchStyle pos-relative">
            <Input
              value={searchInput}
              placeholder="Search Contacts"
              className="react-form-search-input"
              onChange={e => handleSearch(e)}
            />
            <i
              onClick={() => setIsSearch(false)}
              className="fas fa-times close-search"
            ></i>
          </div>
        )}
        {!isSearch && (
          <div className="mx-auto">
            <div className="row ">
              <div className="font-weight-bold" >
                <h5 style={{ color: "black" }} htmlFor="">DEVOLUCIÓN</h5>
              </div>
            </div>


            {selected && selected.length ? (
              <div>
                <i
                  className="fas fa-trash fs-18 add-contact mr-10"
                  onClick={deleteSelected()}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
      <div className="contact-table">
        <Scrollbars
          autoHide
          className="contact-scroll-height"
          style={{
            minHeight: "420px"
          }}
        >
          {listPacientes && listPacientes.length ? (
            <Table hover className="mb-0">
              <tbody className="border">
                {listPacientes.map((e, i) => {
                  return (
                    <tr key={i} >
                      <td>
                        <div className="flex center">
                          <div className="ml-10"><i className="far fa-2x fa-user-circle"></i></div>

                        </div>
                      </td>
                      <td>
                        <div className="ml-10">
                          <div className="row">
                            <div className="font-weight-bold">
                              <i style={{ color: "#3b83bd" }} className="fas fa-circle mt-1 mr-1"></i>{e.NombrePaciente}{"-"}
                            </div>{e.TipoDocumento} - {e.IdentificacionPaciente}
                          </div>
                          <div className="row">
                            {e.Sede} {"  "} <i style={{ color: "#d64baa" }} className="fas fa-pills mt-1 ml-3 mr-1">:</i> {e.ArrayMedicamentos.length}
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
                        />
                      </td> */}
                      <td className="text-secondary font-weight-bold">
                        {e.NombreUsuario ?
                          <>
                            <div className="row ">
                              <div className="mx-auto">
                                <spam>Devolvió</spam>
                              </div>
                            </div>
                            <div className="text-center">{e.NombreUsuario} </div></>
                          : ""} 
                      </td>
                      <td> <div className="row">
                        {e.FechaRegistro.substring(0, 10)}
                      </div>
                        <div className="row">
                          Hora: {e.FechaRegistro.substring(11, 16)}
                        </div></td>
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
            <h3>Datos No Encontrados....</h3> 
          </div>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ContactList;
