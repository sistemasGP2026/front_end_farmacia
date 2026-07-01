import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  SalePrediction,
  UserInfoDoughnutWidget,
  ArchivedPrescriptionsWidget,
  DevolucionesResumenWidget
} from "components/widgets/chartwidgets";
import { MinibarWidgets } from "components/widgets/chartwidgets";
import { gsUrlApi } from "config/configServer";

const Dashboard = ({ sidebarTheme, layoutTheme }) => {
  const [archivedData, setArchivedData] = useState({
    months: [],
    totalArchivadas: 0
  });
  const [prescripcionesMesActual, setPrescripcionesMesActual] = useState({
    solicitadas: 0,
    dispensadas: 0,
    entregadas: 0,
    total: 0
  });
  const [loadingArchived, setLoadingArchived] = useState(true);
  const [errorArchived, setErrorArchived] = useState(false);
  const [loadingPrescripcionesMes, setLoadingPrescripcionesMes] = useState(
    true
  );
  const [errorPrescripcionesMes, setErrorPrescripcionesMes] = useState(false);
  const [devolucionesData, setDevolucionesData] = useState({
    months: [],
    totales: {
      solicitadas: 0,
      confirmadas: 0,
      pendientes: 0
    }
  });
  const [loadingDevoluciones, setLoadingDevoluciones] = useState(true);
  const [errorDevoluciones, setErrorDevoluciones] = useState(false);
  const [requisicionesData, setRequisicionesData] = useState({
    months: [],
    totales: {
      solicitadas: 0,
      confirmadas: 0,
      pendientes: 0
    }
  });
  const [loadingRequisiciones, setLoadingRequisiciones] = useState(true);
  const [errorRequisiciones, setErrorRequisiciones] = useState(false);

  useEffect(() => {
    const cargarArchivadas = async () => {
      try {
        setLoadingArchived(true);
        setErrorArchived(false);

        const response = await fetch(
          gsUrlApi + "/prescripciones/archivadas/ultimos-6-meses",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        const result = await response.json();

        if (!response.ok || result.Error) {
          throw new Error(result.Mensaje || "No fue posible cargar archivadas");
        }

        setArchivedData(result.datos || { months: [], totalArchivadas: 0 });
      } catch (error) {
        setErrorArchived(true);
      } finally {
        setLoadingArchived(false);
      }
    };

    cargarArchivadas();
  }, []);

  useEffect(() => {
    const cargarResumenDevoluciones = async () => {
      try {
        setLoadingDevoluciones(true);
        setErrorDevoluciones(false);

        const response = await fetch(
          gsUrlApi + "/devoluciones/resumen/ultimos-3-meses",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        const result = await response.json();

        if (!response.ok || result.Error) {
          throw new Error(
            result.Mensaje || "No fue posible cargar devoluciones"
          );
        }

        setDevolucionesData(
          result.datos || {
            months: [],
            totales: {
              solicitadas: 0,
              confirmadas: 0,
              pendientes: 0
            }
          }
        );
      } catch (error) {
        setErrorDevoluciones(true);
      } finally {
        setLoadingDevoluciones(false);
      }
    };

    cargarResumenDevoluciones();
  }, []);

  useEffect(() => {
    const cargarResumenPrescripcionesMesActual = async () => {
      try {
        setLoadingPrescripcionesMes(true);
        setErrorPrescripcionesMes(false);

        const response = await fetch(
          gsUrlApi + "/prescripciones/resumen/mes-actual",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        const result = await response.json();

        if (!response.ok || result.Error) {
          throw new Error(
            result.Mensaje || "No fue posible cargar el resumen del mes actual"
          );
        }

        setPrescripcionesMesActual(
          result.datos || {
            solicitadas: 0,
            dispensadas: 0,
            entregadas: 0,
            total: 0
          }
        );
      } catch (error) {
        setErrorPrescripcionesMes(true);
      } finally {
        setLoadingPrescripcionesMes(false);
      }
    };

    cargarResumenPrescripcionesMesActual();
  }, []);

  useEffect(() => {
    const cargarResumenRequisiciones = async () => {
      try {
        setLoadingRequisiciones(true);
        setErrorRequisiciones(false);

        const response = await fetch(
          gsUrlApi + "/requisiciones/resumen/ultimos-3-meses",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        const result = await response.json();

        if (!response.ok || result.Error) {
          throw new Error(
            result.Mensaje || "No fue posible cargar requisiciones"
          );
        }

        setRequisicionesData(
          result.datos || {
            months: [],
            totales: {
              solicitadas: 0,
              confirmadas: 0,
              pendientes: 0
            }
          }
        );
      } catch (error) {
        setErrorRequisiciones(true);
      } finally {
        setLoadingRequisiciones(false);
      }
    };

    cargarResumenRequisiciones();
  }, []);

  return (
    <div>
      <div>
        <div className="row ma-0">
          <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 ptb-15">
            <ArchivedPrescriptionsWidget
              title="Prescripciones Archivadas (ultimos 6 meses)"
              months={archivedData.months}
              total={archivedData.totalArchivadas}
              loading={loadingArchived}
              error={errorArchived}
            />
          </div>

          <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 ptb-15">
            <SalePrediction
              Titulo={"Prescripciones mes actual"}
              resumen={prescripcionesMesActual}
              loading={loadingPrescripcionesMes}
              error={errorPrescripcionesMes}
            />
          </div>
        </div>
        <div className="row ma-0">
          <div className="col-12 col-xl-6 col-lg-12 col-md-12 col-sm-12 ptb-15">
            <DevolucionesResumenWidget
              title="Devoluciones (ultimos 3 meses)"
              months={devolucionesData.months}
              totals={devolucionesData.totales}
              loading={loadingDevoluciones}
              error={errorDevoluciones}
            />
          </div>
          <div className="col-12 col-xl-6 col-lg-12 col-md-12 col-sm-12 ptb-15">
            <DevolucionesResumenWidget
              title="Requisiciones (ultimos 3 meses)"
              months={requisicionesData.months}
              totals={requisicionesData.totales}
              loading={loadingRequisiciones}
              error={errorRequisiciones}
              labels={{
                primary: "Solicitadas",
                secondary: "Entregadas",
                tertiary: "Pendientes",
                summarySuffix: "(3 meses)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger
  };
};

export default connect(mapStateToProps, null)(Dashboard);
