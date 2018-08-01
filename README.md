## Installation
First you need to have [node.js](https://nodejs.org/en/) installed locally.

- `git clone https://github.com/h1mich/contacts-manager`
- `cd contacts-manager`
- `npm install`
- `npm run server:prod`

After issuing the above commands there should start an http server at `http://localhost:8888`.

## Functionality 
- Authentication (registration / log in / log out / remember me).
- Adding / removing / editing of a contact.
- Filtering / sorting of the contacts.

## NPM scripts
#### Client-related scripts:
- `npm run client:dev:once` - compile the client code into a bundle only once.
- `npm run client:dev:watch` - compile the client code into a bundle and recompile it on change.
- `npm run client:prod` - compile the client code into a bundle in `prod` mode.
- `npm run client:lint` - check all the client code with eslint.
#### Server-related scripts:
- `npm run server:dev:once` - start the server with [debugging](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27) and do not restart the process on change.
- `npm run server:dev:watch` - start the server with [debugging](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27) and do restart the process on change.
- `npm run server:prod` - start the server directly without debugging or restarts on change.
- `npm run server:lint` - check all the server code with eslint.

## Technology stack
- [React](https://reactjs.org/) - client side framework.
- [Redux](https://redux.js.org/) - state management.
- [Radium](https://github.com/FormidableLabs/radium) - for writing styles (after some time I decided to drop Radium coz it's performance leaves much to be desired, but I decided to keep writing inline styles. Why inline styles are by far more superior to the styles in separate files you can read [here](https://speakerdeck.com/vjeux/react-css-in-js)).
- [WebPack](https://webpack.js.org/) - building of the client code.
- [ReactRouter](https://reacttraining.com/react-router/) - URL management.
- [Axios](https://github.com/axios/axios) - making ajax requests.
- [Babel](https://babeljs.io/) - compilation of the client code.
- [Lodash](https://lodash.com/) - utility for working with collections and objects. 
- [moment.js](https://momentjs.com/) - utility for working with dates.
- [Express](http://expressjs.com/) - server side framework.
- [Sketch](https://www.sketchapp.com/) - the main tool for design.
- [HTTPie](https://httpie.org/) - the main testing tool for RestAPI.
- Many other small libraries which don't deserve to be listed here...

Of course I don't treat this stack as the only correct technology stack in the universe. Every project is different and every project has its own needs and history. I can work with any other technologies even if they don't quite match my taste.  