import type { ConfigType } from "@/taski/config/ConfigType";

export function taskIdGenerate(config: ConfigType, dir: string): { id: string; prefix: string; idNumber: number } {
  const prefix = config.projectTaskPrefix?.[dir] ?? "T"
  const idNumber = config.projectTaskIdNumber?.[dir] ?? 1
  const id = `${prefix}-${String(idNumber).padStart(3, "0")}`
  return { id, prefix, idNumber }
}
