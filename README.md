# docker-security-node-check

> Checks the security status of the production node version of an auth0 core
> service.

Checks whether a service's production node version has reached End Of Life and
if the current version has known vulnerabilities. This information is retrieved
from the Node.js
[Release](https://github.com/nodejs/Release/blob/master/schedule.json) and
[Security](https://github.com/nodejs/security-wg/tree/master/vuln/core) Working
Groups repos.

## Implementation details

The docker image comes with a `versions.json` file, which maps each service
with its runtime node version. When running the image, a service name should be
passed as parameter and based on the `versions.json` file, the checks will run
for the service's production node version.

The information stored in the `versions.json` comes from the
`auth0-configuration` where the core services' production node versions are
defined. Each time a Jenkins job is triggered for the `auth0-configuration`
master branch, the services' production node versions are collected and stored
in the `versions.json` file which is then achieved. Subsequently a Jenkins job
for this repo is triggered in order to build a new image with the updated node
versions. The updated node versions are retrived by copying the `versions.json`
file from the `auth0-configuration` Jenkins job to this repo's Jenkins job.

## Usage

`docker run auth0brokkr/security-node-check <service name>`
Example: `docker run auth0brokkr/security-node-check auth0-server`
