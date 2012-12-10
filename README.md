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
	// tell big file what to do with javascript files. In this case nothing
    .handle(/\.js$/, function (file) {
    	return file
    })
    // give it a file to include in the build. It dependencies will be traced
    .include(resolve(__dirname, './src/index.js'))
    // If you want to use the product of your main file from the global namespace
    .export('A_Global_if_you_wish')
    // When done with config call enter to have your bigfile made
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
