import useSWR from "swr";
import { getAll } from "../../api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useThemeContext } from "../../contexts/Theme.context";
import Error from "../util/Error";
import LabelInput from "../form/LabelInput";
import Select from "../form/Select";
import TextArea from "../form/TextArea";

export default function BlogPostForm({ onSubmit, submitError, props }) {
    const { theme } = useThemeContext();

    const { data: tags=[] } = useSWR("tags", getAll);

    const { tag, title, content } = props;

    const handleSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <Formik 
            initialValues={{
                tag: tag,
                title: title,
                content: content,
            }} 
            validationSchema={Yup.object({
                tag: Yup.string().oneOf(tags.map(({name}) => name)).required("Tag is required."),
                title: Yup.string().required("Title is required."),
                content: Yup.string().required("Content is required."),
            })}
            onSubmit={(values, { resetForm }) => {
                handleSubmit(values); 
                resetForm();
            }}
        >
            <Form className={`blogPostForm-${theme}`}>
                <LabelInput label="Title" id="title" name="title" type="text" data-cy="blogPostForm_title"/>
                <Select label="Tag" id="tag" name="tag" data-cy="blogPostForm_tag">
                    <option value="">Select a tag</option>
                    {tags.map(({name}) => <option key={name} value={name}>{name}</option>)}
                </Select>
                <TextArea name="content" rows="5" data-cy="blogPostForm_content"/>
                <button type="submit" data-cy="blogPostForm_submit">
                    Post
                </button>
                <Error error={submitError}/>  
            </Form>
        </Formik>
    );
}
