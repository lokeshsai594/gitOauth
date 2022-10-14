require('dotenv/config')
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET

const PORT = process.env.PORT || 3000

app.get('/home', (req, res)=>{
    res.send('welcome home')
})

app.get('/login/github', (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&
    redirect_uri=http://localhost:3000/login/github/callback`

    res.redirect(url)
})

async function getAccessToken(code){
   const res = await fetch('https://github.com/login/oauth/access_token',{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id,client_secret,code
        })
    })
    const data = await res.text()
    console.log(data)
    const params = new URLSearchParams(data)
    console.log(params)
    return params.get('access_token')
}


async function getGithubUser(access_token){
    const result = await fetch('https://api.github.com/user',{
        headers:{
            Authorization: `bearer ${access_token}`
        }
    })
    // console.log(result)
    const data = await result.text()
    return data;
}


app.get('/login/github/callback', async (req, res)=>{
    const code = req.query.code;
    const token = await getAccessToken(code)
    const githubData = await getGithubUser(token)
    res.json(githubData);
})

app.listen(PORT, ()=> {
    console.log(`app listening on port ${PORT}`)
})

