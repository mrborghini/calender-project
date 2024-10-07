import returnJson from "./components/return-json";
import User from "./components/user";

async function main() {
    const user = new User();

    Bun.serve({
        async fetch(req) {
            const url = new URL(req.url);

            // Set CORS headers
            const headers = {
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
                "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
            };

            switch (url.pathname) {
                case "/login":
                    if (req.method === "OPTIONS") {
                        // Respond to preflight requests
                        return new Response(null, {
                            status: 204,
                            headers,
                        });
                    }

                    if (req.method === "POST") {
                        const requestBody = await req.json();
                        const logindata = await user.login(requestBody.username, requestBody.password);
                        if (logindata) {
                            return returnJson(JSON.stringify({ "message": logindata as string }), 200);
                        }
                    }
                    return returnJson(JSON.stringify({ "message": "Something went wrong" }), 403);
                default:
                    return returnJson(JSON.stringify({ "message": "Not found" }), 404);
            }
        },
    });

    console.log("Listening on localhost:3000");
}

main();
