import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let root: string;
if (window.location.href.includes('local')) {
    root = "http://localhost:3000"
} else root = "https://voidchat.herokuapp.com"

export default function LoginButtons() {
    const handleGoogleLogin = () => {
        window.location.href = `${root}/auth/google`;
    };

    const handleGitHubLogin = () => {
        window.location.href = `${root}/auth/github`;
    };

    return (
        <>
            <button className="text-5xl bg-zinc-400 hover:bg-zinc-100 transition-all duration-200 ease-in-out rounded-xl p-3" onClick={handleGoogleLogin}>Login with Google
                <FontAwesomeIcon icon={faGoogle} /></button>
            <button className="text-5xl bg-zinc-400 hover:bg-zinc-100 transition-all duration-200 ease-in-out rounded-xl p-3" onClick={handleGitHubLogin}>Login with GitHub
                <FontAwesomeIcon icon={faGithub} /> </button>
        </>
    );
};




