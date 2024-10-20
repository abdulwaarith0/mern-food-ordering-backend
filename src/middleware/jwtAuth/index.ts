import { auth } from "express-oauth2-jwt-bearer";
import { AUTH0_AUDIENCE, AUTH0_ISSUER_BASE_URL } from "../../constants";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models";


declare global {
    namespace Express {
        interface Request {
            auth0Id: string;
            userId: string;
        }
    }
}


export const jwtCheck = auth({
    audience: AUTH0_AUDIENCE,
    issuerBaseURL: AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256"
});


export const jwtParse = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.sendStatus(401);
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        const auth0Id = decoded.sub;

        const user = await UserModel.findOne({ auth0Id });

        if (!user) {
            res.sendStatus(401);
            return;
        }

        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();
        next();

    } catch (error) {
        res.sendStatus(401);
        return;
    }
};
