import { Request, Response } from "express";
import { IErrorResponse, IResponseData } from "../types";
import { Restaurant } from "../../models";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";


// Create a new restaurant
export const createMyRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        // Check if user already has a restaurant
        const existingRestaurant = await Restaurant.findOne({
            user: req.userId,
        });

        if (existingRestaurant) {
            const result: IResponseData<typeof existingRestaurant> = {
                code: 409,
                data: existingRestaurant,
                message: "User restaurant already exists",
            };
            res.status(409).json(result);
            return;
        }

        const imageUrl = await upLoadImage(req.file as Express.Multer.File);

        // Create new restaurant
        const restaurant = new Restaurant({
            ...req.body,
            imageUrl,
            user: new mongoose.Types.ObjectId(req.userId),
            lastUpdated: new Date(),
        });
        await restaurant.save();

        const result: IResponseData<typeof restaurant> = {
            code: 201,
            data: restaurant,
            message: "Restaurant created successfully",
        };
        res.status(201).json(result);


    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
}


// Get current user's restaurant
export const getMyRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId,
        });

        if (!restaurant) {
            const result: IErrorResponse = {
                code: 404,
                message: "Restaurant not found",
            };
            res.status(404).json(result);
            return;
        }

        const result: IResponseData<typeof restaurant> = {
            code: 200,
            data: restaurant,
            message: "Restaurant found successfully",
        };
        res.status(200).json(result);

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
}


// Update current user's restaurant
export const updateMyRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId,
        });

        if (!restaurant) {
            const result: IErrorResponse = {
                code: 404,
                message: "Restaurant not found",
            };
            res.status(404).json(result);
            return;
        }

        restaurant.set({
            ...req.body,
            lastUpdated: new Date(),
        });

        if (req.file) {
            const imageUrl = await
                upLoadImage(req.file as Express.Multer.File);
            restaurant.set({ imageUrl });
            console.log("Image updated:", imageUrl);
        }

        await restaurant.save();

        const result: IResponseData<typeof restaurant> = {
            code: 200,
            data: restaurant,
            message: "Restaurant updated successfully",
        };
        res.status(200).json(result);

    } catch (error: any) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
}

const upLoadImage = async (file: Express.Multer.File) => {
    try {
        // Get image from request
        const image = file;
        // Convert image to base64
        const base64Image = Buffer.from(image.buffer).toString("base64");
        // Create data URI for image type 
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        // Upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.secure_url;
    } catch (error: any) {
        throw new Error(error.message);
    }
}