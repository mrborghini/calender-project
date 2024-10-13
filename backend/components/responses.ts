function jsonResponse<T>(dictionary: Dict<T>, statusCode = 200, headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
}) {
    return new Response(JSON.stringify(dictionary), {
        headers: headers,
        status: statusCode,
    })
}

export function handleOptionRequest(// Set CORS headers
    headers = {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
        "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
    }): Response {

    return new Response(null, {
        status: 204,
        headers,
    });
}

export default jsonResponse;