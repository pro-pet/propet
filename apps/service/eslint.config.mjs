import { config } from '@propet/eslint-config/nestjs'

export default config.append(
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
