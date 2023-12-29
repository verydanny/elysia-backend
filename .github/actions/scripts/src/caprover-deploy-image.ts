import * as core from '@actions/core'
import * as github from '@actions/github'
import { getDeleteDeployments } from './githubHelpers.js'
import { caproverDeploy } from './fetch.js'

export async function run() {
  const gitHash = github.context.sha

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
