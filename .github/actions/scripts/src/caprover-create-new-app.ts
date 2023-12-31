import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  INPUT_APP_NAME,
  OUTPUT_APP_NAME,
  OUTPUT_APP_TOKEN,
  getInputAppName,
} from './constants.js'
import {
  getPostEnableAndReturnAppToken,
  getPostCaproverCreateApp,
} from './fetch.js'

const SPECIAL_CHAR_REGEX = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi

function generateAppName(appName?: string): string {
  if (!appName) {
    core.info(`Caprover: '${INPUT_APP_NAME}' not set, generating one...`)

    const githubRef = github.context.ref
      .replace(SPECIAL_CHAR_REGEX, '')
      .replace(/refs?/gi, '')
      .replace(/heads?/gi, '')
    const githubRepo = github.context.repo.repo.replace(SPECIAL_CHAR_REGEX, '')

    core.info(`Caprover: generated app name: '${githubRepo}-${githubRef}'`)

    return `${githubRepo}-${githubRef}`
  }

  return appName
}

export async function run() {
  const appName = generateAppName(getInputAppName)

  try {
    const getCaproverRegisteredName = await getPostCaproverCreateApp({
      appName,
    })

    if (getCaproverRegisteredName) {
      core.info(`Caprover: '${OUTPUT_APP_NAME}' set.`)

      core.setOutput(OUTPUT_APP_NAME, getCaproverRegisteredName)

      const appToken = await getPostEnableAndReturnAppToken({ appName })

      if (appToken) {
        core.info(`Caprover: '${OUTPUT_APP_TOKEN}' set.`)
        core.setSecret(appToken)

        return core.setOutput(OUTPUT_APP_TOKEN, appToken)
      }
    }

    // const getCreateDeployment = await octokit.rest.repos.createDeployment({
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   ref: github.context.ref,
    //   environment: 'preview',
    //   auto_merge: false,
    //   required_contexts: [],
    //   transient_environment: true
    // })
  } catch (error) {
    core.error(`${error}`)
  }
}

run()
