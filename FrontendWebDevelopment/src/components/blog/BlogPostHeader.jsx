import { memo } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { useThemeContext } from "../../contexts/Theme.context";

export default memo(function BlogPostHeader(props) {
    const { theme } = useThemeContext();

    const { id, username, tag, date, title } = props;

    return (
        <div className={`blogPostHeader-${theme}`} data-cy="blogPostHeader" >
            <div>
                <p>
                    <span>#{id} </span> 
                    <strong className={`tag-${tag.toLowerCase()}-${theme}`} data-cy="blogPostHeader_tag">
                        {tag}
                    </strong>
                    <TbArrowBadgeRightFilled/>{title}
                </p>
                <p className="blogPostHeader-createdBy" data-cy="blogPostHeader_createdBy">
                    Created by {username} on {date}
                </p> 
            </div>
        </div>
    );
});
