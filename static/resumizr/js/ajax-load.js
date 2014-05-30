$(document).ready(function(){



var bar = $('.progress-bar');
var button = $('#refresh');

// toaster notification options
toastr.options = {
  "closeButton": true,
  "debug": false,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}



var providers = ['facebook','github','linkedin'];


function ajaxDataRequest(provider,force)
{

if(force == true)
  url = '../../../users/refresh-social-data/';
else
  url = '../../../users/social-data/';


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
           url: url+provider,
         
           data: {},
           success: function(response, status, xhr){
            console.log(response);
            var ct = xhr.getResponseHeader("content-type") || "";
            if (ct.indexOf('text') > -1) {
              toastr.warning('Unable to get '+provider+'data','Ahrrgg!');
            }
            if (ct.indexOf('json') > -1) {
              social_data[provider] = response;
            } 
            
          },

          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            bar.css('background-color','red');
            toastr.options['positionClass'] = 'toast-top-right';
           toastr.error('Unable to connect to Server', 'Error fetching '+provider+' data');
      }

       }).always(function(){

        bar.animate({
          width : (button.width() / button.parent().width() * 100)+25+'%'
        },1000);  
        });


}



function loadSocialData(force) {

  bar.css('display','inline-block');
  bar.css('width', '5%');
  bar.css('background-color','#09ab44');

  button.attr('disabled','disabled');
  button.animate({
    'margin-right':'-100px',

  },500);

  $.when(
    // fetching social data
    ajaxDataRequest('facebook',force) , ajaxDataRequest('linkedin',force) , ajaxDataRequest('github',force)
  ).then(function(){

  bar.animate({
    width : '100%'
  },1000);

  setTimeout(function(){
      bar.fadeOut();
      button.removeAttr('disabled');
      button.css('margin-right','-2px');
      toastr.options['positionClass'] = 'toast-top-full-width';
      toastr.success('Remote data loaded successfully ', 'Success');



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
}

// Call the function onload
loadSocialData();

// Call the refreshing social data on button click
  $('#refresh').click(function(){
    loadSocialData(true);
  });

});


