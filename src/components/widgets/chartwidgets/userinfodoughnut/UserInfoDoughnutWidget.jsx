import React from "react";
import Gauge from "react-svg-gauge";
import UserInfoWrapper from "./userinfo.style";

const LatestActivity = props => {
  return (
    <UserInfoWrapper className="fill-height">
      <div className="card roe-shadow-2 fill-height">
        <div className="card-body">
          <h4 className="card-title fs-18 header">
            {props.Titulo ?? "informe"}
          </h4>
          <div className="row">
            <div className="col-md-6 aligner-wrapper text-center">
              <Gauge
                value={70}
                width={200}
                height={140}
                label=""
                color="rgba(40, 167, 69, 1)"
                valueLabelStyle={{ fontSize: "30px" }}
              />
            </div>
            <div className="col-md-6 legend-wrapper">
              <div className="d-flex flex-column justify-content-center  border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator nevy mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark">520</h4>
                </div>
                <small className="text-muted ml-3">
                  {props.nameIndicador1 ?? "Pendientes"}
                </small>
              </div>
              {/* <div className="d-flex flex-column justify-content-center border-top border-bottom py-3 mt-3 mb-3">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator bg-warning mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark">44%</h4>
                </div>
                <small className="text-muted ml-3">Products</small>
              </div> */}
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center">
                  <div className="dot-indicator bg-success mt-1 mr-2"></div>
                  <h4 className="mb-0 text-dark">410</h4>
                </div>
                <small className="text-muted ml-3">
                  {props.nameIndicador2 ?? "Devueltas"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserInfoWrapper>
  );
};

export default LatestActivity;
