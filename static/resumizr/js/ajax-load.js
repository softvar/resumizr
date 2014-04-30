$(document).ready(function(){

var bar = $('.progress-bar');
var button = $('#refresh');


$('#refresh').click(function(){
$.ajax({

     xhr: function()
    {
      var xhr = new window.XMLHttpRequest();
      //Upload progress
      xhr.upload.addEventListener("progress", function(evt){
      	console.log(evt);
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          //Do something with upload progress
         console.log(percentComplete);
       }
     }, false);


     //Download progress
     xhr.addEventListener("progress", function(evt){
       if (evt.lengthComputable) {
         var percentComplete = evt.loaded / evt.total;
          bar.css('width', '' + (100 * percentComplete) + '%');
         console.log(percentComplete);
       }
     }, false);
     return xhr;
   },

   beforeSend: function( xhr ) {
    bar.width('0%');
    bar.show();
  	},
  	dataType:'json',
     type: 'GET',
     url: "../../users/refresh-social-data/facebook",
   
     data: {},
     success: function(data){
    	console.log(data);
    	
    }
 }).done(function(){

 	setTimeout(function(){
 		bar.fadeOut();
    },1000);

	
 });

});

});


