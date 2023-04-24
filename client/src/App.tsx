import { useUser } from "./components/UserContext";
import Navbar from "./components/Navbar";
import Chatroom from "./components/Chatroom";
import LoginScreen from "./components/LoginScreen";

export default function App() {

  //const { user } = useUser();

  return (
    <>
      {/* {user ? ( */}
      <>
        <div className="flex flex-col h-screen w-screen">
          <Navbar />
          <Chatroom />
        </div>
      </>
      {/* ) : ( */}
      {/* <div>
        <LoginScreen />
      </div> */}
      {/* )} */}
    </>
  )
}