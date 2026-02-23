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
        Software: props.data ? props.data.Software: '',
        Descripcion: props.data ? props.data.Descripcion: '',
        Servidor: props.data ? props.data.Servidor: '',
        Instancia: props.data ? props.data.Instancia: '',
        BaseDatos: props.data ? props.data.BaseDatos: '',
        Puerto: props.data ? props.data.Puerto: '',
        Usuario: props.data ? props.data.Usuario: '',
        IdPais: props.data ? props.data.IdPais: '',
        Login: props.data ? props.data.Login: '',
        Clave: props.data ? props.data.Clave: '',
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