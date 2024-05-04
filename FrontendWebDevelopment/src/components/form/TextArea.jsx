import { useField } from "formik";

export default function TextArea({ ...props }) {
    const [field, meta] = useField(props);
    return (
        <>
            <textarea {...field} {...props}/>
            {meta.touched && meta.error ? (
                <p className="form-error" data-cy="form_error">{meta.error}</p>
            ) : null}
        </>
    );
}
