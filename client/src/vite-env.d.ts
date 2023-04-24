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

type Chat = {
    author: {
        email: string,
        githubId: string,
        googleId: string,
        id: string,
        signedUp: string,
        username: string,
    }
    authorId: string;
    body: string;
    createdAt: string;
    id: string;
}