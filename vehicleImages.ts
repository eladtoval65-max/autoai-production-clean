/**
 * Vehicle photos.
 * Primary: the lead (infobox) image of the model's English Wikipedia article, fetched via the
 * public MediaWiki API (CORS origin=*). Lead images are curated by editors to show the car's
 * exterior, so they reliably depict the actual vehicle. pilicense=free keeps them freely licensed.
 * Fallback: a pinned Wikimedia Commons file. Attribution: each photo links to its file page,
 * which names the author and licence (CC BY / BY-SA 4.0 §3(a)(2) allows attribution by URI).
 */
export type VehiclePhoto = { src: string; credit: string; file: string };

const COMMONS = "https://commons.wikimedia.org/wiki/";

function commonsPhoto(file: string, width = 1280): VehiclePhoto {
  const name = file.replace(/ /g, "_");
  return {
    file: name,
    src: `${COMMONS}Special:FilePath/${encodeURIComponent(name)}?width=${width}`,
    credit: `${COMMONS}File:${encodeURIComponent(name)}`,
  };
}

/** Keys are lowercase "model" fragments; the longest matching key wins. [wikipedia article, pinned commons file] */
const MODELS: Record<string, [string, string]> = {
  "corolla cross": ["Toyota Corolla Cross", "Toyota_COROLLA_CROSS_HYBRID_Z_2WD_(6AA-ZVG11-KHXEB)_front.jpg"],
  "corolla": ["Toyota Corolla (E210)", "Toyota_Corolla_Hybrid_(E210)_IMG_4338.jpg"],
  "rav4": ["Toyota RAV4 (XA50)", "Toyota_RAV4_Hybrid_facelift_front.jpg"],
  "yaris cross": ["Toyota Yaris Cross", "Toyota_Yaris_Cross_Hybrid_IMG_5621.jpg"],
  "tucson": ["Hyundai Tucson (NX4)", "Hyundai_Tucson_(NX4)_IMG_3678.jpg"],
  "ioniq 5": ["Hyundai Ioniq 5", "2021_Hyundai_Ioniq_5_(France)_front_view.jpg"],
  "ioniq 6": ["Hyundai Ioniq 6", "Hyundai_Ioniq_6_1X7A7258.jpg"],
  "kona": ["Hyundai Kona", "Hyundai_Kona_SX2_1.6_Premium_Hybrid_Atlas_White.jpg"],
  "mazda3": ["Mazda3", "MAZDA3_FASTBACK_15S_Touring_(6BA-BP5P)_front.jpg"],
  "mazda 3": ["Mazda3", "MAZDA3_FASTBACK_15S_Touring_(6BA-BP5P)_front.jpg"],
  "niro": ["Kia Niro", "Kia_Niro_Hybrid_SG2_Steel_Gray_(1).jpg"],
  "sportage": ["Kia Sportage", "Kia_Sportage_Hybrid_NQ5_PE_1.6_HEV_(1).jpg"],
  "picanto": ["Kia Picanto", "2021_KIA_Picanto_1_DPi_-_998cc_1.0_(66PS)_Petrol_-_Blue_Breeze_-_03-2024,_Front.jpg"],
  "qashqai": ["Nissan Qashqai", "Nissan_Qashqai_(J12)_IMG_4897.jpg"],
  "mg4": ["MG4 EV", "MG4_EV_2024_(3).jpg"],
  "octavia": ["Škoda Octavia", "Skoda_Octavia_IV_1.4_TSI_RF.jpg"],
  "puma": ["Ford Puma (crossover)", "2020_Ford_Puma_Titanium_EcoBoost_Hybrid_1.0_Front.jpg"],
  "golf": ["Volkswagen Golf Mk8", "Volkswagen_Golf_VIII_IMG_9737.jpg"],
  "308": ["Peugeot 308", "2022_-_Peugeot_308_III_(C)_-_048.jpg"],
  "atto 3": ["BYD Atto 3", "BYD_Atto_3_front-left.jpg"],
  "j7": ["Jaecoo J7", "Jaecoo_J7_1.6T_4WD_–_f_21032025.jpg"],
  "jaecoo": ["Jaecoo J7", "Jaecoo_J7_1.6T_4WD_–_f_21032025.jpg"],
  "tiggo 8": ["Chery Tiggo 8", "Chery_Tiggo_8_Pro_PHEV_002.jpg"],
};

const KEYS = Object.keys(MODELS).sort((a, b) => b.length - a.length);
const match = (name: string) => { const n = name.toLowerCase(); return KEYS.find((k) => n.includes(k)); };

/** Pinned Commons fallback (synchronous). */
export function photoFor(name: string, width?: number): VehiclePhoto | null {
  const key = match(name);
  return key ? commonsPhoto(MODELS[key][1], width) : null;
}

const cache = new Map<string, Promise<VehiclePhoto | null>>();

/** Wikipedia lead image for the model (async, cached per article+width). Resolves null when unavailable. */
export function wikiPhotoFor(name: string, width = 1280): Promise<VehiclePhoto | null> {
  const key = match(name);
  if (!key || typeof fetch === "undefined") return Promise.resolve(null);
  const title = MODELS[key][0];
  const id = `${title}|${width}`;
  if (!cache.has(id)) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail%7Cname&pilicense=free&pithumbsize=${width}&titles=${encodeURIComponent(title)}`;
    cache.set(id, fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: any) => {
        const page = d?.query?.pages?.[0];
        const src = page?.thumbnail?.source, file = page?.pageimage;
        if (!src || !file || /\.svg/i.test(file)) return null;
        return { src, file, credit: `https://en.wikipedia.org/wiki/File:${encodeURIComponent(file)}` };
      })
      .catch(() => null));
  }
  return cache.get(id)!;
}
