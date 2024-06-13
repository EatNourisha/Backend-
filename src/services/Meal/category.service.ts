// import Stripe from "stripe";
import {
    CreateCategoryDto,
    IPaginationFilter,
    PaginatedDocument,
  } from "../../interfaces";
  import {
      category,
      Category
  } from "../../models";
  import { RoleService } from "../../services/role.service";
  import { createError, paginate, validateFields } from "../../utils";
  import { AvailableResource, PermissionScope } from "../../valueObjects";
  // import config from "../../config";
  
  export class categoryService {
    // private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    async createCategory(dto: CreateCategoryDto, roles: string[]): Promise<Category> {
      validateFields(dto, ["name"]);
  
      await RoleService.hasPermission(roles, AvailableResource.CATEGORY, [PermissionScope.CREATE, PermissionScope.ALL]);  
      const _category = await category.create({ ...dto});
      return _category;
    }
  
    async updateCategory(id: string, dto: Partial<CreateCategoryDto>, roles: string[]): Promise<Category> {
  
      await RoleService.hasPermission(roles, AvailableResource.CATEGORY, [PermissionScope.UPDATE, PermissionScope.ALL]);
  
      let _category = await category.findById(id).lean<Category>().exec();
      if (!_category) throw createError("Category does not exist", 404);
    
      _category = await category
        .findByIdAndUpdate( id, { ...dto,})
        .lean<Category>()
        .exec();
  
      return _category;
    }
  
    async deleteCategory(id: string, roles: string[]): Promise<Category> {
      await RoleService.hasPermission(roles, AvailableResource.CATEGORY, [PermissionScope.DELETE, PermissionScope.ALL]);
  
      const _category = await category.findByIdAndDelete(id).lean<Category>().exec();
      if (!_category) throw createError("Category does not exist", 400);
      return _category;
    }
  
    async getCategory(_: string[], filters?: IPaginationFilter & { name: string}): Promise<PaginatedDocument<Category[]>> {
      // await RoleService.hasPermission(roles, AvailableResource.CATEGORY, [PermissionScope.READ, PermissionScope.ALL]);
    
      let queries: any = {};
        
      if (filters?.name) {
        Object.assign(queries, { name: filters.name });
      }
    
    
      return await paginate('category', queries, filters);
    }
    
  }
  