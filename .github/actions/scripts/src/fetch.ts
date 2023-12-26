import * as core from '@actions/core'
import {
  TOKEN_HEADER,
  // APP_TOKEN_HEADER,
  NAMESPACE,
  CAPTAIN,
  STATUS,
  BASE_API_PATH,
  INPUT_AUTH_TOKEN,
  getInputUrl,
  getInputPassword,
  getInputOtpToken,
  getInputAuthToken,
  INPUT_PASSWORD,
  INPUT_URL,
  INPUT_OTP_TOKEN,
} from './constants.js'
import { GetPostCaproverLogin, type GetAllAppsJson } from './fetchTypes.js'
import { isEmpty } from 'rambda'

interface CaptainError extends Error {
  captainError: Exclude<STATUS, STATUS.OKAY | STATUS.OKAY_BUILD_STARTED>
}

interface CaproverBodyJSON {
  password?: string
  otpToken?: number
  appName?: string
  hasPersistentData?: boolean
}

interface CaproverFetch {
  url?: string
  endpoint: string
  method: 'GET' | 'POST' | 'POST_DATA'
  body?: CaproverBodyJSON
}

function createHeaders(): Headers {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')
  headers.append(NAMESPACE, CAPTAIN)

  if (getInputAuthToken) {
    headers.append(TOKEN_HEADER, getInputAuthToken)
  }

  // For Later
  // if (getInputAppToken) {
  //   headers.append(APP_TOKEN_HEADER, appToken)
  // }

  return headers
}

export async function getPostCaproverLogin(): Promise<string | undefined> {
  const password = getInputPassword
  const otpToken = Number(getInputOtpToken)

  if (!password) {
    core.setFailed(`Caprover: '${INPUT_PASSWORD}' input needed for login`)

    return
  }

  try {
    const loginResult = (await caproverFetch({
      endpoint: '/login',
      method: 'POST',
      body: {
        password,
        ...(otpToken ? { otpToken } : {}),
      },
    })) as
      | GetPostCaproverLogin
      | STATUS.OKAY
      | STATUS.OKAY_BUILD_STARTED
      | undefined

    if (loginResult && typeof loginResult === 'object') {
      return loginResult.token
    }
  } catch (error) {
    if ((error as CaptainError).captainError === 1114) {
      core.setFailed(
        `Caprover: you must provide an OTP Token, passed in as '${INPUT_OTP_TOKEN}'`
      )

      return
    }
  }
}

export async function getAllApps() {
  return caproverFetch({
    endpoint: '/user/apps/appDefinitions',
    method: 'GET',
  })
}

export async function getPostCaproverCreateApp({
  appName,
  hasPersistentData = false,
}: Required<Pick<CaproverBodyJSON, 'appName'>> &
  Pick<CaproverBodyJSON, 'hasPersistentData'>) {
  try {
    const apps = (await getAllApps()) as
      | GetAllAppsJson
      | STATUS.OKAY
      | STATUS.OKAY_BUILD_STARTED
      | undefined

    if (typeof apps === 'object') {
      const appExists = apps?.appDefinitions.some(
        (app) => app.appName === appName
      )

      if (appExists) {
        core.info(
          `Caprover: '${appName}' app name exists...deploying new version`
        )

        return appName
      }
    }

    const registerApp = await caproverFetch({
      endpoint: '/user/apps/appDefinitions/register',
      method: 'POST',
      body: {
        appName,
        hasPersistentData,
      },
    })

    if (registerApp === STATUS.OKAY) {
      core.info(`Caprover: successfully registered name: '${appName}'`)

      return appName
    }
  } catch (error) {
    if (STATUS[(error as CaptainError).captainError]) {
      core.setFailed(
        `Caprover: failed with error code: ${
          (error as CaptainError).captainError
        }`
      )
    }
  }

  return
}

export async function caproverFetch(config: CaproverFetch) {
  const url = getInputUrl

  if (!url) {
    core.setFailed(`Caprover: '${INPUT_URL}' input needed`)

    return
  }

  if (
    (!getInputPassword && config.endpoint === '/login') ||
    (!getInputAuthToken && config.endpoint !== '/login')
  ) {
    core.setFailed(
      `Caprover: you must provide a '${INPUT_AUTH_TOKEN}' or '${INPUT_PASSWORD}'`
    )

    return
  }

  try {
    const fetchAttempt = await fetch(url + BASE_API_PATH + config.endpoint, {
      method: config?.method,
      body: JSON.stringify(config?.body),
      headers: createHeaders(),
    })

    const { status, data } = await (fetchAttempt.json() as Promise<{
      data: Record<string, string>
      status: (typeof STATUS)[keyof typeof STATUS]
    }>)

    if (status !== STATUS.OKAY && status !== STATUS.OKAY_BUILD_STARTED) {
      core.setFailed(`\n
        Caprover: unknown Error, status: ${status}\n
        file an issue: https://github.com/caprover/caprover/issues
      `)

      return
    }

    if (status === STATUS.OKAY || status === STATUS.OKAY_BUILD_STARTED) {
      if (isEmpty(data)) {
        return status
      }

      return data
    }

    return
  } catch (error) {
    core.setFailed(`Caprover: Failed for an unknown reason`)

    return
  }
}
