import LoginButtons from "./components/LoginButtons"
import LogoutButton from "./components/LogoutButton";
import MessageBar from "./components/MessageBar";
import { useUser } from "./components/UserContext";

export default function App() {

  const { user } = useUser();

  return (
    <>
      {user ? (
        <>
          <h1>WELCOME</h1>
          <LogoutButton />
          <MessageBar />
        </>
      ) : (
        <LoginButtons />
      )}
    </>
  )
}