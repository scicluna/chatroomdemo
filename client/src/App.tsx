import { useUser } from "./components/UserContext";
import Navbar from "./components/Navbar";
import Chatroom from "./components/Chatroom";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  //grab user from userContext
  const { user } = useUser();

  //render intiial layout depending on whether or not the userContext contains a user
  return (
    <>
      {user ? (
        <>
          <div className="flex flex-col h-screen w-screen">
            <Navbar />
            <Chatroom />
          </div>
        </>
      ) : (
        <div>
          <LoginScreen />
        </div>
      )}
    </>
  )
}