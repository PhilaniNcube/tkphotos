import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Single export of GET/POST handlers
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
