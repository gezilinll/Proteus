// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = '2fc9877432c55cb75217';
const clientSecret = '0f0a423c36a29863d9bca2bf949b6c9c0919a0d6';

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

const oauth = async (ctx: any) => {
    const requestToken = ctx.request.query.code;
    console.log('authorization code:', requestToken);

    const tokenResponse = await axios({
        method: 'post',
        url:
            'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json',
        },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`access token: ${accessToken}`);

    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`,
        },
    });
    console.log(result.data);
    const name = result.data.name;

    ctx.response.redirect(`http://localhost:5173/index.html?social=github&id=${result.data.id}`);
};

app.use(route.get('/oauth/redirect', oauth));

app.listen(8080);
