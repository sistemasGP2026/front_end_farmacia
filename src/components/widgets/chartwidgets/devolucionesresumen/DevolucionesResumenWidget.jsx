import React from "react";
import { Bar } from "react-chartjs-2";
import customTooltip from "components/common/chartTooltip";

const formatNumber = value => new Intl.NumberFormat("es-CO").format(value || 0);

const chartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 12,
      fontColor: "#4f5d75",
      fontStyle: "bold"
    }
  },
  hover: {
    mode: "index",
    intersect: false
  },
  tooltips: {
    enabled: false,
    mode: "index",
    intersect: false,
    custom: customTooltip
  },
  scales: {
    xAxes: [
      {
        gridLines: { display: false },
        ticks: {
          fontColor: "#4f5d75",
          fontStyle: "bold"
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          precision: 0,
          fontColor: "#697386"
        },
        gridLines: {
          color: "rgba(114, 132, 154, 0.12)"
        }
      }
    ]
  }
};

const DevolucionesResumenWidget = ({
  title,
  months,
  totals,
  loading,
  error,
  labels = {}
}) => {
  const primaryLabel = labels.primary || "Solicitadas";
  const secondaryLabel = labels.secondary || "Confirmadas";
  const tertiaryLabel = labels.tertiary || "Pendientes";
  const summarySuffix = labels.summarySuffix || "(3 meses)";

  const monthLabels = months.map(item => item.label);
  const solicitadas = months.map(item => item.solicitadas || 0);
  const confirmadas = months.map(item => item.confirmadas || 0);
  const pendientes = months.map(item => item.pendientes || 0);

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: primaryLabel,
        data: solicitadas,
        backgroundColor: "#3a86ff",
        borderColor: "#3a86ff",
        borderWidth: 1,
        barThickness: 18,
        borderRadius: 4
      },
      {
        label: secondaryLabel,
        data: confirmadas,
        backgroundColor: "#06d6a0",
        borderColor: "#06d6a0",
        borderWidth: 1,
        barThickness: 18,
        borderRadius: 4
      },
      {
        label: tertiaryLabel,
        data: pendientes,
        backgroundColor: "#ff9f1c",
        borderColor: "#ff9f1c",
        borderWidth: 1,
        barThickness: 18,
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="card roe-shadow-2 fill-height">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
          <h4 className="card-title fs-18 header mb-1">{title}</h4>
          <div className="text-right">
            <h3 className="mb-0" style={{ color: "#1d4f91" }}>
              {formatNumber((totals && totals.solicitadas) || 0)}
            </h3>
            <small className="text-muted">
              {primaryLabel} {summarySuffix}
            </small>
          </div>
        </div>

        <div className="d-flex flex-wrap mb-3">
          <small className="text-muted mr-3">
            {secondaryLabel}:{" "}
            {formatNumber((totals && totals.confirmadas) || 0)}
          </small>
          <small className="text-muted">
            {tertiaryLabel}: {formatNumber((totals && totals.pendientes) || 0)}
          </small>
        </div>

        <div style={{ height: 230 }}>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Cargando datos...
            </div>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>

        {error ? (
          <small className="text-danger d-block mt-2">
            No fue posible cargar la informacion en tiempo real.
          </small>
        ) : null}
      </div>
    </div>
  );
};

export default DevolucionesResumenWidget;
