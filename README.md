# Triple Check

React form validation that supports async checking and prechecks while allowing the same code to be used on the browser and server (perfect for Next.js API calls).

It's called `triple-check` because it provides the check everyone knows they need and also the two other types of checks that everyone forgets they need:

## Three Types of Checks

- Async checks: Things like checking the database to see if a name exists. Examples:
  - check a name for uniqueness against a database
  - check a value against an API like whether a booking data is available
- Prechecks: A type of check that should only report an issue to the user has passed the check at least once. An example of this is minimum length. It's inappropriate to show the user an error about not meeting the minimum length if he just opened the form. But once the user has hit the minimum length, deleting some characters should show the issue.
  - minimum length
  - check at least one checkbox from this list
  - select a starting date
- Standard checks: Then the rest of the usual checks that we expect like whether a name contains invalid characters or a date is in the past.

## Features

- Support for a waiter (progress indicator)
- Runs checks async on the browser with a simple React hook `useTripleCheck(checks)`
- Runs checks all at once on the server with a single `await tripleCheck(checks)`
- Prevent form submission until form is valid
- Minimizes async API calls by throttling the calls
