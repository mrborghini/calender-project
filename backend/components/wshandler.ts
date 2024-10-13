import type { ServerWebSocket } from "bun";
import Tasks from "./tasks";
import User from "./user";
import Logger from "./logger";

class WsHandler {
    private tasks = new Tasks();
    private connections: ServerWebSocket<unknown>[] = [];
    private user = new User();
    private logger = new Logger("WsHandler");

    public async addConnection(ws: ServerWebSocket<unknown>) {
        this.connections.push(ws);

        ws.send(await this.tasks.getTasks());
    }

    public removeConnection(ws: ServerWebSocket<unknown>, code = 1000, reason = "") {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i] === ws) {
                this.connections.splice(i, 1);
                ws.close(code, reason);
                break;
            }
        }
    }

    public async handleMessage(ws: ServerWebSocket<unknown>, message: string) {
        try {
            const jsonData = JSON.parse(message);

            const token = jsonData.token as string;

            const user = await this.user.parseToken(token);

            if (!user || !user.hasAccess) {
                this.removeConnection(ws, 1011, "unauthorized");
                return;
            }

            switch (jsonData.command) {
                case "addtask":
                    if (!jsonData.title || !jsonData.description || !jsonData.dueTimestamp) {
                        ws.send("Missing required data");
                        return;
                    }
                    await this.tasks.addTask(user.id, jsonData.title, jsonData.description, jsonData.dueTimestamp);
                    break;

                default:
                    break;
            }
        } catch (error) {
            this.removeConnection(ws);
        }
    }
}

export default WsHandler;