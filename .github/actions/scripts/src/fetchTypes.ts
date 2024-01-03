import { EnvVar } from './caprover-deploy-image.js'

export interface GetPostCaproverLogin {
  token: string
}

export interface RepoInfo {
  repo: string
  branch: string
  user: string
  password: string
}

export interface AppDefinition {
  hasPersistentData: boolean
  description: string
  instanceCount: number
  captainDefinitionRelativeFilePath: string
  networks: string[]
  envVars: EnvVar[]
  volumes: Record<string, string>[]
  ports: Record<string, string>[]
  tags: Record<string, string>[]
  versions: Array<{
    version: number
    timeStamp: string
    deployedImageName: string
    gitHash: string
  }>
  deployedVersion: number
  notExposeAsWebApp: boolean
  customDomain: string[]
  hasDefaultSubDomainSsl: boolean
  redirectDomain: string
  forceSsl: boolean
  customNginxConfig: string
  websocketSupport: boolean
  containerHttpPort: number
  preDeployFunction: string
  serviceUpdateOverride: string
  appDeployTokenConfig: {
    enabled: boolean
    appDeployToken?: string
  }
  appName: string
  isAppBuilding: boolean
  appPushWebhook: {
    repoInfo: RepoInfo
    tokenVersion: string // On FrontEnd, these values are null, until they are assigned.
    pushWebhookToken: string // On FrontEnd, these values are null, until they are assigned.
  }
  nodeId: string
}

export interface GetAllAppsJson {
  appDefinitions: Array<AppDefinition>
  rootDomain: string
  captainSubDomain: string
  defaultNginxConfig: string
}
