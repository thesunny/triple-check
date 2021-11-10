import { TripleCheckOptions } from "."

export type CheckValueResult =
  | { status: "pass" }
  | { status: "fail"; message: string }

export async function tripleCheck<T>(
  value: T,
  { precheck, check, asyncCheck }: TripleCheckOptions<T>
): Promise<CheckValueResult> {
  const precheckResult = precheck ? precheck(value) : undefined
  if (typeof precheckResult === "string")
    return { status: "fail", message: precheckResult }
  const checkResult = check ? check(value) : undefined
  if (typeof checkResult === "string")
    return { status: "fail", message: checkResult }
  const asyncCheckResult = asyncCheck ? await asyncCheck(value) : undefined
  if (typeof asyncCheckResult === "string") {
    return { status: "fail", message: asyncCheckResult }
  }
  return { status: "pass" }
}
