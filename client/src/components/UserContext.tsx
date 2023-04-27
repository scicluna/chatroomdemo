import { createContext, useContext, useState, useEffect } from "react";

//declare userContext -- which is an object containing the user state and the set user function
const UserContext = createContext<UserContextValue | null>(null);


//custom hook that returns the userContext object
export function useUser() {
    const context = useContext(UserContext);

    if (!context) return { user: null, setUser: null }

    return context
}

//fetches the current user or null
async function fetchCurrentUser() {
    const response = await fetch("https://voidchat.herokuapp.com/api/user", {
        credentials: "include", // To include the session cookie
    });

    if (response.status === 200) {
        const user = await response.json();
        return user;
    } else {
        return null;
    }
}

//wrapping component -- establishes our user state
export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    //initial fetch for our user -- basically, if a user already exists in the session, set that user to that user.
    useEffect(() => {

        async function loadCurrentUser() {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
        }

        loadCurrentUser();
    }, []);

    //wrap our app inside of UserContext to gain user and setUser globally
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
