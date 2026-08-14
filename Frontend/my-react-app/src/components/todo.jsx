import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Todo() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todos, setTodos] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:3000/api/todos";

    // GET TODOS
    const getTodo = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTodos(response.data);
        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to view tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        getTodo();
    }, []);

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // ADD TODO
    const addTodo = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task");
            return;
        }

        try {
            await axios.post(
                API_URL,
                {
                    title: title
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle("");
            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add task"
            );
        }
    };

    // START EDIT
    const startEdit = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
    };

    // UPDATE TODO
    const updateTask = async (id) => {
        if (!editTitle.trim()) {
            alert("Task cannot be empty");
            return;
        }

        try {
            await axios.put(
                `${API_URL}/${id}`,
                {
                    title: editTitle
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditId(null);
            setEditTitle("");

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // COMPLETE / UNCOMPLETE TODO
    const toggleTodo = async (todo) => {
        try {
            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    completed: !todo.completed
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // DELETE TODO
    const deleteTodo = async (id) => {
        try {
            await axios.delete(
                `${API_URL}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    return (
        <div className="todo-container">

            <div className="todo-header">
                <h1>Todo List</h1>

                <button
                    onClick={logout}
                    className="logout-btn"
                >
                    Logout
                </button>
            </div>

            {/* ADD TODO */}
            <form onSubmit={addTodo}>

                <input
                    type="text"
                    placeholder="Enter a new task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button type="submit">
                    Add
                </button>

            </form>

            {/* LOADING */}
            {loading && (
                <p className="loading">
                    Loading todos...
                </p>
            )}

            {/* ERROR */}
            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {/* EMPTY */}
            {!loading && !error && todos.length === 0 && (
                <p>
                    No Todo yet. Add your First Task in it
                </p>
            )}

            {/* TODO LIST */}
            <div>

                {!loading &&
                    todos.map((todo) => (

                        <div
                            className="todo-item"
                            key={todo._id}
                        >

                            {editId === todo._id ? (

                                <>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            updateTask(todo._id)
                                        }
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditId(null);
                                            setEditTitle("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>

                            ) : (

                                <>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() =>
                                            toggleTodo(todo)
                                        }
                                    />

                                    <span
                                        className={
                                            todo.completed
                                                ? "completed"
                                                : ""
                                        }
                                    >
                                        {todo.title}
                                    </span>

                                    <button
                                        onClick={() =>
                                            startEdit(todo)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteTodo(todo._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </>

                            )}

                        </div>

                    ))}

            </div>

        </div>
    );
}

export default Todo;