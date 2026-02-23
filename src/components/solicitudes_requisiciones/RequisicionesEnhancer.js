import {
    withFormik
} from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        TipoIdentificacion: Yup.string().required('This field is required'),
        Identificacion: Yup.string().required('This field is required'),
        // email: Yup.string().required('This Field is required'),
    }),
    mapPropsToValues: props => ({
        Unidades: props.data ? props.data.Unidades: '',
        Observaciones: props.data ? props.data.Observaciones: '',
        SedeDestino: props.data ? props.data.SedeDestino: '',
        Medicamento: props.data ? props.data.Medicamento: '',
        Fecha: props.data ? props.data.Fecha: '',
        Clave: props.data ? props.data.Clave: '',
        IdMunicipio: props.data ? props.data.IdMunicipio: '',
        // Activo: props.data ? props.data.Activo: '',
        Empresa: props.data ? props.data.Empresa: '',
        //objUsuario.IdRol = $("#select_Rol").val();
        // objUsuario.Rol = data
        // objUsuario.Direccion = data
        // objUsuario.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
        // objUsuario.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");

    }),
    handleSubmit: (values) => {},
    displayName: 'contactForm',
    enableReinitialize:true,
});

export default formikEnhancer;