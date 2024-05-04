import { useThemeContext } from "../../contexts/Theme.context";

export default function Milestone(props) {
    const { theme } = useThemeContext();
    const { accomplished, imagePath, title, content } = props;
    
    return (
        <div className={`milestone${accomplished ? "-accomplished" : ""}-${theme}`}>
            <h2>{title}</h2>
            {imagePath && imagePath.match("^.*\\.(jpg|png)$") ? 
                <img src={imagePath} alt={title}/> : null
            }
            <p>{content}</p>
        </div>
    );
}
