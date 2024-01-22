const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();

// Middleware - for now assume it as plugin
// Middleware usually executes line-by-line.

app.use(express.urlencoded({ extended: false}))

app.get('/api/users',(req,res)=>{
    return res.json(users);
})

app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    // Checking if the user with the requested user_id is present in our MOCK_DATA.json.
    if(!user){
        return res.status(404).json({
            "Error": "User with user id "+id+" not found."
        })
    }

    return res.json(user);
})

app.post("/api/users",(req,res)=>{
    // Create new user

    const body = req.body;

    console.log(body);

    users.push({...body, id: users.length+1});           //{...} is known as spread operator opens all the data in the object

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.json({
            'status': 'User created successfully',
            'id': users.length+1
        })
    });

})

app.patch('/api/users/:id',(req,res)=>{
    
    // Update the field in users with id
    
    const id = Number(req.params.id);
    let user = users.find((user) => user.id === id);

    // Checking if the user with the requested user_id is present in our MOCK_DATA.json.
    if(!user){
        return res.status(404).json({
            "message": "User with user id "+id+" not found."
        })
    }
    
    let index = users.indexOf(user);
    
    Object.assign(user, req.body);
    users[index] = user;
    
    // console.log(req.body);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        console.log(user);
        return res.json({
            'status': 'User updated successfully',
            'user' : users[index]
        })
    });
})

app.delete("/api/users/:id",(req,res)=>{
    
    // Delete the user with id
    
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    
    // Checking if the user with the requested user_id is present in our MOCK_DATA.json.
    if(!user){
        return res.status(404).json({
            "Error": "User with user id "+id+" not found."
        })
    }

    const index = users.indexOf(user);
    // Deleting the user at the index
    users.splice(index,1);

    for(let tempID = index; tempID < users.length; tempID++){
        console.log(users[tempID]);
    }

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        console.log(user);
        return res.json({
            'status': 'User deleted successfully'
        })
    });

})


// using .route for requests with common path
/*
    .route("/api/users/:id")
    .get((req,res) => {})
    .put((req,res) => {})
    .delete((req,res) => {})
*/


const PORT = 8000;

app.listen(PORT,()=>console.log('Server started on port',PORT,'...'));

