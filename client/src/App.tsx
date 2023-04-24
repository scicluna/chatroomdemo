import LoginButtons from "./components/LoginButtons"
import LogoutButton from "./components/LogoutButton";
import { useUser } from "./components/UserContext";

export default function App() {

  const { user } = useUser();

  return (
    <>
      {user ? (
        <>
          <h1>WELCOME</h1>
          <LogoutButton />
        </>
      ) : (
        <LoginButtons />
      )}
    </>
  )
}