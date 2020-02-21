const core = require('../core'); 


// Register
// core.register({
//     username: 'Jeff123',
//     email: 'jeffdododo1234@gmail.com',
//     password: '123456',
//     firstName: 'Jefferson Do',
//     lastName: 'Pianos',
//     country: 'KR',
// }).then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// });


// Login
// core.login({
//     email: 'jeffdododo1234@gmail.com', 
//     password: '123456'
// })
// .then((response) => {
//     console.log(response);
// })
// .catch((error) => {
//     console.log(error);
// })

// Create
// core.auth()
// .then(() => {
//     core.create({
//         groupId: 'com.totalcross', 
//         artifactId: 'HelloWorld', 
//         version: '6.0.2', 
//         platforms: ['-android', '-linux_arm']
//     })
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.log(error);
//     })
// })
// .catch((error) => {
//     console.log(error);
// })


// /// Build (package)
// core.auth()
// .then(() => {
//     core.package()
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.log(error);
//     })
// })
// .catch((error) => {
//     console.log(error);
// })


core.package()
.then((response) => {
    console.log(response);
})
.catch((error) => {
    console.log(error);
})

// core.deploy({username: 'allan', host: '127.0.0.1', path: '~/'})
// .then((response) => {
//     console.log(response);
// })
// .catch((error) => {
//     console.log(error);
// })