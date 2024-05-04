import { Outlet, Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiAdjust } from "react-icons/bi";
import { useThemeContext } from "./contexts/Theme.context";
import { useAuth } from "./contexts/Auth.context";

export default function Root() {
    const { theme, toggleTheme } = useThemeContext();
    const { isAuthed } = useAuth();

    return (
        <>
            <header className="mainHeader">
                <img src="/images/logo.png" width={100} height={100} alt="logo"/>
                <h1>d3dGraphicsEngine</h1>  
            </header>
            <nav className={`mainNavigation-${theme}`}>
                <input type="checkbox" id="check"/>
                <label htmlFor="check" className="menuIcon">
                    <GiHamburgerMenu/>
                </label>
                <ul> 
                    <li>
                        <button type="button" onClick={toggleTheme}>
                            <BiAdjust/>
                        </button>
                    </li>
                    <li><Link className="link" to="/roadmap" data-cy="navbar_roadmap">Roadmap</Link></li>
                    <li><Link className="link" to="/blog" data-cy="navbar_blog">Blog</Link></li>
                    <li>{ isAuthed ? 
                        <Link className="link" to="/logout" data-cy="button_logout">Logout</Link> :
                        <Link className="link" to="/login">Login</Link> 
                    }</li>
                    <li>
                        <label htmlFor="check" className="li-menuIcon">
                            <GiHamburgerMenu/>
                        </label>
                    </li>
                </ul>
            </nav> 
            <Outlet />
        </>
    );
}
