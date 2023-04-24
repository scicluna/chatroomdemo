import { useUser } from "./UserContext"

export default function LogoutButton() {

    const { user, setUser } = useUser()

    function handleLogout() {
        if (user) {
            setUser(null)
        }
    }


    return (
        <button className="text-lime-500 hover:text-lime-200" onClick={handleLogout}>Logout</button>
    )
}