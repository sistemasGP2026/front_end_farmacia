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
        <div className="contact-action-dropdown flex-1">
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
        </div>
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
                  <th className="pl-4">Codigo</th>
                  <th>Nombre</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {Userlists.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="flex center">
                          <div className="ml-10">{e.code}</div>
                        </div>
                      </td>
                      <td>{e.name}</td>
                      <td>
                        <i
                          className="fas fa-edit more-vert-icon"
                          onClick={() => actiononContact("edit", e)}
                        />
                      </td>
                      <td>
                        <i
                          className="fas fa-trash more-vert-icon"
                          onClick={() => actiononContact("delete", e)}
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
