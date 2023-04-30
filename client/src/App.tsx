import { useUser } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import Chatroom from "./pages/Chatroom";
import LoginScreen from "./pages/LoginScreen";
import blackhole from '../public/blackhole2.jpg'

export default function App() {
  //grab user from userContext
  const { user } = useUser();

  //render intiial layout depending on whether or not the userContext contains a user
  return (
    <>
      {user ? (
        <>
          <div className="flex flex-col h-screen w-screen" style={{ backgroundImage: `url(${blackhole})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
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