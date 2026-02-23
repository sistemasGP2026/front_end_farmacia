import React, { useState } from "react";
import { Table } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import classNames from "classnames";
import { ProfileLockScreen } from "helper/constant";
import { Input } from "reactstrap";

const ContactList = (
  {
    selectValue,
    searchInput,
    handleSearch,
    Userlists,
    selected = [],
    actiononContact,
    Consultar,
    selectAction,
    toggleFavContact,
    deleteSelected,
    activePanel,
    panel,
  },
  props
) => {
  const [selectDrp, SetselectDrp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [filterDrp, setFilterDrp] = useState(false);
  const selectContact = (e) => {
    selectValue(e.target.value);
  };

  return (
    <div className="right-panel roe-box-shadow">
      <div className="contact-list-header">
        <div className="form-group col-md-5">
          <h5>
            <i className="fas fa-user" /> Usuarios
          </h5>
        </div>
        <>
          <div
            className="searchStyle pos-relative mr-3"
            style={{ width: "400px" }}
          >
            <i className="fas fa-search close-search"></i>
            <Input
              // value={this.state.value}
              placeholder="Buscar "
              className="react-form-search-input"
              onChange={(ev) => Consultar(ev)}
            />
          </div>
          <div>
            <button
              className="btn text-white btn-sm cursor-pointer"
              style={{ "background-color": "rgb(86, 60, 145)" }}
              onClick={() => actiononContact("nuevo", null)}
            >
              <i className="fas mr-1 fa-plus text-white" />
              Agregar
            </button>
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
          {Userlists && Userlists.length ? (
            <Table striped bordered hover className="mb-0">
              <thead>
                <tr>
                  <th className="pl-4">Identificación</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Celular</th>
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {Userlists.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="flex center">
                          <div className="ml-10">
                            {e.TipoIdentificacion}-{e.Identificacion}
                          </div>
                        </div>
                      </td>
                      <td>{e.NombreCompleto}</td>
                      <td>{e.Email}</td>
                      {/* <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
                        />
                      </td> */}
                      <td>{e.Celular}</td>
                      <td>{e.Activo}</td>
                      <td>
                        <i
                          className="fas fa-edit more-vert-icon cursor-pointer"
                          style={{ fontSize: 20, color: "blue" }}
                          onClick={() => actiononContact("edit", e)}
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
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ContactList;
