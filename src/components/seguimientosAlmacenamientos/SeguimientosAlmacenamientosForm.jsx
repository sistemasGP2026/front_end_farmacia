import React from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table
} from "reactstrap";
import { gsUrlApi } from "config/configServer";
import cogoToast from "cogo-toast";
import { Ring } from "react-awesome-spinners";

const FORM_META = {
  codigo: "PPS-FR-020",
  version: "4",
  fecha: getLocalDateInputValue()
};

const ASPECTOS = [
  { tipo: "SECCION", codigo: "1", titulo: "ALMACENAMIENTO" },
  {
    tipo: "ITEM",
    codigo: "1.1",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Los medicamentos, dispositivos médicos, reactivos se encuentran almacenados correctamente, se encuentran limpios de polvo y suciedad?"
  },
  {
    tipo: "ITEM",
    codigo: "1.2",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Los pisos, muros y techos se encuentran limpios, libres de humedad y en buen estado de conservación e iluminación?"
  },
  {
    tipo: "ITEM",
    codigo: "1.3",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿El área de almacenamiento de medicamentos, dispositivos médicos, reactivos está siendo utilizada para tal fin?"
  },
  {
    tipo: "ITEM",
    codigo: "1.4",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿El área destinada para disposición de residuos se está utilizando adecuadamente?"
  },
  {
    tipo: "ITEM",
    codigo: "1.5",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿La nevera está siendo utilizada única y exclusivamente para el almacenamiento de los medicamentos o reactivos?"
  },
  {
    tipo: "ITEM",
    codigo: "1.6",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Está restringida la entrada al personal ajeno al área de almacenamiento?"
  },
  {
    tipo: "ITEM",
    codigo: "1.7",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Se controlan las condiciones de temperatura y humedad? ¿Se registran?"
  },
  {
    tipo: "ITEM",
    codigo: "1.8",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Los instrumentos para el control de las condiciones ambientales cuentan con calibración vigente?"
  },
  {
    tipo: "ITEM",
    codigo: "1.9",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Los medicamentos que se encuentran almacenados en los cajetines del carro de medicamentos correspondientes a cada uno de los pacientes coinciden con los dispensados por farmacia?"
  },
  {
    tipo: "ITEM",
    codigo: "1.10",
    seccion: "ALMACENAMIENTO",
    pregunta:
      "¿Los cajetines del carro de medicamentos utilizados para el almacenamiento de los medicamentos se encuentran en buenas condiciones de higiene?"
  },
  { tipo: "SECCION", codigo: "2", titulo: "ADMINISTRACIÓN DE MEDICAMENTOS" },
  {
    tipo: "ITEM",
    codigo: "2.1",
    seccion: "ADMINISTRACIÓN DE MEDICAMENTOS",
    pregunta:
      "¿Los medicamentos a administrar son rotulados con la información del paciente?"
  },
  {
    tipo: "ITEM",
    codigo: "2.2",
    seccion: "ADMINISTRACIÓN DE MEDICAMENTOS",
    pregunta:
      "¿Se verificó que el medicamento a administrar correspondía a lo prescrito?"
  },
  {
    tipo: "ITEM",
    codigo: "2.3",
    seccion: "ADMINISTRACIÓN DE MEDICAMENTOS",
    pregunta: "¿Se verificó que la dosis a aplicar correspondía a lo prescrito?"
  },
  {
    tipo: "ITEM",
    codigo: "2.4",
    seccion: "ADMINISTRACIÓN DE MEDICAMENTOS",
    pregunta: "¿Se utilizó el vehículo adecuado o indicado en la preparación?"
  },
  {
    tipo: "ITEM",
    codigo: "2.5",
    seccion: "ADMINISTRACIÓN DE MEDICAMENTOS",
    pregunta:
      "¿La administración del medicamento fue realizada según la frecuencia definida por personal asistencial?"
  },
  { tipo: "SECCION", codigo: "3", titulo: "OTROS" },
  {
    tipo: "ITEM",
    codigo: "3.1",
    seccion: "OTROS",
    pregunta: "¿El carro de paro cuenta con termohigrómetro?"
  },
  {
    tipo: "ITEM",
    codigo: "3.2",
    seccion: "OTROS",
    pregunta: "¿El carro de paro cuenta con el sello de seguridad?"
  },
  {
    tipo: "ITEM",
    codigo: "3.3",
    seccion: "OTROS",
    pregunta:
      "¿Se registran las condiciones adecuadas de temperatura y humedad?"
  },
  {
    tipo: "ITEM",
    codigo: "3.4",
    seccion: "OTROS",
    pregunta:
      "¿Los medicamentos suspendidos son devueltos oportunamente a la farmacia?"
  }
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getLocalDateInputValue(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function getLocalTimeInputValue(date = new Date()) {
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  return `${hh}:${mm}`;
}

function getNombreUsuarioSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem("Usuario") || "null");
    return (
      sesion?.Usuario?.NombreCompleto ||
      sesion?.Usuario?.Nombre ||
      sesion?.Usuario?.usuario ||
      ""
    );
  } catch (e) {
    return "";
  }
}

function getIdUsuarioSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem("Usuario") || "null");
    return (
      sesion?.Usuario?._id ||
      sesion?.Usuario?.IdUsuario ||
      sesion?.Usuario?.id ||
      ""
    );
  } catch (e) {
    return "";
  }
}

function buildInitialAspectos() {
  const aspectos = [];
  ASPECTOS.forEach(row => {
    if (row.tipo !== "ITEM") return;
    const evidencias = Array.isArray(row.EvidenciaUrls)
      ? row.EvidenciaUrls.filter(Boolean)
      : row.EvidenciaUrl
      ? [row.EvidenciaUrl]
      : [];
    aspectos.push({
      Codigo: row.codigo,
      Seccion: row.seccion,
      Pregunta: row.pregunta,
      Resultado: row.Resultado || "",
      Observaciones: row.Observaciones || "",
      EvidenciaUrl: evidencias[0] || "",
      EvidenciaUrls: evidencias
    });
  });
  return aspectos;
}

function normalizeAspectosFromSaved(aspectosSaved = []) {
  const savedByCode = new Map(
    (Array.isArray(aspectosSaved) ? aspectosSaved : [])
      .filter(a => a && a.Codigo)
      .map(a => [String(a.Codigo), a])
  );

  return buildInitialAspectos().map(base => {
    const saved = savedByCode.get(String(base.Codigo));
    if (!saved) return base;

    const evidencias = Array.from(
      new Set(
        [
          saved.EvidenciaUrl,
          ...(Array.isArray(saved.EvidenciaUrls) ? saved.EvidenciaUrls : [])
        ]
          .map(u => String(u || "").trim())
          .filter(Boolean)
      )
    );

    return {
      ...base,
      Resultado: saved.Resultado || "",
      Observaciones: saved.Observaciones || "",
      EvidenciaUrl: evidencias[0] || "",
      EvidenciaUrls: evidencias
    };
  });
}

function buildFormStateFromInitialData(initialData) {
  const now = new Date();

  if (!initialData) {
    return {
      _id: "",
      Servicio: "",
      ServicioId: "",
      ServicioNombre: "",
      Fecha: getLocalDateInputValue(now),
      Hora: getLocalTimeInputValue(now),
      RealizadoPorId: getIdUsuarioSesion(),
      RealizadoPor: getNombreUsuarioSesion(),
      RevisadoPor: "",
      RevisadoPorFirma: "",
      Aspectos: buildInitialAspectos()
    };
  }

  return {
    _id: initialData._id || "",
    Servicio: initialData.Servicio || "",
    ServicioId: initialData.ServicioId || "",
    ServicioNombre: initialData.ServicioNombre || "",
    Fecha: initialData.Fecha
      ? getLocalDateInputValue(new Date(initialData.Fecha))
      : getLocalDateInputValue(now),
    Hora: initialData.Hora || getLocalTimeInputValue(now),
    RealizadoPorId: initialData.RealizadoPorId || getIdUsuarioSesion(),
    RealizadoPor: initialData.RealizadoPor || getNombreUsuarioSesion(),
    RevisadoPor: initialData.RevisadoPor || "",
    RevisadoPorFirma: initialData.RevisadoPorFirma || "",
    Aspectos: normalizeAspectosFromSaved(initialData.Aspectos)
  };
}

