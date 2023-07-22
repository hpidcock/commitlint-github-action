import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export const updateEnvVars = (envVars) => {
  Object.keys(envVars).forEach((key) => {
    process.env[key] = envVars[key]
  })
}

export const updatePushEnvVars = (cwd) => {
  updateEnvVars({
    GITHUB_WORKSPACE: cwd,
    GITHUB_EVENT_NAME: 'push',
  })
}

export const createPushEventPayload = async (
  cwd,
  { forced = false, headCommit = null, commits = [] },
) => {
  const payload = {
    forced,
    head_commit: headCommit,
    commits,
  }
  const eventPath = path.join(cwd, 'pushEventPayload.json')

  updateEnvVars({ GITHUB_EVENT_PATH: eventPath })
  await writeFile(eventPath, JSON.stringify(payload), 'utf8')
}

export const createPullRequestEventPayload = async (cwd) => {
  const payload = {
    number: '1',
    repository: {
      owner: {
        login: 'wagoid',
      },
      name: 'commitlint-github-action',
    },
  }

  const eventPath = path.join(cwd, 'pullRequestEventPayload.json')

  updateEnvVars({
    GITHUB_EVENT_PATH: eventPath,
    GITHUB_REPOSITORY: 'wagoid/commitlint-github-action',
  })
  await writeFile(eventPath, JSON.stringify(payload), 'utf8')
}

export const updatePullRequestEnvVars = (cwd, options = {}) => {
  const { eventName = 'pull_request' } = options

  updateEnvVars({
    GITHUB_WORKSPACE: cwd,
    GITHUB_EVENT_NAME: eventName,
  })
}

export const buildResponseCommit = (sha, message) => ({
  sha,
  commit: {
    message,
  },
})
