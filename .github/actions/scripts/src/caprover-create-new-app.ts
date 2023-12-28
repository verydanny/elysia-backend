import * as core from '@actions/core'
import * as github from '@actions/github'
import { getDeleteDeployments } from './githubHelpers.js'
import {
  INPUT_APP_NAME,
  OUTPUT_APP_NAME,
  getInputAppName,
} from './constants.js'
import { getPostCaproverCreateApp } from './fetch.js'

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
      core.setOutput(OUTPUT_APP_NAME, getCaproverRegisteredName)
    }

    await getDeleteDeployments()
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
