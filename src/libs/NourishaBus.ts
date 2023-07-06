import _Emittery from "emittery";
import { Customer, MealLineup, Subscription } from "../models";

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
  "customer:disabled": { owner: Customer; modifier: Customer | string };
  "customer:password:reset": { owner: Customer };

  "customer:device_token:updated": { owner: Customer | string, token: string };


  "subscription:updated": { owner: Customer | string, subscription: Subscription };
  "subscription:cancelled": { owner: Customer | string, subscription: Subscription };

  "lineup:created": { owner: Customer | string, lineup: MealLineup };
  "lineup:updated": { owner: Customer | string, lineup: MealLineup };


};

export class _NourishaBus extends _Emittery<NourishaEventTypes> {
  constructor() {
    super();
  }
}

const NourishaBus = new _NourishaBus();
export default NourishaBus;
