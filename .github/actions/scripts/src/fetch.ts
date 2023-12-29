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
import { URL } from 'url'

interface CaptainError extends Error {
  captainError: Exclude<STATUS, STATUS.OKAY | STATUS.OKAY_BUILD_STARTED>
}

interface CaproverBodyJSON {
  password?: string
  otpToken?: number
  appName?: string
  hasPersistentData?: boolean
  appDeployTokenConfig?: {
    enabled?: boolean
  }
}

interface CaproverFetch {
  url?: string
  endpoint: string
  method: 'GET' | 'POST' | 'POST_DATA'
  body?: CaproverBodyJSON
}

function createHeaders() {
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
        ...(otpToken && !isNaN(otpToken) ? { otpToken } : {}),
      },
    })) as
      | GetPostCaproverLogin
      | STATUS.OKAY
      | STATUS.OKAY_BUILD_STARTED
      | undefined

    core.info(`Login result ${loginResult}`)

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

export async function getAllApps(): Promise<
  GetAllAppsJson | STATUS.OKAY | STATUS.OKAY_BUILD_STARTED | undefined
> {
  return caproverFetch({
    endpoint: '/user/apps/appDefinitions',
    method: 'GET',
  }) as Promise<
    GetAllAppsJson | STATUS.OKAY | STATUS.OKAY_BUILD_STARTED | undefined
  >
}

export async function getPostCaproverCreateApp({
  appName,
  hasPersistentData = false,
}: Required<Pick<CaproverBodyJSON, 'appName'>> &
  Pick<CaproverBodyJSON, 'hasPersistentData'>): Promise<string | undefined> {
  try {
    const allApps = await getAllApps()

    if (typeof allApps === 'object') {
      const appExists = allApps?.appDefinitions.find(
        (app) => app.appName === appName
      )

      if (appExists) {
        core.info(
          `Caprover: '${appName}' app name exists...deploying new version`
        )

        if (appExists && appExists?.appDeployTokenConfig.enabled) {
          return appName
        }

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

export async function getEnableAndReturnAppToken({
  appName,
}: Required<Pick<CaproverBodyJSON, 'appName'>>): Promise<string | undefined> {
  try {
    const prefetchAllApps = await getAllApps()

    if (typeof prefetchAllApps === 'object') {
      const appToken = prefetchAllApps?.appDefinitions.find(
        (apps) => apps.appName === appName
      )

      if (appToken?.appDeployTokenConfig?.enabled) {
        core.info(`Caprover: app token already enabled for '${appName}'`)

        return appToken?.appDeployTokenConfig?.appDeployToken
      }
    }

    const updateToEnableAppToken = await caproverFetch({
      method: 'POST',
      endpoint: '/user/apps/appDefinitions/update',
      body: {
        appName,
        appDeployTokenConfig: {
          enabled: true,
        },
      },
    })

    if (updateToEnableAppToken === STATUS.OKAY) {
      core.info(
        `Caprover: enabled appToken for '${appName}' \n
        Fetching the newly created appToken...`
      )

      const allApps = await getAllApps()

      if (typeof allApps === 'object') {
        const appToken = allApps?.appDefinitions.find(
          (apps) => apps.appName === appName
        )

        if (appToken?.appDeployTokenConfig?.enabled) {
          return appToken?.appDeployTokenConfig?.appDeployToken
        }
      }
    }

    core.error(`Caprover: unable to create app token for '${appName}'`)

    return
  } catch (error) {
    if (STATUS[(error as CaptainError).captainError]) {
      core.setFailed(
        `Caprover: failed with error code: ${
          (error as CaptainError).captainError
        }`
      )
    }
  }
}

export async function caproverFetch(config: CaproverFetch) {
  const url = getInputUrl

  core.info(`DEBUG: ${url}`)

  if (!url) {
    core.setFailed(`Caprover: '${INPUT_URL}' input needed`)

    return
  }

  core.info(
    `DEBUG: password ${typeof getInputPassword} ${typeof getInputAuthToken} ${
      config.endpoint
    }`
  )

  if (
    (!getInputPassword && config.endpoint === '/login') ||
    (!getInputAuthToken && config.endpoint !== '/login')
  ) {
    core.setFailed(
      `Caprover: you must provide a '${INPUT_AUTH_TOKEN}' or '${INPUT_PASSWORD}'`
    )

    return
  }

  const fetchEndpoint = new URL(url, BASE_API_PATH + config.endpoint)

  core.info(`Logging in on: ${fetchEndpoint}`)

  try {
    const fetchAttempt = await fetch(fetchEndpoint, {
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
