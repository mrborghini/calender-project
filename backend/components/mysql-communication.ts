import mysql from "mysql2/promise";
import Logger from "./logger";

class MysqlCommunication {
    private dbUsername = import.meta.env.MYSQL_USER || "";
    private dbPassword = import.meta.env.MYSQL_PASSWD || "";
    private dbName = import.meta.env.MYSQL_DB || "";
    private sqlHost = import.meta.env.MYSQL_HOST || "";
    private logger = new Logger("MysqlCommunication");

    private conn: mysql.Connection | null = null;

    private async connect() {
        const mysqlCreds = {
            host: this.sqlHost,
            user: this.dbUsername,
            password: this.dbPassword,
            database: this.dbName,
        }

        this.logger.debug(`Database options: ${JSON.stringify(mysqlCreds)}`);

        this.conn = await mysql.createConnection(mysqlCreds);

        if (!this.conn) {
            this.logger.error("Could not connect")
            throw new Error("Could not connect");
        }
    }

    protected async executeQuery(command: string, values: string[]) {
        if (!this.conn) {
            await this.connect();
        }

        if (!this.conn) {
            throw "Could not connect to mysql";
        }
        // Prepare and execute the initial command
        const prepared = await this.conn.prepare(command);

        // Execute the command with the first value, or use the full values array as needed
        const data = await prepared.execute(values);

        return data;
    }
}

export default MysqlCommunication;