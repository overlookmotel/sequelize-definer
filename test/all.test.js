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
	_ = Utils._;

// init

chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser("Tests"), function () {
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
					
					expect(this.sequelize.models.Task.associations.User).to.be.ok;
					expect(this.sequelize.models.Task.associations.User.isSingleAssociation).to.be.true;
					
					expect(this.sequelize.models.User.associations.Task).to.be.ok;
					expect(this.sequelize.models.User.associations.Task.isSingleAssociation).to.be.true;
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
					
					expect(this.sequelize.models.Task.associations.Owner).to.be.ok;
					expect(this.sequelize.models.Task.associations.Owner.as).to.equal('Owner');
					
					expect(this.sequelize.models.User.associations.OwnedTask).to.be.ok;
					expect(this.sequelize.models.User.associations.OwnedTask.as).to.equal('OwnedTask');
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
					
					expect(this.sequelize.models.Task.associations.User).to.be.ok;
					expect(this.sequelize.models.Task.associations.User.isSingleAssociation).to.be.true;
					
					expect(this.sequelize.models.User.associations.TasksUsers).to.be.ok;
					expect(this.sequelize.models.User.associations.TasksUsers.isMultiAssociation).to.be.true;
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
					
					expect(this.sequelize.models.Task.associations.Owner).to.be.ok;
					expect(this.sequelize.models.Task.associations.Owner.as).to.equal('Owner');
					
					expect(this.sequelize.models.User.associations.OwnedTasks).to.be.ok;
					expect(this.sequelize.models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');
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
					
					expect(this.sequelize.models.Task.associations.TasksUsers).to.be.ok;
					expect(this.sequelize.models.Task.associations.TasksUsers.isMultiAssociation).to.be.true;
					
					expect(this.sequelize.models.User.associations.TasksUsers).to.be.ok;
					expect(this.sequelize.models.User.associations.TasksUsers.isMultiAssociation).to.be.true;
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
					
					expect(this.sequelize.models.Task.associations.Owners).to.be.ok;
					expect(this.sequelize.models.Task.associations.Owners.as).to.equal('Owners');
					
					expect(this.sequelize.models.User.associations.OwnedTasks).to.be.ok;
					expect(this.sequelize.models.User.associations.OwnedTasks.as).to.equal('OwnedTasks');
				});
			});
		});
	});
});
