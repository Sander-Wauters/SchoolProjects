import { useCallback, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAll, updateById, deleteById, post } from "../../api";
import { useThemeContext } from "../../contexts/Theme.context";
import AsyncData from "../util/AsyncData";
import Error from "../util/Error";
import BlogPostHeaderList from "../blog/BlogPostHeaderList";
import BlogPostForm from "../blog/BlogPostForm";

export default function BlogPostManagementPanel() {
    const { theme } = useThemeContext();

    const [selectedBlogPost, setSelectedBlogPost] = useState({ id: -1, index: -1, selected: "" });
    const [editingBlogPost, setEditingBlogPost] = useState(false);

    const { data: blogPosts=[], blogPostsIsLoading, blogPostsError } = useSWR("blogPosts", getAll);
    const { trigger: saveBlogPost, error: saveBlogPostError } = useSWRMutation("blogPosts", post);
    const { trigger: updateBlogPost, error: updateBlogPostError } = useSWRMutation("blogPosts", updateById);
    const { trigger: deleteBlogPost, error: deleteBlogPostError } = useSWRMutation("blogPosts", deleteById);

    const handleSelectBlogPost = (event) => {
        const id = parseInt(event.target.value);
        const index = blogPosts.findIndex(el => el.id === id);
        setSelectedBlogPost({ id, index, selected: String(id) }); 
        setEditingBlogPost(false);
    };

    const handleEditBlogPost = () => {
        if (selectedBlogPost.id !== -1 && selectedBlogPost.index !== -1) {
            setEditingBlogPost(!editingBlogPost);
        }
    };

    const handleSaveBlogPost = useCallback(async (data) => {
        await saveBlogPost(data);
    }, [saveBlogPost]);

    const handleUpdateBlogPost = useCallback(async (data) => {
        if (selectedBlogPost.id !== -1) {
            const { tag, title, content } = data;
            await updateBlogPost({
                id: selectedBlogPost.id,
                tag,
                title,
                content,
            });
            setSelectedBlogPost({ id: -1, index: -1, selected: "" });
        }
    }, [updateBlogPost, selectedBlogPost.id]);

    const handleRemoveBlogPost = useCallback(async () => {
        if (selectedBlogPost.id !== -1 && confirm("Are you sure you want to remove this blog post?")) {
            await deleteBlogPost(selectedBlogPost.id);
            setSelectedBlogPost({ id: -1, index: -1, selected: "" });
        }
    }, [deleteBlogPost, selectedBlogPost.id]);

    return (
        <div className={`managementPanel-${theme}`}>
            <h3>Add new blog post.</h3>
            <BlogPostForm onSubmit={handleSaveBlogPost} submitError={saveBlogPostError} props={{ tag:"", title:"", content:"" }}/>
            <h3>Change existing blog post.</h3>
            <AsyncData loading={blogPostsIsLoading} error={blogPostsError}>
                <Error error={deleteBlogPostError} data-cy={"managementPanelBlogPosts_deleteError"}/>
                <label htmlFor="id">ID: </label>
                 <select id="id" name="id" value={selectedBlogPost.selected} onChange={handleSelectBlogPost} className={`idSelector-${theme}`} data-cy={"managementPanelBlogPosts_idSelector"}>
                    <option value="">-</option>
                    {blogPosts.map(({id}) => (
                        <option key={id} value={id}>{id}</option>
                    ))}
                </select>
                <button type="button" onClick={handleEditBlogPost} className={`buttonEdit-${theme}`} data-cy={"managementPanelBlogPosts_edit"}>
                    Edit
                </button>
                <button type="button" onClick={handleRemoveBlogPost} className={`buttonRemove-${theme}`} data-cy={"managementPanelBlogPosts_delete"}>
                    Delete
                </button>
                {editingBlogPost && selectedBlogPost.index !== -1 ? 
                    <BlogPostForm onSubmit={handleUpdateBlogPost} submitError={updateBlogPostError} props={blogPosts[selectedBlogPost.index]}/>
                    : null
                }
            </AsyncData>
            <BlogPostHeaderList blogPosts={blogPosts}/>
        </div>
    );
}
