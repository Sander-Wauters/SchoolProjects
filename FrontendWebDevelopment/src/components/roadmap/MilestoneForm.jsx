import useSWR from "swr";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useThemeContext } from "../../contexts/Theme.context";
import { getAll } from "../../api";
import Error from "../util/Error";
import LabelInput from "../form/LabelInput";
import Select from "../form/Select";
import TextArea from "../form/TextArea";

export default function MilestoneForm({ onSubmit, submitError, props }) {
    const { theme } = useThemeContext();

    const { data: tags=[] } = useSWR("tags", getAll);

    const { tag, accomplished, imagePath, title, content } = props;

    const handleSubmit = (data) => {
        onSubmit(data); 
    };

    return (
        <>
            <Formik
                initialValues={{
                    tag: tag,
                    accomplished: accomplished,
                    imagePath: imagePath,
                    title: title,
                    content: content,
                }}
                validationSchema={Yup.object({
                    tag: Yup.string().oneOf(tags.map(({name}) => name)).required("Tag is required."),
                    imagePath: Yup.string().matches("^.*\\.(jpg|png)$", "Not a valid image.").optional(),
                    title: Yup.string().required("Title is required."),
                    content: Yup.string().required("Content is required."),
                })}
                onSubmit={(values, { resetForm }) => {
                    handleSubmit(values);
                    resetForm();
                }}
            >
                <Form className={`milestoneForm-${theme}`}>
                    <LabelInput label="Title" id="title" name="title" type="text" />
                    <LabelInput label="Accomplished" id="accomplished" name="accomplished" type="checkbox"/>
                    <LabelInput label="Image" id="imagePath" name="imagePath" type="text" />
                    <Select label="Tag" id="tag" name="tag">
                        <option value="">Select a tag</option>
                        {tags.map(({name}) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </Select>
                    <TextArea name="content" rows="15" />
                    <button type="submit">Post</button>
                    <Error error={submitError} />  
                </Form>
            </Formik>
        </>
    );
}
