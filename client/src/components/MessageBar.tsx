import { useRef } from "react"
import { useUser } from "./UserContext"

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
            } else {
                console.error("Error posting message:", response.status);
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <form>
                <input ref={message} type="text" />
                <button type="submit" onClick={postMessage}>POST</button>
            </form>
        </div>
    )
}