import Button from "components/button/Button";

import React, { /*useState,*/ Fragment } from "react";
/* import classNames from "classnames"; */

const Buttons = ({
    actiononButton
}) => {

    return (
        <Fragment>
            <div className="pb-3">
                <Button type="submit" className="c-btn ml-2 c-success">
                    Guardar
                </Button>
               {/*  <Button type="button" onClick={() => this.props.actiononButton("cancelar")} className="c-btn ml-2 c-secundari">
                    Cancelar
                </Button> */}
            </div>
        </Fragment>
    );
};

export default Buttons;