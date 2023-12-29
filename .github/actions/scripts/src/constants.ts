import * as core from '@actions/core'

export const TOKEN_HEADER = 'x-captain-auth'
export const APP_TOKEN_HEADER = 'x-captain-app-token'
export const NAMESPACE = 'x-namespace'
export const CAPTAIN = 'captain'
export const BASE_API_PATH = '/api/v2'

export const INPUT_URL = 'caprover-url'
export const INPUT_PASSWORD = 'caprover-password'
export const INPUT_OTP_TOKEN = 'caprover-otp'
export const INPUT_AUTH_TOKEN = 'caprover-auth-token'
export const INPUT_APP_NAME = 'caprover-app-name'
export const INPUT_GITHUB_TOKEN = 'github-token'

export const getInputUrl = core.getInput(INPUT_URL)
export const getInputPassword = core.getInput(INPUT_PASSWORD)
export const getInputOtpToken = Number(core.getInput(INPUT_OTP_TOKEN))
export const getInputAuthToken = core.getInput(INPUT_AUTH_TOKEN)
export const getInputAppName = core.getInput(INPUT_APP_NAME)
export const getInputGithubToken = core.getInput(INPUT_GITHUB_TOKEN)

export const OUTPUT_AUTH_TOKEN = 'caprover-auth-token'
export const OUTPUT_APP_NAME = 'caprover-app-name'
export const OUTPUT_APP_TOKEN = 'caprover-app-token'

export enum STATUS {
  OKAY = 100,
  OKAY_BUILD_STARTED = 101,
  STATUS_ERROR_GENERIC = 1000,
  STATUS_ERROR_CAPTAIN_NOT_INITIALIZED = 1001,
  STATUS_ERROR_USER_NOT_INITIALIZED = 1101,
  STATUS_ERROR_NOT_AUTHORIZED = 1102,
  STATUS_ERROR_ALREADY_EXIST = 1103,
  STATUS_ERROR_BAD_NAME = 1104,
  STATUS_WRONG_PASSWORD = 1105,
  STATUS_AUTH_TOKEN_INVALID = 1106,
  VERIFICATION_FAILED = 1107,
  ILLEGAL_OPERATION = 1108,
  BUILD_ERROR = 1109,
  ILLEGAL_PARAMETER = 1110,
  NOT_FOUND = 1111,
  AUTHENTICATION_FAILED = 1112,
  STATUS_PASSWORD_BACK_OFF = 1113,
  STATUS_ERROR_OTP_REQUIRED = 1114,
  STATUS_ERROR_PRO_API_KEY_INVALIDATED = 1115,
  UNKNOWN_ERROR = 1999,
}
