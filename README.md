# html-diff

A simple tool in Node JS for visually comparing two HTML files and reporting whether any differences were detected.


## Usage

```
new HTMLDiff("output").diff("baseline/page1.html", "test/page1.html");
```

Examples of the output are:

```
{ html1: 'baseline/page2.html', html2: 'test/page2.html', success: true }
```
```
{ html1: 'baseline/page1.html', html2: 'test/page1.html', success: false, snapshot: 'output/5757828440.png' }
```