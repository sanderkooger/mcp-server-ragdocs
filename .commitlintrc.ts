import type { UserConfig } from "@commitlint/types"; // [!code focus]
import { RuleConfigSeverity } from "@commitlint/types"; // [!code focus]

const Configuration: UserConfig = {
  // [!code focus]
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-atom",
  formatter: "@commitlint/format",
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "chore",
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "revert",
        "build",
        "ci",
      ],
    ],
  },
  // ...
};

export default Configuration;
