import eslintConfig from '@electron-toolkit/eslint-config'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
    { ignores: ['**/node_modules', '**/dist', '**/out'] },
    eslintConfig,
    ...eslintPluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                extraFileExtensions: ['.vue']
            }
        }
    },
    {
        files: ['**/*.{js,jsx,vue}'],
        rules: {
            // 缩进强制 4 个空格（核心！）
            indent: ['error', 4],
            'vue/script-indent': ['error', 4, { baseIndent: 1 }],
            'vue/html-indent': ['error', 4],

            'vue/require-default-prop': 'off',
            'vue/multi-word-component-names': 'off'
        }
    },
    eslintConfigPrettier
]
