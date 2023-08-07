
import { RoleService } from "../role.service";
import { CreateReviewDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import { Review, review } from "../../models";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import { createError, paginate, validateFields } from "../../utils";


export class ReviewService {


    async addReview(customer_id: string, dto: CreateReviewDto, roles: string[]) {
        validateFields(dto, ['rating', 'content']);
        if(!!dto?.rating  && dto?.rating < 1 || !!dto.rating && dto?.rating > 10) throw createError("Rating should be within the range of 1 and 10", 403);

        await RoleService.hasPermission(roles, AvailableResource.REVIEW, [PermissionScope.CREATE, PermissionScope.ALL]);
        const rev = await review.create({...dto, customer: customer_id});
        return rev;
    }

    async updateReview(review_id: string, customer_id: string, dto: Partial<CreateReviewDto>, roles: string[]) {
        if(!!dto?.rating  && dto?.rating < 1 || !!dto.rating && dto?.rating > 10) throw createError("Rating should be within the range of 1 and 10", 403);

        await RoleService.hasPermission(roles, AvailableResource.REVIEW, [PermissionScope.UPDATE, PermissionScope.ALL]);
        const rev = await review.findOneAndUpdate({_id: review_id, customer: customer_id}, {...dto}, {new: true}).lean<Review>().exec();
        if(!rev) throw createError("Review not found", 404);
        return rev;
    }



    async getCustomerReviews(customer_id: string, roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<Review[]>> {
        await RoleService.hasPermission(roles, AvailableResource.REVIEW, [PermissionScope.READ, PermissionScope.ALL]);
        return paginate('review', {customer: customer_id}, filters);
    }


    // ADMIN
    async getAllReviews(roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<Review[]>> {
        await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.REVIEW, [PermissionScope.READ, PermissionScope.ALL]);
        return paginate('review', {}, filters, {populate: ['customer']});
    }

    async getReviewsByCustomerId(customer_id: string, roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<Review[]>> {
        await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.REVIEW, [PermissionScope.READ, PermissionScope.ALL]);
        return paginate('review', {customer: customer_id}, filters);
    }
}
