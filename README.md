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
