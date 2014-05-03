$(document).ready(function(){

// setting styling for P-notification
PNotify.prototype.options.styling = "bootstrap3";

var bar = $('.progress-bar');
var button = $('#refresh');





$('#refresh').click(function(){

  bar.css('display','inline-block');
  bar.css('width', '5%');

  button.attr('disabled','disabled');
  button.animate({
    'margin-right':'-100px',

},500);

$.when(

 /* fetching facebook data */ 
$.ajax({

     xhr: function()
    {
      var xhr = new window.XMLHttpRequest();
     //Download progress
     xhr.addEventListener("progress", function(evt){
   /*    if (evt.lengthComputable) {
         var percentComplete = evt.loaded / evt.total;
          bar.css('width', '' + (100 * percentComplete) + '%');
         console.log(percentComplete);
      
       }
    */ 
     }, false);
     return xhr;
   },

   beforeSend: function( xhr ) {
  	},
  	
     type: 'GET',
     url: "../../users/social-data/facebook",
   
     data: {},
     success: function(response, status, xhr){
    	console.log(response);
      var ct = xhr.getResponseHeader("content-type") || "";
      if (ct.indexOf('text') > -1) {
        new PNotify({
        title: 'Ahrrgg!',
        text: 'Unable to get Facebook data',
        animate_speed : 'fast',
        addclass : 'card'
        });
      }
      if (ct.indexOf('json') > -1) {
        social_data['facebook'] = response;
      } 
    	
    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
     new PNotify({
      title: 'Ahrrgg!',
      text: 'Unable to get Facebook data',
      animate_speed : 'fast',
      addclass : 'card'
      });
}

 }).always(function(){

bar.animate({
  width : (button.width() / button.parent().width() * 100)+25+'%'
},1000); 	
}),



/* fetching linkedin data */

$.ajax({

     xhr: function()
    {
      var xhr = new window.XMLHttpRequest();
     //Download progress
     xhr.addEventListener("progress", function(evt){
     /*    if (evt.lengthComputable) {
           var percentComplete = evt.loaded / evt.total;
            bar.css('width', '' + (100 * percentComplete) + '%');
           console.log(percentComplete);
         
       }
    */ 
     }, false);
     return xhr;
   },

   beforeSend: function( xhr ) {
    },
    
     type: 'GET',
     url: "../../users/social-data/linkedin",
   
     data: {},
     success: function(response, status, xhr){
      console.log(response);
      var ct = xhr.getResponseHeader("content-type") || "";
      if (ct.indexOf('text') > -1) {
        new PNotify({
        title: 'Ahrrgg!',
        text: 'Unable to get Linkedin data',
        animate_speed : 'fast',
        addclass : 'card'
        });
      }
      if (ct.indexOf('json') > -1) {
        social_data['linkedin'] = response;
      } 

      
      
    },

     error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert('linkedin...');
            new PNotify({
            title: 'Ahrrgg!',
            text: 'Unable to get Linkedin data',
            animate_speed : 'fast',
            addclass : 'card'
            });
    }

 }).always(function(){

bar.animate({
  width : (button.width() / button.parent().width() * 100)+25+'%'
},1000);  
}),


/* github data */

$.ajax({

     xhr: function()
    {
      var xhr = new window.XMLHttpRequest();
     //Download progress
     xhr.addEventListener("progress", function(evt){
   /*    if (evt.lengthComputable) {
         var percentComplete = evt.loaded / evt.total;
          bar.css('width', '' + (100 * percentComplete) + '%');
         console.log(percentComplete);
      
       }
    */  
     }, false);
     return xhr;
   },

   beforeSend: function( xhr ) {
    },
    
     type: 'GET',
     url: "../../users/social-data/github",
   
     data: {},
     success: function(response, status, xhr){
      console.log(response);
      var ct = xhr.getResponseHeader("content-type") || "";
      
      if (ct.indexOf('text') > -1) {
        new PNotify({
        title: 'Ahrrgg!',
        text: 'Unable to get Github data',
        animate_speed : 'fast',
        addclass : 'card'
        });
      }
      else if (ct.indexOf('json') > -1) {
        social_data['github'] = response;

      } 
      
      
    },
     error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        new PNotify({
        title: 'Ahrrgg!',
        text: 'Unable to get Github data',
        animate_speed : 'fast',
        addclass : 'card'
        });
}

 }).always(function(){

bar.animate({
  width : (button.width() / button.parent().width() * 100)+25+'%'
},1000);  
})

).then(function(){

bar.animate({
  width : '100%'
},1000);

setTimeout(function(){
    bar.fadeOut();
    button.removeAttr('disabled');
     button.css('margin-right','-2px');

},2000);


// attaching suggestion popovers
attachPopOvers();

});



});

});


