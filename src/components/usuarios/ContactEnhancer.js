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
        TipoIdentificacion: props.data ? props.data.TipoIdentificacion: '',
        Identificacion: props.data ? props.data.Identificacion: '',
        PrimerNombre: props.data ? props.data.PrimerNombre: '',
        SegundoNombre: props.data ? props.data.SegundoNombre: '',
        PrimerApellido: props.data ? props.data.PrimerApellido: '',
        SegundoApellido: props.data ? props.data.SegundoApellido: '',
        NombreCompleto: props.data ? props.data.NombreCompleto: '',
        FechaNacimiento: props.data ? props.data.FechaNacimiento: '',
        Email: props.data ? props.data.Email: '',
        Telefono: props.data ? props.data.Telefono: '',
        Celular: props.data ? props.data.Celular: '',
        IdPais: props.data ? props.data.IdPais: '',
        Login: props.data ? props.data.Login: '',
        Clave: props.data ? props.data.Clave: '',
        Municipio: props.data ? props.data.Municipio: '',
        IdMunicipio: props.data ? props.data.IdMunicipio: '',
        // Activo: props.data ? props.data.Activo: '',
        Empresa: props.data ? props.data.Empresa: '',
        objRoles: props.data ? props.data.objRoles: '',
        SedesSelect: props.data ? props.data.SedesSelect: '',
        //objUsuario.IdRol = $("#select_Rol").val();
        RolSelect: props.data ? props.data.RolSelect: '',

        // objUsuario.Direccion = data
        // objUsuario.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
        // objUsuario.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");

    }),
    handleSubmit: (values) => {},
    displayName: 'contactForm',
    enableReinitialize:true,
});

export default formikEnhancer;