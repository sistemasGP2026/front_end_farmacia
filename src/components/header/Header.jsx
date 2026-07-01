import React, { useEffect, useState } from "react";
import HeaderWrapper from "./header.style";
import { UncontrolledPopover, PopoverBody } from "reactstrap";
import { ProfileLockScreen } from "helper/constant";
import { connect } from "react-redux";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";

const { logout } = AuthActions;
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

const Header = props => {
  const { drawerMiniMethod, mini } = props;
  const dispatch = useDispatch();
  const [Sede, setSedes] = useState([]);
  const [Bodega, setBodegas] = useState([]);
  const [Usuario, setUsuario] = useState("");
  const userSignout = () => {
    props.logout();
  };

  const ListarSedes = () => {
    let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
    if (ObjSesion.Usuario) {
      let objSede = ObjSesion.Usuario.Sede;
      let objBodega = ObjSesion.Usuario.Bodega;
      setUsuario(ObjSesion.Usuario.NombreCompleto);
      if (objSede) {
        setSedes(objSede.label);
        setBodegas(objBodega?.label);
      } else {
        props.history.push("/Login");
      }
    } else {
      props.history.push("/Login");
    }
  };

  useEffect(() => {
    ListarSedes();
  }, [dispatch]);

  return (
    <HeaderWrapper {...props}>
      <div className="headerBack">
        <div className="flex-x align-center">
          <div className="drawer-handle-arrow">
            {mini ? (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <i className="fas fa-bars"></i>
              </button>
            ) : (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <i className="fas fa-bars"></i>
              </button>
            )}
          </div>
          <div
            className="mini-drawer-menu-icon"
            onClick={() => drawerMiniMethod()}
          >
            <i className="fas fa-bars" />{" "}
            <span className="app-name fs-16 bold-text">{"Roe"}</span>
          </div>
          <div className="pl-10 mr-4">
            <label>Sede: {Sede}</label>
          </div>
          <div className="pl-2 flex-1">
            <label>Bodega: {Bodega}</label>
          </div>

          <div className="pl-10 pr-3 flex">
            <label className="mt-2 mr-2" style={{ fontSize: "smaller" }}>
              {Usuario}
            </label>
            <div id="profile" className="cursor-pointer">
              <img
                className="top-header-profile-class"
                src={ProfileLockScreen}
                alt="notify"
              />
            </div>

            <UncontrolledPopover
              className="roy-menu"
              innerClassName="roy-inner-content"
              placement="bottom-end"
              target="profile"
              trigger="legacy"
            >
              <PopoverBody>
                <div
                  className="roy-menu-list"
                  onClick={() => props.history.push("/profile")}
                >
                  Perfil
                </div>
                <div className="roy-menu-list">Configuración</div>
                <div className="roy-menu-list" onClick={userSignout}>
                  Cerrar Sesión
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default compose(withRouter, connect(null, { logout }))(Header);
