#!env node
/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const SequelizeAuto = require('sequelize-auto')
const { execSync } = require('child_process')
const sqlTables = require('../config/sqlTables')
const sequelizerc = require('../.sequelizerc')

const directory = sequelizerc['models-path']
const {
  username, password, database, host, port, dialect
} = require(sequelizerc.config)

const config = {
  host,
  dialect,
  directory,
  port,
  caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
  caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
  singularize: false,
  additional: {
    timestamps: false,
    paranoid: false,
    underscored: false,
    freezeTableName: true
  }
  // skipTables: [migrationStorageTableName, seederStorageTableName],
}

const main = async () => {
  config.tables = sqlTables

  const files = fs.readdirSync(directory)
  files.forEach(file => {
    if (file === 'index.js' || file === 'package.json') return
    fs.unlinkSync(path.join(directory, file))
  })

  const sequelizeAuto = new SequelizeAuto(database, username, password, config)
  // eslint-disable-next-line no-unused-vars
  sequelizeAuto.run().then((data) => {
    // const { table, foreignKeys, indexes, hasTriggerTables, relations, text } = data;
    // console.log({ table, foreignKeys, indexes, hasTriggerTables, relations, text });
    if (sqlTables.length) {
      try {
        sqlTables.forEach((table) => {
          const model = path.join(directory, `${table}.js`)
          let content = fs.readFileSync(model)

          content = content.toString().replace(/"\(N/g, '"')
          fs.writeFileSync(model, content)
        })
        console.log('\n> lint fix files in models directory..')
        const formating = execSync(`npx eslint --fix ${directory}`)
        console.log(formating.toString())
        fs.writeFileSync(path.join(directory, '.gitkeep'), '')
        console.log('> done')
      } catch (err) {
        console.error(err)
      }
    } else {
      fs.writeFileSync(
        path.join(directory, 'init-models.js'),
        'module.exports = (sequelize) => {\n  return null\n}\n'
      )
    }
  })
}

main()
