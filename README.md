# html-diff

A simple tool in Node JS for visually comparing two HTML files and reporting whether any differences were detected.


## Usage

```
new HTMLDiff().diff("baseline/page1.html", "test/page1.html").then(function(output) {
  ...
});
```

Examples of the output are:

```
{ 
  "success": true 
}
```
```
{ 
  "success": false, 
  "snapshot": "output/5757828440.png" 
}
```
