import { ReturnModelType, DocumentType } from "@typegoose/typegoose";
import { createError } from "../utils";
import { customer, meal, mealPack, card, transaction, notification, allergy } from "../models";

import capitalize from "lodash/capitalize";
import consola from "consola";

// TODO: Add accessible schema union types.
export type SchemaTypes = "customer" | "meal" | "mealPack" | "card" | "transaction" | "notification" | "allergy";

export class AccessService {
  static async documentBelongsToAccount(customer_id: string, docId: string, schema: SchemaTypes, key?: string): Promise<boolean> {
    const doc = await this.getModel(schema).findById(docId).select("account").lean().exec();
    if (!doc) throw createError(`${capitalize(schema)} not found`, 404);
    if (Boolean(String(key ? doc[key] : doc.account) !== customer_id)) {
      consola.error(`Access denied - ${schema}_${docId} does not belong to the account_${customer_id}`);
      throw createError("Access denied", 401);
    }
    return Boolean(String(doc.account) === customer_id);
  }

  static getModel(schema: SchemaTypes): ReturnModelType<DocumentType<any>, any> {
    // TODO: Add model coresponding to the accessible schema union types.
    const map: { [key in SchemaTypes]: DocumentType<any> } = { customer, meal, mealPack, card, transaction, notification, allergy };

    return map[schema];
  }
}
