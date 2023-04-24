/// <reference types="vite/client" />

//establish types
interface User {
    id: number;
    username: string;
    email: string;
}

interface UserProviderProps {
    children: React.ReactNode;
}

type UserContextValue = {
    user: User | null;
    setUser: (user: User | null) => void;
};