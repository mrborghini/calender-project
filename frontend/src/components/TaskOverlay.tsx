import { useEffect, useState } from "react";
import { TaskData } from "./types/task-data";
import WsConnection from "./ws-connection";

interface Props {
    task: TaskData,
    onClose: () => void,
    ws: WsConnection | null,
}

function TaskOverlay(props: Props) {
    const [title, setTitle] = useState(props.task.title);
    const [description, setDescription] = useState(props.task.description);

    useEffect(() => {

    }, []);
    return (
        <>
            <div className="overlay">
                <button onClick={props.onClose}>X</button>
                <div>
                    <div className="input-container">
                        <label htmlFor="overlay-title">Title:</label>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            id="overlay-title"
                            placeholder="Type a title here"
                            className="overlay-info"
                            type="text"
                            defaultValue={title}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="date">When:</label>
                        <input type="datetime-local" id="date" name="date" />
                    </div>
                    <div className="input-container">
                        <label htmlFor="desc">Description:</label>
                        <textarea
                            className="overlay-info"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Type description here"
                            name="desc"
                            value={description}
                            id="desc"
                        ></textarea>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TaskOverlay;