import React from "react";
import { Doughnut } from "react-chartjs-2";
import SalePredictionWrapper from "./saleprediction.style";
import customTooltip from "components/common/chartTooltip";

const formatNumber = value => new Intl.NumberFormat("es-CO").format(value || 0);

const options = {
  tooltips: {
    enabled: false,
    custom: customTooltip
  },
  cutoutPercentage: 75,
  animationEasing: "easeOutBounce",
  animateRotate: true,
  animateScale: false,
  responsive: true,
  maintainAspectRatio: false,
  showScale: true,
  legend: {
    display: false
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
};

const LatestActivity = props => {
  const resumen = props.resumen || {
    solicitadas: 0,
    dispensadas: 0,
    entregadas: 0,
    total: 0
  };

  const chartData = {
    datasets: [
      {
        data: [resumen.solicitadas, resumen.dispensadas, resumen.entregadas],
        backgroundColor: ["#3a86ff", "#ffbe0b", "#06d6a0"],
        borderColor: ["#3a86ff", "#ffbe0b", "#06d6a0"],
        hoverBackgroundColor: ["#245bc5", "#d99900", "#03a57b"],
        hoverBorderColor: ["#245bc5", "#d99900", "#03a57b"]
      }
    ],
    labels: ["Solicitadas", "Dispensadas", "Entregadas"]
  };

  return (
    <SalePredictionWrapper className="fill-height">
      <div className="card roe-shadow-2 fill-height">
        <div className="card-body">
          <h4 className="card-title fs-18 header">
            {props.Titulo ?? "Project Completion"}
          </h4>
          <div className="row">
            <div className="col-md-6 aligner-wrapper mt-15">
              {props.loading ? (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  Cargando datos...
                </div>
              ) : (
                <Doughnut data={chartData} height={160} options={options} />
              )}
              <div className="wrapper d-flex flex-column justify-content-center absolute absolute-center middle-block">
                <h4 className="d-block text-center mb-0 text-muted">
                  {formatNumber(resumen.total)}
                </h4>
                <small className="d-block text-center mb-2 text-muted">
                  Total
                </small>
              </div>
            </div>
            <div className="col-md-6 legend-wrapper">
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator nevy mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark fs-20">
                    {formatNumber(resumen.solicitadas)}
                  </h4>
                </div>
                <small className="text-muted ml-3">Solicitadas</small>
              </div>
              <div className="d-flex flex-column justify-content-center border-top border-bottom py-3 mt-3 mb-3">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator bg-warning mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark fs-20">
                    {formatNumber(resumen.dispensadas)}
                  </h4>
                </div>
                <small className="text-muted ml-3">Dispensadas</small>
              </div>
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator bg-success mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark fs-20">
                    {formatNumber(resumen.entregadas)}
                  </h4>
                </div>
                <small className="text-muted ml-3">Entregadas</small>
              </div>
              {props.error ? (
                <small className="text-danger d-block mt-3">
                  No fue posible cargar la informacion en tiempo real.
                </small>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SalePredictionWrapper>
  );
};

export default LatestActivity;
