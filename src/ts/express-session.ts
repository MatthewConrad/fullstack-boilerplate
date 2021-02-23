// overload express-session module so that TS will let us set properties on session
import "express-session";
declare module "express-session" {
    export interface SessionData {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }
}
