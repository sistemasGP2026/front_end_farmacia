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

const ContactList = ({
  selectValue,
  searchInput,
  handleSearch,
  Userlists,
  selected = [],
  actiononContact,
  selectAction,
  toggleFavContact,
  deleteSelected,
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
          <div className="flex center">
            <div className="mr-1">
              <button
                onClick={() => setIsSearch(!isSearch)}
                className="search-contant"
              >
                <i className="fas fa-search"></i>
              </button>
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
            {/* <div>
              <i
                className="fas fa-plus-circle add-contact"
                onClick={() => actiononContact("add", null)}
              />
            </div> */}
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
            minHeight: "220px"
          }}
        >
          {Userlists && Userlists.length ? (
            <Table borderless hover className="mb-0">
               <thead>
                <tr>
                  <th className="pl-4">Software</th>
                  <th>Descripción</th>
                  <th>Servidor</th>
                  <th>Instancia</th>
                  <th>Puerto</th>
                  <th>Base de datos</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {Userlists.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="flex center">
                        <div className="ml-10">{e.Software}</div>
                        </div>
                      </td>
                      <td>{e.Descripcion}</td>
                      <td>{e.Servidor}</td>
                      {/* <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
                        />
                      </td> */}
                      <td>{e.Instancia}</td>
                      <td>{e.Puerto}</td>
                      <td>{e.BaseDatos}</td>
                      <td>{e.Usuario}</td>
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
            <div className="text-center no-found-message">
              No Configuraciones Data Found....
            </div>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ContactList;
