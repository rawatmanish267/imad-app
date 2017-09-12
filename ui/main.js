
//submit username/password to login

var submit=document.getElementById('submit_btn');
submit.onclick=function(){
    //make a request to server and send name
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
          if (request.readyState === XMLHttpRequest.DONE) 
          {
              //Take Some Action
              if (request.status === 200) 
                    { 
                         console.log("user is logged in");
                         alert('user logged in');
                    } else if(request.status===403)
                    {
                        alert('username/password invalid');
                    }else if(request.status===500)
                    {
                        alert('unknown error');
                    }
          } 
    }; 
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open("POST", "http://manishrawat2674.imad.hasura-app.io/login", true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password})); 
    //capture a list of names and render it as a list
   
};