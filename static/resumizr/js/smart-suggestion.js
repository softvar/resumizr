function attachPopOvers()
{


// checking if social data exists
if(typeof social_data === 'undefined'){
   social_data = {};
 };

 /* declaring variables for each fiels */
 var facebook_name = '';
 var linkedin_name = '';
 var facebook_email = '';
 var linkedin_email = '';

 
 if(social_data['facebook'])
 {
 	if(social_data['facebook']['first_name'] && social_data['facebook']['last_name'])
	 	facebook_name = social_data['facebook']['first_name'] + ' ' + social_data['facebook']['last_name'];
 
 	if(social_data['facebook']['email'])
 		facebook_email = social_data['facebook']['email'];
 }


if(social_data['linkedin'])
{

	if(social_data['linkedin']['firstName'] && social_data['linkedin']['lastName'])
		linkedin_name = social_data['linkedin']['firstName']+' '+social_data['linkedin']['lastName'];

	if(social_data['linkedin']['emailAddress'])
 		linkedin_email = social_data['linkedin']['emailAddress'];
	
	
}





$('#name').popover('destroy'); 
$("#name").popover({
 	placement : 'auto',
 	title :'Name suggestions',
 	html : true,
 	content : function(){
 		
 		if(facebook_name && linkedin_name)
 		{
 			var names_list = '<ul><li><span class="suggestion-item">'+facebook_name+'</span><span class="provider"><i>    facebook</i></span></li><li><span class="suggestion-item">'+linkedin_name+'</span><span class="provider"><i>    linkedin</i></span></li></ul>';
 			return names_list;
 		}
 		else
 			return 'No sugestions available';
 	}

 });

$('#email').popover('destroy');
 $("#email").popover({
 	
 	placement : 'left',
 	title : 'Email suggestions',
 	html : true,
 	content : function(){
 		
 		if (facebook_email && linkedin_email)
 		{
	 		var emails_list = '<ul><li><span class="suggestion-item">'+facebook_email+'</span><span class="provider"><i>    facebook</i></span></li><li><span class="suggestion-item">'+linkedin_email+'</span><span class="provider"><i>    linkedin</i></span></li></ul>';
	 		return emails_list;
	 	}	
	 	else
	 	{
	 		return 'No sugestions available';	
	 	}
 	}



 });



}



