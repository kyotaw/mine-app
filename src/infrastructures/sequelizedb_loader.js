'use strict';


var fs = require('fs')
  , path = require('path')
  , Y = require('../helpers/y').Y
  , env = require('../env');

module.exports = {
    loadModels: function() {
        var baseDir = env.SRC_ROOT_DIR; 
        Y((load) => {
            return (dir) => {
                fs.readdirSync(dir)
                    .filter((fileName) => {
                        var filePath = path.join(dir, fileName);
                        return fileName.indexOf('.') !== 0;
                    })
                    .forEach((fileName) => {
                        var filePath = path.join(dir, fileName);
                        if (fs.statSync(filePath).isDirectory(filePath)) {
                            if (fileName === 'entities') {
                                console.log('loading models from ' + filePath);
                                fs.readdirSync(filePath).forEach((modelName) => {
                                    var modelPath = path.join(filePath, modelName);
                                    if (fs.statSync(modelPath).isDirectory(modelPath)) {
                                        load(modelPath);
                                    } else {
                                        console.log('   ' + modelName);
                                        require(modelPath);
                                    }
                                });
                            } else {
                                load(filePath);
                            }
                        }
                    }
                );
            }
        })(baseDir);
    }
}
