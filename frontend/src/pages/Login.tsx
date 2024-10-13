import { useState } from "react";
import { Navigate } from "react-router-dom"; // Ensure this is imported from react-router-dom

function Login() {
    const baseUrl = import.meta.env.VITE_APP_API_URL || "";
    // Define state for username, password, error, and redirect
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent page reload

        const body = {
            "usernameOrEmail": username,
            "password": password,
        };

        try {
            const response = await fetch(`${baseUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            if (!response.ok) {
                // If the response was not OK, set the error message
                setError(jsonData.message || "An error occurred. Please try again.");
                return;
            }

            // If token is present, save it and set redirect to true
            if (jsonData.token) {
                localStorage.setItem("token", jsonData.token);
                setRedirect(true);
            }
        } catch (error) {
            setError("Network error. Please try again later.");
        }
    };

    if (redirect) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <h1>{error}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    required
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update username
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    required
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password
                />
                <button type="submit">Login</button>
            </form>
        </>
    );
}

export default Login;
