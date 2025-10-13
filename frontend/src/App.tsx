import { useState, useEffect, createContext } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Favourite from "./components/pages/Favourite";
import About from "./components/pages/About";
import Logout from "./components/pages/Logout";
import axios from "axios";
import calculateAge from "./utils/CalculateAge";
import { ToastContainer } from "react-toastify";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  email: string;
  description: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const UserContext = createContext<UserContextType | undefined>(undefined);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8888/api/user", {
          headers: { "Content-Type": "application/json" },
        });

        const data = res.data;
        setUser({
          id: data.user_id,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          dob: data.date_of_birth,
          age: calculateAge(data.date_of_birth),
          email: data.email,
          description: data.description,
        });
      } catch (error) {
        console.error("❌ Failed fetching user data:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8888/api/protected");
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [user]);

  return (
    <BrowserRouter>
      <Header />
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/fav" element={<Favourite />} />
            <Route path="/about" element={<About />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>

  );
}

export default App;
