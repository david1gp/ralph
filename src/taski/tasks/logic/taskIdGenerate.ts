import type { ConfigType } from "@/taski/config/ConfigType"

export function taskIdGenerate(
  config: ConfigType,
  projectPath: string,
): { id: string; prefix: string; idNumber: number } {
  const prefix = config.projectTaskPrefix?.[projectPath] ?? "T"
  const idNumber = config.projectTaskIdNumber?.[projectPath] ?? 1
  const id = `${prefix}-${String(idNumber).padStart(3, "0")}`
  return { id, prefix, idNumber }
}
