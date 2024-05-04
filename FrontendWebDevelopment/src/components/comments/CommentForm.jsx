import { Formik, Form } from "formik";
import * as Yup from "yup";
import Error from "../util/Error";
import TextArea from "../form/TextArea";

export default function CommentForm({ onSubmit, submitError, initialContent="", className="" }) {
    const handleSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <Formik
            initialValues={{
                content: initialContent,
            }}
            validationSchema={Yup.object({
                content: Yup.string().trim().required("Content is required."),
            })}
            onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
            }}
        >
            <Form className={className}>
                <TextArea id="content" name="content" rows="5" data-cy="commentForm_content"/>
                <button type="submit" data-cy="commentForm_submit">
                    Post
                </button>
                <Error error={submitError}/>
            </Form>
        </Formik>
    );
}
