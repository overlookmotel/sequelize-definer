# Changelog

## 0.0.1

* Initial release

## 0.0.2

* Extra fields can be overridden by null/false field
* `skipFields` option
* Bug fixes
* Tests for basic functionality

## 0.1.0

* All options definable in individual model options
* All input will not be touched (cloned before internal modification)
* Labels for createdAt, updatedAt, deletedAt fields
* Support for `underscored` and `underscoredAll` options
* Bug fixes
* Changed README for flatten options passed to require-folder-tree
* Tests for all options

## 0.1.1

* Minor code tidy
* Added licenses to package.json
* Sequelize peer dependency

## 0.1.2

* Added own lodash dependency, rather than using `Sequelize.Utils._`
* Moved define functions into own files

## 0.1.3

* JSHint included in tests
* Set versions for mocha & chai dependencies
* Travis integration
* Updated README

## 0.1.4

* Travis loads sequelize dependency from Github repo master branch not npm
* Tests db user sequelize_test
* Travis uses db user travis
* Updated README

## 0.2.0

Now works with all dialects of SQL supported by Sequelize (MySQL, Postgres, SQLite)

* Updated README

## 0.2.1

* `labels` option inherits from global options defined with `new Sequelize()`
* `humanize` utility function handles underscore style

## 0.2.2

* Bug fix: utility function `functionValue` was not passing arguments
* Update db library dependencies in line with Sequelize
* Remove definer-related options from options passed to `Sequelize#define()`
* Where a model field is a reference to another model (an ID for association), `reference` attribute of the field set to model name of referenced model
* `humanize()` utility function handles empty string/null/undefined
* Amend travis config file to use `npm install` to install Sequelize's dependencies after getting latest master from git
* Added `editorconfig` file

## Next

* Code tidy
