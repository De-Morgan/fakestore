import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Tests import this to override a handler for one test: `server.use(http.get(...))`.
export const server = setupServer(...handlers);
