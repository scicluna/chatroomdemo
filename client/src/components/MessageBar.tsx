import { useRef } from "react"
import { useUser } from "../contexts/UserContext"

const URL = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000';

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
            const response = await fetch(`${URL}/api/chat`,
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
        <div className="w-screen p-3" style={{ backgroundColor: 'rgb(0 0 0 / 61%)' }}>
            <form className="w-full flex justify-center">
                <input className="p-1 w-5/6 text-green-500" ref={message} type="text" style={{ backgroundColor: '#fafafa36' }} />
                <button className=" text-green-500 hover:text-green-200 ml-2" type="submit" onClick={postMessage}>POST</button>
            </form>
        </div>
    )
}