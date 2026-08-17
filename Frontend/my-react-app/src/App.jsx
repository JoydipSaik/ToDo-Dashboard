import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./components/login";
import Register from "./components/Register";
import Todo from "./components/todo";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/todo"
                element={<Todo />}
            />

        </Routes>
    );
}

export default App;