import React from "react";
import FooterWrapper from "./footer.style";
import Button from "components/button/Button";

const Footer = props => {
  return (
    <FooterWrapper {...props}>
      <div className="footerBack flex-x align-center border">
        <div className="flex-1 fs-13 bold-text footer-text">
        © Desarrollado por SYSNET. Todos los derechos reservados.
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
