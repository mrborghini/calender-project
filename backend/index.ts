import type { ServerWebSocket } from "bun";
import Logger from "./components/logger";
import jsonResponse, { handleOptionRequest } from "./components/responses";
import User from "./components/user";
import WsHandler from "./components/wshandler";

async function main() {
    const logger = new Logger("main");
    const user = new User();
    const wsHandler = new WsHandler();

    Bun.serve({
        async fetch(req, server) {
            const url = new URL(req.url);

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
                    case "/realtime":
                        const secTokenData = req.headers.get("sec-websocket-protocol");

                        if (!secTokenData) {
                            return jsonResponse({ message: "Unauthorized" }, 403);
                        }

                        const secToken = secTokenData.split(", ")[1];

                        const userTokenData = await user.parseToken(secToken);

                        if (!userTokenData) {
                            return jsonResponse({ message: "Unauthorized" }, 403);
                        }

                        if (!userTokenData.hasAccess) {
                            return jsonResponse({ message: "Unauthorized" }, 403);
                        }

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
            async open(ws: ServerWebSocket<unknown>) {
                await wsHandler.addConnection(ws);
                logger.info("New WebSocket connection connected");
            },
            // Handle messages for WebSocket connections
            async message(ws: ServerWebSocket<unknown>, message: string | Buffer): Promise<void> {
                logger.debug(`Received message: ${message}`);
                await wsHandler.handleMessage(ws, message as string);
            },
            // Handle WebSocket close events
            close(ws: ServerWebSocket<unknown>): void | Promise<void> {
                wsHandler.removeConnection(ws);
                logger.info("WebSocket connection closed");
            }
        }
    });

    logger.info("Server started on localhost:3000");
}

main();