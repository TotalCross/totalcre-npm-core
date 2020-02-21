#!/usr/bin/env node
global.__lib = __dirname + '/lib';
global.__rest = 'https://us-central1-totalcross-user-area.cloudfunctions.net/app/api/v1';
global.__resources = __dirname + '/resources'
global.__mavenMetadata = 'https://maven.totalcross.com/artifactory/repo1/com/totalcross/totalcross-sdk/maven-metadata.xml';

const fileSystem = require(__lib + '/file-system');
const request = require(__lib + '/request');
const terminal = require(__lib + '/terminal');

module.exports = {
    register: async (credentials) => {
        return request.restRegister(credentials)
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    },

    login: async (credentials) => {
        return request.restLogin(credentials)
        .then((response) => {
            return fileSystem.configJsonSave(response.token, response.key)
            .then((response) => {
                return response
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

    build: async () => {
        return terminal.run('mvn package')
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    },

    deploy: async (options) => {
        return terminal.scp({
            file: 'target/install/linux_arm/*',
            user: options.username,
            host: options.host,
            port: '22',
            path: options.path
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    },

    versions: async () => {
        if (await request.mavenMetadataLastUpdated() == await fileSystem.mavenMetadataLastUpdated(__resources + '/maven-metadata.xml')) {
            return await filesystem.mavenMetadataVersions(__basedir + '/resources/maven-metadata.xml');
        } else {
            return await request.mavenMetadataVersions();
        }
    },

    auth: async () => {
        return fileSystem.configJsonToken()
        .then((response) => {
            return request.restValidateToken(response)
            .then((response) => {
                return `Auth is ${response}`
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




