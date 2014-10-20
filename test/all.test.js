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
	Utils = Sequelize.Utils,
	_ = Utils._,
	pathModule = require('path');

// init

chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser("Tests"), function () {
	beforeEach(function() {
		_.forIn(this.sequelize.models, function(model) {
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
				expect(this.sequelize.models[modelName]).to.be.ok;
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
					
					var models = this.sequelize.models;
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
					
					var models = this.sequelize.models;
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
					
					var models = this.sequelize.models;
					expect(models.Task.associations.User).to.be.ok;
					expect(models.Task.associations.User.target).to.equal(models.User);
					expect(models.Task.associations.User.isSingleAssociation).to.be.true;
					
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
					
					var models = this.sequelize.models;
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
					
					var models = this.sequelize.models;
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
					
					var models = this.sequelize.models;
					expect(models.Task.associations.Owners).to.be.ok;
					expect(models.Task.associations.Owners.target).to.equal(models.User);
					expect(models.Task.associations.Owners.as).to.equal('Owners');
					
					expect(models.User.associations.OwnedTasks).to.be.ok;
					expect(models.User.associations.OwnedTasks.target).to.equal(models.Task);
					expect(models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');
					
					expect(models.TaskUser).to.be.ok;
					expect(models.TaskUser.attributes.UserId).to.be.ok;
					expect(models.TaskUser.attributes.TaskId).to.be.ok;
					expect(models.TaskUser.attributes.id).not.to.exist;
				});
			});
		});
	});
	
	describe('defineFromFolder', function() {
		it('defines all models', function() {
			this.sequelize.defineFromFolder(pathModule.join(__dirname, '../testExample'));
			
			expect(this.sequelize.models.Task2).to.be.ok;
			expect(this.sequelize.models.User2).to.be.ok;
		});
	});
});
