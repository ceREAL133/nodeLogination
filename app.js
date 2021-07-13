const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
let usersList = require('./usersList.json');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({
  defaultLayout: false
}));

app.set('views', path.join(__dirname, 'static'));

app.get('/', (req, res)=>{
    res.redirect('registry')
})

app.get('/registry', (req, res) => {
    res.render('registry');
});

app.post('/registry', async (req, res) => {   
    let jsonStr = JSON.stringify(usersList);
    let {userName, login, password} = req.body;
    let obj = JSON.parse(jsonStr);
    let newObj = {
        login,
        userName,
        password,
        id : JSON.stringify(usersList.length + 1)
    }

    let checkExistedUser = obj.find(data => data.login === newObj.login);
    if(checkExistedUser){
        console.log('user already exist');
        res.redirect('login')
    }else{
        obj.push(newObj);
        fs.writeFile('usersList.json', JSON.stringify(obj, null, 1), err=>{console.log(err)});

        localStorage.setItem('user', JSON.stringify(newObj));
        // console.log(JSON.parse(localStorage.getItem('user')));

        res.redirect('user')
    }

    // console.log(obj);
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async(req, res) => {
    let {login, password} = req.body;
    
    let findedUser = usersList.find(user => user.login === req.body.login);
    
    if (findedUser.login === req.body.login && findedUser.password === req.body.password) {
        console.log('its ok');
        
        localStorage.setItem('user', JSON.stringify(findedUser));
        // console.log(JSON.parse(localStorage.getItem('user')));

        res.redirect('user');
    } else if(findedUser.password !== req.body.password){
        console.log('invalid password');
        res.redirect('login')
    } else{
        console.log('user doesnt exist');
    }
})

app.get('/user', (req, res) => {
    let currentUser = JSON.parse(localStorage.getItem('user'));

    let allUsersStr = JSON.stringify(usersList);
    let allUsers = JSON.parse(allUsersStr);
    res.render('user', {currentUser : currentUser, allUsers : allUsers});
});

app.listen(3000, () => {
  console.log('App listen 3000');
})
