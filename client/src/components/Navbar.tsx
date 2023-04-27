import LogoutButton from "./LogoutButton"
import voidlogo from "../void.png"

//simple jsx container for our logout button and any other components in the navbar
export default function Navbar() {
    return (
        <nav className="flex justify-between items-center bg-zinc-900 text-zinc-100 p-5 h-16">
            <img className="h-full" src={voidlogo} />
            <LogoutButton />
        </nav>
    )
}

