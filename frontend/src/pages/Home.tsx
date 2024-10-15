import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import WsConnection from "../components/ws-connection";
import { TaskData } from "../components/types/task-data";
import Task from "../components/Task";
import TaskOverlay from "../components/TaskOverlay";

function Home() {
    const [, setToken] = useState<string | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [ws, setWs] = useState<WsConnection | null>(null);
    const [currentData, setCurrentData] = useState<TaskData[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setRedirect(true);
            return;
        }

        setToken(storedToken);

        const connection = new WsConnection(storedToken, (tasks: TaskData[]) => {
            setCurrentData(tasks); // Update state with new tasks
            console.log(tasks);
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

    const handleTaskClick = (task: TaskData) => {
        setSelectedTask(task);
    };

    const closeOverlay = () => {
        setSelectedTask(null);
    };

    return (
        <>
            <div className="home">
                <h1>Tasks</h1>
                <button>Add new task</button>
                <div className="task-list">
                    {currentData.map((task) => (
                        <div
                            key={task.id.toString()}
                            onClick={() => handleTaskClick(task)}
                            className="task-item"
                            style={{ cursor: "pointer" }}
                        >
                            <Task
                                id={task.id}
                                currentStatus={task.currentStatus}
                                dueTimeStamp={task.dueTimestamp}
                                title={task.title}
                                description={task.description}
                                username={task.username}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedTask && (
                <TaskOverlay task={selectedTask} onClose={closeOverlay} ws={ws} />
            )}
        </>
    );
}

export default Home;
