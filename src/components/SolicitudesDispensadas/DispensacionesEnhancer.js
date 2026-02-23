import {
    withFormik
} from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        // TipoIdentificacion: Yup.string().required('This field is required'),
        // Identificacion: Yup.string().required('This field is required'),
        // email: Yup.string().required('This Field is required'),
    }),
    mapPropsToValues: props => ({
        IdPaciente: props.data ? props.data._id: '',
        NombrePaciente: props.data ? props.data.NombrePaciente: '',
        LogoSexo: props.data ? props.data.LogoSexo: '',
        Edad: props.data ? props.data.Edad: '',
        NombreOrigen: props.data ? props.data.NombreOrigen: '',
        NombreCama: props.data ? props.data.NombreCama: '',
        UnidadFuncional: props.data ? props.data.UnidadFuncional: '',
        ListaMedicamentos: props.data ? props.data.ListaMedicamentos: '',
        IdentificacionPaciente: props.data ? props.data.IdentificacionPaciente: '',

        // NombreCompleto: props.data ? props.data.NombreCompleto: '',
        // FechaNacimiento: props.data ? props.data.FechaNacimiento: '',
        // Email: props.data ? props.data.Email: '',
        // Telefono: props.data ? props.data.Telefono: '',
        // Celular: props.data ? props.data.Celular: '',
        // IdPais: props.data ? props.data.IdPais: '',
        // Login: props.data ? props.data.Login: '',
        // Clave: props.data ? props.data.Clave: '',
        // IdMunicipio: props.data ? props.data.IdMunicipio: '',
        // // Activo: props.data ? props.data.Activo: '',
        // Empresa: props.data ? props.data.Empresa: '',
        // objRoles: props.data ? props.data.objRoles: '',
        // //objUsuario.IdRol = $("#select_Rol").val();
        // // objUsuario.Rol = data
        // // objUsuario.Direccion = data
        // // objUsuario.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
        // // objUsuario.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");

    }),
    handleSubmit: (values) => {},
    CancelarDispensacion:(values) => {},
    displayName: 'contactForm',
    enableReinitialize:true,
});

export default formikEnhancer;