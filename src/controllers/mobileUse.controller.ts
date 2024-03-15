import { NextFunction, Request, Response } from "express";
import { MobileUseService } from "../services";
import { sendError, sendResponse } from "../utils";

const service = new MobileUseService();

export class MobileUseController {
    async saveString (req: Request, res: Response, next: NextFunction) {
         try {
            const { body } = req;
           const result = await service.saveStringData(body);
            sendResponse(res, 201, result);
         } catch (error) {
            sendError(error, next);
         }
    }

    async getString (_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await service.getStringData();
            sendResponse(res, 200, result);
        } catch (error) {
            sendError(error, next);
        }
    }
}