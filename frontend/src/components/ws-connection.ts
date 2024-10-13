import { TaskData } from "./types/task-data";

class WsConnection {
    private baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";
    private ws: WebSocket;
    public currentTaskData: TaskData[] = [];

    constructor(token: string, onTasksUpdate: (tasks: TaskData[]) => void) {
        this.ws = new WebSocket(`${this.baseUrl}/realtime`, ["authorization", token]);

        this.ws.onopen = () => this.onOpen();
        this.ws.onmessage = (event) => this.onMessage(event, onTasksUpdate);
    }

    private onOpen() {
        console.log("Connected");
    }

    private onMessage(event: MessageEvent<any>, onTasksUpdate: (tasks: TaskData[]) => void) {
        try {
            const jsondata = JSON.parse(event.data);

            console.log(event.data)

            if (jsondata.tasks) {
                this.currentTaskData = jsondata.tasks as TaskData[];
                onTasksUpdate(this.currentTaskData); // Notify the Home component of the update
            }
        } catch (error) {
            console.log("Invalid message data:", event.data);
        }
    }

    public close() {
        this.ws.close();
    }
}

export default WsConnection;
