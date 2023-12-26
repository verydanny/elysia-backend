import { dirname, resolve, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const NODE_FIX =
  'import { createRequire as createImportMetaRequire } from "module"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\n'
const BUILD_DIR = resolve(__dirname, './dist')

const nodeBuild = await Bun.build({
  entrypoints: [
    resolve(__dirname, './src/caprover-login.ts'),
    resolve(__dirname, './src/caprover-create-new-app.ts'),
  ],
  target: 'node',
  format: 'esm',
})

// Write output files
for (const result of nodeBuild.outputs) {
  const fileContent = NODE_FIX + (await result.text())
  const dest = join(BUILD_DIR, result.path)
  existsSync(BUILD_DIR) || mkdirSync(BUILD_DIR)

  Bun.write(dest, fileContent)
}
