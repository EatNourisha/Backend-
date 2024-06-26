import _Emittery from "emittery";
import { Customer, MealLineup, Order, Subscription } from "../models";
import {
  CreateLineupDto,
  SendResetPasswordEmailMobileDto,
  SendResetPasswordEmailWebDto,
  SendVerificationEmailDto,
  SendWelcomeEmailDto,
  SendPromoEmailDto,
  GiftCardEmailDto,
} from "../interfaces";

_Emittery.isDebugEnabled = false;

export type NourishaEventTypes = {
  // ACCOUNT EVENT TYPES
  "customer:tested": { sub: string; roles: string[] };
  "customer:created": { owner: Customer };
  "customer:logged_in": { owner: Customer };
  "customer:verified": { owner: Customer };
  "customer:password:changed": { owner: Customer };
  "customer:deleted": { owner: Customer; modifier: Customer | string };
  "customer:enabled": { owner: Customer; modifier: Customer | string };
  "customer:referred": { invitee: string; inviter_refCode: string };
  "customer:disabled": { owner: Customer; modifier: Customer | string };
  "customer:password:reset": { owner: Customer };

  "customer:device_token:updated": { owner: Customer | string; token: string };

  "customer:send_verification_email": SendVerificationEmailDto;
  "customer:send_welcome_email": SendWelcomeEmailDto;
  "customer:send_promo_email": SendPromoEmailDto;
  "customer:send_resetpassword_email_web": SendResetPasswordEmailWebDto;
  "customer:send_resetpassword_email_mobile": SendResetPasswordEmailMobileDto;
  "customer:send_giftcard_email": GiftCardEmailDto;

  "subscription:updated": { owner: Customer | string; subscription: Subscription };
  "subscription:cancelled": { owner: Customer | string; subscription: Subscription };

  "lineup:created": { owner: Customer | string; lineup: MealLineup; dto: CreateLineupDto };
  "lineup:updated": { owner: Customer | string; lineup: MealLineup; dto: CreateLineupDto };

  "referral:created": { owner: Customer | string };

  "order:placed": { owner: Customer | string; order: Order }; // send went an order has been paid for;
};

export class _NourishaBus extends _Emittery<NourishaEventTypes> {
  constructor() {
    super();
  }
}

const NourishaBus = new _NourishaBus();
export default NourishaBus;
