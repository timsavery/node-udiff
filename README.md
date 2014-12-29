## node-udiff

### Installation
`npm install udiff`

### Usage
```javascript
var udiff = require('udiff');

udiff.parseFromFile('./test/sample.diff', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log(JSON.stringify(result, null, 2));
});
```

### License
```text
            DO WHATEVER THE FUCK YOU WANT, PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

            0. You just DO WHATEVER THE FUCK YOU WANT.
```
