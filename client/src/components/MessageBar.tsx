import { useRef } from "react"
import { useUser } from "./UserContext"
import socket from '../socket';

export default function MessageBar() {
    const message = useRef<HTMLInputElement>(null)
    const { user } = useUser()

    async function postMessage(e: React.MouseEvent) {
        e.preventDefault()
        if (!message.current?.value) return
        if (!user) return

        try {
            const response = await fetch('http://localhost:3000/api/chat',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        authorId: user.id,
                        body: message.current.value
                    }),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                }
            )
            if (response.ok) {
                // Clear the input field after a successful message post
                message.current.value = "";
                const newChat = await response.json();
                socket.emit('newChat', newChat);
            } else {
                console.error("Error posting message:", response.status);
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="bg-zinc-900 w-screen p-3">
            <form className="w-full flex justify-center">
                <input className="w-5/6 text-lime-200 bg-zinc-500 opacity-50" ref={message} type="text" />
                <button className=" text-lime-500 hover:text-lime-200 ml-2" type="submit" onClick={postMessage}>POST</button>
            </form>
        </div>
    )
}