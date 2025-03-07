import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
  // [!code focus]
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-atom',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'chore',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'revert',
        'build',
        'ci'
      ]
    ]
  },
  ignores: [
    (message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message),
    (message) => /^chore\(release\): .*$/m.test(message)
  ]
}

export default Configuration
