import _Emittery from "emittery";
import { Customer } from "../models";

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
};

export class _NourishaBus extends _Emittery<NourishaEventTypes> {
  constructor() {
    super();
  }
}

const NourishaBus = new _NourishaBus();
export default NourishaBus;
