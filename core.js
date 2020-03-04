#!/usr/bin/env node
global.__lib = __dirname + '/lib';
global.__rest = 'https://us-central1-totalcross-user-area.cloudfunctions.net/app/api/v1';
global.__resources = __dirname + '/resources'
global.__mavenMetadata = 'https://maven.totalcross.com/artifactory/repo1/com/totalcross/totalcross-sdk/maven-metadata.xml';

const fileSystem = require(__lib + '/file-system');
const request = require(__lib + '/request');
const terminal = require(__lib + '/terminal');

module.exports = {
    register: async (options) => {
        return request.restRegister(options)
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    },

    login: async (options) => {
        return request.restLogin(options)
        .then((response) => {
            return fileSystem.configJsonSave(response.token, response.key)
            .then((response) => {
                if (response = true) return 'You are logged in'
            })
            .catch((error) => {
                throw error
            })
        }).catch((error) => {
            throw error
        })
    },

    create: async (options) => {
        return fileSystem.configJsonKey()
        .then(async (response) => {
            options.key = response; 

            let path = './' + options.artifactId;
            let package = path + '/src/main/java/' + options.groupId.replace(/\./g, "/");
            await fileSystem.makeDir(path);
            await fileSystem.makeDir(package);
            await fileSystem.makeDir(path + '/src/main/resources');
            await fileSystem.makeDir(path + '/src/test');
            
            await fileSystem.setupFile(__resources + '/pom.xml', path + '/pom.xml', options);
            await fileSystem.setupFile(__resources + '/Sample.java', `${package}/${options.artifactId}.java`, options);
            await fileSystem.setupFile(__resources + '/TestSampleApplication.java',`${package}/Run${options.artifactId}Application.java`, options);    
            
            return 'Project created'
        })
        .catch((error) => {
            throw error
        })
    },

    package: async () => {
        return terminal.run('mvn package')
        .then((response) => {
            setTimeout(async () => {
                token = await fileSystem.configJsonToken()

                request.restHistory({token: token, activity: "package"})
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })
            },5000);

            return response
        })
        .catch((error) => {
            throw error
        })
    },

    deploy: async (options) => {
        return terminal.run(`scp target/install/linux_arm/* ${options.username}@${options.host}:${options.path}`)
        .then((response) => {
            setTimeout(() => {
                token = fileSystem.configJsonToken()

                request.restHistory({token: token, activity: "deploy"})
                .then((response) => {
                    // console.log(response);
                })
                .catch((error) => {
                    // console.log(error);
                })
            },5000);

            return response
        })
        .catch((error) => {
            throw error
        })
    },

    versions: async () => {
        if (await request.mavenMetadataLastUpdated() == await fileSystem.mavenMetadataLastUpdated(__resources + '/maven-metadata.xml')) {
            return await filesystem.mavenMetadataVersions(__resources + '/maven-metadata.xml');
        } else {
            return await request.mavenMetadataVersions();
        }
    },

    latestVersions: async () => {
        let versions;

        if (await request.mavenMetadataLastUpdated() == await fileSystem.mavenMetadataLastUpdated(__resources + '/maven-metadata.xml')) {
            versions = await filesystem.mavenMetadataVersions(__basedir + '/resources/maven-metadata.xml');
        } else {
            versions = await request.mavenMetadataVersions();
        }
        
        let latestVersions = [versions[0]];
        for (let i = 1; i < versions.length; i++) {
            if(versions[i][0] != versions[i-1][0]) latestVersions.push(versions[i])
        }
        
        return latestVersions;
    },

    auth: async () => {
        return fileSystem.configJsonToken()
        .then((response) => {
            return request.restValidate({token: response})
            .then((response) => {
                if (response = true) return 'Authentication success'
            })
            .catch((error) => {
                throw error
            })
        })
        .catch((error) => {
            throw error
        })
    }
}




