import MessageBar from "./MessageBar";
import { useEffect, useState, useMemo, useRef } from "react";

export default function Chatroom() {
    const [chats, setChats] = useState<Chat[]>([])
    const chatContainer = useRef<HTMLDivElement>(null)
    const lastMessage = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chatContainer.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
        const diff = scrollHeight - (scrollTop + clientHeight);
        const threshold = 30;
        const isAtBottom = diff <= threshold;

        console.log('scroll height', scrollHeight)
        console.log('scroll top', scrollTop)
        console.log('client height', clientHeight)
        console.log('diff', scrollHeight - (scrollTop + clientHeight))
        console.log(isAtBottom)

        if (isAtBottom) {
            if (lastMessage.current) {
                chatContainer.current.scrollTo({
                    top: lastMessage.current.offsetTop,
                    behavior: "smooth",
                });
            }
        }
    }, [chats]);

    const socket = useMemo(() => {
        return new WebSocket("wss://voidchat.herokuapp.com/ws");
    }, []);

    async function getChats() {
        const response = await fetch("https://voidchat.herokuapp.com/api/chat");
        if (response.status === 200) {
            const chat = await response.json();
            return chat;
        } else {
            return null;
        }
    }

    useEffect(() => {
        async function loadChats() {
            const chat = await getChats();
            if (!chat) return;
            setChats(chat);
        }
        loadChats();

        let socket: WebSocket;

        const setupWebSocket = () => {
            // Create a new WebSocket instance
            socket = new WebSocket("wss://voidchat.herokuapp.com/ws");

            // Connection opened
            socket.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:", event);
            });

            // Handle incoming messages
            const handleMessage = (event: any) => {
                console.log("WebSocket message received:", event);
                const message = JSON.parse(event.data);

                if (message.type === "NEW_CHAT") {
                    // Update the chats state with the new chat
                    setChats((prevChats) => [...prevChats, message.data]);
                }
            };

            // Listen for messages
            socket.addEventListener("message", handleMessage);

            // Handle WebSocket disconnection
            socket.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:", event);

                // Remove the message event listener
                socket.removeEventListener("message", handleMessage);

                // Attempt to reconnect after a delay
                setTimeout(() => {
                    setupWebSocket();
                }, 5000); // 5 seconds
            });
        };

        setupWebSocket();

        // Clean up the WebSocket connection and listeners when the component is unmounted
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    console.log(chats)

    return (
        <>
            <main className="h-screen w-screen p-5 bg-zinc-800 text-lime-500 overflow-y-scroll
                scrollbar-none" ref={chatContainer} >
                {chats.map((chat, i) => {
                    return (
                        <div key={i} className="flex gap-5" ref={i === chats.length - 1 ? lastMessage : null}>
                            <p>{chat.author?.username || 'Unknown'}:</p>
                            <p>{chat.body}</p>
                        </div>

                    )
                })}
            </main>
            <MessageBar socket={socket} />
        </>
    )
}