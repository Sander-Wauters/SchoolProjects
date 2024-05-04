import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/Auth.context";
import NotFound from "../util/NotFound";

export default function PrivateRoute() {
    const { ready, isAuthed, user: { role }} = useAuth();

    if (ready && isAuthed && role === "admin") {
        return <Outlet />;
    }

    return <NotFound />;
}
