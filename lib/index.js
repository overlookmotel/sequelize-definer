// --------------------
// Sequelize definer
// --------------------

// modules
var requireFolderTree = require('require-folder-tree');

// imports
var utils = require('./utils'),
	errors = require('./errors');

// exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize');
	
	var Utils = Sequelize.Utils,
		_ = Utils._;
	
	utils = utils(Sequelize);
	
	// add custom errors to Sequelize
	errors = errors(Sequelize);
	_.extend(Sequelize, errors);
	_.extend(Sequelize.prototype, errors);
	
	// define a set of models at once
	// input expected in form of a Javascript object with names of the models as keys
	Sequelize.prototype.defineAll = function(definitions, defineOptions) {
		var sequelize = this;
		
		defineOptions = _.extend({
			primaryKey: 'id',
			primaryKeyType: Sequelize.INTEGER,
			primaryKeyFirst: false,
			autoAssociate: false,
			//onDelete: undefined,
			//onUpdate: undefined,
			//fields: undefined,
			labels: false,
			freezeTableName: sequelize.options.define && sequelize.options.define.freezeTableName,
			camelThrough: false
		}, defineOptions || {});
		
		// find primary keys
		var primaryKeys = {};
		
		_.forIn(definitions, function(definition, modelName) {
			primaryKey(modelName, definition);
		});
		
		// process definitions
		var relationshipsOne = [];
		var relationshipsMany = [];
		
		_.forIn(definitions, function(definition, modelName) {
			defineOne(modelName, definition);
		});
		
		// create relationships
		defineRelationships();
		
		// functions
		
		function primaryKey(modelName, definition)
		{
			// find primary key
			var fields = definition.fields = definition.fields || {};
			
			var key;
			_.forIn(fields, function(field, fieldName) {
				if (!_.isPlainObject(field)) field = fields[fieldName] = {type: field};
				
				if (field.primaryKey && !key) key = fieldName;
			});
			
			// if no primary key, create primary key column
			if (!key && defineOptions.primaryKey) {
				key = utils.functionValue(defineOptions.primaryKey, modelName, definition, definitions);
				var keyField = {type: defineOptions.primaryKeyType, allowNull: false, primaryKey: true, autoIncrement: true};
				
				if (defineOptions.primaryKeyFirst) {
					utils.unshift(fields, key, keyField);
				} else {
					fields[key] = keyField;
				}
			}
			
			if (key) {
				definition.primaryKey = key;
				primaryKeys[modelName + Utils.uppercaseFirst(key)] = {model: modelName, field: key};
			}
			
			// get table name
			var options = definition.options = definition.options || {};
			
			if (options.freezeTableName === undefined) {
				if (defineOptions.freezeTableName !== undefined) {
					options.freezeTableName = defineOptions.freezeTableName;
				} else {
					options.freezeTableName = sequelize.options.define && sequelize.options.define.freezeTableName;
				}
			}
			
			options.tableName = options.freezeTableName ? modelName : Utils.pluralize(modelName);
		}
		
		function defineOne(modelName, definition)
		{
			// add additional fields
			var fields = definition.fields;
			if (defineOptions.fields) {
				_.forIn(defineOptions.fields, function(field, fieldName) {
					if (fields[fieldName]) return;
					fields[fieldName] = utils.functionValue(field, modelName, definition, definitions);
				});
			}
			
			// populate details of fields
			_.forIn(fields, function(params, fieldName) {
				var label = fieldName;
				
				// process oneToMany associations
				var reference = params.reference;
				if (reference === false) {
					delete params.reference;
				} else if (reference || (defineOptions.autoAssociate && primaryKeys[fieldName])) {
					// field references another model
					var referencesKey;
					if (reference) {
						if (!definitions[reference]) throw new Sequelize.SequelizeDefinerError('Reference \'' + reference + '\' in field \'' + fieldName + '\' is invalid');
						
						if (!params.referencesKey) params.referencesKey = definitions[reference].primaryKey;
						
						if (utils.endsWith(fieldName, Utils.uppercaseFirst(params.referencesKey))) {
							var as = fieldName.slice(0, -params.referencesKey.length);
							if (!params.as && as != reference) params.as = as;
							label = params.as || as;
						} else {
							label = reference;
						}
					} else {
						reference = primaryKeys[fieldName].model;
						params.referencesKey = primaryKeys[fieldName].field;
						label = reference;
					}
					
					params.references = definitions[reference].options.tableName;
					
					var referenceType = utils.pop(params, 'referenceType') || 'many';
					if (['one', 'many'].indexOf(referenceType) == -1) throw new Sequelize.SequelizeDefinerError("referenceType must be either 'one' or 'many' in " + modelName + '.' + fieldName);
					
					if (!params.onDelete && defineOptions.onDelete) params.onDelete = defineOptions.onDelete;
					if (!params.onUpdate && defineOptions.onUpdate) params.onUpdate = defineOptions.onUpdate;
					
					var relationshipOptions = {
						modelName1: modelName,
						modelName2: reference,
						foreignKey: fieldName,
						referenceType: 'has' + Utils.uppercaseFirst(referenceType)
					};
					
					if (params.as !== undefined) relationshipOptions.as = params.as;
					if (params.asReverse !== undefined) relationshipOptions.asReverse = utils.pop(params, 'asReverse');
					
					// set field type according to referred to field
					var referenceField = definitions[reference].fields[params.referencesKey];
					params.type = referenceField ? referenceField.type : defineOptions.primaryKeyType;
					
					// store details in relationships array
					relationshipsOne.push(relationshipOptions);
				}
				
				// create label
				if (defineOptions.labels && !params.label) params.label = (label == 'id' ? 'ID' : utils.camelToHuman(label));
			});
			
			// process manyToMany relationships
			if (definition.manyToMany) {
				_.forIn(definition.manyToMany, function(options, modelName2) {
					if (options === true) options = {};
					relationshipsMany.push(_.extend(options, {modelName1: modelName, modelName2: modelName2}));
				});
			}
			
			// define model in sequelize
			var model = sequelize.define(modelName, fields, definition.options);
			
			// done
			return model;
		}
		
		function defineRelationships()
		{
			// define relationships
			var models = sequelize.models;
			
			// define belongsTo-hasMany relationships
			_.forEach(relationshipsOne, function(options) {
				var model1 = models[options.modelName1],
					model2 = models[options.modelName2];
				
				var joinOptions = {};
				if (options.asReverse) joinOptions.as = options.asReverse;
				model2[options.referenceType](model1, joinOptions); // NB referenceType = 'hasOne' or 'hasMany'
				
				joinOptions = {};
				if (options.as) joinOptions.as = options.as;
				model1.belongsTo(model2, options);
			});
			
			// define many-to-many relationships
			_.forEach(relationshipsMany, function(options) {
				var modelName1 = utils.pop(options, 'modelName1'),
					modelName2 = utils.pop(options, 'modelName2'),
					model1 = models[modelName1],
					model2 = models[modelName2],
					key1 = definitions[modelName1].primaryKey,
					key2 = definitions[modelName2].primaryKey;
				
				if (options.through) {
					// use defined through table
					options.through = models[options.through];
				} else {
					// make through table
					var fields = {};
					fields[modelName1 + Utils.uppercaseFirst(key1)] = {type: definitions[modelName1].fields[key1].type, allowNull: false};
					fields[modelName2 + Utils.uppercaseFirst(key2)] = {type: definitions[modelName2].fields[key2].type, allowNull: false};
					
					var modelName = modelName1 + defineOptions.camelThrough ? Utils.uppercaseFirst(modelName2) : modelName2;
					var tableName = defineOptions.freezeTableName ? modelName : Utils.pluralize(modelName1) + Utils.pluralize(defineOptions.camelThrough ? Utils.uppercaseFirst(modelName2) : modelName2);
					
					options.through = defineOne(modelName, {fields: fields, options: {tableName: tableName}});
				}
				
				if (!options.onDelete && defineOptions.onDelete) options.onDelete = defineOptions.onDelete;
				if (!options.onUpdate && defineOptions.onUpdate) options.onUpdate = defineOptions.onUpdate;
				
				var asReverse = utils.pop(options, 'asReverse');
				
				options.foreignKey = modelName2 + Utils.uppercaseFirst(key2);
				model2.hasMany(model1, options);
				
				options.as = asReverse;
				
				options.foreignKey = modelName1 + Utils.uppercaseFirst(key1);
				model1.hasMany(model2, options);
			});
		}
	};
	
	Sequelize.prototype.defineFromFolder = function(path, options) {
		var loadOptions = options.loadOptions || {};
		loadOptions.flatten = true;
		
		var definitions = requireFolderTree(path, loadOptions);
		
		return this.defineAll(definitions, options);
	};
	
	return Sequelize;
};
