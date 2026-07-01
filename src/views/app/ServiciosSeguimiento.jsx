import React from "react";
import PageTitle from "components/common/PageTitle";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import cogoToast from "cogo-toast";
import { Ring } from "react-awesome-spinners";
import { gsUrlApi } from "config/configServer";

class ServiciosSeguimiento extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preload: false,
      data: [],
      editing: null,
      modalOpen: false,
      Codigo: "",
      Nombre: "",
      Activo: true
    };
  }

  componentDidMount() {
    this.cargarListado();
  }

  cargarListado = async () => {
    this.setState({ preload: true });
    try {
      let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
      const CodigoSede = ObjSesion?.Usuario?.Sede?.value;

      const res = await fetch(
        gsUrlApi + "/serviciosseguimiento/listar/" + CodigoSede,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json"
          }
        }
      );
      const json = await res.json();
      const datos = Array.isArray(json?.datos) ? json.datos : [];
      this.setState({ data: datos });
    } catch (err) {
      console.log("err", err);
      this.setState({ data: [] });
    } finally {
      this.setState({ preload: false });
    }
  };

  limpiar = () => {
    this.setState({
      editing: null,
      Codigo: "",
      Nombre: "",
      Activo: true
    });
  };

  abrirNuevo = () => {
    this.limpiar();
    this.setState({ modalOpen: true });
  };

  cerrarModal = () => {
    this.setState({ modalOpen: false });
    this.limpiar();
  };

  editar = item => {
    this.setState({
      editing: item,
      modalOpen: true,
      Codigo: item?.Codigo || "",
      Nombre: item?.Nombre || "",
      Activo: item?.Activo !== false
    });
  };

  guardar = async e => {
    e.preventDefault();

    if (!this.state.Codigo || !this.state.Nombre) {
      cogoToast.warn("Complete Código y Nombre", {
        position: "bottom-right",
        heading: "Validación"
      });
      return;
    }

    const isEdit = !!this.state.editing?._id;
    const url = isEdit
      ? gsUrlApi + "/serviciosseguimiento/actualizar"
      : gsUrlApi + "/serviciosseguimiento/insertar";

    this.setState({ preload: true });
    try {
      let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
      const CodigoSede = ObjSesion?.Usuario?.Sede?.value;
      const payload = {
        ...(isEdit ? { _id: this.state.editing._id } : {}),
        Codigo: this.state.Codigo,
        Nombre: this.state.Nombre,
        Activo: !!this.state.Activo,
        CodigoSede: CodigoSede
      };

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        cogoToast.error("No fue posible guardar", {
          position: "bottom-right",
          heading: "Error"
        });
      } else {
        cogoToast.success("Guardado", {
          position: "bottom-right",
          heading: "OK"
        });
        this.cerrarModal();
        this.cargarListado();
      }
    } catch (err) {
      console.log("err", err);
      cogoToast.error("No fue posible guardar", {
        position: "bottom-right",
        heading: "Error"
      });
    } finally {
      this.setState({ preload: false });
    }
  };

  eliminar = async item => {
    if (!item?._id) return;

    this.setState({ preload: true });
    try {
      const res = await fetch(gsUrlApi + "/serviciosseguimiento/eliminar", {
        method: "POST",
        body: JSON.stringify({ _id: item._id }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        cogoToast.error("No fue posible eliminar", {
          position: "bottom-right",
          heading: "Error"
        });
      } else {
        cogoToast.success("Eliminado", {
          position: "bottom-right",
          heading: "OK"
        });
        if (this.state.editing?._id === item._id) {
          this.limpiar();
        }
        this.cargarListado();
      }
    } catch (err) {
      console.log("err", err);
      cogoToast.error("No fue posible eliminar", {
        position: "bottom-right",
        heading: "Error"
      });
    } finally {
      this.setState({ preload: false });
    }
  };

  render() {
    return (
      <div>
        <PageTitle
          title="Servicios para seguimientos"
          className="plr-15"
          breadCrumb={[{ name: "Administrativos" }]}
        />

        <div className="p-15">
          <Modal
            isOpen={this.state.modalOpen}
            toggle={this.cerrarModal}
            backdrop="static"
            centered
          >
            <ModalHeader toggle={this.cerrarModal}>
              {this.state.editing ? "Editar servicio" : "Nuevo servicio"}
            </ModalHeader>
            <Form onSubmit={this.guardar}>
              <ModalBody>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Código</Label>
                      <Input
                        type="text"
                        value={this.state.Codigo}
                        onChange={e =>
                          this.setState({ Codigo: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>

                  <Col md={8}>
                    <FormGroup>
                      <Label>Nombre</Label>
                      <Input
                        type="text"
                        value={this.state.Nombre}
                        onChange={e =>
                          this.setState({ Nombre: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  disabled={this.state.preload}
                >
                  Guardar
                </Button>
                <Button
                  color="secondary"
                  type="button"
                  className="ml-2"
                  onClick={this.cerrarModal}
                  disabled={this.state.preload}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          <div className="card p-15">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="font-weight-bold">Listado</div>
              <Button color="primary" size="sm" onClick={this.abrirNuevo}>
                Nuevo
              </Button>
            </div>

            {this.state.preload ? (
              <div className="d-flex align-items-center">
                <Ring />
                <div className="ml-2">Cargando…</div>
              </div>
            ) : (
              <Table bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th style={{ width: "160px" }}>Código</th>
                    <th>Nombre</th>
                    <th style={{ width: "90px" }} className="text-center">
                      Activo
                    </th>
                    <th style={{ width: "180px" }} className="text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Sin registros
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(item => (
                      <tr key={item._id}>
                        <td>{item.Codigo || ""}</td>
                        <td>{item.Nombre || ""}</td>
                        <td className="text-center">
                          {item.Activo === false ? "No" : "Sí"}
                        </td>
                        <td className="text-center">
                          <Button
                            color="link"
                            className="p-0"
                            onClick={() => this.editar(item)}
                          >
                            Editar
                          </Button>
                          <span className="mx-2">|</span>
                          <Button
                            color="link"
                            className="p-0 text-danger"
                            onClick={() => this.eliminar(item)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ServiciosSeguimiento;
