import * as core from '@actions/core'
// import * as github from '@actions/github'
import { getInputAppName, getInputAppToken } from './constants.js'

core.info(`appName: ${getInputAppName} appToken: ${getInputAppToken}`)
