import { Request, Response } from "express";
import { UserModel } from "../../models";
import { IErrorResponse, IResponseData } from "../types";


// Create new user
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
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        }
        res.status(500).json(result);
    }
}


// Get current user
export const getCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const currentUser = await UserModel.findOne({ _id: req.userId});

        if (!currentUser) {
            const result: IErrorResponse = {
                code: 404,
                message: "User not found",
            }
            res.status(404).json(result);
            return;
        }

        const result: IResponseData<typeof currentUser> = {
            code: 200,
            data: currentUser,
            message: "User found successfully",
        }
        res.status(200).json(result);

    } catch (error) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        }
        res.status(500).json(result);
    }
}


// Update current user
export const updateCurrentUser = async (
    req: Request,
    res: Response): Promise<void> => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await UserModel.findById(req.userId);

        if (!user) {
            const result: IErrorResponse = {
                code: 404,
                message: "User not found",
            }
            res.status(404).json(result);
            return;
        }

        user.name = name ?? user.name;
        user.addressLine1 = addressLine1 ?? user.addressLine1;
        user.country = country ?? user.country;
        user.city = city ?? user.city;

        await user.save();

        const result: IResponseData<typeof user> = {
            code: 200,
            data: user,
            message: "User updated successfully",
        }
        res.status(200).json(result);

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: "Error updating user",
        }
        res.status(500).json(result);
    }
}
