export interface GetPostCaproverLogin {
  token: string
}

export interface GetAllAppsJson {
  appDefinitions: Array<{
    hasPersistentData: boolean
    description: string
    instanceCount: number
    captainDefinitionRelativeFilePath: string
    networks: string[]
    envVars: Record<string, string>[]
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
    websocketSupport: boolean
    containerHttpPort: number
    preDeployFunction: string
    serviceUpdateOverride: string
    appDeployTokenConfig: {
      enabled: boolean
    }
    appName: string
    isAppBuilding: boolean
  }>
  rootDomain: string
  captainSubDomain: string
  defaultNginxConfig: string
}
