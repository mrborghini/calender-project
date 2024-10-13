import type { RowDataPacket } from "mysql2/promise";
import MysqlCommunication from "./mysql-communication";
import jwt from 'jsonwebtoken';
import type { UserCreds } from "./types/user-creds";
import jsonResponse from "./responses";

class User extends MysqlCommunication {
    private jwtSecret = process.env.JWT_TOKEN || "secretToken";
    private jwtExpiration = process.env.JWT_EXPIRATION || "14d"

    public async login(usernameOrEmail: string, password: string) {
        let user = await this.findUserbyUsername(usernameOrEmail);

        if (!user) {
            return jsonResponse({ message: "invalid username or password" }, 400);
        }

        if (!await this.verifyPassword(password, user.password)) {
            return jsonResponse({ message: "invalid username or password" }, 400);
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            hasAccess: user.hasAccess,
        }, this.jwtSecret, { expiresIn: this.jwtExpiration });

        return jsonResponse({ message: "Login success!", token: token })
    }

    public async findUserbyUsername(username: string): Promise<UserCreds | null> {
        return await this.findUser("username", username);
    }

    private async findUser(whereRow: string, value: string): Promise<UserCreds | null> {
        const result = await this.executeQuery(`SELECT * FROM users WHERE ${whereRow} = ?`, [value]);

        if (!result) {
            return null;
        }

        const results = result[0] as RowDataPacket;

        if (results.length === 0) {
            return null;
        }

        const row = results[0] as RowDataPacket;

        const user: UserCreds = {
            id: row.id,
            username: row.username,
            password: row.password,
            hasAccess: row.has_access === 1
        }

        return user;
    }

    public async parseToken(token: string | null): Promise<UserCreds | null> {
        if (token === null) {
            return null;
        }

        const splitToken = token.split("Bearer ");

        let tokenData;

        if (splitToken.length > 1) {
            tokenData = splitToken[1];
        } else {
            tokenData = splitToken[0]
        }

        try {
            const decoded = jwt.verify(tokenData, this.jwtSecret);
            const userData = decoded as UserCreds;

            const user = await this.findUserbyUsername(userData.username);

            if (!user) {
                return null;
            }

            userData.hasAccess = user.hasAccess;

            return userData;
        } catch (error) {
            return null;
        }
    }

    private async verifyPassword(password: string, hash: string) {
        return await Bun.password.verify(password, hash);
    }

    public async userCreate(username: string, password: string) {
        await this.executeQuery("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
    }
}

export default User;