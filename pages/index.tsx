import Head from "next/head"
import { useState } from "react"
import { UseTripleCheckResult, useTripleCheck } from "~/src"

export default function () {
  const [name, setName] = useState("")
  const checkNameResult = useTripleCheck(name, {
    precheck(name) {
      if (name.length < 3) return "Name must be at least 3 characters long"
    },
    check(name) {
      if (!name.match(/[a-z0-9-]*/i))
        return "Name may only contain letters numbers and dashes"
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
      </Head>
      <h1>Triple Check</h1>
      <div className="form-group">
        <label htmlFor="name-input">Choose a user name</label>
        <input
          type="text"
          className="form-control mb-1"
          id="name-input"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <CheckResult result={checkNameResult} />
      </div>
      <h5>Some things to try</h5>
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
      </ul>
    </div>
  )
}

function CheckResult({ result }: { result: UseTripleCheckResult }) {
  if (result.status === "fail") {
    return <div className="text-danger">{result.message}</div>
  }
  return <div>&nbsp;</div>
}
