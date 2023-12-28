import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  INPUT_APP_NAME,
  INPUT_GITHUB_TOKEN,
  OUTPUT_APP_NAME,
  getInputAppName,
  getInputGithubToken,
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

    if (!getInputGithubToken) {
      core.notice(
        `Caprover: missing '${INPUT_GITHUB_TOKEN}', can't post deployment link`
      )

      return
    }

    const octokit = github.getOctokit(getInputGithubToken)

    await octokit.rest.repos.createDeployment({
      owner: github.context.repo.owner,
      repo: github.context.repo.owner,
      ref: github.context.ref,
      environment: 'preview',
      auto_merge: false,
    })
  } catch (error) {
    core.error(`${error}`)
  }
}

run()
