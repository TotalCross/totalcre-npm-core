// This module interfaces:
const fileSystem = require('fs-extra');

// Extra librarys:
const homedir = require('os').homedir();
const replaceInFile = require('replace-in-file');
const { xml2json } = require('xml-js');


module.exports = {
    makeDir: async (dir) => {
        return fileSystem.ensureDir(dir)
        .then(() => {
            return `dir created successfully`
        })
        .catch((error) => {
            throw 'From "file-system.js", makeDir() error: ' + error
        })  
    },
    
    setupFile: async (source, target, project) => {
        return fileSystem.copy(source, target)
        .then(async () => {
            let platforms = '';
            if (project.platforms) {
                for (let i = 0; i < project.platforms.length; i++) {
                    let platform = `<platform>${project.platforms[i]}</platform>`;
                    if (i < 0) {
                        platform = '\t\t\t\t\t\t' + project.platforms;
                    }
                    if (i < project.platforms.length - 1) {
                        platform += '\n';
                    }
                    platforms += platform;
                }
            }
            
            await replaceInFile({ files: target, from: /\${'groupid'}/g, to: project.groupId });
            await replaceInFile({ files: target, from: /\${'artifactid'}/g, to: project.artifactId });
            await replaceInFile({ files: target, from: /\${'version'}/g, to: project.version });
            await replaceInFile({ files: target, from: /\${'platforms'}/g, to: platforms });
            await replaceInFile({ files: target, from: /\${'activation_key'}/g, to: project.key });
            
            return 'File setup success'
        })
        .catch((error) => {
            throw 'From "file-system.js", setupFile() error: ' + error
        })
    },
    
    mavenMetadataLastUpdated: async (mavenMetadataFile) => {
        return fileSystem.readFile(mavenMetadataFile)
        .then((file) => {
            let json = JSON.parse(xml2json(file.toString(), {compact: true}));
            return json.metadata.versioning.lastUpdated;
        })
        .catch((error) => {
            throw 'From "file-system.js", mavenMetadataLastUpdated() error: ' + error
        });
    },
    
    mavenMetadataVersions: async (mavenMetadataFile) => {
        return fileSystem.readFile(mavenMetadataFile)
        .then((file) => {
            let json = JSON.parse(xml2json(file.toString(), {compact: true}));
            return json.metadata.versioning.versions.version.map((x) => x._text).sort().reverse();
        })
        .catch((error) => {
            throw 'From "file-system.js", mavenMetadataVersions() error: ' + error
        });
    },
    
    configJsonSave: async (token, key) => {
        return fileSystem.writeFile(`${homedir}/TotalCross/.config.json`, JSON.stringify({"token":token,"key":key}), 'utf8')
        .then(() => {
            return '.config.json saved successfully'
        })
        .catch((error) => {
            throw 'From "file-system.js", configJsonSave() error: ' + error
        })
    },
    
    configJsonToken: async () => {
        return fileSystem.readFile(`${homedir}/TotalCross/.config.json`)
        .then((file) => {
            return JSON.parse(file.toString()).token;
        })
        .catch((error) => {
            throw 'From "file-system.js", configJsonToken() error: ' + error
        });
    },
    
    configJsonKey: async () => {
        return fileSystem.readFile(`${homedir}/TotalCross/.config.json`)
        .then((file) => {
            return JSON.parse(file.toString()).key;
        })
        .catch((error) => {
            throw 'From "file-system.js", configJsonKey() error: ' + error
        });
    }
}