import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginButtons() {
    //change our current route to auth/google for authentication purposes
    const handleGoogleLogin = () => {
        window.location.href = `https://voidchat.herokuapp.com/auth/google`;
    };
    //change our current route to auth/github for authentication purposes
    const handleGitHubLogin = () => {
        window.location.href = `http://voidchat.herokuapp.com/auth/github`;
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





