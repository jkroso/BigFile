# Big File

Turn a mapping of modules into a browser suitable package. A build tool then.

## Getting Started

In Node.js 

`npm install bigfile`

## API

```javascript
var BigFile = require('bigfile')
```

## Basic Usage

```javascript
new BigFile()
    .handle(/\.js$/, function (file) {
    	return file
    })
    .include(resolve(__dirname, './src/index.js'))
    .export('A_Global_if_you_wish')
    .render(function(text) {
    	// Put the text where you please
        res.write(text)
    })
```

## Contributing

Please do.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Jakeb Rosoman  
Licensed under the MIT license.
