import Stripe from "stripe";
import { CreatePromoCodeDto, IPaginationFilter, PaginatedDocument } from "../../interfaces";
import {
  AdminSettings,
  Coupon,
  Customer,
  Earnings,
  //   Earnings,
  Plan,
  PromoCode,
  Referral,
  adminSettings,
  coupon,
  customer,
  earnings,
  //   earnings,
  plan,
  promoCode,
  referral,
} from "../../models";
import { RoleService } from "../role.service";
import { createError, getUpdateOptions, paginate, validateFields } from "../../utils";
import { AvailableResource, AvailableRole, PermissionScope } from "../../valueObjects";
import config from "../../config";
import { toLower, omit } from "lodash";
import { when } from "../../utils/when";
import { InfluencerRewardType } from "../../models/adminSettings";

export class DiscountService {
  private stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

  async getPromos(roles: string[], filters: IPaginationFilter): Promise<PaginatedDocument<PromoCode[]>> {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.DISCOUNT, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);
    return await paginate("promoCode", {}, filters, { populate: ["coupon"] });
  }

  async getPromoById(promo_id: string, roles: string[], filters: IPaginationFilter) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.DISCOUNT, [
      PermissionScope.READ,
      PermissionScope.ALL,
    ]);

    const [promo, earnings] = await Promise.all([
      promoCode.findById(promo_id).populate("coupon").lean<PromoCode>().exec(),
      paginate<Earnings[]>("earnings", { promo: promo_id }, filters),
    ]);

    return { promo, earnings };
  }

  async createPromoCode(admin_id: string, dto: CreatePromoCodeDto, roles: string[]) {
    validateFields(dto, ["code", "coupon", "influencer"]);

    if (!!dto?.influencer && !dto?.influencer?.customer)
      validateFields(dto.influencer, ["first_name", "last_name", "email", "phone_number"]);
    if (!!dto?.restrictions) validateFields(dto.restrictions, ["first_time_transaction"]);

    const coupon_data = dto?.coupon as Coupon;
    if (!!coupon_data) validateFields(dto.coupon as Coupon, ["duration"]);

    console.log("Promo Code DTO", dto);

    const currency = coupon_data?.currency ?? "gbp";
    const amount_or_percent = coupon_data?.percent_off ?? coupon_data.amount_off;
    if (!amount_or_percent) throw createError("coupon.percent_off or coupon.amount_off is required", 400);

    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.DISCOUNT, [
      PermissionScope.CREATE,
      PermissionScope.ALL,
    ]);

    const expires_at = when(!!dto?.expires_at, new Date(dto?.expires_at), undefined) as any;
    const amount_off = when(!!coupon_data?.amount_off, coupon_data?.amount_off * 100, null);
    const stripe_coup = await this.stripe.coupons.create({ ...dto?.coupon, amount_off, currency });

    const coup = await coupon
      .findOneAndUpdate(
        { stripe_id: stripe_coup.id },
        {
          ...stripe_coup,
          stripe_id: stripe_coup.id,
          amount_off: when(!!amount_off, coupon_data?.amount_off, undefined),
          required_for: "promo",
        },
        getUpdateOptions()
      )
      .lean<Coupon>()
      .exec();

    const minimum_amount_currency = when(!!dto?.restrictions?.minimum_amount, currency, undefined);
    const stripe_promo = await this.stripe.promotionCodes.create({
      ...omit(dto as any, ["influencer"]),
      coupon: stripe_coup?.id,
      expires_at: expires_at?.getTime() / 1000,
      restrictions: { ...dto?.restrictions, minimum_amount_currency },
    });

    if (!!coup && !!stripe_promo) {
      console.log("Stripe Coupon", { stripe_coup, coup, stripe_promo });
      return await promoCode
        .findOneAndUpdate(
          { stripe_id: stripe_promo.id },
          {
            ...stripe_promo,
            influencer: dto?.influencer,
            code: toLower(dto.code),
            coupon: coup._id,
            stripe_id: stripe_promo.id,
            created_by: admin_id,
            expires_at,
          },
          getUpdateOptions()
        )
        .lean<PromoCode>()
        .exec();
    }

    return null;
  }

  static async attachPromoToCustomer(customer_id: string, code: string) {
    const promo = await promoCode
      .findOne({ code: toLower(code) })
      .lean<PromoCode>()
      .exec();

    if (!promo) return null;

    const cus = await customer
      .findByIdAndUpdate(customer_id, {
        pending_promo: promo?._id,
      })
      .lean<Customer>()
      .exec();

    if (!cus) return null;

    // connect the promo with referral
    const ref = await referral
      .findOneAndUpdate(
        { ref_code: code, invitee: customer_id },
        {
          inviter: promo?.influencer?.customer,
          invitee: customer_id,
          ref_code: code,
          reward: 0,
          currency: "gbp",
          is_promotion: true,
          promo: promo?._id,
        },
        getUpdateOptions()
      )
      .lean<Referral>()
      .exec();

    console.log("[attachPromoToCustomer]", { ref, promo, cus });

    return ref;
  }

  static async updateInfluencersReward(customer_id: string, plan_id: string, promo: PromoCode) {
    const pln = await plan.findById(plan_id).lean<Plan>().exec();
    if (!pln) return;

    const settings = await adminSettings.findOne({ name: "settings" }).lean<AdminSettings>().exec();

    const value = pln?.amount ?? 0;
    const ins = settings?.influencer_reward;
    const percentage_amount = value * ((ins?.amount ?? 1) / 100);

    const reward = when(ins?.type === InfluencerRewardType.FIXED, ins?.amount ?? 2, percentage_amount);

    const refs: string[] = [];
    const ref = await referral
      .findOneAndUpdate({ invitee: customer_id, promo: promo?._id, is_promotion: true }, { $inc: { reward }, is_subscribed: true })
      .lean<Referral>()
      .exec();

    if (!!ref) refs.push(ref?._id!);
    return await earnings
      .findOneAndUpdate({ promo: promo?._id }, { $inc: { balance: reward }, $push: { refs }, promo: promo?._id }, getUpdateOptions())
      .lean<Earnings>()
      .exec();
  }
}
