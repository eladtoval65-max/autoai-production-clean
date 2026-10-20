/**
 * State for the licence-plate lookup: input, request status and the registry record.
 */
import { useState, type FormEvent } from "react";
import { lookupPlate, normalizePlate, type PlateRecord } from "../model/plate";
import { track } from "../model/tracking";

export type PlateStatus = "idle" | "loading" | "error" | "invalid";

export function usePlateLookup() {
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState<PlateStatus>("idle");
  const [record, setRecord] = useState<PlateRecord | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const n = normalizePlate(plate);
    if (!n) { setStatus("invalid"); setRecord(null); return; }
    setStatus("loading"); setRecord(null);
    track("plate_check");
    try { setRecord(await lookupPlate(n)); setStatus("idle"); }
    catch { setStatus("error"); }
  }

  return { plate, setPlate, status, record, submit };
}
