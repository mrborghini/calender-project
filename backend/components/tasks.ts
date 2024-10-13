import type { RowDataPacket } from "mysql2";
import MysqlCommunication from "./mysql-communication";
import jsonResponse from "./responses";
import type { Task } from "./types/tasks";

class Tasks extends MysqlCommunication {
    public async getTasks() {
        const data = await this.executeQuery("SELECT tasks.id, users.username, tasks.description, tasks.current_status, tasks.due_timestamp, title FROM tasks INNER JOIN users ON tasks.created_by = users.id;", []);

        if (!data) {
            return jsonResponse({});
        }

        const row = data[0] as RowDataPacket;

        const tasks: Task[] = []
        
        for (let i = 0; i < row.length; i++) {
            tasks.push({
                id: row[i].id,
                currentStatus: row[i].current_status,
                dueTimestamp: row[i].due_timestamp,
                title: row[i].title,
                description: row[i].description,
                username: row[i].username
            });
        }

        return jsonResponse({"amount": tasks.length, tasks})
    }
}

export default Tasks;