import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth.context";
import { ThemeProvider } from "./contexts/Theme.context";
import Root from "./Root";
import Blog from "./components/blog/Blog";
import Roadmap from "./components/roadmap/Roadmap";
import BlogPost from "./components/blog/BlogPost";
import Login from "./components/login/Login";
import Logout from "./components/login/Logout";
import Register from "./components/login/Register";
import AdminPanel from "./components/management/AdminPanel";
import PrivateRoute from "./components/util/PrivateRoute";
import NotFound from "./components/util/NotFound";

const router = createBrowserRouter([
    { path: "/", element: <Root />, children: [
        { index: true, element: <Roadmap />, },
        { path: "/blog", element: <Blog />, },
        { path: "/roadmap", element: <Roadmap />, },
        { path: "/post/:id", element: <BlogPost /> },
        { path: "/login", element: <Login /> },
        { path: "/logout", element: <Logout /> },
        { path: "/register", element: <Register /> },
        { path: "/admin", element: <PrivateRoute />, children: [
            { index: true, element: <AdminPanel />, },
        ] },
        { path: "*", element: <NotFound />, },
    ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);
