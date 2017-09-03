var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var articles={
 'article-one':{
  title:'Article one | rawatji',  
  heading:'Article One',
  date:'Aug 5,2017',
  content:  `<p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
         
        
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>`
},
  'article-two':{title:'Article two | rawatji',  
  heading:'Article Two',
  date:'Aug 6,2017',
  content:  `<p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
         
        
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>`},
   'article-three':{title:'Article Three | rawatji',  
  heading:'Article Three',
  date:'Aug 7,2017',
  content:  `<p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
         
        
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>
            <p>
               This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
                This is new paragraph.This is text is amazing.   This is new paragraph.This is text is amazing.  
            </p>`}        
};

function createTemplate(data){
var title=data.title;
var heading=data.heading;
var date=data.date;
var content=data.content;
var htmlTemplate=`
         <!DOCTYPE html>
    <html>
        <head>
            <title> ${title}
                </title>
            <meta name="viewport" content="width_device-width,initial-scale=1">
            <link href="/ui/style.css" rel="stylesheet">
            </head>
    <body>
           <div class="container">
        <a href="/"> Home </a>
        <hr/>
        <h1>
            ${heading} 
        </h1>    
        <div>
           <p> ${date} </p>
        </div>
            <div>
               ${content}
             </div>
    </body>
    </html>
    `;
return htmlTemplate;
}
var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt)
{
 //how do we create a hash    
 var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
 return hashed.toString('hex');    
}

app.get('/hash/input',function(req,res){
   var hashedString=hash(req.params.input,'this-is-some-random-string'); 
    res.send(hashedString);
});

var counter=0;
app.get('/counter',function(req, res){
   counter=counter+1;
   res.send(counter.toString());
});

var names=[];
app.get('/submit-name',function(req, res){
   //get the name from the request
    var name=req.query.name;
    names.push(name);
    //JSON:JavaScript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/:articleName',function(req,res){
    var articleName=req.params.articleName;
   res.send(createTemplate(articles[articleName])); 
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function(req, res){
    res.sendFile(path.join(__dirname,'ui', 'main.js'));
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
