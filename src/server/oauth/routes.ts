import { Router } from "express";
import { apiTokenUrl, authorizationUrl, redirectUrl } from "./config";
import "../../ts/express-session";

const oAuthRouter: Router = Router();

oAuthRouter.get("/login", (_req, res) => {
    const scopes: string = "user-library-read";
    res.redirect(
        `${authorizationUrl}?response_type=code&client_id=${process.env.OAUTH_CLIENT_ID}` +
            `&scope=${encodeURIComponent(scopes)}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}`
    );
});

oAuthRouter.get("/callback", async (req, res) => {
    const code: string = req.query.code as string;
    const authorization: string = Buffer.from(
        `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
    ).toString("base64");

    await fetch(apiTokenUrl, {
        method: "POST",
        headers: {
            Authorization: `Basic ${authorization}`,
        },
        body: JSON.stringify({
            code: code,
            redirect_uri: redirectUrl,
            grant_type: "authorization_code",
        }),
    }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
            req.session.access_token = response.access_token;
            req.session.refresh_token = response.refresh_token;
            req.session.expires_in = response.expires_in;

            res.redirect("/");
        })
        .catch((error: Error) => {
            res.status(500).send(error);
        });
});

export default oAuthRouter;
