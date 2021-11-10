import debounce from "lodash/debounce"
import isEqual from "lodash/isEqual"
import { useCallback, useRef, useState } from "react"
export * from "./triple-check"

export type UseTripleCheckResult =
  /**
   * `ready` state indicates that we haven't yet passed the `precheck` which
   * usually lets us know that the user hasn't interacted enough yet to start
   * showing error messages. For example, the user hasn't entered the minimum
   * number of characters. We don't want to show an error message before the
   * user gets a chance to start typing.
   *
   * Similarly, consider a set of checkboxes where we need to check at least
   * one. We don't want to show an error message until the user has checked
   * at least one.
   *
   * Usually, the UI will show no message.
   */
  | { status: "ready"; message: string }
  /**
   * Indicates we have passed all checks and prechecks but we are waiting for
   * an `asyncCheck` to completed.
   *
   * The UI will usually show nothing but optionally we can show a loading icon
   */
  | { status: "waiting" }
  /**
   * Indicates all checks have passed including the async ones
   */
  | { status: "pass" }
  /**
   * Indicates that there is one or more of...
   *
   * - A failure in either `check`
   * - A failure in `asyncCheck` or
   * - A failure in `precheck` after the `precheck` has passed at least once
   */
  | { status: "fail"; message: string }

/**
 * Convenience function to improve readability. If the result is a `string`
 * we know that the result is a failure. Putting the check in directly is hard
 * to understand though so this function helps us read the code.
 */
function pass(result: string | void): result is void {
  return typeof result === "undefined"
}

export type TripleCheckOptions<T> = {
  precheck?: (value: T) => string | void
  check?: (value: T) => string | void
  asyncCheck?: (value: T) => Promise<string | void>
  throttle?: number
}

/**
 *
 * Rules of checking value...
 *
 * - If a sync check fails at any time, return a 'fail' with the message from
 *   the sync check. Usually things that go into the sync check are making sure
 *   that there are no invalid characters in the value or a date selection is
 *   outside of a date range.
 * - We then do a `precheck` which is a check that is expected to be failing
 *   with a default value. Usually this is used to check things like the
 *   number of characters. If a `precheck` fails, we do not display a `fail`,
 *   we display a `ready`; however, once a `precheck` passes, we will then
 *   show any subsequent failures. For example, consider a `name` that requires
 *   at least `3` characters. Once the user has typed `3` characters, then he
 *   later deletes some of those characters, then an error message will be
 *   displayed.
 */
export function useTripleCheck<T>(
  value: T,
  {
    precheck = () => {},
    check = () => {},
    asyncCheck,
    throttle: wait = 1000,
  }: TripleCheckOptions<T>
): UseTripleCheckResult {
  const ref = useRef<{
    lastValue: T
    reportPrechecks: boolean
    // cancelAsyncCheck: () => void
  }>({
    lastValue: value,
    reportPrechecks: false,
    // cancelAsyncCheck: () => {},
  })

  /**
   * We default to the waiting response because if we ever make it to the
   * `asyncCheck` we want it to start in the `waiting` state.
   */
  const [asyncCheckResponse, setAsyncCheckResponse] =
    useState<UseTripleCheckResult>({
      status: "waiting",
    })

  const throttledAsyncCheck = useCallback(
    debounce(async (value: T) => {
      if (asyncCheck == null) return
      const asyncResponse = await asyncCheck(value)
      /**
       * If the `lastValue` is not the same as the `value` used to call this
       * method, the result will be incorrect so we just return.
       */
      if (!isEqual(ref.current.lastValue, value)) return
      if (pass(asyncResponse)) {
        setAsyncCheckResponse({ status: "pass" })
      } else {
        setAsyncCheckResponse({ status: "fail", message: asyncResponse })
      }
    }, wait),
    []
  )

  /**
   * If we don't pass a regular check, fail immediately and don't do any
   * other checks.
   */
  const checkResult = check(value)
  if (!pass(checkResult)) {
    ref.current.lastValue = value
    return { status: "fail", message: checkResult }
  }

  /**
   * If we pass a `precheck`, then start to `reportChecks`
   *
   * If we don't pass a precheck:
   *
   * - return `ready` if `reportChecks` is false
   * - return `fail` if `reportChecks` is true
   */
  const precheckResult = precheck(value)
  if (pass(precheckResult)) {
    ref.current.reportPrechecks = true
  } else {
    ref.current.lastValue = value
    if (ref.current.reportPrechecks) {
      return { status: "fail", message: precheckResult }
    } else {
      return { status: "ready", message: precheckResult }
    }
  }

  /**
   */
  if (asyncCheck) {
    if (value !== ref.current.lastValue) {
      if (asyncCheckResponse.status !== "waiting") {
        setAsyncCheckResponse({ status: "waiting" })
      }
      throttledAsyncCheck(value)
    }
  } else {
    return { status: "pass" }
  }
  ref.current.lastValue = value

  return asyncCheckResponse
}
