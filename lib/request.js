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
            return [response[0],response[1],response[2],response[3],response[4]];
        })
        .catch((error) => {
            throw error;
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
            throw error;
        })
    },
    
    restLogin: async (credentials) => {
        return request({
            method: 'POST',
            uri: __rest + '/login',
            body:{
                "email": credentials.email,
                "password": credentials.password
            },
            json: true
        })
        .then((response) => {
            return {token: response.accessToken, key: response.totalcrossKey}
        })
        .catch((error) => {
            throw error;
        })
    },
    
    restRegister: async (credentials) => {
        console.log(credentials);
        
        return request({
            method: 'POST',
            uri: __rest + '/register',
            body:{
                "userName": credentials.username,
                "email": credentials.email,
                "password": credentials.password,
                "firstName": credentials.firstName,
                "lastName": credentials.lastName,
                "country": credentials.country,
            },
            json: true
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;  
        })
    },
    
    restValidateToken: async (token) => {        
        return request({
            method: 'GET',
            uri: __rest + '/validate-token',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            resolveWithFullResponse: true
        })
        .then((response) => {
            if(response.statusCode == 200) return true;
        })
        .catch(() => {
            return false;
        })
    }
}