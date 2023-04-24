import LoginButtons from "./LoginButtons";

export default function LoginScreen() {
    return (
        <main className="flex items-center justify-center h-screen w-screen bg-black">
            <div className="w-5/6 h-5/6 bg-zinc-950 flex flex-col gap-5 justify-center items-center">
                <h1 className="text-lime-600 text-3xl">Enter The Void</h1>
                <LoginButtons />
            </div>
        </main>
    )
}