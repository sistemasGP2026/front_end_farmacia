import React, { Fragment } from "react";
import SidebarWrapper from "./sidebar.style";
import Radium from "radium";
import NavList from "components/sidebar/NavList";
// import { sidebarData } from "util/data/sidebar";
import { LogoSios, AppName } from "helper/constant";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink } from "react-router-dom";
import IntlMessages from "util/intlMessages";
import { gsUrlApi } from '../../config/configServer';
let lstInterfaces = null;


class CargarMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mini: '',
      drawerWidth: '',
      miniDrawerWidth: '',
      onMouseEnter: '',
      onMouseLeave: '',
      sidebarTheme: '',
      layoutTheme: '',
      closeDrawer: '',
      themeSetting: '',
      SidebarData: []
    }
  }

  async componentDidMount() {

    fetch(gsUrlApi + '/interfaces/', {
      method: 'GET',
      body: JSON.stringify(),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      }
    }).then(res => res.json())
      .then(data => data)
      .then((data) => {
        if (data.interfaces.length > 0) {
          var lstData = [];
          lstData = data.interfaces;
          lstData = lstData.sort(function(a, b) {
						return a.Orden - b.Orden;
					  });
          let ObjSesion = JSON.parse(localStorage.getItem('Usuario'))
          let glstPermisos = ObjSesion.Usuario.Rol.Permisos;
          let lstDataAux = [];
          for (let j = 0; j < glstPermisos.length; j++) {
            for (let k = 0; k < lstData.length; k++) {
              if (lstData[k].id === glstPermisos[j]) {
                lstDataAux.push(lstData[k])
              }
            }
          }
          lstData = lstDataAux;
          var array = []
          lstInterfaces = lstData;
          // console.log("lstDataAux-->", lstDataAux);

          var lstMenus = lstInterfaces.filter(obj => {
            return obj.parent === "#";
          });
          lstMenus = lstMenus.sort(function(a, b) {
						return a.Orden - b.Orden;
					  });
          for (var i = 0; i < lstMenus.length; i++) {
            var objMenu = lstMenus[i];

            var objDataMenu = {};
            var objDataSub = {};


            var lstSubMenu = lstInterfaces.filter(obj => {
              return obj.parent === lstMenus[i].id;
            });

            if (lstSubMenu.length > 0) {

              var objMenu = {};
              objDataMenu.name = lstMenus[i].text;
              objDataMenu.iconClass = lstMenus[i].icon
              var ArrayChild = []
              for (let j = 0; j < lstSubMenu.length; j++) {
                var objDataSub = {};
                objDataSub.listname = lstSubMenu[j].text;
                objDataSub.routepath = lstSubMenu[j].Url;
                objDataSub.iconClass = lstSubMenu[j].icon
                ArrayChild.push(objDataSub)
              }
              objDataMenu.child = ArrayChild;
              array.push(objDataMenu)

              // child: [
              //   {
              //     listname: "sidebar.dashboard",
              //     routepath: "/dashboard",
              //     shortname: "DA"
              //   },
            } else if(lstMenus[i].Url) {
              objDataMenu.name = lstMenus[i].text;
              objDataMenu.routepath = lstMenus[i].Url;
              // objDataMenu.isDisabled = lstMenus[i].selected;
              objDataMenu.iconClass = lstMenus[i].icon
              array.push(objDataMenu)
            }

          }
        }
        this.setState(state => ({
          ...state, SidebarData: array
        }))
        // return array;

      })
      .catch(err => console.log("err", err));

  }

  render() {
    let listNameStyle;
    let sidebar;
    let sideScrollStyle;

    if (
      this.props.themeSetting.toolbarAlignValue === "above" &&
      this.props.themeSetting.footerAlignValue === "above"
    ) {
      sideScrollStyle = {
        zIndex: 5,
        height: "calc(100vh - 190px)"
      };
    } else if (this.props.themeSetting.toolbarAlignValue === "above") {
      sideScrollStyle = {
        zIndex: 5,
        height: "calc(100vh - 145px)"
      };
    } else if (this.props.themeSetting.footerAlignValue === "above") {
      sideScrollStyle = {
        zIndex: 5,
        height: "calc(100vh - 128px)"
      };
    } else {
      sideScrollStyle = {
        zIndex: 5,
        height: "calc(100vh - 75px)"
      };
    }

    if (this.props.themeSetting.sidebarTransParentValue === "on") {
      sidebar = {
        backgroundImage: `linear-gradient(0deg,rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.9)),url(${this.props.themeSetting.transparentImage})`,
        backgroundRepeat: "no-repeat, repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: this.props.mini ? this.props.miniDrawerWidth : this.props.drawerWidth,
        "@media (max-width: 991.98px)": {
          width: this.props.mini ? 0 : this.props.drawerWidth
        }
      };
    } else {
      sidebar = {
        width: this.props.mini ? this.props.miniDrawerWidth : this.props.drawerWidth,
        background: this.props.sidebarTheme.backgroundColor,
        "@media (max-width: 991.98px)": {
          width: this.props.mini ? 0 : this.props.drawerWidth
        }
      };
    }

    const closeIcon = {
      "@media (max-width: 991.98px)": {
        display: "block"
      }
    };

    if (this.props.mini) {
      listNameStyle = {
        opacity: this.props.miniDrawerWidth === this.props.drawerWidth ? 1 : 0,
        transform:
          this.props.miniDrawerWidth === this.props.drawerWidth
            ? "translateZ(0)"
            : "translate3d(-25px,0,0)"
      };
    } else {
      listNameStyle = {
        opacity: !this.props.mini ? 1 : 0,
        transform: !this.props.mini ? "translateZ(0)" : "translate3d(-25px,0,0)"
      };
    }
    return (
      <>
        <SidebarWrapper
          themeSetting={this.props.themeSetting}
          sidebarTheme={this.props.sidebarTheme}
          layoutTheme={this.props.layoutTheme}
          mini={this.props.mini}
          miniDrawerWidth={this.props.miniDrawerWidth}
          drawerWidth={this.props.drawerWidth}
        >
          {!this.props.mini && <div className="sidebar-overlay" onClick={this.props.closeDrawer()}></div>}
          <div
            id="sidebar"
            className="sidebar sideBack"
            style={sidebar}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            <div className="sidebar-header text-center">
              <NavLink to={"/"} className="simple-text logo-this.props.mini">
                <div className="logo-img text-center pb-6 mt-2">
                  <img src={LogoSios} alt="react-logo" />
                </div>
              </NavLink>
              <div className="NameApp logo-text simple-text fs-20 bold-text border-top">{AppName}</div>
            </div>
            <div
              className="close-drawer-icon"
              style={closeIcon}
              onClick={this.props.closeDrawer()}
            >
              <i className="fas fa-times-circle" />
            </div>
            <Scrollbars
              autoHide
              style={sideScrollStyle}
              renderThumbVertical={({ style, ...props }) => (
                <div {...props} className="sidebar-scrollbar-style" />
              )}
              renderThumbHorizontal={({ style, ...props }) => <div {...props} />}
              renderTrackVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    zIndex: 5,
                    position: "absolute",
                    width: "6px",
                    right: "2px",
                    bottom: "2px",
                    top: "2px",
                    borderRadius: "3px"
                  }}
                />
              )}
            >
              <div className="sidebar-wrapper">
                <ul className="nav">
                  {this.state.SidebarData.map((list, i) => {
                    return (
                      <Fragment key={i}>
                        {list.type && list.type === "heading" ? (
                          (!this.props.mini || this.props.miniDrawerWidth === this.props.drawerWidth) && (
                            <div className="sidelist-header-name">
                              {
                                <Fragment>
                                  <IntlMessages id={list.name} />
                                  {list.hasOwnProperty("isNew") && list["isNew"] && (
                                    <span
                                      style={{
                                        right: "23px"
                                      }}
                                      className="new-update-tag fs-13 bold-text"
                                    >
                                      New
                                    </span>
                                  )}
                                </Fragment>
                              }
                            </div>
                          )
                        ) : (
                          <NavList
                            listNameStyle={listNameStyle}
                            list={list}
                            mini={this.props.mini}
                            miniDrawerWidth={this.props.miniDrawerWidth}
                            drawerWidth={this.props.drawerWidth}
                            {...this.props}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </ul>
              </div>
            </Scrollbars>
          </div>
        </SidebarWrapper>
      </>
    );
  }

}

export default Radium(CargarMenu);