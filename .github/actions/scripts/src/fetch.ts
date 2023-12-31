import * as core from '@actions/core'
import {
  TOKEN_HEADER,
  APP_TOKEN_HEADER,
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
  getInputAppName,
  getInputAppToken,
  getInputImageUrl,
  INPUT_IMAGE_URL,
  INPUT_APP_NAME,
} from './constants.js'
import {
  GetPostCaproverLogin,
  type GetAllAppsJson,
  AppDefinition,
} from './fetchTypes.js'
import { isEmpty } from 'rambda'
import { EnvVar } from './caprover-deploy-image.js'

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
  captainDefinitionContent?: string
  gitHash?: string
  instanceCount?: number
  forceSsl?: boolean
  envVars?: EnvVar[]
}

type DefinitionBody = Partial<AppDefinition>

interface CaproverFetch {
  url?: string
  endpoint: string
  method: 'GET' | 'POST' | 'POST_DATA'
  body?: CaproverBodyJSON & DefinitionBody
}

function createHeaders() {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')
  headers.append(NAMESPACE, CAPTAIN)

  if (getInputAuthToken) {
    headers.append(TOKEN_HEADER, getInputAuthToken)
  }

  if (getInputAppToken) {
    headers.append(APP_TOKEN_HEADER, getInputAppToken)
  }

  return headers
}

