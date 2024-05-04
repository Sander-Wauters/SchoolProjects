import { memo } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { useThemeContext } from "../../contexts/Theme.context";

export default memo(function MilestoneHeader(props) {
    const { theme } = useThemeContext();

    const { id, tag, accomplished, title } = props;

    return (
        <div className={`milestoneHeader${accomplished ? "-accomplished" : ""}-${theme}`}>
            <div>
                <p>
                    <span>#{id} </span>
                    <strong className={`tag-${tag.toLowerCase()}-${theme}`} data-cy="blogPostHeader_tag">
                        {tag}
                    </strong>
                    <TbArrowBadgeRightFilled/>{title}
                </p>
            </div>
        </div>
    );
});
