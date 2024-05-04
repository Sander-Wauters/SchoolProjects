import { useField } from "formik";

export default function LabelInput({label, ...props}) {
    const [field, meta] = useField(props);

    return (
        <>
            <label htmlFor={props.name}>{label}</label>
            <input {...field} {...props}/>
            {meta.touched && meta.error ? (
                <p className="form-error" data-cy="form_error">{meta.error}</p>
            ) : null}
        </>
    );
}
