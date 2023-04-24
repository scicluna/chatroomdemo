import { useUser } from "./UserContext"

export default function LogoutButton() {

    const { user, setUser } = useUser()

    function handleLogout() {
        if (user) {
            setUser(null)
        }
    }


    return (
        <button onClick={handleLogout}>Logout</button>
    )
}