class SeguimientosAlmacenamientosForm extends React.Component {
  constructor(props) {
    super(props);

    this.signatureCanvasRef = React.createRef();
    this.isSigning = false;
    this.lastPoint = null;

    const initialForm = buildFormStateFromInitialData(
      props.initialData || null
    );

    this.state = {
      ...initialForm,
      isSaving: false,
      uploading: {},
      serviciosSeguimiento: []
    };
  }

  componentDidMount() {
    this.cargarServiciosSeguimiento();

    const nombreUsuario = getNombreUsuarioSesion();
    const idUsuario = getIdUsuarioSesion();
    if (
      (nombreUsuario && !this.state.RealizadoPor) ||
      (idUsuario && !this.state.RealizadoPorId)
    ) {
      this.setState({
        RealizadoPor: this.state.RealizadoPor || nombreUsuario,
        RealizadoPorId: this.state.RealizadoPorId || idUsuario
      });
    }

    // Inicializa el canvas con fondo blanco y, si existe, pinta la firma actual.
    this.resetSignatureCanvas();
    this.syncSignatureCanvasWithState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialData !== this.props.initialData) {
      const next = buildFormStateFromInitialData(
        this.props.initialData || null
      );
      this.setState({ ...next, uploading: {} }, () => {
        this.resetSignatureCanvas();
        this.syncSignatureCanvasWithState();
      });
    }
  }

  syncSignatureCanvasWithState = () => {
    const firma = String(this.state.RevisadoPorFirma || "").trim();
    if (!firma) return;

    const canvas = this.signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const src = firma.startsWith("data:")
      ? firma
      : `data:image/png;base64,${firma}`;
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = src;
  };

  getCanvasPoint = (clientX, clientY) => {
    const canvas = this.signatureCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  resetSignatureCanvas = () => {
    const canvas = this.signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpia y deja fondo blanco
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    this.isSigning = false;
    this.lastPoint = null;
  };

  startSigning = pt => {
    if (!pt) return;
    this.isSigning = true;
    this.lastPoint = pt;
  };

  drawTo = pt => {
    if (!this.isSigning || !pt) return;
    const canvas = this.signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const from = this.lastPoint;
    if (!from) {
      this.lastPoint = pt;
      return;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    this.lastPoint = pt;
  };

  endSigning = () => {
    if (!this.isSigning) return;
    this.isSigning = false;
    this.lastPoint = null;

    const canvas = this.signatureCanvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      this.setState({ RevisadoPorFirma: dataUrl });
    } catch (e) {
      // noop
    }
  };

  cargarServiciosSeguimiento = async () => {
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
      this.setState({ serviciosSeguimiento: datos });
    } catch (err) {
      console.log("err", err);
      this.setState({ serviciosSeguimiento: [] });
    }
  };

  setAspecto = (codigo, patch) => {
    this.setState(state => ({
      ...state,
      Aspectos: state.Aspectos.map(a =>
        a.Codigo === codigo ? { ...a, ...patch } : a
      )
    }));
  };

  getAspecto = codigo => {
    return this.state.Aspectos.find(a => a.Codigo === codigo);
  };

  getAspectoEvidencias = aspecto => {
    if (!aspecto) return [];
    const urlsArray = Array.isArray(aspecto.EvidenciaUrls)
      ? aspecto.EvidenciaUrls
      : [];
    const single = aspecto.EvidenciaUrl ? [aspecto.EvidenciaUrl] : [];
    return Array.from(
      new Set(
        [...single, ...urlsArray]
          .map(u => String(u || "").trim())
          .filter(Boolean)
      )
    );
  };

  setAspectoEvidencias = (codigo, urls) => {
    const normalized = Array.from(
      new Set(
        (Array.isArray(urls) ? urls : [])
          .map(u => String(u || "").trim())
          .filter(Boolean)
      )
    );
    this.setAspecto(codigo, {
      EvidenciaUrls: normalized,
      EvidenciaUrl: normalized[0] || ""
    });
  };

  removeAspectoEvidencia = (codigo, urlToRemove) => {
    const aspecto = this.getAspecto(codigo);
    const current = this.getAspectoEvidencias(aspecto);
    const updated = current.filter(u => u !== urlToRemove);
    this.setAspectoEvidencias(codigo, updated);
  };

  Guardar = async e => {
    e.preventDefault();

    const pendientes = this.state.Aspectos.filter(a => !a.Resultado);
    if (!this.state.ServicioId || !this.state.Fecha || !this.state.Hora) {
      cogoToast.warn("Complete Servicio, Fecha y Hora", {
        position: "bottom-right",
        heading: "Validación"
      });
      return;
    }
    if (pendientes.length > 0) {
      cogoToast.warn("Hay ítems sin seleccionar (Resultado)", {
        position: "bottom-right",
        heading: "Validación"
      });
      return;
    }

    this.setState({ isSaving: true });
    try {
      let ObjSesion = JSON.parse(localStorage.getItem("Usuario"));
      const CodigoSede = ObjSesion?.Usuario?.Sede?.value;

      const payload = {
        _id: this.state._id || undefined,
        Servicio: this.state.Servicio,
        ServicioId: this.state.ServicioId,
        ServicioNombre: this.state.ServicioNombre,
        Fecha: this.state.Fecha
          ? new Date(`${this.state.Fecha}T00:00:00`)
          : null,
        Hora: this.state.Hora,
        Aspectos: this.state.Aspectos,
        RealizadoPorId: this.state.RealizadoPorId,
        RealizadoPor: this.state.RealizadoPor,
        RevisadoPor: this.state.RevisadoPor,
        RevisadoPorFirma: this.state.RevisadoPorFirma,
        CodigoSede: CodigoSede,
        UsuarioCambioId: getIdUsuarioSesion(),
        UsuarioCambioNombre: getNombreUsuarioSesion()
      };

      const isEditMode = !!this.state._id;
      const endpoint = isEditMode
        ? "/seguimientosalmacenamientos/actualizar"
        : "/seguimientosalmacenamientos/insertar";

      const res = await fetch(gsUrlApi + endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json"
        }
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        cogoToast.error("Hubo un error al guardar el registro", {
          position: "bottom-right",
          heading: "Error"
        });
      } else {
        cogoToast.success(
          isEditMode
            ? "Registro actualizado exitosamente"
            : "Registro guardado exitosamente",
          {
            position: "bottom-right",
            heading: isEditMode ? "Actualizado" : "Guardado"
          }
        );
        if (typeof this.props.onSaved === "function") {
          this.props.onSaved(data);
        }

        if (!isEditMode) {
          const resetState = buildFormStateFromInitialData(null);
          this.setState({ ...resetState }, () => {
            this.resetSignatureCanvas();
          });
        }
      }
    } catch (err) {
      console.log("err", err);
      cogoToast.error("Hubo un error al guardar el registro", {
        position: "bottom-right",
        heading: "Error"
      });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  subirEvidencia = (codigo, selectedFile) => {
    if (!selectedFile) return;

    this.setState(state => ({
      uploading: {
        ...state.uploading,
        [codigo]: true
      }
    }));

    const fileName = selectedFile?.name || "";
    const lastDot = fileName.lastIndexOf(".");
    const fileExt = lastDot >= 0 ? fileName.slice(lastDot) : "";
    const fileBase = lastDot >= 0 ? fileName.slice(0, lastDot) : fileName;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = reader.result;
        const base64String =
          typeof result === "string" ? result.split(",")[1] : "";

        const Usuario = JSON.parse(localStorage.getItem("Usuario") || "null");
        let ProyectoS3 = {
          Codigo: "GESTIONSALUD",
          Usuario: "gestionsalud",
          Clave: "Z3MxX3h4eHg="
        };
        let IdEmpresaS3 = "6AF25417-ED9F-4AB5-8EEF-AF92C7AE9840";
        let DefaultConexionAWS = "false";
        let Empresa = Usuario?.Empresa || "";

        const nombreArchivo =
          "Evidencia_Seguimientos_" +
          Empresa +
          "_" +
          codigo +
          "_" +
          fileBase +
          "_" +
          new Date().getTime() +
          fileExt;

        let body = {
          IdEmpresa: IdEmpresaS3,
          DefaultConexionAWS: DefaultConexionAWS,
          Proyecto: ProyectoS3,
          Directorio: "Imagenes",
          NombreArchivo: nombreArchivo,
          ArchivoBase64String: base64String
        };

        const res = await fetch(
          gsUrlApi + "/seguimientosalmacenamientos/evidencia/upload",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Accept: "application/json"
            }
          }
        );
        const responseS3 = await res.json();

        const urlEvidencia =
          responseS3?.datos?.UrlEvidencia || responseS3?.datos?.RutaS3;
        const evidenciaFinal =
          typeof urlEvidencia === "string" && urlEvidencia.startsWith("/")
            ? `${gsUrlApi}${urlEvidencia}`
            : urlEvidencia;

        if (evidenciaFinal) {
          const aspecto = this.getAspecto(codigo);
          const evidenciasActuales = this.getAspectoEvidencias(aspecto);
          this.setAspectoEvidencias(codigo, [
            ...evidenciasActuales,
            evidenciaFinal
          ]);

          cogoToast.success("Evidencia subida", {
            position: "bottom-right",
            heading: "OK"
          });
        } else {
          cogoToast.error("No fue posible subir la evidencia", {
            position: "bottom-right",
            heading: "Error"
          });
          return;
        }
      } catch (err) {
        console.log("err", err);
        cogoToast.error("No fue posible subir la evidencia", {
          position: "bottom-right",
          heading: "Error"
        });
        return;
      } finally {
        this.setState(state => {
          const uploading = { ...(state.uploading || {}) };
          delete uploading[codigo];
          return { uploading };
        });
      }
    };
    reader.onerror = () => {
      cogoToast.error("No fue posible subir la evidencia", {
        position: "bottom-right",
        heading: "Error"
      });
      return;
    };
    reader.readAsDataURL(selectedFile); // Convertimos el archivo a Base64
  };

  renderResultadoCell(row) {
    const aspecto = this.getAspecto(row.codigo);
    if (!aspecto) return null;

    return (
      <td>
        <Input
          type="select"
          value={aspecto.Resultado || ""}
          onChange={e =>
            this.setAspecto(row.codigo, { Resultado: e.target.value })
          }
        >
          <option value="">Seleccione...</option>
          <option value="CUMPLE">Cumple</option>
          <option value="NO_CUMPLE">No cumple</option>
          <option value="NA">No aplica</option>
        </Input>
      </td>
    );
  }

  renderObservacionesCell(row) {
    const aspecto = this.getAspecto(row.codigo);
    if (!aspecto) return null;
    return (
      <td>
        <Input
          type="text"
          value={aspecto.Observaciones || ""}
          onChange={e =>
            this.setAspecto(row.codigo, { Observaciones: e.target.value })
          }
        />
      </td>
    );
  }

  renderEvidenciaCell(row) {
    const aspecto = this.getAspecto(row.codigo);
    if (!aspecto) return null;

    const evidencias = this.getAspectoEvidencias(aspecto);
    const isUploading = !!this.state.uploading?.[row.codigo];
    const inputAdjuntarId = `evidencia_adjuntar_${row.codigo}`;
    const inputCamaraId = `evidencia_camara_${row.codigo}`;
    const inputManualId = `evidencia_manual_${row.codigo}`;

    return (
      <td>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center">
            <Input
              id={inputManualId}
              type="text"
              placeholder="https://..."
              disabled={isUploading}
            />
            <Button
              type="button"
              color="link"
              className="ml-2 p-0"
              disabled={isUploading}
              onClick={() => {
                const input = document.getElementById(inputManualId);
                const value = String(input?.value || "").trim();
                if (!value) return;
                this.setAspectoEvidencias(row.codigo, [...evidencias, value]);
                if (input) input.value = "";
              }}
              title="Agregar URL"
            >
              Agregar
            </Button>
          </div>

          {evidencias.length > 0 && (
            <div
              className="mt-2"
              style={{ maxHeight: "90px", overflowY: "auto" }}
            >
              {evidencias.map((url, idx) => (
                <div
                  key={`${row.codigo}_${idx}_${url}`}
                  className="d-flex align-items-center justify-content-between"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "12px" }}
                  >
                    Evidencia {idx + 1}
                  </a>
                  <Button
                    type="button"
                    color="link"
                    className="p-0 ml-2"
                    onClick={() => this.removeAspectoEvidencia(row.codigo, url)}
                    title="Quitar evidencia"
                  >
                    <i className="fas fa-times" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 d-flex align-items-center justify-content-center">
            <input
              id={inputAdjuntarId}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files && e.target.files[0];
                e.target.value = "";
                this.subirEvidencia(row.codigo, file);
              }}
            />
            <label
              htmlFor={inputAdjuntarId}
              className="mb-0"
              style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
              title="Adjuntar imagen"
              onClick={e => {
                if (isUploading) e.preventDefault();
              }}
            >
              <i className="fas fa-paperclip" />
            </label>

            <input
              id={inputCamaraId}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files && e.target.files[0];
                e.target.value = "";
                this.subirEvidencia(row.codigo, file);
              }}
            />
            <label
              htmlFor={inputCamaraId}
              className="mb-0 ml-2"
              style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
              title="Tomar foto"
              onClick={e => {
                if (isUploading) e.preventDefault();
              }}
            >
              <i className="fas fa-camera" />
            </label>
          </div>
        </div>

        {isUploading && (
          <div className="mt-1">
            <small>Subiendo…</small>
          </div>
        )}
      </td>
    );
  }

  render() {
    const isEditMode = !!this.state._id;

    return (
      <div className="p-15 m-2">
        <div className="card p-15 p-4">
          <Row className="mb-3 ">
            <div className="font-weight-bold mt-3 mx-auto">
              SEGUIMIENTO DEL ALMACENAMIENTO, DISPENSACIÓN Y ADMINISTRACIÓN DE
              MEDICAMENTOS, DISPOSITIVOS MÉDICOS Y REACTIVOS
            </div>
          </Row>
          <Row className="mb-3 d-flex ">
            <Col md={4}>
              <div className="d-flex ">
                <div className="font-weight-bold mr-4">Código:</div>
                <div>{FORM_META.codigo}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex ">
                <div className="font-weight-bold mr-4">Versión:</div>
                <div>{FORM_META.version}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex ">
                <div className="font-weight-bold mr-4">Fecha:</div>
                <div>{FORM_META.fecha}</div>
              </div>
            </Col>
          </Row>
          <Form onSubmit={this.Guardar}>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>Servicio:</Label>
                  <Input
                    type="select"
                    value={this.state.ServicioId || ""}
                    onChange={e => {
                      const id = e.target.value;
                      const svc = this.state.serviciosSeguimiento.find(
                        x => String(x?._id || "") === String(id)
                      );
                      const codigo = svc?.Codigo || "";
                      const nombre = svc?.Nombre || "";

                      this.setState({
                        ServicioId: id,
                        ServicioNombre: nombre,
                        // Mantener Servicio como código (o nombre si no hay código)
                        Servicio: codigo || nombre
                      });
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {this.state.serviciosSeguimiento
                      .filter(s => s?.Activo !== false)
                      .map(s => {
                        const label = [s?.Codigo, s?.Nombre]
                          .filter(Boolean)
                          .join(" - ");
                        return (
                          <option key={s._id} value={s._id}>
                            {label.trim()}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Fecha:</Label>
                  <Input
                    type="date"
                    value={this.state.Fecha}
                    onChange={e => this.setState({ Fecha: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Hora:</Label>
                  <Input
                    type="time"
                    value={this.state.Hora}
                    onChange={e => this.setState({ Hora: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Table bordered size="sm">
              <thead>
                <tr>
                  <th style={{ width: "70px" }} className="text-center">
                    #
                  </th>
                  <th>ASPECTO DE REVISIÓN</th>
                  <th style={{ width: "160px" }} className="text-center">
                    Resultado
                  </th>
                  <th style={{ width: "260px" }}>Observaciones</th>
                  <th className="text-center" style={{ width: "260px" }}>
                    Evidencias (URLs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ASPECTOS.map(row => {
                  if (row.tipo === "SECCION") {
                    return (
                      <tr key={row.codigo}>
                        <td className="text-center font-weight-bold">
                          {row.codigo}
                        </td>
                        <td
                          colSpan={4}
                          className="font-weight-bold text-center"
                        >
                          {row.titulo}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.codigo}>
                      <td className="text-center">{row.codigo}</td>
                      <td>{row.pregunta}</td>
                      {this.renderResultadoCell(row)}
                      {this.renderObservacionesCell(row)}
                      {this.renderEvidenciaCell(row)}
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Realizado por:</Label>
                  <Input
                    type="text"
                    value={this.state.RealizadoPor}
                    disabled
                    readOnly
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Revisado por:</Label>
                  <div>
                    <div
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                        width: "100%",
                        background: "#ffffff"
                      }}
                    >
                      <canvas
                        ref={this.signatureCanvasRef}
                        width={520}
                        height={160}
                        style={{
                          width: "100%",
                          height: "160px",
                          display: "block",
                          touchAction: "none"
                        }}
                        onMouseDown={e => {
                          const pt = this.getCanvasPoint(e.clientX, e.clientY);
                          this.startSigning(pt);
                        }}
                        onMouseMove={e => {
                          const pt = this.getCanvasPoint(e.clientX, e.clientY);
                          this.drawTo(pt);
                        }}
                        onMouseUp={() => this.endSigning()}
                        onMouseLeave={() => this.endSigning()}
                        onTouchStart={e => {
                          e.preventDefault();
                          const t = e.touches && e.touches[0];
                          if (!t) return;
                          const pt = this.getCanvasPoint(t.clientX, t.clientY);
                          this.startSigning(pt);
                        }}
                        onTouchMove={e => {
                          e.preventDefault();
                          const t = e.touches && e.touches[0];
                          if (!t) return;
                          const pt = this.getCanvasPoint(t.clientX, t.clientY);
                          this.drawTo(pt);
                        }}
                        onTouchEnd={e => {
                          e.preventDefault();
                          this.endSigning();
                        }}
                        onTouchCancel={e => {
                          e.preventDefault();
                          this.endSigning();
                        }}
                      />
                    </div>

                    <div className="mt-2">
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          this.resetSignatureCanvas();
                          this.setState({ RevisadoPorFirma: "" });
                        }}
                      >
                        Limpiar firma
                      </Button>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <div className="d-flex align-items-center">
              <Button
                color="primary"
                type="submit"
                disabled={this.state.isSaving}
              >
                {isEditMode ? "Actualizar" : "Guardar"}
              </Button>
              {typeof this.props.onCancel === "function" && (
                <Button
                  color="secondary"
                  type="button"
                  className="ml-2"
                  disabled={this.state.isSaving}
                  onClick={this.props.onCancel}
                >
                  Cancelar
                </Button>
              )}
              {this.state.isSaving && (
                <div className="ml-3">
                  <Ring />
                </div>
              )}
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default SeguimientosAlmacenamientosForm;
