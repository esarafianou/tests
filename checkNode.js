const fs = require('fs')
const tar = require('tar')
const request = require('request-promise')
const semver = require('semver');
const versions = require('./versions.json')

const checkEOL = async (nodeVersion) => {
  const releasesUrl = 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'
  const options = {
    url: releasesUrl,
    transform: function (body) {
      return JSON.parse(body);
    }
  }
  try {
    const versions = await request(options)

    const EOL = false
    let releaseLine = nodeVersion.slice('.')[0]
    if (releaseLine.charAt(0) !== 'v') {
      releaseLine = 'v' + releaseLine
    }
    if (versions[releaseLine].end < new Date()) {
      EOL = true
    }
    return Promise.resolve(EOL)
  }
  catch(err) {
    return Promise.reject(err)
  }
}

const checkVulnerabilities = async (nodeVersion) => {
  const res = await request.get({ uri: 'https://github.com/nodejs/security-wg/archive/master.tar.gz',  encoding: null })
  const arcName = 'security-wg.tar.gz'
  fs.writeFileSync(arcName, res, { encoding: null });
  try {
    await tar.extract({ file: arcName, cwd: '.', sync: true });
  } catch(err) {
    return Promise.reject(err)
  }

  let moreVulns = true
  let affectedVulns = [];
  let i = 1;
  try {
    while (moreVulns === true) {
      let vulnFile = `./security-wg-master/vuln/core/${i}.json`
      console.log(vulnFile)
      if (fs.existsSync(vulnFile)) {
        let vuln = require(vulnFile)
        console.log(vuln)
        if (semver.satisfies(nodeVersion, vuln.vulnerable) && !semver.satisfies(nodeVersion, vuln.patched)) {
          affectedVulns.push(vuln)
        }
        i++
      } else {
        moreVulns = false
      }
    }
    return Promise.resolve(affectedVulns)
  } catch(err) {
    return Promise.reject(err)
  }
}

const checkNodeSecurity = async (nodeVersion) => {
  let EOL, vulnerabilities
  try {
    EOL = await checkEOL(nodeVersion)
  } catch(err) {
    return Promise.reject(err)
  }

  try {
    vulnerabilities = await checkVulnerabilities(nodeVersion)
  } catch(err) {
    return Promise.reject(err)
  }
  return Promise.resolve({
    EOL: EOL,
    vulnerabilities: vulnerabilities
  })
}

module.exports.nodeStatus = nodeStatus = () => {
  const service = process.argv[2]
  const nodeVersion = versions[service]

  const EOLdescription = 'Runtime node version has reached EOL'
  const vulnsDescription = 'Insecure runtime node version'

  genericIssue = {
    nodeVersion: nodeVersion,
    timestamp: new Date(),
    passing: false,
    blocking: process.env.BLOCKING || false
  }

  issues = {}
  checkNodeSecurity(nodeVersion)
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(`An error occured: ${err.message}`)
  })
}


nodeStatus()
