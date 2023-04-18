# Changelog

## 0.6.1

Docs:

* Reformat README

## 0.6.0

Features:

* Support Sequelize v5
* Support multiple many-to-many relationships between same models

Minor:

* Drop support for Node versions < 10

Bug fixes:

* Fix pluralization of through table names
* Fix missing `var`
* Replace `attributes` with `rawAttributes`

Refactor:

* Refactor utils
* Replace use of Lodash with ES6 JS
* Break up long lines
* Fix ESLint errors
* `index.js` entry point

Dependencies:

* Update dependencies

No code:

* Header comments
* Reformat code comments
* Fix spacing in `package.json`

Docs:

* Versioning policy
* Reverse changelog order
* Update license year
* Remove license indentation

Dev:

* Use NPM v9 for development
* Replace make with npm scripts
* Clean up after `cover` NPM script even if fails
* Replace JSHint with ESLint
* ESLint process all dot files
* Simplify lint scripts
* `package-lock.json`
* Update `package-lock.json` format
* Update NPM ignore
* Replace `.npmignore` with `files` list in `package.json`
* `package.json` re-order dev dependencies
* `.gitattributes` file
* Fix `.gitignore`
* Remove `npm-debug.log` from `.gitignore`
* Update `.editorconfig`
* Remove `sudo` from Travis CI config
* Reformat Travis CI config
* Update dev dependencies

## 0.5.0

* `lowercaseTableName` option [feat]
* `autoAssociate` option match upper case model names
* Avoid errors on Sequelize versions without `Utils._` [fix]
* Avoid errors on Sequelize versions without `Utils.uppercaseFirst` [fix]

## 0.4.6

* Bug fix: Field names on many-to-many self-associations
* Throw error if non-existent models referenced
* Update `semver-select` dependency
* Update `mysql` dev dependency in line with Sequelize v3.12.2
* Update dev dependencies
* License update
* README

## 0.4.5

* MSSQL config for tests

## 0.4.4

* Rename `SequelizeHierarchyError` to `HierarchyError`
* Documentation for errors

## 0.4.3

* Patches use `Sequelize.version` for version number where available

## 0.4.2

* Update dependency mysql in line with Sequelize v3.7.1
* Update dependency lodash
* Update dev dependencies

## 0.4.1

* Patch for `Utils.underscoredIf()` to support Sequelize > 3.5.0

## 0.4.0

* Support for Sequelize v3.x.x
* Bug fix: Apply auto-increment by default on INTEGER/BIGINT primary key fields
* Bug fix: Use `referenceKey` rather than `referencesKey`
* Better support for underscored field names as references
* Update dependencies
* Update dev dependencies in line with Sequelize v3.2.0
* Travis runs tests with Sequelize v3 and v2
* Test code coverage & Travis sends to coveralls
* Run jshint on tests
* Disable Travis dependency cache
* Update README badges to use shields.io

Breaking changes:

* Bug fix: Apply auto-increment by default on INTEGER/BIGINT primary key fields
* Bug fix: Use `referenceKey` rather than `referencesKey`

## 0.3.4

* Move testExample to test/example

## 0.3.3

* Remove relative path to sequelize in tests

## 0.3.2

* Replace `utils.endsWith` with `_.endsWith`

## 0.3.1

* Loosen sequelize dependency version to v2.x.x
* Update mysql module dependency in line with sequelize v2.1.0
* Update lodash dependency
* Update dev dependencies
* Fix bug processing `options.fields`
* README contribution section

## 0.3.0

* `primaryKeyAttributes` option
* Update require-folder-tree dependency to v1.1.0 (allows custom transformations of file names)
* Code tidy

## 0.2.47

* Fix bug with labels on timestamp fields

## 0.2.46

* Update sequelize dependency to v2.0.0+
* Update dev dependencies in line with sequelize v2.0.5
* Update test support files in line with sequelize v2.0.5
* Support for Microsoft SQL Server
* Remove use of deprecated sequelize API
* Code tidy in test/support.js
* Fix tests for Sequelize v2
* Travis runs tests against node 0.10 and 0.12
* Travis uses correct database users
* README update
* README code examples tagged as Javascript

## 0.2.45

* Set sequelize dependency to ~2.0.0-rc3 (tilde)
* README known issue hasOne foreign keys
* README notes on contribution
* Remove all trailing whitespace
* Travis runs on new container infrastructure
* Update db dev dependencies in line with Sequelize 2.0.0-rc8
* Update dev dependencies

## 0.2.44

* Lock sequelize dev dependency to 2.0.0-rc3

## 0.2.8

* Lock sequelize dependency to 2.0.0-rc3 (errors with rc4)

## 0.2.7

* Updated sequelize dependency to v2.0.0-rc3
* Only auto-increment on primary key if INTEGER type
* Default value for UUID primary key fields
* JSHint ignores redefinition of `Promise`

## 0.2.6

* Remove temporary patch for inflection's incorrect pluralization of "permission"

## 0.2.5

* Temporary patch for inflection's incorrect pluralization of "permission" pending PR to fix it permanently
* Specify to use latest Sequelize version from Github in package.json rather than .travis.yml

## 0.2.4

* `primaryKeyThrough` option

## 0.2.3

* Code tidy
* Save `reference` to fields in through models if `associateThrough` option set

## 0.2.2

* Bug fix: utility function `functionValue` was not passing arguments
* Update db library dependencies in line with Sequelize
* Remove definer-related options from options passed to `Sequelize#define()`
* Where a model field is a reference to another model (an ID for association), `reference` attribute of the field set to model name of referenced model
* `humanize()` utility function handles empty string/null/undefined
* Amend travis config file to use `npm install` to install Sequelize's dependencies after getting latest master from git
* Added `editorconfig` file

## 0.2.1

* `labels` option inherits from global options defined with `new Sequelize()`
* `humanize` utility function handles underscore style

## 0.2.0

Now works with all dialects of SQL supported by Sequelize (MySQL, Postgres, SQLite)

* Updated README

## 0.1.4

* Travis loads sequelize dependency from Github repo master branch not npm
* Tests db user sequelize_test
* Travis uses db user travis
* Updated README

## 0.1.3

* JSHint included in tests
* Set versions for mocha & chai dependencies
* Travis integration
* Updated README

## 0.1.2

* Added own lodash dependency, rather than using `Sequelize.Utils._`
* Moved define functions into own files

## 0.1.1

* Minor code tidy
* Added licenses to package.json
* Sequelize peer dependency

## 0.1.0

* All options definable in individual model options
* All input will not be touched (cloned before internal modification)
* Labels for createdAt, updatedAt, deletedAt fields
* Support for `underscored` and `underscoredAll` options
* Bug fixes
* Changed README for flatten options passed to require-folder-tree
* Tests for all options

## 0.0.2

* Extra fields can be overridden by null/false field
* `skipFields` option
* Bug fixes
* Tests for basic functionality

## 0.0.1

* Initial release

