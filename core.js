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
        var response = await request.restRegister(credentials);
        console.log(response);
    },

    login: async (credentials) => {
        var access = await request.restLogin(credentials);
        await fileSystem.configJsonSave(access.token, access.key);
    },

    create: async (options) => {
        if(await request.restValidateToken(await fileSystem.configJsonToken()) == false) {
            console.log("Invalid token, please run:\n\n$ totalcross login\n\nor totalcross --help for more information");
            return -1
        };
        
        options.key = await fileSystem.configJsonKey()
        

        let path = './' + options.artifactId;
        let package = path + '/src/main/java/' + options.groupId.replace(/\./g, "/");
        await fileSystem.makeDir(path);
        await fileSystem.makeDir(package);
        await fileSystem.makeDir(path + '/src/main/resources');
        await fileSystem.makeDir(path + '/src/test');
        
        await fileSystem.setupFile(__resources + '/pom.xml', path + '/pom.xml', options);
        await fileSystem.setupFile(__resources + '/Sample.java', `${package}/${options.artifactId}.java`, options);
        await fileSystem.setupFile(__resources + '/TestSampleApplication.java',`${package}/Run${options.artifactId}Application.java`, options);
    },

    build: async () => {
        if(await request.restValidateToken(await fileSystem.configJsonToken()) == false) {
            console.log("Invalid token, please run:\n\n$ totalcross login\n\nor totalcross --help for more information");
            return -1
        };

        await terminal.run('mvn package');
    },

    deploy: async (options) => {
        if(await request.restValidateToken(await fileSystem.configJsonToken()) == false) {
            console.log("Invalid token, please run:\n\n$ totalcross login\n\nor totalcross --help for more information");
            return -1
        };
        
        await terminal.scp({
            file: 'target/install/linux_arm/*',
            user: options.username,
            host: options.host,
            port: '22',
            path: options.path
        });
    },

    versions: async () => {
        if (await request.mavenMetadataLastUpdated() == await fileSystem.mavenMetadataLastUpdated(__resources + '/maven-metadata.xml')) {
            return await filesystem.mavenMetadataVersions(__basedir + '/resources/maven-metadata.xml');
        } else {
            return await request.mavenMetadataVersions();
        }
    }
}




