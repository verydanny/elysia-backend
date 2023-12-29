import * as core from '@actions/core'
import { getPostCaproverLogin } from './fetch.js'
import { OUTPUT_AUTH_TOKEN } from './constants.js'

export async function run() {
  try {
    const token = await getPostCaproverLogin()

    if (token) {
      core.info(`Caprover: Logged in Successfully.`)
      core.setSecret(token)

      return core.setOutput(OUTPUT_AUTH_TOKEN, token)
    }

    core.setFailed(`Caprover: couldn't generate token...`)
  } catch (error) {
    return core.error(`Caprover: Something went wrong...`)
  }

  return
}

run()
