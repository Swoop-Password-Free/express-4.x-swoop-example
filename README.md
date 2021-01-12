This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users using [Swoop](https://swoopnow.com).  Use
this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone git://github.com/Swoop-Password-Free/express-4.x-swoop-example.git
$ cd express-4.x-swoop-example
$ npm install
```

The example uses environment variables to configure the client id and
client secret needed to access the Swoop API.  Start the server with those
variables set to the appropriate credentials.

```bash
$ SWOOP_CLIENT_ID=__SWOOP_CLIENT_ID__ SWOOP_CLIENT_SECRET=__SWOOP_CLIENT_SECRET__ node server.js
```

Open a web browser and navigate to [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
to see the example in action.


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
