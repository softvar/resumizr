// adding event listeners

$(document).ready(function(){

// event listener for name suggestion
$("body").on("click", ".nameSuggestion", function(){  
     $('#name').val($(this).children('span:first').text()); // setting value of name input
  
});

// event listener for email suggestion
$("body").on("click", ".emailSuggestion", function(){  
     $('#email').val($(this).children('span:first').text()); // setting value of email input
  
});



});





function attachPopOvers()
{


// checking if social data exists
if(typeof social_data === 'undefined'){
   social_data = {};
 };

// list of providers
var providers = ['facebook','linkedin','github'];

 /* declaring suggestions for each fiels */

 var suggestions = {};

 suggestions['facebook_name'] = '';
 suggestions['linkedin_name'] = '';
 suggestions['facebook_email'] = '';
 suggestions['linkedin_email'] = '';

 


 if(social_data['facebook'])
 {
 	if(social_data['facebook']['first_name'] && social_data['facebook']['last_name'])
	 	suggestions['facebook_name']= social_data['facebook']['first_name'] + ' ' + social_data['facebook']['last_name'];
 
 	if(social_data['facebook']['email'])
 		suggestions['facebook_email']= social_data['facebook']['email'];
 }


if(social_data['linkedin'])
{

	if(social_data['linkedin']['firstName'] && social_data['linkedin']['lastName'])
		suggestions['linkedin_name'] = social_data['linkedin']['firstName']+' '+social_data['linkedin']['lastName'];

	if(social_data['linkedin']['emailAddress'])
 		suggestions['linkedin_email'] = social_data['linkedin']['emailAddress'];
	
	
}




// name suggestions
$('#name').popover('destroy'); 
$("#name").popover({
 	placement : 'bottom',
 	title :'Name suggestions',
 	html : true,
 	trigger : 'focus',
 	content : function(){
 		
 		
 			var names_list = ''
 			providers.forEach(function(provider)
 			{
 				
 				// if suggestion is availbale from social provider
 				if (suggestions[provider+'_name'])
 				{	
 					names_list+='<li class="nameSuggestion"><span class="suggestion-item">'+suggestions[provider+'_name']+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';

 				}

 			});
 		if(names_list != '')
 		{
 			names_list='<ul class="suggestion-list">'+names_list+'</ul>';
 			return names_list;
 		}
 		else
 			return 'No sugestions available';
 	}

 });


// email suggestions
$('#email').popover('destroy');
 $("#email").popover({
 	placement : 'left',
 	title : 'Email suggestions',
 	html : true,
 	trigger : 'focus',
 	content : function(){
 		
 		
 			var email_list = '';
 			providers.forEach(function(provider)
 			{
 				// if suggestion is availbale from social provider
 				
 				if (suggestions[provider+'_email'])
 				{	
 					email_list+='<li class="emailSuggestion"><span class="suggestion-item">'+suggestions[provider+'_email']+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';

 				}

 			});
 		if(email_list != '')
 		{
 			email_list='<ul class="suggestion-list">'+email_list+'</ul>';
 			return email_list;
 		}
 		else
 			return 'No sugestions available';
 	}



 });



}







