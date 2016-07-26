[![Build Status](https://travis-ci.org/jameslong/topsecret.svg?branch=master)](https://travis-ci.org/jameslong/topsecret)

# topsecret

[Top Secret](https://playtopsecret.com) is a video game about the Snowden leaks played by email. This repo contains the game server, content editor, and browser/desktop clients. Stay up to date about the game via the [blog](https://playtopsecret.com/blog.html), [forum](http://forum.playtopsecret.com), and [Twitter account](https://twitter.com/jamestyro).

![Top Secret Offline Version](/img/gamescreenshot.png?raw=true)
*You can play by email or offline using the desktop app.*

![Top Secret Editor](/img/editorscreenshot.png?raw=true)
*The visual editor to create game content.*

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

1. Run the following in the *server* directory: `node build/server/src/main.js`

### Editor

1. Run the server (see above)
2. Open *editor/build/index.html*

### Browser

1. Run the server (see above)
2. Open *browser/build/index.html*

### Desktop app

1. See *app/packaged_apps* for for the platform specific packages

##Contact

If you have any queries about the game or the tech, please email <james@playtopsecret.com>.
