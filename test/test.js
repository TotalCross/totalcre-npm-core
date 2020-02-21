const core = require('../core'); 

const run = async () => {
    
    // promise usage


    // await/async usage
    await core.login({
        email: 'jeffdododo123@gmail.com', 
        password: '123456'
    });
    await core.create({
        groupId: 'com.totalcross', 
        artifactId: 'HelloWorld', 
        version: '6.0.2', 
        platforms: ['android', 'linux_arm']
    });

    // cd to project dir

    await core.build()
}

// run();

    core.register({
        username: 'Jeff123',
        email: 'jeffdododo123@gmail.com',
        password: '123456',
        firstName: 'Jefferson Do',
        lastName: 'Pianos',
        country: 'KR',
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
        
    });


 core.versions().then((response) => {
     console.log(response);
     
 });