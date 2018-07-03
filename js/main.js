//(function() {
//
//  "use strict";
//
//  var taskItems = document.querySelectorAll(".task");
//
//  for ( var i = 0, len = taskItems.length; i < len; i++ ) {
//    var taskItem = taskItems[i];
//    contextMenuListener(taskItem);
//  }
//
//  function contextMenuListener(el) {
//    el.addEventListener( "contextmenu", function(e) {
//      console.log(e, el);
//    });
//  }
//
//})();//
//this is not yet working for the right click event for the header. 



///////////////////////////////////////////////////////
//this is the window scroll for daily notifications. weather?//
///////////////////////////////////////////////////////
window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}