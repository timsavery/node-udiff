var os = require('os');
var fs = require('fs');

exports.parseFromText = function(diffText, callback) {
  // each match indicates a separate file in the diff
  var fileMatch;
  var fileIndicies = [];
  var fileEx = new RegExp('(\\w+: [\\w\\.\\/]+' + os.EOL + '=+)', 'g');
  while ((fileMatch = fileEx.exec(diffText))) {
    fileIndicies.push(fileMatch.index);
  }

  // pull out each file diff
  var fileDiffs = [];
  for (var i = 0; i < fileIndicies.length; i++) {
    if (i + 1 < fileIndicies.length) {
      fileDiffs.push(diffText.substring(fileIndicies[i], fileIndicies[i+1]));
    } else {
      fileDiffs.push(diffText.substring(fileIndicies[i]));
    }
  }

  var diffs = {};
  fileDiffs.forEach(function(fileDiffText) {    
    // pick out the file name
    var firstLine = fileDiffText.split(os.EOL)[0]
      , filePath = firstLine.substring(firstLine.indexOf(':')+1, firstLine.length).trim();

    // pick out all the hunk markers
    var hunkIndicies = [], hunkEx = /@@/gi, hunkMatch;
    while ((hunkMatch = hunkEx.exec(fileDiffText))) {
      hunkIndicies.push(hunkMatch.index);
    }

    // sanity check :: hunk markers come in pairs
    if ((hunkIndicies.length % 2) != 0) {
      callback(new Error('Sanity check failed: Hunk markers should come in pairs.'));
    }

    // parse out hunk properties
    var hunks = []
      , hunkMarkerLength = 2;

    for (var i = 0; i+hunkMarkerLength <= hunkIndicies.length; i+=hunkMarkerLength) {
      var startIdx = hunkIndicies[i]+hunkMarkerLength
        , endIdx = hunkIndicies[i+1]
        , hunkPropsParts = fileDiffText.substring(startIdx, endIdx).trim().split(' ');

      var hunkContent = (endIdx < hunkIndicies.length-1) 
        ? fileDiffText.substring(endIdx+hunkMarkerLength, hunkIndicies[endIdx+1]) 
        : fileDiffText.substring(endIdx+hunkMarkerLength);

      var oldFilePropsParts = hunkPropsParts[0].split(',')
        , newFilePropsParts = hunkPropsParts[1].split(',');

      var hunkLines = hunkContent.split(os.EOL)
        , filteredHunkLines = [];

      hunkLines.forEach(function(line) {
        if (line.length > 0 && line[0] != '\\') { // no blank empty lines or end of file marker
          filteredHunkLines.push({
            action: line[0].trim(),
            text: line.substring(1).trim()
          });
        }
      });

      hunks.push({
        old: {
          from: parseInt(oldFilePropsParts[0].substring(1)),
          numLines: parseInt(oldFilePropsParts[1])
        },
        new: {
          from: parseInt(newFilePropsParts[0].substring(1)),
          numLines: parseInt(newFilePropsParts[1])
        },
        lines: filteredHunkLines
      });

      diffs[filePath] = { 
        hunks: hunks
      };
    }   
  }); 

  callback(null, diffs);
};

exports.parseFromFile = function(diffFile, callback) {
  fs.exists(diffFile, function (exists) {
    if (!exists) {
      return callback('No diff file located at ' + diffFile);
    }
    
    fs.readFile(diffFile, 'utf-8', function(err, contents) {
      exports.parseFromText(contents, callback);
    });
  });
};