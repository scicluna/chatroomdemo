import { useRef } from "react"
import { useUser } from "./UserContext"

export default function MessageBar({ socket }: any) {
    //set message ref for submission use
    const message = useRef<HTMLInputElement>(null)

    //get user variable from our user context
    const { user } = useUser()

    //handle logic for posting a message
    async function postMessage(e: React.MouseEvent) {
        e.preventDefault()
        if (!message.current?.value) return
        if (!user) return

        //post request using the user context and the input value
        try {
            const response = await fetch('https://voidchat.herokuapp.com/api/chat',
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
                //send the message to our websocket
                socket.send(
                    JSON.stringify({
                        authorId: user.id,
                        body: message.current.value,
                    })
                );
                // Clear the input field after a successful message post
                message.current.value = "";
            } else {
                console.error("Error posting message:", response.status);
            }
        } catch (err) {
            console.error(err)
        }
    }

    //simple jsx setup
    return (
        <div className="bg-zinc-900 w-screen p-3">
            <form className="w-full flex justify-center">
                <input className="w-5/6 text-lime-200 bg-zinc-500 opacity-50" ref={message} type="text" />
                <button className=" text-lime-500 hover:text-lime-200 ml-2" type="submit" onClick={postMessage}>POST</button>
            </form>
        </div>
    )
}