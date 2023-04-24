


export default function LoginButtons() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    const handleGitHubLogin = () => {
        window.location.href = 'http://localhost:3000/auth/github';
    };

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <button onClick={handleGitHubLogin}>Login with GitHub</button>
        </div>
    );
};





