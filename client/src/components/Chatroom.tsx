import MessageBar from "./MessageBar";
import { useEffect, useState, useRef } from "react";

const URL = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000';
const WS = window.location.origin.includes('local') ? 'ws://localhost:3000/ws' : "wss://voidchat.herokuapp.com/ws";

export default function Chatroom() {
    //set state for chats list
    const [chats, setChats] = useState<Chat[]>([])

    //html references
    const chatContainer = useRef<HTMLDivElement>(null)
    const lastMessage = useRef<HTMLDivElement>(null)

    //webSocket ref
    const socketRef = useRef<WebSocket | null>(null);

    //useEffect to handle smooth mouse scrolling with new incoming chats.
    useEffect(() => {
        if (!chatContainer.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
        const diff = scrollHeight - (scrollTop + clientHeight);
        const threshold = 30;
        const isAtBottom = diff <= threshold;

        if (isAtBottom) {
            if (lastMessage.current) {
                chatContainer.current.scrollTo({
                    top: lastMessage.current.offsetTop,
                    behavior: "smooth",
                });
            }
        }
    }, [chats]);

    //grabs our chats from mongoose
    async function getChats() {
        const response = await fetch(`${URL}/api/chat`);
        if (response.status === 200) {
            const chat = await response.json();
            return chat;
        } else {
            return null;
        }
    }

    //primary useEffect logic for updating chats live
    useEffect(() => {

        //async loadChats function to grab chats from mongoose and set the current state
        async function loadChats() {
            const chat = await getChats();
            if (!chat) return;
            setChats(chat);
        }
        loadChats();

        //handle settingup a new WebSocket
        const setupWebSocket = () => {
            // Create a new WebSocket instance
            console.log('websocket is ', WS)
            console.log(window.location.origin.includes('local'))
            socketRef.current = new WebSocket(WS);

            // Connection opened
            socketRef.current.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:", event);
            });

            // Handle incoming messages
            const handleMessage = (event: any) => {
                console.log("WebSocket message received:", event);
                const message = JSON.parse(event.data);

                //If message.type is "NEW_CHAT" then update the chats state to include the new message data.
                if (message.type === "NEW_CHAT") {
                    // Update the chats state with the new chat
                    setChats((prevChats) => [...prevChats, message.data]);
                }
            };

            // Listen for messages
            socketRef.current.addEventListener("message", handleMessage);

            // Handle WebSocket disconnection
            socketRef.current.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:", event);

                // Remove the message event listener
                socketRef.current?.removeEventListener("message", handleMessage);

                // Attempt to reconnect after a delay keeping sessions mostly active
                setTimeout(() => {
                    setupWebSocket();
                }, 5000); // 5 seconds
            });
        };

        //initially set up the webSocket
        setupWebSocket();

        // Clean up the WebSocket connection and listeners when the component is unmounted
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    //return jsx for the chatroom and message bar mapping the chats over our view
    return (
        <>
            <main className="h-screen w-screen p-5 bg-zinc-800 text-lime-500 overflow-y-scroll
                scrollbar-none" ref={chatContainer} >
                {chats.map((chat, i) => {
                    return (
                        //handles our "lastMessage" ref tagging the most recent chat as "lastMessage"
                        <div key={i} className="flex gap-5" ref={i === chats.length - 1 ? lastMessage : null}>
                            <p>{chat.author?.username || 'Unknown'}:</p>
                            <p>{chat.body}</p>
                        </div>
                    )
                })}
            </main>
            <MessageBar socket={socketRef.current} />
        </>
    )
}