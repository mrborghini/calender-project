import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import WsConnection from "../components/ws-connection";
import { TaskData } from "../components/types/task-data";
import Task from "../components/Task";

function Home() {
    const [token, setToken] = useState<string | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [ws, setWs] = useState<WsConnection | null>(null);
    const [currentData, setCurrentData] = useState<TaskData[]>([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setRedirect(true);
            return;
        }

        setToken(storedToken);

        const connection = new WsConnection(storedToken, (tasks: TaskData[]) => {
            setCurrentData(tasks); // Update state with new tasks
            console.log(tasks)
        });

        setWs(connection);

        // Clean up WebSocket on unmount
        return () => {
            connection.close();
        };
    }, []);

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <h1>Tasks</h1>
            <div className="task-list">
                {currentData.map((task) => (
                    <Task
                        key={task.id.toString()}
                        id={task.id}
                        currentStatus={task.currentStatus}
                        dueTimeStamp={task.dueTimestamp}
                        title={task.title}
                        description={task.description}
                        username={task.username}
                    />
                ))}
            </div>
        </>
    );
}

export default Home;
