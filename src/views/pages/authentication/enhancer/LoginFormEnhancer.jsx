import {
    withFormik
} from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
        email: Yup.string().required('Please Enter Any Email'),
        password: Yup.string().required('Please Enter Any Password'),
    }),
    mapPropsToValues: props => ({
        email: '',
        password: '',
    }),
    handleSubmit: (values) => {},
    displayName: 'CustomValidationForm',
    enableReinitialize:true,
});

export default formikEnhancer;