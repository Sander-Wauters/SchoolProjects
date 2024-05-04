import { Formik, Form } from "formik";
import * as Yup from "yup";
import useSWRMutation from "swr/mutation"; 
import { useThemeContext } from "../../contexts/Theme.context";
import { post } from "../../api";
import LabelInput from "../form/LabelInput";
import Error from "../util/Error";

export default function Register() {
    const { theme } = useThemeContext();

    const { trigger: doRegister, error: registerError } = useSWRMutation("users/register", post);

    return (
        <Formik
            initialValues={{
                username: "",
                email: "",
                password: "",
                passwordConfirmation: "",
            }}
            validationSchema={Yup.object({
                username: Yup.string().max(255).required("Username is required"),
                email: Yup.string().max(255).email().required("Email is required"),
                password: Yup.string().min(8).max(255).required("Password is required"),
                passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Please confirm password"),
            })}
            onSubmit={(values, { resetForm }) => {
                delete values.passwordConfirmation;
                doRegister(values);
                resetForm();
            }}
        >
            <Form className={`registerForm-${theme}`}>
                <LabelInput label="Username" id="username" name="username" type="text" />
                <LabelInput label="Email" id="email" name="email" type="email" />
                <LabelInput label="Password" id="password" name="password" type="password" />
                <LabelInput label="Confirm password" id="passwordConfirmation" name="passwordConfirmation" type="password" />
                <button type="submit" >
                    Register
                </button>
                <button type="reset" >
                    Cancel
                </button>
                <Error error={registerError} />
            </Form>
        </Formik>
    );
}
