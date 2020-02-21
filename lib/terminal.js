const scp = require('scp');

module.exports = {
    run: async (command) => {
        return new Promise((resolve, reject) => {
            let exec = require('child_process').exec;
            exec(command, (error, stdout, stderr) => {
                console.log(error);
                console.log(stdout);
                console.log(stderr);
            })
        });    
    },

    scp: async (options) => {
        scp.send(options, (error) => {
            if (error) console.log(error);
            else console.log('File transferred.');
        });
    }
}