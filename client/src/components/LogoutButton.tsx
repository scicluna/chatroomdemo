import { useUser } from "./UserContext"

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
        <button className="text-lime-500 hover:text-lime-200" onClick={handleLogout}>Logout</button>
    )
}