export async function getPostCaproverLogin(): Promise<string | undefined> {
  const password = getInputPassword
  const otpToken = Number(getInputOtpToken)

  if (!password) {
    core.setFailed(`Caprover: '${INPUT_PASSWORD}' input needed for login.`)

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

    core.info(
      `Login result, body: ${JSON.stringify({
        password,
        ...(otpToken && !isNaN(otpToken) ? { otpToken } : {}),
      })}`
    )

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

export async function getAppDefinition({
  appName,
}: Required<Pick<CaproverBodyJSON, 'appName'>>) {
  try {
    const allApps = await getAllApps()

    if (typeof allApps === 'object') {
      const appExists = allApps?.appDefinitions.find(
        (app) => app.appName === appName
      )

      if (appExists?.appName) {
        core.info(`Caprover: '${appName}' app exists`)

        return appExists
      }
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
}

export async function getPostCaproverCreateApp({
  appName,
  hasPersistentData = false,
}: Required<Pick<CaproverBodyJSON, 'appName'>> &
  Pick<CaproverBodyJSON, 'hasPersistentData'>): Promise<string | undefined> {
  try {
    const getApp = await getAppDefinition({ appName })

    if (getApp?.appName) {
      return getApp.appName
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
      core.info(`Caprover: '${appName}' successfully registered.`)

      const enableBaseDomainSsl = await caproverFetch({
        endpoint: '/user/apps/appDefinitions/enablebasedomainssl',
        method: 'POST',
        body: {
          appName,
        },
      })

      if (enableBaseDomainSsl === STATUS.OKAY) {
        core.info(`Caprover: general SSL is enabled for: '${appName}'`)
      }

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

export async function getPostEnableAndReturnAppToken({
  appName,
}: Required<Pick<CaproverBodyJSON, 'appName'>>): Promise<string | undefined> {
  try {
    core.info(`Caprover: prefetching to check for existing appToken.`)

    const getApp = await getAppDefinition({ appName })

    if (getApp?.appDeployTokenConfig?.enabled) {
      core.info(`Caprover: app token already enabled for '${appName}'`)

      return getApp.appDeployTokenConfig.appDeployToken
    }

    core.info(`Caprover: '${appName}'...enabling token.`)

    const updateToEnableAppToken = await caproverFetch({
      method: 'POST',
      endpoint: '/user/apps/appDefinitions/update',
      body: {
        appName,
        appDeployTokenConfig: {
          enabled: true,
        },
        instanceCount: getApp?.instanceCount,
        notExposeAsWebApp: getApp?.notExposeAsWebApp,
        forceSsl: getApp?.forceSsl,
        volumes: getApp?.volumes,
        ports: getApp?.ports,
        customNginxConfig: getApp?.customNginxConfig,
        appPushWebhook: getApp?.appPushWebhook,
        nodeId: getApp?.nodeId,
        preDeployFunction: getApp?.preDeployFunction,
        envVars: getApp?.envVars,
      },
    })

    if (updateToEnableAppToken === STATUS.OKAY) {
      core.info(
        `Caprover: '${appName}'...enabled appToken.\nFetching the newly created appToken...`
      )

      const getApp = await getAppDefinition({ appName })

      if (getApp?.appDeployTokenConfig?.enabled) {
        return getApp.appDeployTokenConfig.appDeployToken
      }
    }

    core.setFailed(`Caprover: '${appName}' unable to create app token.`)

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

export async function getPostEnableInstance({
  appName,
  envVars,
}: {
  appName: string
  envVars?: EnvVar[]
}) {
  const getApp = await getAppDefinition({ appName })

  if (getApp?.appName) {
    try {
      const createEnableInstance = await caproverFetch({
        method: 'POST',
        endpoint: '/user/apps/appDefinitions/update',
        body: {
          appName,
          notExposeAsWebApp: getApp?.notExposeAsWebApp,
          forceSsl: getApp?.forceSsl,
          volumes: getApp?.volumes,
          ports: getApp?.ports,
          customNginxConfig: getApp?.customNginxConfig,
          appPushWebhook: getApp?.appPushWebhook,
          nodeId: getApp?.nodeId,
          preDeployFunction: getApp?.preDeployFunction,
          envVars: getApp?.envVars,
          appDeployTokenConfig: getApp?.appDeployTokenConfig,
          ...(Number(getApp?.instanceCount) === 0 ? { instanceCount: 1 } : {}),
          ...(Array.isArray(envVars) && envVars.length > 0 ? { envVars } : {}),
        },
      })

      return createEnableInstance
    } catch (error) {
      core.info(`Failed: getPostEnableInstance() ${error}`)

      if (STATUS[(error as CaptainError).captainError]) {
        core.setFailed(
          `Caprover: failed with error code: ${
            (error as CaptainError).captainError
          }`
        )
      }
    }
  }
}

export async function getPostEnableSsl({ appName }: { appName?: string }) {
  return (
    appName &&
    caproverFetch({
      method: 'POST',
      endpoint: '/user/apps/appDefinitions/enablebasedomainssl',
      body: {
        appName,
      },
    })
  )
}

export async function caproverDeploy({
  isDetached = true,
  gitHash = '',
  envVars,
}: {
  isDetached?: boolean
  gitHash?: string
  envVars?: EnvVar[]
}) {
  const appName = getInputAppName
  const imageName = getInputImageUrl

  if (!imageName) {
    core.setFailed(`Caprover: no '${INPUT_IMAGE_URL}' provided.`)

    return
  }

  if (!appName) {
    core.setFailed(`Caprover: no '${INPUT_APP_NAME}' provided.`)

    return
  }

  try {
    const enableInstance = await getPostEnableInstance({ appName, envVars })

    if (enableInstance === STATUS.OKAY) {
      const startDeploy = await caproverFetch({
        method: 'POST',
        endpoint:
          '/user/apps/appData/' + appName + (isDetached ? '?detached=1' : ''),
        body: {
          captainDefinitionContent: JSON.stringify({
            schemaVersion: 2,
            imageName,
          }),
          gitHash,
        },
      })

      if (startDeploy === STATUS.OKAY_BUILD_STARTED) {
        return startDeploy
      }
    }
  } catch (error) {
    if (STATUS[(error as CaptainError).captainError]) {
      core.error(`${error}`)

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

  if (!url) {
    core.setFailed(`Caprover: '${INPUT_URL}' needed.`)

    return
  }

  const noPassOnLogin = !getInputPassword && config.endpoint === '/login'
  const noAuthOnRoutes = !getInputAuthToken && config.endpoint !== '/login'

  if (noPassOnLogin || noAuthOnRoutes) {
    core.setFailed(
      `Caprover: you must provide a '${INPUT_AUTH_TOKEN}' or '${INPUT_PASSWORD}'`
    )

    return
  }

  try {
    const fetchAttempt = await fetch(
      `${url}${BASE_API_PATH}${config.endpoint}`,
      {
        method: config?.method,
        body: JSON.stringify(config?.body),
        headers: createHeaders(),
      }
    )

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
    core.error(`${error}`)

    if (STATUS[(error as CaptainError).captainError]) {
      core.setFailed(
        `Caprover: failed with error code: ${
          (error as CaptainError).captainError
        }`
      )
    }

    return
  }
}
