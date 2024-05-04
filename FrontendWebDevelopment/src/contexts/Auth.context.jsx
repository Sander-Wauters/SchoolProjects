import { createContext, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import useSWRMutation from "swr/mutation"; 
import { post, setAuthToken } from "../api";

const JWT_TOKEN_KEY = "jwtToken";
const USER_NAME_KEY = "username"; 
const USER_ROLE_KEY = "role";
const AuthContext = createContext();

function getUserFromStorage() {
    return {
        username: localStorage.getItem(USER_NAME_KEY),
        role: localStorage.getItem(USER_ROLE_KEY)
    };
}

export function useAuth() {
    return useContext(AuthContext); 
}

export function AuthProvider({ children }) {
    const [ready, setReady] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
    // TODO: check localStorage username and role with a getUser to the backend.
    const [user, setUser] = useState(getUserFromStorage());
    
    useEffect(() => {
        setAuthToken(token);
        setIsAuthed(Boolean(token));
        setReady(true);
    }, [token]);

    const { trigger: doLogin, isMutating: loading, error, } = useSWRMutation('users/login', post);

    const login = useCallback(async ({ username, password }) => {
        try {
            const { token, user } = await doLogin({ username, password });

            setToken(token); 
            setUser(user);

            localStorage.setItem(JWT_TOKEN_KEY, token);
            localStorage.setItem(USER_NAME_KEY, user.username);
            localStorage.setItem(USER_ROLE_KEY, user.role);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [doLogin]);

    const logout = useCallback(() => {
        setToken(null);
        setUser({ username: null, role: null });

        localStorage.removeItem(JWT_TOKEN_KEY);
        localStorage.removeItem(USER_NAME_KEY);
        localStorage.removeItem(USER_ROLE_KEY);
    }, []);

    const value = useMemo(() => ({
        token,
        user,
        error,
        ready,
        loading,
        isAuthed,
        login,
        logout,
    }), [token, user, error, ready, loading, isAuthed, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
