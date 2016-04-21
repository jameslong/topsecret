[![Build Status](https://travis-ci.org/jameslong/topsecret.svg?branch=master)](https://travis-ci.org/jameslong/topsecret)

# topsecret

[Top Secret](https://playtopsecret.com) is a video game about the Snowden leaks played by email. This repo contains the open-source server, client-side, and editor code for the game. Stay up to date about the game via the [blog](https://playtopsecret.com/blog.html), [forum](http://forum.playtopsecret.com), and [Twitter account](https://twitter.com/jamestyro).

## Dependencies

- [Node.js](https://nodejs.org/en/) v4.3.1 or above
- [Grunt CLI](http://gruntjs.com/) v0.1.13 or above

## Installing

```
npm install
```

##Building

```
grunt
```

##Usage

### Server

1. Copy the `server/example_credentials` directory and paste as `server/credentials` (this only needs to be done once)
2. Run the following in the *server* directory: `node build/server/src/app/main.js`

### Editor

1. Run the server (see above)
2. Open *editor/index.html*

### Client

1. Run the server (see above)
2. Open *client/index.html*

##Contact

If you have any queries about the game or the tech, please email <james@playtopsecret.com>.
