import { useState } from "react";

function Login() {
    const baseUrl = import.meta.env.VITE_APP_API_URL || "";
    // Define state for username and password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSubmit = async (e: { preventDefault: () => void; }) =>{
        e.preventDefault(); // Prevent page reload
        console.log("Username:", username, "Password:", password);
        // Here you can add logic to send the data to a backend, etc.

        const body = {
            "username": username,
            "password": password,
        }

        const data = await fetch(`${baseUrl}/login`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const jsonData = await data.json();

        console.log(jsonData);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update username
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
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
