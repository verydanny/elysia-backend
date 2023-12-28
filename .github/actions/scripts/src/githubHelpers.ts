import * as core from '@actions/core'
import * as github from '@actions/github'
import { getInputGithubToken, INPUT_GITHUB_TOKEN } from './constants.js'

export async function getDeleteDeployments() {
  if (!getInputGithubToken) {
    core.notice(
      `Caprover: missing '${INPUT_GITHUB_TOKEN}', can't post deployment link`
    )

    return
  }

  const octokit = github.getOctokit(getInputGithubToken)
  const parameters = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  }

  const getDeployments = await octokit.rest.repos.listDeployments(parameters)

  if (getDeployments.status === 200) {
    if (getDeleteDeployments.length === 0) {
      core.info(`Caprover: no deployments to delete...`)

      return
    }

    const deleteDeployments = getDeployments.data.map(({ id }) =>
      octokit.rest.repos.deleteDeployment({
        ...parameters,
        deployment_id: id,
      })
    )

    return (await Promise.allSettled(deleteDeployments)).some((promise) =>
      promise.status === 'rejected' ? false
      : promise.status === 'fulfilled' && promise.value.status !== 204 ? false
      : true
    )
  }

  return
}
