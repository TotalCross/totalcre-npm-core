const request = require('request-promise');
const convert = require('xml-js');

module.exports = {
    mavenMetadataVersions: async () => {
        return request({
            method: 'GET',
            uri: __mavenMetadata,
            transform: (response) => {
                return JSON.parse(convert.xml2json(response, {compact: true})).metadata.versioning.versions.version.map((x) => x._text).sort().reverse();
            }
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw {code: error.statusCode, message: error.error.message};
        })
    },
    
    mavenMetadataLastUpdated: async () => {
        return request({
            method: 'HEAD',
            uri: __mavenMetadata,
        })
        .then((response) => {
            let date = response['last-modified'].split(" ");
            let moment = date[4].split(":");
            let months = {
                'Jan' : '01',
                'Feb' : '02',
                'Mar' : '03',
                'Apr' : '04',
                'May' : '05',
                'Jun' : '06',
                'Jul' : '07',
                'Aug' : '08',
                'Sep' : '09',
                'Oct' : '10',
                'Nov' : '11',
                'Dec' : '12'
            }
            return date[3] + months[date[2]] + date[1] + moment[0] + moment[1] + moment[2];
        }).catch((error) => {
            throw {code: error.statusCode, message: error.error.message};
        })
    },

    mavenPluginLastVersion: async () => {
        return request({
            method: 'GET',
            uri: __mavenPlugin,
            transform: (response) => {
                return JSON.parse(convert.xml2json(response, {compact: true})).metadata.versioning.versions.version.map((x) => x._text).sort().reverse();
            }
        })
        .then((response) => {
            return response[0];
        })
        .catch((error) => {
            throw {code: error.statusCode, message: error.error.message};
        })
    },

    restLogin: async (options) => {
        return request({
            method: 'POST',
            uri: __rest + '/login',
            body:{
                "email": options.email,
                "password": options.password
            },
            json: true
        })
        .then((response) => {
            return {token: response.accessToken, key: response.totalcrossKey}
        })
        .catch((error) => {
            throw {code: error.statusCode, message: error.error.message};
        })
    },
    
    restRegister: async (options) => {
        return request({
            method: 'POST',
            uri: __rest + '/register',
            body:{
                "userName": options.username,
                "email": options.email,
                "password": options.password,
                "firstName": options.firstName,
                "lastName": options.lastName,
                "country": options.country,
            },
            json: true
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw {code: error.statusCode, message: error.error.message};  
        })
    },
    
    restValidate: async (options) => {   
        return request({
            method: 'GET',
            uri: __rest + '/validate-token',
            headers: {
                "Authorization": `Bearer ${options.token}`,
            },
            resolveWithFullResponse: true
        })
        .then((response) => {
            if(response.statusCode == 200) return true;
            return false
        })
        .catch((error) => {
            if(response.statusCode == 401 || response.statusCode == 403) throw {code: error.statusCode + ', please, run totalcross login again', message: error.error.message}; 
            throw {code: error.statusCode, message: error.error.message};
        })
    },

    restHistory: async (options) => {
        return request({
            method: 'POST',
            uri: __rest + '/history',
            headers: {
                "Authorization": `Bearer ${options.token}`,
                "Content-Type": "application/json"
            },
            body: {
                "activity": options.activity
            },
            json:true,
            resolveWithFullResponse: true
        })
        .then((response) => {
            if(response.statusCode == 200) return true;
            return false
        })
        .catch((error) => {
            throw {code: error.statusCode, message: error.error.message};
        })
    }
}