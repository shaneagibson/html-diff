var HTMLDiff = require('./index.js');

var options = {
    tempDir: "tmp"
};

var htmlDiff = new HTMLDiff("output", options);

htmlDiff.diff("baseline/page1.html", "test/page1.html");