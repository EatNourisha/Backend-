import { AvailableResource, PermissionScope } from "../../valueObjects";
import { CsTeam, csteam, Customer, customer } from "../../models";
import { RoleService } from "../../services/role.service";
import { createError } from "../../utils";
import csFollowUps from "../../models/csFollowUps";
import csReports from "../../models/csReports";

export class csTeamService {
  async addCsMember(customer_id: string, cus_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);

    let _cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!_cus) throw createError("Customer does not exist", 404);

    let team = await customer.findById(cus_id).lean<Customer>().exec();
    if (!team) throw createError("Member does not exist", 404);

    const _csTeam = await csteam.create({ added_by: _cus?._id, team_member: team?._id });
    return _csTeam;
  }

  async getAllCs(customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);

    let cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    let team = await csteam
      .find()
      .lean<CsTeam>()
      .populate([
        { path: "added_by", model: "Customer" },
        { path: "team_member", model: "Customer" },
      ])
      .exec();
    if (!team) throw createError("Members not found", 404);

    return team;
  }

  async getACs(customer_id: string, teamId: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);

    let cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    let team = await csteam
      .findById(teamId)
      .lean<CsTeam>()
      .populate([
        { path: "added_by", model: "Customer" },
        { path: "team_member", model: "Customer" },
      ])
      .exec();
    if (!team) throw createError("Members not found", 404);

    return team;
  }

  async removeCs(customer_id: string, teamId: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);

    let cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Customer does not exist", 404);

    let team = await csteam.findOne({ _id: teamId, customer: customer_id }).exec();
    if (!team) throw createError("Cs not found", 404);

    await team.deleteOne();

    return { message: "Cs removed" };
  }

  async assignCs(customer_id: string, _cus_id: string, teamId: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);

    let cus = await customer.findById(customer_id).lean<Customer>().exec();
    if (!cus) throw createError("Admin does not exist", 404);

    let custom = await customer.findById(_cus_id).exec();
    if (!custom) throw createError("Customer does not exist", 404);

    let team = await csteam.findOne({ _id: teamId, customer: customer_id }).exec();
    if (!team) throw createError("Cs not found", 404);

    ((custom.assigned_cs as string[]) ?? undefined).push(team._id);

    await custom.save();

    return { message: "CS assigned" };
  }

  async addFollowUp(customer_id: string, _cus_id: string, text: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);
  
    const admin = await customer.findById(customer_id).lean<Customer>().exec();
    if (!admin) throw createError("Admin does not exist", 404);
  
    const custom = await customer.findById(_cus_id).exec();
    if (!custom) throw createError("Customer does not exist", 404);
  
    const followUp = await csFollowUps.create({ text, by: admin._id, customer: custom._id });
  
    custom.follow_up = (custom.follow_up as string[]) ?? [];
    custom.follow_up.push(followUp._id);
  
    await custom.save();
  
    return followUp;
  }

  async addReport(customer_id: string, _cus_id: string, text: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.CREATE, PermissionScope.ALL]);
  
    const admin = await customer.findById(customer_id).lean<Customer>().exec();
    if (!admin) throw createError("Admin does not exist", 404);
  
    const custom = await customer.findById(_cus_id).exec();
    if (!custom) throw createError("Customer does not exist", 404);
  
    const report = await csReports.create({ text, by: admin._id, customer: custom._id });
  
    custom.report = (custom.report as string[]) ?? [];
    custom.report.push(report._id);
  
    await custom.save();
  
    return report;
  }

  async getCustomerFollowHistory(customer_id: string, _cus_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.READ, PermissionScope.ALL]);
  
    const admin = await customer.findById(customer_id).lean<Customer>().exec();
    if (!admin) throw createError("Admin does not exist", 404);

    const custom = await customer.findById(_cus_id).exec();
    if (!custom) throw createError("Customer does not exist", 404);

    const followUps = await csFollowUps.find({ customer: custom?._id }).sort({createdAt: -1}).populate([
        { path: "by", model: "Customer" },
      ]).exec();
  
    // Check if follow-ups exist for the given customer
    if (!followUps || followUps.length === 0) {
      return [];
    }
  
    return followUps;
  }
  
  async getCustomerReportHistory(customer_id: string, _cus_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.CSTEAM, [PermissionScope.READ, PermissionScope.ALL]);
  
    const admin = await customer.findById(customer_id).lean<Customer>().exec();
    if (!admin) throw createError("Admin does not exist", 404);

    const custom = await customer.findById(_cus_id).exec();
    if (!custom) throw createError("Customer does not exist", 404);

    const reports = await csReports.find({ customer: custom?._id }).sort({createdAt: -1}).populate([
        { path: "by", model: "Customer" },
      ]).exec();
  
    // Check if follow-ups exist for the given customer
    if (!reports || reports.length === 0) {
      return [];
    }
  
    return reports;
  }
  
}

// 2023-11-26T23:34:09.665+00:00
