# Azure Pipelines Tasks

Some random VSTS/ADO tasks for my own perusal:

- [`PostToobigResults`](./src/PostToobigResults): Task to post [`toobig`](https://github.com/unindented/toobig) results as a comment in a PR.

Learn more about building custom ADO tasks in this [tutorial](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task).

## Setup

To install all dependencies:

```
npm ci
```

## Build

To build the extension:

```
npm run build
```

## Test

To run linting and unit tests:

```
npm test
```

To run just unit tests:

```
npm run test:unit
```

To continuously run unit tests on changes:

```
npm run watch:unit
```

## Run locally

To run a task locally, copy `.env.example` to `.env`, and fill out the missing values.

To get an auth token for `ADO_TOKEN`, follow [these instructions](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

Then run the desired task:

```
npm run start:PostToobigResults
```

## Meta

- Code: `git clone git://github.com/unindented/azure-pipelines-tasks.git`
- Home: <https://github.com/unindented/azure-pipelines-tasks>

## Contributors

- Daniel Perez Alvarez (<https://github.com/unindented>)

## License

Copyright (c) 2020 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
