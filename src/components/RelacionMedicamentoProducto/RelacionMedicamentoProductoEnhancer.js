import {
    withFormik
} from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        nombre: Yup.string().required('This field is required'),
        // email: Yup.string().required('This Field is required'),
    }),
    mapPropsToValues: props => ({
        Nombre:props.data ? props.data.nombre: '',
        Software:props.data ? props.data.Software: '',
        Identificacion:props.data ? props.data.Identificacion: '',
        Telefono:props.data ? props.data.telefono: '', 
        Direccion :props.data ? props.data.direccion: '',
        Usuario :props.data ? props.data.usuario: '',
        Estado:props.data ? props.data.Estado: '',
    }),
    handleSubmit: (values) => {},
    displayName: 'contactForm',
    enableReinitialize:true,
});

export default formikEnhancer;