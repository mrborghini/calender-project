function returnJson(message: string, statusCode = 200) {
    return new Response(message, {
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow all origins
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
            "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
        },
        status: statusCode
    })
}

export default returnJson;