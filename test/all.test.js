// --------------------
// Sequelize definer
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	promised = require('chai-as-promised'),
	Support = require(__dirname + '/support'),
	Sequelize = Support.Sequelize,
	Promise = Sequelize.Promise,
	_ = require('lodash'),
	pathModule = require('path');

// init
chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser('Tests'), function () {
	beforeEach(function() {
		this.models = this.sequelize.models;

		_.forIn(this.models, function(model) {
			this.sequelize.modelManager.removeDAO(model);
		}.bind(this));
	});

	describe('defineAll', function() {
		it('defines all models', function() {
			var definitions = {
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

			this.sequelize.defineAll(definitions);

			_.forIn(definitions, function(definition, modelName) {
				expect(this.models[modelName]).to.be.ok;
				expect(this.models[modelName].tableName).to.equal(modelName + 's');
			}.bind(this));
		});

		describe('associations', function() {
			describe('one-to-one', function() {
				it('creates association', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.User).to.be.ok;
					expect(models.Task.associations.User.target).to.equal(models.User);
					expect(models.Task.associations.User.isSingleAssociation).to.be.true;

					expect(models.User.associations.Task).to.be.ok;
					expect(models.User.associations.Task.target).to.equal(models.Task);
					expect(models.User.associations.Task.isSingleAssociation).to.be.true;
				});

				it('uses as and asReverse', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.Owner).to.be.ok;
					expect(models.Task.associations.Owner.target).to.equal(models.User);
					expect(models.Task.associations.Owner.as).to.equal('Owner');

					expect(models.User.associations.OwnedTask).to.be.ok;
					expect(models.User.associations.OwnedTask.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTask.as).to.equal('OwnedTask');
				});
			});

			describe('one-to-many', function() {
				it('creates association', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.User).to.be.ok;
					expect(models.Task.associations.User.target).to.equal(models.User);
					expect(models.Task.associations.User.isSingleAssociation).to.be.true;

					expect(models.User.associations.TasksUsers).to.be.ok;
					expect(models.User.associations.TasksUsers.target).to.equal(models.Task);
					expect(models.User.associations.TasksUsers.isMultiAssociation).to.be.true;
				});

				it('deduces foreign key', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.Worker).to.be.ok;
					expect(models.Task.associations.Worker.target).to.equal(models.User);
					expect(models.Task.associations.Worker.isSingleAssociation).to.be.true;

					expect(models.User.associations.TasksUsers).to.be.ok;
					expect(models.User.associations.TasksUsers.target).to.equal(models.Task);
					expect(models.User.associations.TasksUsers.isMultiAssociation).to.be.true;
				});

				it('uses as and asReverse', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.Owner).to.be.ok;
					expect(models.Task.associations.Owner.target).to.equal(models.User);
					expect(models.Task.associations.Owner.as).to.equal('Owner');

					expect(models.User.associations.OwnedTasks).to.be.ok;
					expect(models.User.associations.OwnedTasks.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');
				});
			});

			describe('many-to-many', function() {
				it('creates association', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.TasksUsers).to.be.ok;
					expect(models.Task.associations.TasksUsers.target).to.equal(models.User);
					expect(models.Task.associations.TasksUsers.isMultiAssociation).to.be.true;

					expect(models.User.associations.TasksUsers).to.be.ok;
					expect(models.User.associations.TasksUsers.target).to.equal(models.Task);
					expect(models.User.associations.TasksUsers.isMultiAssociation).to.be.true;

					expect(models.TaskUser).to.be.ok;
					expect(models.TaskUser.attributes.TaskId).to.be.ok;
					expect(models.TaskUser.attributes.UserId).to.be.ok;
					expect(models.TaskUser.attributes.id).not.to.exist;
				});

				it('uses as and asReverse', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.Owners).to.be.ok;
					expect(models.Task.associations.Owners.target).to.equal(models.User);
					expect(models.Task.associations.Owners.as).to.equal('Owners');

					expect(models.User.associations.OwnedTasks).to.be.ok;
					expect(models.User.associations.OwnedTasks.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');

					expect(models.TaskOwner).to.be.ok;
					expect(models.TaskOwner.attributes.UserId).to.be.ok;
					expect(models.TaskOwner.attributes.TaskId).to.be.ok;
					expect(models.TaskOwner.attributes.id).not.to.exist;
				});

				it('uses through', function() {
					var definitions = {
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

					var models = this.models;
					expect(models.Task.associations.Joins).to.be.ok;
					expect(models.Task.associations.Joins.target).to.equal(models.User);
					expect(models.Task.associations.Joins.as).to.equal('Users');

					expect(models.User.associations.Joins).to.be.ok;
					expect(models.User.associations.Joins.target).to.equal(models.Task);
					expect(models.User.associations.Joins.as).to.equal('Tasks');

					expect(models.Join.attributes.UserId).to.be.ok;
					expect(models.Join.attributes.TaskId).to.be.ok;
					expect(models.Join.attributes.id).not.to.exist;
				});

				describe('options', function() {
					it('primaryKeyThrough', function() {
						var definitions = {
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

						var models = this.models;
						expect(models.TaskUser.attributes.id).to.be.ok;
					});

					it('associateThrough', function() {
						var definitions = {
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

						var models = this.models;
						expect(models.TaskUser.associations.User).to.be.ok;
						expect(models.TaskUser.associations.User.target).to.equal(models.User);
						expect(models.TaskUser.associations.User.as).to.equal('User');

						expect(models.TaskUser.associations.Task).to.be.ok;
						expect(models.TaskUser.associations.Task.target).to.equal(models.Task);
						expect(models.TaskUser.associations.Task.as).to.equal('Task');
					});

					describe('skipFieldsOnThrough', function() {
						it('fields added if false', function() {
							var definitions = {
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

							expect(this.models.TaskUser.attributes.moon).to.be.ok;
						});

						it('fields not added if true', function() {
							var definitions = {
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

							this.sequelize.defineAll(definitions, {fields: {moon: Sequelize.STRING}, skipFieldsOnThrough: true});

							expect(this.models.TaskUser.attributes.moon).not.to.exist;
						});
					});

					it('camelThrough', function() {
						var definitions = {
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

		describe('options', function() {
			it('primaryKey', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKey: 'foo'});

				expect(this.models.User.attributes.foo).to.be.ok;
				expect(this.models.User.attributes.foo.primaryKey).to.be.true;
			});

			it('primaryKeyType', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyType: Sequelize.STRING(10)});

				expect(this.models.User.attributes.id).to.be.ok;
				expect(this.models.User.attributes.id.primaryKey).to.be.true;
				expect(this.models.User.attributes.id.type).to.be.instanceof(Sequelize.STRING);
			});

			it('primaryKeyAttributes', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyAttributes: {foo: 'bar'}});

				expect(this.models.User.attributes.id).to.be.ok;
				expect(this.models.User.attributes.id.primaryKey).to.be.true;
				expect(this.models.User.attributes.id.foo).to.equal('bar');
			});

			it('primaryKeyFirst', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {primaryKeyFirst: true});

				expect(this.models.User.attributes.id).to.be.ok;
				expect(this.models.User.attributes.id.primaryKey).to.be.true;
				expect(Object.keys(this.models.User.attributes)[0]).to.equal('id');
			});

			it('autoAssociate', function() {
				var definitions = {
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

				var models = this.models;
				expect(models.Task.associations.User).to.be.ok;
				expect(models.Task.associations.User.target).to.equal(models.User);
				expect(models.Task.associations.User.isSingleAssociation).to.be.true;

				expect(models.User.associations.TasksUsers).to.be.ok;
				expect(models.User.associations.TasksUsers.target).to.equal(models.Task);
				expect(models.User.associations.TasksUsers.isMultiAssociation).to.be.true;
			});

			it('fields', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50)
						}
					}
				};

				this.sequelize.defineAll(definitions, {fields: {moon: Sequelize.STRING}});

				expect(this.models.User.attributes.moon).to.be.ok;
			});

			it('labels', function() {
				var definitions = {
					User: {
						fields: {
							name: Sequelize.STRING(50),
							numberOfUnits: Sequelize.INTEGER
						}
					}
				};

				this.sequelize.defineAll(definitions, {labels: true});

				var attributes = this.models.User.attributes;
				expect(attributes.id.label).to.equal('ID');
				expect(attributes.name.label).to.equal('Name');
				expect(attributes.numberOfUnits.label).to.equal('Number Of Units');
				expect(attributes.createdAt.label).to.equal('Created At');
				expect(attributes.updatedAt.label).to.equal('Updated At');
			});

			it('freezeTableName', function() {
				var definitions = {
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

	describe('defineFromFolder', function() {
		it('defines all models', function() {
			this.sequelize.defineFromFolder(pathModule.join(__dirname, './example'));

			expect(this.models.Task2).to.be.ok;
			expect(this.models.User2).to.be.ok;
		});
	});
});
