var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var Pool=require('pg').Pool;
var bodyParser=require('body-parser');
var session=require('express-session');
var config={
    user:'manishrawat2674',
    datbase:'manishrawat2674',
    host:'db.imad.hasura-app.io',
    password:process.env.DB_PASSWORD
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
           <p> ${date.toDateString()} </p>
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
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie:{maxAge:1000*60*60*24*30}
}));

var pool=new Pool(config);
app.get('/test-db',function(req,res){
   //make a select request
   //return a response with the result
   pool.query('SELECT * FROM test',function(err,result){
      if(err)
      {
          res.status(500).send(err.toString());
      }
      else
      {
        res.send(JSON.stringify(result.rows));    
      }
   });
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt)
{
 //how do we create a hash    
 var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
 return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');    
}


app.get('/hash/:input',function(req,res){
   var hashedString=hash(req.params.input,'this-is-some-random-string'); 
    res.send(hashedString);
});

var counter=0;
app.get('/counter',function(req, res){
   counter=counter+1;
   res.send(counter.toString());
});
app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
      if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send("user created successfully :"+username);
        }
    });
});

app.post('/login',function(req,res){
   var username=req.body.username;
    var password=req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
      if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
          if(result.rows.length===0)
          {
              res.send(403).send("username/password is invalid");
          }
          else
          {
            var dbString=result.rows[0].password;
            var salt=dbString.split('$')[2];
            var hashedPassword=hash(password,salt);
            if(hashedPassword===dbString)
            {
              req.session.auth={userId:result.rows[0].id};    
              res.send("credentials correct!");
          } 
          else
          {
              res.send(403).send("username/password is invalid");
          }
        }
    }
    });
});

app.get('/check-login',function(req,res){
    if(req.session&&req.session.auth&&req.session.auth.userId)
    {
        res.send('you are logged in'+req.session.auth.userId.toString());
    }
    else
    {
        res.send('you are not logged in!');
    }
});
app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('logged out');
});
var names=[];
app.get('/submit-name',function(req, res){
   //get the name from the request
    var name=req.query.name;
    names.push(name);
    //JSON:JavaScript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName',function(req,res){
    pool.query("SELECT * FROM article WHERE title=$1",[req.params.articleName],function(err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length===0)
            {
                res.status(404).send("article not found");
            }
            else
            {
                var articleData=result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
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
