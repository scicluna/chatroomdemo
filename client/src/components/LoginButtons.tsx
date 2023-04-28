import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const URL = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000';

export default function LoginButtons() {
    //change our current route to auth/google for authentication purposes
    const handleGoogleLogin = () => {
        window.location.href = `${URL}/auth/google`;
    };
    //change our current route to auth/github for authentication purposes
    const handleGitHubLogin = () => {
        window.location.href = `${URL}/auth/github`;
    };

    //return both login buttons
    return (
        <>
            <button className="text-5xl bg-zinc-400 hover:bg-zinc-100 transition-all duration-200 ease-in-out rounded-xl p-3" onClick={handleGoogleLogin}>Login with Google
                <FontAwesomeIcon icon={faGoogle} /></button>
            <button className="text-5xl bg-zinc-400 hover:bg-zinc-100 transition-all duration-200 ease-in-out rounded-xl p-3" onClick={handleGitHubLogin}>Login with GitHub
                <FontAwesomeIcon icon={faGithub} /> </button>
        </>
    );
};





