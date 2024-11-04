import { Request, Response } from "express";
import { IErrorResponse, IResponseData } from "../types";
import { Restaurant } from "../../models";


// Get a single restaurant
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId  = req.params.restaurantId;

        const restaurant = await Restaurant.findById(restaurantId);

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
            message: "Restaurant found",
        };
        res.status(200).json(result);

    } catch (error) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
}

// /api/restaurant/search/:city
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const { city } = req.params;
        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOptions = (req.query.sortOptions as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = { city };

        query["city"] = new RegExp(city, "i");
        const cityCheck = await Restaurant.countDocuments(query);
        if (cityCheck === 0) {
            const result: IErrorResponse = {
                code: 404,
                message: `No restaurants found in ${city}`,
            };
            res.status(404).json({
                result,
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1
                }
            });
            return;
        }

        if (selectedCuisines) {
            // Split the selected cuisines by comma and create an array of regex patterns
            const cuisinesArray = selectedCuisines
                .split(",")
                .map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray };
        }

        if (searchQuery) {
            // restaurantName = Pizza palace
            // cuisines = [ Pizza, Burritos, Pasta ]
            // searchQuery = Pizza

            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { restaurantName: searchRegex },
                { cuisines: { $in: [searchRegex] } },
            ];
        }

        const pageSize = 7;
        const skip = (page - 1) * pageSize;

        const restaurants = await Restaurant.find(query)
            .sort({ [sortOptions]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await Restaurant.countDocuments(query);

        const result = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            }
        };

        res.status(200).json(result);
    } catch (error) {
        const result: IErrorResponse = {
            code: 500,
            message: "Internal server error",
        };
        res.status(500).json(result);
    }
}

