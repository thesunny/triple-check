import delay from "delay"
import Head from "next/head"
import { useState } from "react"
import { UseTripleCheckResult, useTripleCheck } from "~/src"

export default function () {
  const [name, setName] = useState("")
  const checkNameResult = useTripleCheck(name, {
    precheck(name) {
      if (name.length === 0) return "Name is a required field"
      if (name.length < 3) return "Name must be at least 3 characters long"
    },
    check(name) {
      if (name.length > 0 && name.match(/[^a-z0-9-]/i))
        return "Name may only contain letters numbers and dashes"
    },
    async asyncCheck(name) {
      delay(500) // add an artificial delay to simulate an API request
      if (["john", "jane"].includes(name))
        return `The name "${name}" is already taken`
    },
  })
  return (
    <div className="container" style={{ width: 720 }}>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
          crossOrigin="anonymous"
        />
        <style>{`
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
.rotate {
  display: inline-block;
  animation: spin 2s linear infinite;
}
        `}</style>
      </Head>
      <h1>Triple Check</h1>
      <div className="form-group">
        <label htmlFor="name-input">Choose a user name</label>
        <input
          type="text"
          className="form-control"
          id="name-input"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <div>
          <small>Min 3 characters. Letters, numbers and dashes only.</small>
        </div>
        <CheckResult result={checkNameResult} pass="Name is available" />
      </div>
      <h5>Features</h5>
      <ul>
        <li>
          <strong>Type three characters then backspace:</strong> Precheck issues
          will only show after the precheck has passed at least once.
        </li>
        <li>
          <strong>
            Regular checks will show even if the precheck is failing:
          </strong>{" "}
          Enter a name with a symbol in it like $
        </li>
        <li>
          <strong>
            Expensive async checks only get executed if "precheck" and "check"
            have passed.
          </strong>{" "}
          Enter a name with a symbol in it like $
        </li>
        <li>
          <strong>Enter "john" or "jane":</strong> Test a simulation of async
          checking (1s delay on the API response)
        </li>
        <li>
          If async responses come out of order, we only respect the result of
          the most recent async check. This presents network issues from
          resulting in the wrong result.
        </li>
      </ul>
    </div>
  )
}

function CheckResult({
  result,
  pass,
}: {
  result: UseTripleCheckResult
  pass: string
}) {
  if (result.status === "fail") {
    return <div className="text-danger">✗ {result.message}</div>
  } else if (result.status === "pass") {
    return <div className="text-success">✓ {pass}</div>
  } else if (result.status === "waiting") {
    return (
      <div className="text-warning">
        <span className="rotate">⟳</span>
      </div>
    )
  } else {
    return <div>&nbsp;</div>
  }
}
