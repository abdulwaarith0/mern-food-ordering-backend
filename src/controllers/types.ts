export interface IResponseData<T> {
	message?: string | null;
	code: number;
	data?: T;
}

export interface IErrorResponse {
    code: number;
    message: string;
}

export interface IRestaurant {
    restaurantName: string;
    cuisines: string[];
    city: string;
}

export interface ISearchRestaurantResponse {
    restaurants: IResponseData<IRestaurant[]>;
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}
