import { useEffect } from 'react';
import { useAuth } from '../../contexts/Auth.context';

export default function Logout() {
    const { isAuthed, logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div>
            {isAuthed ? <h2>Logging out...</h2> : <h2>You were successfully logged out</h2>}
        </div>
    );
}
