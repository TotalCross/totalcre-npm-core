const scp = require('scp');
const exec = require('child-process-promise').exec;

module.exports = {
    run: async (command) => {
        return exec(command)
        .then((response) => {
            return response.stdout
        })
        .catch((error) => {
            throw error
        })  
    },

    scp: async (options) => {
        return scp.send(options, (error) => {
            if (error) throw error;
            else return 'File transferred.';
        });
    }
}