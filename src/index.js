import express from 'express'
import { existsSync, mkdirSync } from 'fs'
import _applyRoutes from './router'
import _applyMiddlewares from './lib/middlewares'
import path from 'path'
import './lib/global'

const dbDirectory = path.join(process.cwd(), '/src/db')

if (!existsSync(dbDirectory)) {
  mkdirSync(dbDirectory)
}

const app = express()

_applyMiddlewares(app)
_applyRoutes(app)

app.listen(4000, () => print(`app is ready on port 4000`))