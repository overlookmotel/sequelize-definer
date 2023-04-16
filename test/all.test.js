/* --------------------
 * Sequelize definer
 * Tests
 * ------------------*/

/* eslint-disable no-invalid-this */

'use strict';

// Modules
const chai = require('chai'),
	{expect} = chai,
	promised = require('chai-as-promised'),
	_ = require('lodash'),
	pathModule = require('path'),
	semverSelect = require('semver-select');

// Imports
const Support = require('./support.js'),
	{Sequelize} = Support;

// Init
chai.use(promised);
chai.config.includeStack = true;

// Tests

// eslint-disable-next-line global-require
const sequelizeVersion = Sequelize.version || require('sequelize/package.json').version;

console.log('Sequelize version:', sequelizeVersion); // eslint-disable-line no-console

describe(Support.getTestDialectTeaser('Tests'), () => {
	beforeEach(function() {
		this.models = this.sequelize.models;

		const removeModel = semverSelect(sequelizeVersion, {
			'<3.0.0': this.sequelize.modelManager.removeDAO,
			'*': this.sequelize.modelManager.removeModel
		}).bind(this.sequelize.modelManager);

		_.forIn(this.models, (model) => {
			removeModel(model);
		});
	});

	describe('defineAll', () => {
		describe('defines', () => {
			beforeEach(function() {
				this.definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					},
					Task: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(this.definitions);
			});

			it('defines all models', function() {
				_.forIn(this.definitions, (definition, modelName) => {
					expect(this.models[modelName]).to.be.ok;
					expect(this.models[modelName].tableName).to.equal(`${modelName}s`);
				});
			});

			it('creates primary keys', function() {
				_.forIn(this.definitions, (definition, modelName) => {
					expect(this.models[modelName].rawAttributes.id).to.be.ok;
					expect(this.models[modelName].rawAttributes.id.primaryKey).to.be.true;
					expect(this.models[modelName].rawAttributes.id.autoIncrement).to.be.true;
				});
			});
		});

		describe('associations', () => {
			describe('one-to-one', () => {
				it('creates association', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50),
								UserId: {
									reference: 'User',
									referenceType: 'one'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					expect(models.Task.associations.User).to.be.ok;
					expect(models.Task.associations.User.target).to.equal(models.User);
					expect(models.Task.associations.User.isSingleAssociation).to.be.true;

					expect(models.User.associations.Task).to.be.ok;
					expect(models.User.associations.Task.target).to.equal(models.Task);
					expect(models.User.associations.Task.isSingleAssociation).to.be.true;
				});

				it('uses as and asReverse', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50),
								UserId: {
									reference: 'User',
									referenceType: 'one',
									as: 'Owner',
									asReverse: 'OwnedTask'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					expect(models.Task.associations.Owner).to.be.ok;
					expect(models.Task.associations.Owner.target).to.equal(models.User);
					expect(models.Task.associations.Owner.as).to.equal('Owner');

					expect(models.User.associations.OwnedTask).to.be.ok;
					expect(models.User.associations.OwnedTask.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTask.as).to.equal('OwnedTask');
				});
			});

			describe('one-to-many', () => {
				it('creates association', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50),
								UserId: {
									reference: 'User'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					let associations = _.values(models.Task.associations),
						association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.User);
					expect(association.as).to.equal('User');
					expect(association.isSingleAssociation).to.be.true;

					associations = _.values(models.User.associations);
					association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('Tasks');
					expect(association.isMultiAssociation).to.be.true;
				});

				it('deduces foreign key', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50),
								WorkerId: {
									reference: 'User'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					let associations = _.values(models.Task.associations),
						association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.User);
					expect(association.as).to.equal('Worker');
					expect(association.isSingleAssociation).to.be.true;

					associations = _.values(models.User.associations);
					association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('Tasks');
					expect(association.isMultiAssociation).to.be.true;
				});

				it('uses as and asReverse', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50),
								UserId: {
									reference: 'User',
									as: 'Owner',
									asReverse: 'OwnedTasks'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					expect(models.Task.associations.Owner).to.be.ok;
					expect(models.Task.associations.Owner.target).to.equal(models.User);
					expect(models.Task.associations.Owner.as).to.equal('Owner');

					expect(models.User.associations.OwnedTasks).to.be.ok;
					expect(models.User.associations.OwnedTasks.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');
				});
			});

			describe('many-to-many', () => {
				it('creates association', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50)
							},
							manyToMany: {
								User: true
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					let associations = _.values(models.Task.associations),
						association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.User);
					expect(association.as).to.equal('Users');
					expect(association.isMultiAssociation).to.be.true;

					associations = _.values(models.User.associations);
					association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('Tasks');
					expect(association.isMultiAssociation).to.be.true;

					expect(models.TaskUser).to.be.ok;
					expect(models.TaskUser.rawAttributes.TaskId).to.be.ok;
					expect(models.TaskUser.rawAttributes.UserId).to.be.ok;
					expect(models.TaskUser.rawAttributes.id).not.to.exist;
				});

				it('uses as and asReverse', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50)
							},
							manyToMany: {
								User: {
									as: 'Owners',
									asReverse: 'OwnedTasks'
								}
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					expect(models.Task.associations.Owners).to.be.ok;
					expect(models.Task.associations.Owners.target).to.equal(models.User);
					expect(models.Task.associations.Owners.as).to.equal('Owners');

					expect(models.User.associations.OwnedTasks).to.be.ok;
					expect(models.User.associations.OwnedTasks.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');

					expect(models.TaskOwner).to.be.ok;
					expect(models.TaskOwner.rawAttributes.UserId).to.be.ok;
					expect(models.TaskOwner.rawAttributes.TaskId).to.be.ok;
					expect(models.TaskOwner.rawAttributes.id).not.to.exist;
				});

				it('uses through', function() {
					const definitions = {
						User: {
							fields: {
								name: Sequelize.STRING(50)
							}
						},
						Task: {
							fields: {
								name: Sequelize.STRING(50)
							},
							manyToMany: {
								User: {
									through: 'Join'
								}
							}
						},
						Join: {
							fields: {
								status: Sequelize.STRING(50)
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					let associations = _.values(models.Task.associations),
						association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.User);
					expect(association.as).to.equal('Users');
					expect(association.isMultiAssociation).to.be.true;

					associations = _.values(models.User.associations);
					association = associations[0];
					expect(associations).to.have.length(1);
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('Tasks');
					expect(association.isMultiAssociation).to.be.true;

					expect(models.Join.rawAttributes.UserId).to.be.ok;
					expect(models.Join.rawAttributes.TaskId).to.be.ok;
					expect(models.Join.rawAttributes.id).not.to.exist;
				});

				it('handles self-association', function() {
					const definitions = {
						Task: {
							fields: {
								name: Sequelize.STRING(50)
							},
							manyToMany: {
								Task: {
									through: 'Join',
									as: 'DoBefores',
									asReverse: 'DoAfters'
								}
							}
						},
						Join: {
							fields: {
								status: Sequelize.STRING(50)
							}
						}
					};

					this.sequelize.defineAll(definitions);

					const {models} = this;
					const associations = _.values(models.Task.associations);
					expect(associations).to.have.length(2);

					let association = associations[0];
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('DoBefores');
					expect(association.isMultiAssociation).to.be.true;

					association = associations[1];
					expect(association.target).to.equal(models.Task);
					expect(association.as).to.equal('DoAfters');
					expect(association.isMultiAssociation).to.be.true;

					expect(models.Join.rawAttributes.TaskId).to.be.ok;
					expect(models.Join.rawAttributes.DoBeforeId).to.be.ok;
					expect(models.Join.rawAttributes.id).not.to.exist;
				});

				describe('options', () => {
					it('primaryKeyThrough', function() {
						const definitions = {
							User: {
								fields: {
									name: Sequelize.STRING(50)
								}
							},
							Task: {
								fields: {
									name: Sequelize.STRING(50)
								},
								manyToMany: {
									User: true
								}
							}
						};

						this.sequelize.defineAll(definitions, {primaryKeyThrough: true});

						const {models} = this;
						expect(models.TaskUser.rawAttributes.id).to.be.ok;
					});

					it('associateThrough', function() {
						const definitions = {
							User: {
								fields: {
									name: Sequelize.STRING(50)
								}
							},
							Task: {
								fields: {
									name: Sequelize.STRING(50)
								},
								manyToMany: {
									User: true
								}
							}
						};

						this.sequelize.defineAll(definitions, {associateThrough: true});

						const {models} = this;
						expect(models.TaskUser.associations.User).to.be.ok;
						expect(models.TaskUser.associations.User.target).to.equal(models.User);
						expect(models.TaskUser.associations.User.as).to.equal('User');

						expect(models.TaskUser.associations.Task).to.be.ok;
						expect(models.TaskUser.associations.Task.target).to.equal(models.Task);
						expect(models.TaskUser.associations.Task.as).to.equal('Task');
					});

					describe('skipFieldsOnThrough', () => {
						it('fields added if false', function() {
							const definitions = {
								User: {
									fields: {
										name: Sequelize.STRING(50)
									}
								},
								Task: {
									fields: {
										name: Sequelize.STRING(50)
									},
									manyToMany: {
										User: true
									}
								}
							};

							this.sequelize.defineAll(definitions, {fields: {moon: Sequelize.STRING}});

							expect(this.models.TaskUser.rawAttributes.moon).to.be.ok;
						});

						it('fields not added if true', function() {
							const definitions = {
								User: {
									fields: {
										name: Sequelize.STRING(50)
									}
								},
								Task: {
									fields: {
										name: Sequelize.STRING(50)
									},
									manyToMany: {
										User: true
									}
								}
							};

							this.sequelize.defineAll(definitions, {
								fields: {moon: Sequelize.STRING},
								skipFieldsOnThrough: true
							});

							expect(this.models.TaskUser.rawAttributes.moon).not.to.exist;
						});
					});

					it('camelThrough', function() {
						const definitions = {
							user: {
								fields: {
									name: Sequelize.STRING(50)
								}
							},
							task: {
								fields: {
									name: Sequelize.STRING(50)
								},
								manyToMany: {
									user: true
								}
							}
						};

						this.sequelize.defineAll(definitions, {camelThrough: true});

						expect(this.models.taskUser).to.be.ok;
					});
				});
			});
		});

		describe('options', () => {
			it('primaryKey', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKey: 'foo'});

				expect(this.models.User.rawAttributes.foo).to.be.ok;
				expect(this.models.User.rawAttributes.foo.primaryKey).to.be.true;
			});

			it('primaryKeyType', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyType: Sequelize.STRING(10)});

				expect(this.models.User.rawAttributes.id).to.be.ok;
				expect(this.models.User.rawAttributes.id.primaryKey).to.be.true;
				expect(this.models.User.rawAttributes.id.type).to.be.instanceof(Sequelize.STRING);
			});

			it('primaryKeyAttributes', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyAttributes: {foo: 'bar'}});

				expect(this.models.User.rawAttributes.id).to.be.ok;
				expect(this.models.User.rawAttributes.id.primaryKey).to.be.true;
				expect(this.models.User.rawAttributes.id.foo).to.equal('bar');
			});

			it('primaryKeyFirst', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyFirst: true});

				expect(this.models.User.rawAttributes.id).to.be.ok;
				expect(this.models.User.rawAttributes.id.primaryKey).to.be.true;
				expect(Object.keys(this.models.User.rawAttributes)[0]).to.equal('id');
			});

			it('autoAssociate', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					},
					Task: {
						fields: {
							name: Sequelize.STRING(50),
							UserId: {}
						}
					}
				};

				this.sequelize.defineAll(definitions, {autoAssociate: true});

				const {models} = this;
				let associations = _.values(models.Task.associations),
					association = associations[0];
				expect(associations).to.have.length(1);
				expect(association.target).to.equal(models.User);
				expect(association.as).to.equal('User');
				expect(association.isSingleAssociation).to.be.true;

				associations = _.values(models.User.associations);
				association = associations[0];
				expect(associations).to.have.length(1);
				expect(association.target).to.equal(models.Task);
				expect(association.as).to.equal('Tasks');
				expect(association.isMultiAssociation).to.be.true;
			});

			it('fields', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {fields: {moon: Sequelize.STRING}});

				expect(this.models.User.rawAttributes.moon).to.be.ok;
			});

			it('labels', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50),
							numberOfUnits: Sequelize.INTEGER
						}
					}
				};

				this.sequelize.defineAll(definitions, {labels: true});

				const attributes = this.models.User.rawAttributes;
				expect(attributes.id.label).to.equal('ID');
				expect(attributes.name.label).to.equal('Name');
				expect(attributes.numberOfUnits.label).to.equal('Number Of Units');
				expect(attributes.createdAt.label).to.equal('Created At');
				expect(attributes.updatedAt.label).to.equal('Updated At');
			});

			it('freezeTableName', function() {
				const definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {freezeTableName: true});

				expect(this.models.User.tableName).to.equal('User');
			});
		});
	});

	describe('defineFromFolder', () => {
		it('defines all models', function() {
			this.sequelize.defineFromFolder(pathModule.join(__dirname, './example'));

			expect(this.models.Task2).to.be.ok;
			expect(this.models.User2).to.be.ok;
		});
	});
});
