import mysql from "mysql2/promise";

class MysqlCommunication {
    private sqlUsername = import.meta.env.MYSQL_USER || "";
    private sqlPassword = import.meta.env.MYSQL_PASSWD || "";
    private dbName = import.meta.env.MYSQL_DB || "";
    private sqlHost = import.meta.env.MYSQL_HOST || "";

    private conn: mysql.Connection | null = null;

    private async Connect(){
        this.conn = await mysql.createConnection({
            host: this.sqlHost,
            user: this.sqlUsername,
            password: this.sqlPassword,
            database: this.dbName,
          });

          if (!this.conn) {
            throw new Error("Connection is not initialized.");
        }
    }

    protected async ExecuteQuery(command: string, values: string[]) {
        if (!this.conn) {
            await this.Connect();
        }
    
        // Prepare and execute the initial command
        const prepared = await this.conn?.prepare(command);
        
        // Execute the command with the first value, or use the full values array as needed
        return await prepared?.execute(values);
    }

    public async userCreate(username: string, password: string){
        await this.ExecuteQuery("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
    }
}

export default MysqlCommunication;