import Button from "components/button/Button";

import React, { Fragment } from "react";
/* import classNames from "classnames"; */

const Buttons = ({
    actiononButton
}) => {

    return (
        <Fragment>
            <div className="pb-3">
                <Button  type="submit" onClick={() => actiononButton("nuevo")} className="c-btn ml-2 c-primary">
                        Nuevo
                </Button>
                <Button type="submit" onClick={() => actiononButton("eliminar")} className="c-btn ml-2 c-danger">
                    Eliminar
                </Button>
                <Button type="submit" onClick={() => actiononButton("cancelar")} className="c-btn ml-2 c-secundari">
                    Cancelar
                </Button>
            </div>
        </Fragment>
    );
};

export default Buttons;
