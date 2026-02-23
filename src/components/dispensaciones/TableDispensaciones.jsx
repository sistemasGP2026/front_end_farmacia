import React, { useState, Fragment } from "react";
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
  selected = [], 
  actiononContact, 
  deleteSelected, 
  activePanel,
  panel, 

}) => {
  const [selectDrp, SetselectDrp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [filterDrp, setFilterDrp] = useState(false);
  const selectContact = e => {
    selectValue(e.target.value);
  };

  return (
    <Fragment>
      
  
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
                <h5 style={{color: "black"}} htmlFor="">DISPENSACIÓN</h5>
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
            
            
            <div className="filterSmallScreenmenu">
              <Dropdown
                isOpen={filterDrp}
                toggle={() => setFilterDrp(!filterDrp)}
                size="sm"
              >
                {/* <DropdownToggle tag="span">
                  <i className="fas fa-bars add-contact ml-10" />
                </DropdownToggle> */}
                <DropdownMenu>
                  <DropdownItem>
                    <div className="flex center">
                      <div>
                        <img
                          className="contact-profile-image"
                          src={ProfileLockScreen}
                          alt="profile"
                        />
                      </div>
                      <div className="fs-16 ml-2">Alice Blue</div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    className={classNames(
                      "left-panel-list",
                      panel === "all" && "box-glow"
                    )}
                    onClick={() => activePanel("all")}
                  >
                    All Contacts
                  </DropdownItem>
                  <DropdownItem
                    className={classNames(
                      "left-panel-list",
                      panel === "frequently" && "box-glow"
                    )}
                    onClick={() => activePanel("frequently")}
                  >
                    Frequently Contacted
                  </DropdownItem>
                  <DropdownItem
                    className={classNames(
                      "left-panel-list",
                      panel === "favorite" && "box-glow"
                    )}
                    onClick={() => activePanel("favorite")}
                  >
                    Favorite Contacts
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
      <div className="contact-table">
        <Scrollbars
          autoHide
          className="contact-scroll-height"
          style={{
            minHeight: "430px"
          }}
        >
          {listPacientes && listPacientes.length ? (
            <Table  hover className="mb-0">
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
                              <i style={{color: "#3b83bd"}} className="fas fa-circle mt-1 mr-1"></i>{e.NombrePaciente}-
                            </div>
                            <div className="">
                             {e.TipoID} - {e.Identificacion}-
                            </div>
                            <div className="">
                              {e.LogoSexo}
                            </div>
                            -{e.Edad + "  Años"}
                          </div>
                          <div className="row">
                            {e.UnidadFuncional} <i style={{color: "green"}} className="fas fa-procedures mt-1 ml-2 mr-1">:</i>{e.NombreCama}<i style={{color: "#d64baa"}} className="fas fa-pills mt-1 ml-3 mr-1">:</i> {e.TotalProductos}<i  className=" ml-3 mr-1"> Caso: {e.Caso}</i>
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
                        />
                      </td> */}
                      <td className="text-success font-weight-bold">PENDIENTES</td>
                      <td>{e.FechaRegistro 
                      ?<div className=""><div className="row">{e.FechaRegistro.substring(0, 10)} </div>
                      <div className="row">Hora: {e.FechaRegistro.substring(11, 16)}</div></div>
                      :""}</td>
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
    </Fragment>
  );
};

export default ContactList;
