import { useUser } from "../contexts/UserContext"

export default function LogoutButton() {

    //grab user/setUser from our custom hook -- basically from the userContext provider
    const { user, setUser } = useUser()

    async function handleLogout() {
        //if user exists, get request to the logout route, destroying our session and setting user to null.
        if (user) {
            try {
                const response = await fetch('/logout', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.ok) {
                    setUser(null)
                } else {
                    console.error(response.statusText)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    //return logout button
    return (
        <button className="text-green-500 hover:text-green-200" onClick={handleLogout}>Logout</button>
    )
}