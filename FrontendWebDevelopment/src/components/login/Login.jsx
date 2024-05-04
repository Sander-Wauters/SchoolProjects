import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useThemeContext } from "../../contexts/Theme.context";
import { useAuth } from "../../contexts/Auth.context";
import LabelInput from "../form/LabelInput";
import Error from "../util/Error";

export default function Login() {
    const { theme } = useThemeContext();
    
    const { login, loading: loginLoading, error: loginError, isAuthed } = useAuth();

    return (
        <>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                validationSchema={Yup.object({
                    username: Yup.string().max(255).required("Username is required"),
                    password: Yup.string().min(8).max(255).required("Username is required"),
                })}
                onSubmit={(values, { resetForm }) => {
                    login({ ...values });
                    resetForm();
                }}
            >
                <Form className={`loginForm-${theme}`}>
                    <LabelInput label="Username" id="username" name="username" type="text" data-cy="username_input" />
                    <LabelInput label="Password" id="password" name="password" type="password" data-cy="password_input" />
                    <button type="submit" disabled={loginLoading} data-cy="login_button">
                        Login
                    </button>
                    <button type="reset" >
                        Cancel
                    </button>
                    <Error error={loginError} />
                </Form>
            </Formik>
            <p>Don't have an account?<Link className={`buttonEdit-${theme}`} to="/register">Register now</Link></p>
            {isAuthed ? <h3>You are logged in</h3> : null}
        </>
    );
}
