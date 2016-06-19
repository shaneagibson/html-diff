var BlinkDiff = require('blink-diff');
var fs = require("fs");
var path = require("path");
var webshot = require('webshot');

function HTMLDiff(outputDir, options) {
    if (!outputDir) outputDir = "output";
    if (!options) options = {};
    this._tempDir = (options.tempDir || "tmp");
    this._outputDir = outputDir;
}

HTMLDiff.prototype = {

    diff: function(html1, html2) {

        if (html1 == html2) throw new Error("HTML Pages must be different");

        var self = this;

        var imageFile = function(htmlFile) { return self._tempDir+"/"+path.dirname(htmlFile)+"/"+path.basename(htmlFile, path.extname(htmlFile))+".png"; };

        var saveHTMLAsImage = function(htmlFile) {
            return new Promise(function(resolve, reject) {
                var html = fs.readFileSync(htmlFile, "utf8");
                var captureOptions = {
                    shotSize: { width: 'all' , height: 'all' },
                    siteType: 'html'
                };
                console.log("Capturing "+htmlFile+" as image");
                webshot(html, imageFile(htmlFile), captureOptions, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(imageFile);
                    }
                });
            });

        };

        var compareImages = function() {
            var image1 = imageFile(html1);
            var image2 = imageFile(html2);
            var random = Math.floor(Math.random() * (9999999999-1000000000)) + 1000000000 + 1;
            var outputImage = self._outputDir+"/"+random+".png";
            var diff = new BlinkDiff({
                imageAPath: image1,
                imageBPath: image2,
                thresholdType: BlinkDiff.THRESHOLD_PERCENT,
                threshold: 0.00000001,
                imageOutputPath: outputImage
            });
            return new Promise(function (resolve, reject) {
                console.log("Comparing "+image1+" with "+image2);
                diff.run(function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        var isDifferent = result.code === BlinkDiff.RESULT_DIFFERENT;
                        var outcome = { html1: html1, html2: html2, success: !isDifferent };
                        if (!isDifferent) {
                            fs.unlink(outputImage);
                        } else {
                            outcome.snapshot = outputImage;
                        }
                        resolve(outcome);
                    }
                });
            });

        };

        var renderHTMLPagesAsImages = function() {
            return Promise.all([ saveHTMLAsImage(html1), saveHTMLAsImage(html2) ]);
        };

        return self._clean()
          .then(renderHTMLPagesAsImages)
          .then(compareImages)
          .then(console.log)
          .catch(console.log);

    },

    _clean: function() {
        var self = this;
        return deleteDirectory(this._outputDir)
          .then(function() { return deleteDirectory(self._tempDir); })
          .then(function() { return createDirectory(self._outputDir); })
          .then(function() { return createDirectory(self._tempDir); });
    }

};

function createDirectory(directory) {
    console.log("Creating "+directory);
    var endsWith = function(string, suffix) { return string.match(suffix+"$") == suffix; };
    if (!endsWith(directory, "/")) directory = directory + "/";
    var dirs = directory.split('/');
    var prevDir = dirs.splice(0,1)+"/";
    while (dirs.length > 0) {
        var curDir = prevDir + dirs.splice(0,1);
        if (!fileExists(curDir)) {
            fs.mkdirSync(curDir);
        }
        prevDir = curDir + '/';
    }
}

function deleteDirectory(directory) {
    return new Promise(function(resolve) {
        console.log("Deleting "+directory);
        fs.unlink(directory, resolve);
    });
}

function fileExists(file) {
    try {
        fs.statSync(file);
        return true;
    } catch(e) {
        return false;
    }
}

module.exports = HTMLDiff;