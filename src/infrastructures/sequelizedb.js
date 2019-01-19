'use strict';

const Sequelize = require('sequelize')
    , env = require('../env')
    , array = require('../helpers/array')
    , loader = require('./sequelizedb_loader');

const ops = {
    host: env.DB_HOST, 
    dialect: 'postgres',
}

const sequelize = env.DATABASE_URL ?
    new Sequelize(env.DATABASE_URL, { dialect: 'postgres', ssl: true }) :
    new Sequelize(env.DB_NAME, env.DB_USER_NAME, env.DB_PASSWORD, { host: env.DB_HOST, dialect: 'postgres' });

function inherit(schema, baseSchema) {
    schema.associations = _convertToArray(schema.associations);
    baseSchema.associations = _convertToArray(baseSchema.associations);
    
    if (baseSchema.properties != null) {
        schema.properties = schema.properties || {};
        for (let key in baseSchema.properties) {
            if (schema.properties[key] === undefined) {
                schema.properties[key] = baseSchema.properties[key];
            }
        }
    }

    if (baseSchema.methods != null) {
        schema.methods = schema.methods || {};
        for (let key in baseSchema.methods) {
            const func = baseSchema.methods[key];
            if (schema.methods[key] === undefined &&
                typeof func === 'function') {
                schema.methods[key] = func;
            }
        }
    }

    if (baseSchema.classMethods != null) {
        schema.classMethods = schema.classMethods || {};
        for (let key in baseSchema.classMethods) {
            const func = baseSchema.classMethods[key]; 
            if (schema.classMethods[key] === undefined && 
                typeof func === 'funcition') {
                schema.classMethods[key] = ((m) => {
                    return () => {
                        func.apply(m, arguments);
                    }
                })(model)
            }
        }
    }

    if (baseSchema.hooks != null) {
        schema.hooks = schema.hooks || {};
        for (let key in baseSchema.hooks) {
            const func = baseSchema.hooks[key];
            if (schema.hooks[key] === undefined &&
                typeof func === 'function') {
                schema.hooks[key] = func;
            }
        }
    }

    if (baseSchema.associations != null) {
        schema.associations = schema.associations || [];
        Array.prototype.push.apply(schema.associations, baseSchema.associations);
    }
}

function _convertToArray(associations) {
    if (associations == null || array.isArray(associations)) {
        return associations;
    }

    var ret = [];
    for (let type in associations) {
        var association = {};
        association.association = type;
        for (let ops in associations[type]) {
            association[ops] = associations[type][ops];
        }
        ret.push(association);
    }

    return ret;
}

function _oneToMany(model, association) {
    model.hasOne(association.target, {
        foreignKey: association.foreignKey,
        constraints: false,
        scope: association.scope,
        as: association.as.srcToDst,
    });

    association.target.belongsTo(model, {
        foreignKey: association.foreignKey,
        constraints: false,
        as: association.as.dstToSrc,
    });
}

function define(modelName, schema, baseSchema) {
    schema.associations = _convertToArray(schema.associations);

    if (baseSchema != null) {
        inherit(schema, baseSchema);
    }
    var model =  sequelize.define(
        modelName,
        schema.properties,
        {
            classMethods: schema.classMethods,
            instanceMethods: schema.methods,
            hooks: schema.hooks,
        }
    );

    if (schema.associations != null) {
        for (let i = 0; i < schema.associations.length; ++i) {
            const association = schema.associations[i];
            const type = association.association;
            if (type === 'oneToMany') {
                _oneToMany(model, association);
            } else {
                model[type](
                    association.target,
                    association.options
                );
            }
        }
    }

    return model;
}

function makeShareable(model) {
    var unique = 'shareable_' + model.name;
    model.through = sequelize.define(
        model.name + 'Through',
        {
            id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            shareableId: { type: sequelize.UUID, unique: unique }, 
            owner: { type: sequelize.STRING, unique: unique },
            ownerId: { type: sequelize.UUID, unique: unique, references: null },
        }
    );
    model.addOwnerModel = function(ownerModel) {
        ownerModel.belongsToMany(model, {
            through: {
                model: model.through,
                unique: false,
                scope: {
                    owner: ownerModel.name
                }
            },
            foreignKey: 'ownerId',
            constraints: false,
        });
        model.belongsToMany(ownerModel, {
            through: {
                model: model.through,
                unique: false,
            },
            foreignKey: 'shareableId',
            constraints: false,
        });
    }
}

function start() {
    loader.loadModels();
    return sequelize.sync();
}

module.exports = {
    conn: sequelize,
    Sequelize: Sequelize,
    inherit: inherit,
    define: define,
    makeShareable: makeShareable,
    start: start
}
