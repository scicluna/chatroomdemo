import { useUser } from "./UserContext"

export default function LogoutButton() {

    const { user, setUser } = useUser()

    async function handleLogout() {
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


    return (
        <button className="text-lime-500 hover:text-lime-200" onClick={handleLogout}>Logout</button>
    )
}