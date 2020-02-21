const exec = require('child-process-promise').exec;

module.exports = {
    run: async (command) => {
        return exec(command)
        .then((response) => {
            return response.stdout
        })
        .catch((error) => {
            if (error.stdout) throw error.stdout
            if (error.stderr) throw error.stderr
        })  
    }
}