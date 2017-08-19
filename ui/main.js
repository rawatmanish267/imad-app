// counter code
var button=document.getElementById('counter');
var counter=0;
button.onClick=function(){
  //make a request to counter endpoint
  
  //capture the request and store it in a variable
  
  //render the variable in the span
  counter=counter+1;
  var span=document.getElementById('count');
  span.innerHTML=counter.toString();
};
