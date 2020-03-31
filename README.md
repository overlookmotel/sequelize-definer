# sequelize-definer.js

# Sequelize plugin to help easily define a set of models

## What's it for?

This plugin for [Sequelize](http://sequelizejs.com/) provides two utility functions to make it easier to define a set of models at once, either from a Javascript object or a folder.

## Current status

[![NPM version](https://img.shields.io/npm/v/sequelize-definer.svg)](https://www.npmjs.com/package/sequelize-definer)
[![Build Status](https://img.shields.io/travis/overlookmotel/sequelize-definer/master.svg)](http://travis-ci.org/overlookmotel/sequelize-definer)
[![Dependency Status](https://img.shields.io/david/overlookmotel/sequelize-definer.svg)](https://david-dm.org/overlookmotel/sequelize-definer)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/sequelize-definer.svg)](https://david-dm.org/overlookmotel/sequelize-definer)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/sequelize-definer/master.svg)](https://coveralls.io/r/overlookmotel/sequelize-definer)

API is stable. All features and options are fairly well tested. Works with all dialects of SQL supported by Sequelize (MySQL, Postgres, SQLite, Microsoft SQL Server).

Tested with Sequelize v2.x.x and v3.x.x, but may work on Sequelize v1.7 too - please let me know if you have success with v1.7.

## Usage

### Loading module

To load module:

```js
var Sequelize = require('sequelize-definer')();
// NB Sequelize must also be present in `node_modules`
```

or, a more verbose form useful if chaining multiple Sequelize plugins:

```js
var Sequelize = require('sequelize');
require('sequelize-definer')(Sequelize);
```

### Defining from object
#### Sequelize#defineAll( definitions [, options] )

Call `Sequelize#defineAll( definitions )`, passing an object containing the model definitions with the model names as keys.e.g.:

```js
sequelize.defineAll({
	User: {
		fields: {
			field1: ...,
			field2: ...
		},
		options: { ... }
	},
	Task: {
		fields: {
			field1: ...,
			field2: ...
		},
		options: { ... }
	}
});
```

`fields` and `options` are the same as are passed to `Sequelize#define( modelName, fields, options )`. Both are optional.

### Defining from folder
#### Sequelize#defineFromFolder( folderPath [, options] )

Call `Sequelize#defineFromFolder( folderPath )` passing full directory path of the folder to load model definitions from. e.g.:

```js
sequelize.defineFromFolder( path.join( __dirname, 'models' ) );
```

Example of a model file:

```js
// User.js
var Sequelize = require('sequelize');

module.exports = {
	fields: {
		name: Sequelize.STRING
	}
};
```

`defineFromFolder()` uses [require-folder-tree](https://github.com/overlookmotel/require-folder-tree/) to load the files from the folder. You can pass options to `require-folder-tree` for how the files are loaded by including an object `loadOptions` in `options` passed to `defineFromFolder()`. e.g.:

```js
// Load files in sub-folders as models with name prefixed by folder name
// e.g. `User/Permission.js` defines model `UserPermission`
sequelize.defineFromFolder( path.join( __dirname, 'models' ), {
	loadOptions: {
		// NB flatten is always set to `true`
		flattenPrefix: true
	}
} );
```

### Defining one-to-one or one-to-many associations

You can create associations between models within the model definitions.

A one-to-many association:

```js
// Each Task belongs to a User and a User has many Tasks
sequelize.defineAll({
	User: {
		fields: {
			name: Sequelize.STRING
		}
	},
	Task: {
		fields: {
			name: Sequelize.STRING,
			UserId: {
				reference: 'User'
			}
		}
	}
});

// Equivalent to:
// Task.belongsTo(User);
// User.hasMany(Task);
```

For a one-to-one association (i.e. hasOne rather than hasMany), define `referenceType: 'one'`:

```js
sequelize.defineAll({
	User: ...,
	Task: { fields: {
		name: ...,
		UserId: {
			reference: 'User',
			referenceType: 'one'
		}
	} }
});

// Equivalent to:
// Task.belongsTo(User);
// User.hasOne(Task);
```

NB The type of a field with `reference` is automatically inherited from the primary key of the referenced model, so no need to specify `type`.

Other options...

```js
sequelize.defineAll({
	User: ...,
	Task: { fields: {
		name: ...,
		UserId: {
			reference: 'User',
			referenceKey: 'id', // defaults to the primary key of the referenced model
			as: 'Owner', // defaults to name of the referenced model
			asReverse: 'TasksToDo', // defaults to name of this model
			type: Sequelize.INTEGER, // defaults to type of the primary key field in referenced model
			onDelete: 'CASCADE', // defaults to undefined (default Sequelize behaviour)
			onUpdate: 'CASCADE' // defaults to undefined (default Sequelize behaviour)
		}
	} }
});

// Equivalent to:
// Task.belongsTo(User, { as: 'Owner', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// User.hasMany(Task, { as: 'TasksToDo', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Then you can do:
// user.getTasksToDo()
// task.getOwner()
```

See `autoAssociate` option below for an even easier way to handle associations.

### Defining many-to-many associations

```js
sequelize.defineAll({
	User: {
		fields: {
			name: Sequelize.STRING
		}
	},
	Task: {
		fields: {
			name: Sequelize.STRING
		},
		manyToMany: {
			User: true
		}
	}
});

// Equivalent to:
// Task.belongsToMany(User);
// User.belongsToMany(Task);
```

Options can also be passed:

```js
sequelize.defineAll({
	User: ...,
	Task: {
		fields: ...,
		manyToMany: {
			User: {
				onDelete: 'RESTRICT', // defaults to undefined
				onUpdate: 'RESTRICT', // defaults to undefined
				as: 'Worker', // defaults to name of the referenced model
				asReverse: 'TasksToDo', // defaults to name of this model
				through: 'UserTask', // defaults to undefined, creating through table automatically
				skipFields: true // defaults to value of options.skipFieldsOnThrough (see below)
			}
		}
	},
	UserTask: {
		fields: {
			status: Sequelize.STRING
		}
	}
});

// Equivalent to:
// Task.belongsToMany(User, { through: 'UserTask', onDelete: 'RESTRICT', onUpdate: 'RESTRICT', as: 'Worker' });
// User.belongsToMany(Task, { through: 'UserTask', onDelete: 'RESTRICT', onUpdate: 'RESTRICT', as: 'TasksToDo' });
```

### Options

All options below apply to both `defineAll()` and `defineFromFolder()`.

Options can also be applied on a model-by-model basis in each model's options, except where noted below. Options set on a particular model override the global options.

#### primaryKey

Sets the name of the primary key attribute automatically created on all models which have no primary key defined.
Defaults to `'id'` (default Sequelize behaviour).

```js
sequelize.defineAll( definitions, { primaryKey: 'ID' });
```

If a function is provided in place of a string, the function is called to get the key name. Function is called with arguments `( modelName, definition, definitions )`.

```js
// primary key for model User will be UserId
sequelize.defineAll( definitions, {
	primaryKey: function(modelName) {
		return modelName + 'Id';
	}
});
```

#### primaryKeyType

Sets the type of the auto-created primary key attribute.
Defaults to `Sequelize.INTEGER` (default Sequelize behaviour).

```js
sequelize.defineAll( definitions, { primaryKeyType: Sequelize.INTEGER.UNSIGNED });
```

#### primaryKeyAttributes

Define additional attributes for primary keys.
Defaults to `undefined` (default Sequelize behaviour).

```js
sequelize.defineAll( definitions, { primaryKeyAttributes: { defaultValue: Sequelize.UUIDV4 } });
```

#### primaryKeyThrough

When `true`, creates an `id` column as primary key in through tables.
When `false`, there is no `id` column and the primary key consists of the columns referring to the models being associated by the through table (usual Sequelize behaviour).
Defaults to `false`.

#### primaryKeyFirst

When `true`, creates the primary key as the first column in the table.
Defaults to `false`.

#### associateThrough

When `true`, associates through tables with their joined models.
Defaults to `false`.

This allows you to do e.g. `TaskUser.findAll( { include: [ Task, User ] } )`

`associateThrough` option can also be overridden on an individual many-to-many join with the `manyToMany` object's `associate` option.

#### autoAssociate

When `true`, automatically creates associations where a column name matches the model name + primary key of another model. No need to specify `reference` as in the association examples above. If you have a standardized naming convention, this makes it really easy and natural to define associations. Defaults to `false`.

```js
sequelize.defineAll({
	User: {
		fields: {
			name: Sequelize.STRING
		}
	},
	Task: {
		fields: {
			name: Sequelize.STRING,
			UserId: { allowNull: false }
		}
	}
}, {
	// options
	autoAssociate: true
});

// This automatically runs
// Task.belongsTo(User);
// User.hasMany(Task);
```

To prevent a particular field being auto-associated, set `reference` on the field to `null`.

#### fields

Adds the fields provided to every model defined.
Defaults to `undefined`.

```js
sequelize.defineAll( definitions, { fields: {
	createdByUserId: {
		type: Sequelize.INTEGER,
		references: 'Users'
	}
} });
```

If a function is provided in place of an object, the function is called to get the field definition. Function is called with arguments `( modelName, definition, definitions )`.

```js
sequelize.defineAll( definitions, {
	autoAssociate: true,
	fields: {
		createdByUserId: function(modelName) {
			return {
				reference: 'User',
				asReverse: 'created' + Sequelize.Utils.pluralize(modelName)
			};
		}
	}
});

// Equivalent to e.g.
// Task.belongsTo(User, { as: 'createdByUser' });
// User.hasMany(Task, { as: 'createdTasks' });
```

To skip adding all extra fields on a particular model, set `skipFields` to `true` in that model's options.
To skip adding a particular extra field, include that field in the model's `fields` object as `null`.

#### skipFieldsOnThrough

When `true`, does not add extra fields defined with `options.fields` to through tables.
Defaults to `false`.

To skip adding extra fields on a particular many-to-many association's through table, set `skipFields` in the `manyToMany` object's options.

#### labels

When `true`, creates a `label` attribute on each field, with a human-readable version of the field name.
Defaults to global define option set in `new Sequelize()` or `false`.

#### freezeTableName

When `true`, table names are the same as model names provided, not pluralized as per default Sequelize behaviour.
Defaults to global define option set in `new Sequelize()` or `false`.

#### lowercaseTableName

When `true`, table names have first letter lower cased.
Defaults to global define option set in `new Sequelize()` or `false`.

#### camelThrough

When `true`, creates through model names in camelcase (i.e. 'taskUser' rather than 'taskuser').
Defaults to global define option set in `new Sequelize()` or `false` (default Sequelize behaviour).

`camelThrough` option can also be overridden on an individual many-to-many join with the `manyToMany` object's `camel` option.

### Errors

Errors thrown by the plugin are of type `DefinerError`. The error class can be accessed at `Sequelize.DefinerError`.

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.
Requires a database called 'sequelize_test' and a db user 'sequelize_test' with no password.

## Changelog

See [changelog.md](https://github.com/overlookmotel/sequelize-definer/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/sequelize-definer/issues

### Known issues

* Does not create foreign key constraint on a 'hasOne' relation defined by setting 'reference' in field definition

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
