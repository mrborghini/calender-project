import type { ServerWebSocket } from "bun";
import Logger from "./components/logger";
import jsonResponse, { handleOptionRequest } from "./components/responses";
import User from "./components/user";
import Tasks from "./components/tasks";

async function main() {
    const logger = new Logger("main");
    const user = new User();
    const tasks = new Tasks();

    Bun.serve({
        async fetch(req, server) {
            const url = new URL(req.url);

            const token = req.headers.get("authorization");

            const tokenData = await user.parseToken(token);

            try {
                if (req.method === "OPTIONS") {
                    return handleOptionRequest();
                }

                switch (url.pathname) {
                    case "/api":
                        return jsonResponse({ message: "You have found THE api" });
                    case "/api/login":
                        if (req.method !== "POST") {
                            return jsonResponse({ message: "Wrong method used" }, 400)
                        }

                        const body = await req.json();

                        if (!body.usernameOrEmail || !body.password) {
                            return jsonResponse({ message: "Bad request" }, 400)
                        }

                        return await user.login(body.usernameOrEmail, body.password);
                    case "/api/tasks":
                        if (!tokenData) {
                            return jsonResponse({message: "Unauthorized"}, 403);
                        }

                        if (!tokenData.hasAccess) {
                            return jsonResponse({message: "Unauthorized"}, 403);
                        }
                        
                        return await tasks.getTasks();
                    case "/realtime":
                        if (!server.upgrade(req)) {
                            return jsonResponse({ message: "Could not upgrade connection" }, 400);
                        }
                        break;
                    default:
                        return jsonResponse({ message: "Not found" }, 404);
                }
            }
            catch (error) {
                logger.error(`Could not parse json: ${error}`);
                return jsonResponse({ message: "no json provided" }, 400)
            }
        },
        websocket: {
            // Handle messages for WebSocket connections
            message(ws: ServerWebSocket<unknown>, message: string | Buffer): void | Promise<void> {
                ws.send(`Echo: ${message as string}`);
            },
            // Handle WebSocket close events
            close(_): void | Promise<void> {
                logger.info("WebSocket connection closed");
            }
        }
    });

    logger.info("Server started on localhost:3000");
}

main();