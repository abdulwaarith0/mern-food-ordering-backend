import { Request, Response } from "express";
import { IErrorResponse, IResponseData } from "../types";
import { Restaurant } from "../../models";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";


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

        // Get image from request
        const image = req.file as Express.Multer.File;
        // Convert image to base64
        const base64Image = Buffer.from(image.buffer).toString("base64");
        // Create data URI for image type 
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        // Upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI);

        // Create new restaurant
        const restaurant = new Restaurant({
            ...req.body,
            imageUrl: uploadResponse.secure_url,
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