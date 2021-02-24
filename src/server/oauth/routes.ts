import { Router } from "express";
import { apiTokenUrl, authorizationUrl, redirectUrl } from "./config";
import fetch from "node-fetch";
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

    const authBody: URLSearchParams = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUrl,
    });

    await fetch(apiTokenUrl, {
        method: "POST",
        headers: {
            Authorization: `Basic ${authorization}`,
            "content-type": "application/x-www-form-urlencoded",
        },
        body: authBody,
    })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to retrieve auth token.");
            return response.json();
        })
        .then((response) => {
            if (!response.access_token) throw new Error("Authorization was successful but no token was given.");
            req.session.access_token = response.access_token;
            req.session.refresh_token = response.refresh_token;
            req.session.expires_in = response.expires_in;
            res.redirect("/");
        })
        .catch((error) => {
            res.status(500).send(error.toString());
        });
});

oAuthRouter.get("/get/albums", async (req, res) => {
    if (req.session.access_token) {
        await fetch("https://api.spotify.com/v1/me/albums", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${req.session.access_token}`,
                "content-type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("GET request to Spotify API failed.");
                return response.json();
            })
            .then((response) => {
                res.status(200).send(response);
            })
            .catch((error) => {
                res.status(500).send(error.toString());
            });
    } else {
        res.status(200).send("Not authenticated.");
    }
});

export default oAuthRouter;
