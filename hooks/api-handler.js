import axios from "axios";

export default async function api_handler(method, path, request = {}) {
  let response;
  const paramsPath = Array.isArray(request?.params)
    ? request.params.join("/")
    : request?.params
      ? request.params
      : "";
  const queryPath = request?.query
    ? Object?.keys(request.query)
      ?.filter((key) => request.query[key] != null)
      .map((key) => `${key}=${request.query[key]}`)
      .join("&")
    : "";

  const fullPath = path.concat(
    paramsPath,
    queryPath ? "?".concat(queryPath) : "",
  );

  try {
    switch (method) {
      case "get":
        response = await axios.get(fullPath);
        return response;
      case "post":
        response = await axios.post(fullPath, request.body);
        return response;
      case "put":
        response = await axios.put(fullPath, request.body);
        return response;
      case "delete":
        response = await axios.delete(fullPath);
        return response;
      default:
        console.error(`Unknown HTTP request method '${method}'`);
    }
  } catch (err) {
    throw err;
  }
};