import * as core from '@actions/core'
import * as github from '@actions/github'
import { getDeleteDeployments } from './githubHelpers.js'
import { caproverDeploy } from './fetch.js'
import { CAP_ENV_REGEX } from './constants.js'

function getEnvForDeployment(env: Record<string, string | undefined>) {
  return Object.keys(env).reduce((envArray, currentEnv) => {
    const matchEnv = currentEnv.match(CAP_ENV_REGEX)

    core.info(`${matchEnv}`)
  }, [])
}

export async function run() {
  const gitHash = github.context.sha
  const getAllEnv = getEnvForDeployment(process.env)

  try {
    const deployImage = await caproverDeploy({ gitHash })

    core.info(`${deployImage}`)
  } catch (error) {
    if (error) {
      core.error(`${error}`)

      return core.setFailed(`Caprover: failed to deploy`)
    }
  }

  await getDeleteDeployments()
}

run()
