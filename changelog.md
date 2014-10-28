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
