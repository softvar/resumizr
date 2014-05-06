$(document).ready(function(){

// setting styling for P-notification
PNotify.prototype.options.styling = "bootstrap3";

var bar = $('.progress-bar');
var button = $('#refresh');


var providers = ['facebook','github','linkedin'];


function ajaxDataRequest(provider)
{


return $.ajax({

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
           url: "../../users/social-data/"+provider,
         
           data: {},
           success: function(response, status, xhr){
            console.log(response);
            var ct = xhr.getResponseHeader("content-type") || "";
            if (ct.indexOf('text') > -1) {
              new PNotify({
              title: 'Ahrrgg!',
              text: 'Unable to get '+provider+'data',
              animate_speed : 'fast',
              });
            }
            if (ct.indexOf('json') > -1) {
              social_data[provider] = response;
            } 
            
          },

          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            bar.css('background-color','red');
           new PNotify({
            title: 'Connection Error',
            text: 'Unable to get '+provider+'data',
            animate_speed : 'fast',
            });
      }

       }).always(function(){

        bar.animate({
          width : (button.width() / button.parent().width() * 100)+25+'%'
        },1000);  
        });


}





$('#refresh').click(function(){

  bar.css('display','inline-block');
  bar.css('width', '5%');
  bar.css('background-color','#09ab44');

  button.attr('disabled','disabled');
  button.animate({
    'margin-right':'-100px',

},500);

$.when(


// fetching social data

ajaxDataRequest('facebook') , ajaxDataRequest('linkedin') , ajaxDataRequest('github')

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

}).fail(function(){
/* ajax request failed */
bar.animate({
  width : '100%'
},1000);

setTimeout(function(){
    bar.fadeOut();
    button.removeAttr('disabled');
    button.css('margin-right','-2px');
    button.text('request-failed');
    button.css('background-color','red');

},2000);





});



});

});


