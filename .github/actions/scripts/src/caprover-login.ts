import * as core from '@actions/core'
import { getPostCaproverLogin } from './fetch.js'
import { OUTPUT_AUTH_TOKEN, getInputOtpToken } from './constants.js'

export async function run() {
  core.info(`OTP TOKEN: ${getInputOtpToken}`)

  try {
    const token = await getPostCaproverLogin()

    if (token) {
      core.info(`Caprover: Logged in Successfully.`)
      core.setSecret(token)

      return core.setOutput(OUTPUT_AUTH_TOKEN, token)
    }

    core.error(`Caprover: couldn't generator token...`)
  } catch (error) {
    return core.error(`Caprover: Something went wrong...`)
  }

  return
}

run()
