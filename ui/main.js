// counter code
var button=document.getElementById('counter');

button.onClick=function(){
  //create a request object
  var request= new XMLHttpRequest();
  
  //capture the request and store it in a variable
  request.onreadystatechange=function(){
      if(request.readyState===XMLHttpRequest.DONE)
      {
          if(request.status===200)
          {
              var counter=request.responseText;
              var span=document.getElementById('button');
              span.innerHTML=counter.toString();
          }
      }
  };
  //make a request
  request.open("GET","http://http://manishrawat2674.imad.hasura-app.io/counter",true);
  request.send(null);
  };
