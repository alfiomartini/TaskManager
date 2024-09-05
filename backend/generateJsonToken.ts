import { v4 as uuidv4 } from "uuid";

const jwsSecret = uuidv4();

console.log("jwsSecret:", jwsSecret);
