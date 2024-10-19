import { Request, Response } from "express";
import { getErrorResponse } from "../../constants";
import { UserModel } from "../../models";
import { IResponseData } from "../types";


export const createCurrentUser = async (
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const { auth0Id } = req.body;
        const existingUser = await UserModel.findOne({ auth0Id });

        if (existingUser) {
            const result: IResponseData<typeof existingUser> = {
                code: 200,
                data: existingUser,
                message: "User already exists",
            };
            res.status(200).json(result);
            return;
        }

        const newUser = new UserModel(req.body);
        await newUser.save();

        const result: IResponseData<typeof newUser> = {
            code: 201,
            data: newUser,
            message: "User created successfully",
        };
        res.status(201).json(result);

    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
}