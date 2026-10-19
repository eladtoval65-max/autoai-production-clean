/**
 * Vehicle photos from Wikimedia Commons, hotlinked through Special:FilePath.
 * Attribution: each photo links to its Commons file page, which names the
 * author and licence (CC BY / BY-SA 4.0 §3(a)(2) allows attribution by URI).
 */
export type VehiclePhoto = { src: string; credit: string; file: string };

const COMMONS = "https://commons.wikimedia.org/wiki/";

function photo(file: string, width = 1280): VehiclePhoto {
  const name = file.replace(/ /g, "_");
  return {
    file: name,
    src: `${COMMONS}Special:FilePath/${encodeURIComponent(name)}?width=${width}`,
    credit: `${COMMONS}File:${encodeURIComponent(name)}`,
  };
}

/** Keys are lowercase "make model" fragments; the longest matching key wins. */
const PHOTOS: Record<string, string> = {
  "corolla cross": "Toyota_COROLLA_CROSS_HYBRID_Z_2WD_(6AA-ZVG11-KHXEB)_front.jpg",
  "corolla hybrid": "Toyota_Corolla_Hybrid_(E210)_IMG_4338.jpg",
  "corolla": "2024_Toyota_Corolla_LE_in_Classic_Silver_Metallic,_front_right.jpg",
  "rav4": "Toyota_RAV4_Hybrid_facelift_front.jpg",
  "yaris cross": "Toyota_Yaris_Cross_Hybrid_IMG_5621.jpg",
  "tucson": "Hyundai_Tucson_(NX4)_IMG_3678.jpg",
  "ioniq 5": "2021_Hyundai_Ioniq_5_(France)_front_view.jpg",
  "ioniq 6": "Hyundai_Ioniq_6_1X7A7258.jpg",
  "kona": "Hyundai_Kona_SX2_1.6_Premium_Hybrid_Atlas_White.jpg",
  "mazda3": "MAZDA3_FASTBACK_15S_Touring_(6BA-BP5P)_front.jpg",
  "mazda 3": "MAZDA3_FASTBACK_15S_Touring_(6BA-BP5P)_front.jpg",
  "niro": "Kia_Niro_Hybrid_SG2_Steel_Gray_(1).jpg",
  "sportage": "Kia_Sportage_Hybrid_NQ5_PE_1.6_HEV_(1).jpg",
  "picanto": "2021_KIA_Picanto_1_DPi_-_998cc_1.0_(66PS)_Petrol_-_Blue_Breeze_-_03-2024,_Front.jpg",
  "qashqai": "Nissan_Qashqai_(J12)_IMG_4897.jpg",
  "mg4": "MG4_EV_2024_(3).jpg",
  "octavia": "Skoda_Octavia_IV_1.4_TSI_RF.jpg",
  "puma": "2020_Ford_Puma_Titanium_EcoBoost_Hybrid_1.0_Front.jpg",
  "golf": "Volkswagen_Golf_VIII_IMG_9737.jpg",
  "308": "2022_-_Peugeot_308_III_(C)_-_048.jpg",
  "atto 3": "BYD_Atto_3_front-left.jpg",
  "j7": "Jaecoo_J7_1.6T_4WD_–_f_21032025.jpg",
  "jaecoo": "Jaecoo_J7_1.6T_4WD_–_f_21032025.jpg",
  "tiggo 8": "Chery_Tiggo_8_Pro_PHEV_002.jpg",
};

const KEYS = Object.keys(PHOTOS).sort((a, b) => b.length - a.length);

export function photoFor(name: string, width?: number): VehiclePhoto | null {
  const n = name.toLowerCase();
  const key = KEYS.find((k) => n.includes(k));
  return key ? photo(PHOTOS[key], width) : null;
}
