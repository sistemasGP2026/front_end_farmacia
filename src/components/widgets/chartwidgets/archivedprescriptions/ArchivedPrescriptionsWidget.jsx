import React from "react";
import { Bar } from "react-chartjs-2";
import customTooltip from "components/common/chartTooltip";

const formatNumber = value => new Intl.NumberFormat("es-CO").format(value || 0);

const barValueLabelsPlugin = {
  afterDatasetsDraw: chart => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.fillStyle = "#2f3a4f";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "bold 11px sans-serif";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];

        if (value == null || value <= 0) {
          return;
        }

        const model = bar._model || bar._view;
        const x = model && model.x ? model.x : 0;
        const y = model && model.y ? model.y : 0;

        ctx.fillText(formatNumber(value), x, y - 6);
      });
    });

    ctx.restore();
  }
};

const chartOptions = {
  maintainAspectRatio: false,
  legend: { display: false },
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

const formatVariation = (current, previous) => {
  if (!previous) {
    return "Sin referencia";
  }

  const variation = ((current - previous) / previous) * 100;
  const sign = variation > 0 ? "+" : "";
  return sign + variation.toFixed(1) + "% vs mes anterior";
};

const ArchivedPrescriptionsWidget = ({
  title,
  months,
  total,
  loading,
  error
}) => {
  const monthLabels = months.map(item => item.label);
  const monthValues = months.map(item => item.total);
  const chartValues = monthValues.map(value => (value > 0 ? value : null));
  const currentMonthValue = monthValues.length
    ? monthValues[monthValues.length - 1]
    : 0;
  const previousMonthValue =
    monthValues.length > 1 ? monthValues[monthValues.length - 2] : 0;
  const vibrantPalette = [
    "#ff4d6d",
    "#ff9f1c",
    "#2ec4b6",
    "#3a86ff",
    "#8338ec",
    "#06d6a0"
  ];
  const barColors = monthValues.map(
    (_, index) => vibrantPalette[index % vibrantPalette.length]
  );

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Archivadas",
        data: chartValues,
        backgroundColor: barColors,
        borderColor: barColors,
        hoverBackgroundColor: barColors,
        hoverBorderColor: barColors,
        borderWidth: 2,
        barThickness: 34,
        minBarLength: 8,
        borderRadius: 6
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
              {formatNumber(total)}
            </h3>
            <small className="text-muted">Total 6 meses</small>
          </div>
        </div>

        <small className="text-muted d-block mb-3">
          {formatVariation(currentMonthValue, previousMonthValue)}
        </small>

        <div style={{ height: 220 }}>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Cargando datos...
            </div>
          ) : (
            <Bar
              data={chartData}
              options={chartOptions}
              plugins={[barValueLabelsPlugin]}
            />
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

export default ArchivedPrescriptionsWidget;
