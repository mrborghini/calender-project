import type { RowDataPacket } from "mysql2";
import MysqlCommunication from "./mysql-communication";
import type { TaskData } from "./types/task-data";

class Tasks extends MysqlCommunication {
    public async getTasks() {
        const data = await this.executeQuery("SELECT tasks.id, users.username, tasks.description, tasks.current_status, tasks.due_timestamp, title FROM tasks INNER JOIN users ON tasks.created_by = users.id;", []);

        if (!data) {
            return JSON.stringify({});
        }

        const row = data[0] as RowDataPacket;

        const tasks: TaskData[] = []

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

        return JSON.stringify({ "amount": tasks.length, tasks });
    }

    public async addTask(userId: number, title: string, description: string, dueTimestamp: bigint) {
        await this.executeQuery("INSERT INTO tasks (current_status, due_timestamp, title, description, created_by) VALUES (?, ?, ?, ?, ?)", [
            "todo",
            `${dueTimestamp}`,
            title,
            description,
            `${userId}`
        ]);

        return JSON.stringify({ "message": "Success!" });
    }

    public async modifyTask(id: number, userId: number, title: string, description: string, dueTimestamp: bigint) {
        await this.executeQuery(
            "UPDATE tasks SET current_status = ?, due_timestamp = ?, title = ?, description = ?, created_by = ? WHERE id = ?",
            [
                "todo",
                `${dueTimestamp}`,
                title,
                description,
                `${userId}`,
                `${id}`
            ]
        );
    }
}

export default Tasks;