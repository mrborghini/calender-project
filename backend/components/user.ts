import type { RowDataPacket } from "mysql2/promise";
import MysqlCommunication from "./mysql-communication";

class User extends MysqlCommunication {
    public async login(username: string, password: string): Promise<boolean | string> {
        const result = await this.ExecuteQuery("SELECT * FROM users WHERE username = ?", [username]);
    
        // Ensure result is an array of rows and check if it's empty
        if (!result || !Array.isArray(result[0]) || result[0].length === 0) {
            console.log("Could not determine array")
            return false;
        }
        
        // Assuming result is an array of RowDataPacket objects
        const row = result[0][0] as RowDataPacket;
        
        // If the row doesn't have a password field, return false
        if (!row || !row.password) {
            return false;
        }
    
        const hash = row.password;
    
        const isMatch = await Bun.password.verify(password, hash);

        if (!isMatch) {
            return false;
        }

        const userData = {
            "id": row.id,
            "username": row.username,
            "password": row.password,
            "hasAccess": row.has_access === 1 ? true : false
        }

        return JSON.stringify(userData);
        
    }

    public async userCreate(username: string, password: string){
        await this.ExecuteQuery("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
    }
}

export default User;