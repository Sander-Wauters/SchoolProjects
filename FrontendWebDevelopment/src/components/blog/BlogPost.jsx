import { useCallback } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAll, post } from "../../api";
import { useThemeContext } from "../../contexts/Theme.context";
import { useAuth } from "../../contexts/Auth.context";
import AsyncData from "../util/AsyncData";
import BlogPostHeader from "./BlogPostHeader";
import Comment from "../comments/Comment";
import CommentForm from "../comments/CommentForm";

export default function BlogPost() {
    const { id } = useParams();

    const { theme } = useThemeContext();
    const { isAuthed } = useAuth();

    const { data: blogPost={}, mutate: mutateBlogPost, isLoading: blogPostIsLoading, error: blogPostError } = useSWR(`blogPosts/${id}`, getAll);
    const { trigger: saveComment, error: saveError } = useSWRMutation("comments", post); 

    const handleSubmitComment = useCallback(async (data) => {
        const { content } = data;

        await saveComment({
            postId: id,
            content,
        });
        mutateBlogPost();
    }, [saveComment, mutateBlogPost, id]);

    return (
        <>
            <AsyncData loading={blogPostIsLoading} error={blogPostError}>
                <BlogPostHeader {...blogPost} />
                <div className={`blogPost-${theme}`} data-cy="blogPost_content">
                    <div>
                        {blogPost.content}
                    </div>
                </div>
                {blogPost.Comments ? blogPost.Comments.map((comment) => 
                    <Comment key={comment.id} commentData={comment} mutateBlogPost={mutateBlogPost} />
                ) : null}
            </AsyncData>
            {isAuthed ?  
                <CommentForm onSubmit={handleSubmitComment} submitError={saveError} className={`commentForm-${theme}`}/> : null
            }
        </>
    );
}

