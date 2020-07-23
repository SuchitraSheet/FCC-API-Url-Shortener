//import $ from "jquery";
function UrlVerify() {
  /*
  $("#input").submit(function(e) {
      e.preventDefault();
    });
  */
  const text = document.getElementById("url_input").value;
  var regex = /^((https|ftp|smtp):\/\/)(www.)[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
  var flag = regex.test(text);
  if(flag == true){
      document.getElementById("input").action = "https://api--fcc.glitch.me/new/"+text;
  }
  else{
    if(text.length > 0)
    {
      $("#check").append("Incorrect url!");
    }
  }
}
