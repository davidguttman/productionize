# productionize
[![NPM](https://nodei.co/npm/productionize.png)](https://nodei.co/npm/productionize/)

Does a few simple things like overriding console.log and console.error to use for JSON logging [bunyan](https://github.com/trentm/node-bunyan).

tl;dr: ~20 lines used in a bunch of production apps.

## Usage ##

```js

// at the very top of your app's entry:
require('productionize')('your-app-name-for-logging')

```

## License ##

MIT
