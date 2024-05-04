import { memo, useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";
import { updateById, deleteById } from "../../api";
import { useThemeContext } from "../../contexts/Theme.context";
import { useAuth } from "../../contexts/Auth.context";
import Error from "../util/Error";
import CommentForm from "./CommentForm";

export default memo(function Comment({ commentData, mutateBlogPost }) {
    const { theme } = useThemeContext();
    const { user, isAuthed } = useAuth();

    const [editing, setEditing] = useState(false);

    const { trigger: updateComment, error: updateError } = useSWRMutation("comments", updateById);
    const { trigger: deleteComment, error: deleteError } = useSWRMutation("comments", deleteById);

    const { id, username, dateCreated, dateLastChanged, content } = commentData;

    const handleToggleEdit = () => {
        setEditing(!editing);
    };

    const handleEdit = useCallback(async (data) => {
        await updateComment({
            id: id,
            content: data.content,
        });
        (editing) => setEditing(!editing);
        mutateBlogPost();
    }, [updateComment, mutateBlogPost, id]);

    const handleRemove = useCallback(async () => {
        if (confirm("Are you sure you want to remove this comment?")) {
            await deleteComment(id);
            mutateBlogPost();
        }
    }, [deleteComment, mutateBlogPost, id]);

    return (
        <div className={`comment-${theme}`}>
            <div> 
                <p data-cy="comment_createdBy">{username} commented on {dateCreated}; last edited on {dateLastChanged}</p> 
                <p data-cy="comment_content">{content}</p>
                {isAuthed && (user.username === username || user.role === "admin") ?
                    <span>    
                        <button className={`buttonEdit-${theme}`} type="button"
                            onClick={handleToggleEdit} data-cy="comment_edit">
                            Edit
                        </button>
                        <button className={`buttonRemove-${theme}`} type="button"
                            onClick={handleRemove} data-cy="comment_remove">
                            Remove
                        </button>
                        <Error error={deleteError}/>
                    </span> : null
                }
                {editing ? 
                    <CommentForm onSubmit={handleEdit} submitError={updateError} initialContent={content} className={`commentEditForm-${theme}`} />
                    : null
                }
            </div>
        </div>
    );
});

