const express = require('express')
const speakeasy = require('speakeasy')
const bodyparser = require('body-parser')

const app = express();

const STEP = 60;
const WINDOW = 3;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.post('/totp-secret', (request, response, next) => {
   const secret = speakeasy.generateSecret({ length: 20 });
   response.send({ secret: secret.base32 })
})

app.post('/totp-generate', (request, response, next) => {
   response.send({
      token: speakeasy.totp({
         secret: request.body.secret,
         encoding: 'base32',
         step: STEP, 
         window: WINDOW 
      })
   })
})

app.post('/totp-validate', (request, response, next) => {
   response.send({
      valid: speakeasy.totp.verify({
         secret: request.body.secret,
         encoding: 'base32',
         token: request.body.token,
         step: STEP,
         window: WINDOW
      })
   })
})

app.listen(3000, () => {
   console.log('HTTP server running on port 3000')
})