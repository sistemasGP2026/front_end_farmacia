import {
    withFormik
} from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        name: Yup.string().required('This field is required'),
        code: Yup.string().required('This field is required'),
        // email: Yup.string().required('This Field is required'),
    }),
    mapPropsToValues: props => ({
        name: props.data ? props.data.name: '',
        code: props.data ? props.data.code: '',
        // email:props.data ? props.data.email: '',
    }),
    handleSubmit: (values) => {},
    displayName: 'contactForm',
    enableReinitialize:true,
});

export default formikEnhancer;