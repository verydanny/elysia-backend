import * as core from '@actions/core'
import * as github from '@actions/github'
import { getDeleteDeployments } from './githubHelpers.js'
import { caproverDeploy } from './fetch.js'
import { CAP_ENV_REGEX } from './constants.js'

export interface EnvVar {
  key: string
  value: string
}

function getEnvForDeployment(
  env: Record<string, string | undefined>
): EnvVar[] {
  return Object.keys(env).reduce((envArray: EnvVar[], currentEnv) => {
    const matchEnv = currentEnv.match(CAP_ENV_REGEX)
    const matchResult = Array.isArray(matchEnv) && matchEnv[1]

    if (matchResult) {
      const stringified = {
        key: matchResult,
        value: env[currentEnv] || '',
      }

      return [...envArray, stringified]
    }

    return envArray
  }, [])
}

export async function run() {
  const gitHash = github.context.sha
  const envVars = getEnvForDeployment(process.env)

  core.info(`env: ${envVars}`)
  try {
    const deployImage = await caproverDeploy({ gitHash, envVars })

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
