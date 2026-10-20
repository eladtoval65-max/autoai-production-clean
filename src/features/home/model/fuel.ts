/**
 * Powertrain label conversions. The UI stores the Hebrew label on each car (car.fuel).
 */

/** Questionnaire value → Hebrew label. */
export const FUEL_ANSWER_HE: Record<string, string> = { hybrid: "היברידי", petrol: "בנזין", electric: "חשמלי" };

/** Catalog/DB English label → Hebrew label. */
export const FUEL_TO_HE: Record<string, string> = { Hybrid: "היברידי", Petrol: "בנזין", Electric: "חשמלי", Diesel: "דיזל" };

/** Hebrew label → English (for the English UI). */
export const FUEL_EN: Record<string, string> = { "היברידי": "Hybrid", "בנזין": "Petrol", "חשמלי": "Electric", "דיזל": "Diesel" };

/** Hebrew labels offered in the results filter. */
export const FUEL_FILTER_OPTIONS = ["היברידי", "בנזין", "חשמלי"];
