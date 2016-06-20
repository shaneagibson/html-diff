# html-diff

A simple tool in Node JS for visually comparing two HTML files and reporting whether any differences were detected.

## Usage
~~~
HTMLDiff(outputDir, options)
~~~

#### Parameters

| Name                     | Description
| ------------------------ | --------------------------------------------------------------------------------------------------
| outputDir                | The directory where snapshot images of differences will be written. Default is "output".
| options.tempDir          | The temporary directory where images used for comparison will be stored. Default is "tmp".

#### Example
```
new HTMLDiff(outputDir, options).diff("baseline/page1.html", "test/page1.html").then(function(output) {
  ...
});
```

#### Example Output
```
{ 
  "match": true 
}
```
```
{ 
  "match": false, 
  "errors": [ 
    {
      "snapshot": "output/5757828440.png"
    }
  ]
}
```
