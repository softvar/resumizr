/* gloabl suggestions object */
suggestions = {};

/* months in string format */
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


/* list of providers */
var providers = ['facebook','linkedin','github'];

var single_fields = ['name','email','website','location'];

var workex_fields = ['job-description','company-name','job-title','end-date','start-date'];  // array of fields attached with each suggestion

var workex_popoverFields = ['job-title','company-name'];  // fields for which popovers will be defined





/* adding event listeners */

$(document).ready(function(){

/* attaching click event listerners for single suggestion fields */
single_fields.forEach(function(field){

	$("body").on("click", '.'+field+'Suggestion', function(){  
	     $('#'+field).val($(this).children('span:first').text()); // setting value of name input
	});

});

/* attaching click event listerner for workex suggestion fields */
workex_popoverFields.forEach(function(field){

	$("body").on("click", '.'+field+'Suggestion', function(event){  
	     
		var provider = $(this).data('provider');
		var key = $(this).data('ref-no');
		
		var target = $(event.target).parents().eq(3).children('.'+field); // target input box
		
		container = target.parents().eq(3); // getting 4th level parent of target element
    	

    	workex_fields.forEach(function(sibling){

    		container.find('.'+sibling+':first').val(suggestions[provider+'_workex'][key][sibling]); // seting text of sibbling fields in div
    	});
   

	});

});



});


/* popover settings for work expeirence segment */
function workex_popoverSettings(field) {
return {
 	placement : 'auto',
 	title :field+' suggestions',
 	html : true,
 	trigger : 'focus',
 	content : function(){
 		
 		
 			var list = '';
 			providers.forEach(function(provider)
 			{
 				
 				// if suggestion is availbale from social provider
 				if (suggestions[provider+'_workex'] && (suggestions[provider+'_workex'] != ''))
 				{	
 					//console.log(suggestions[provider+'_workex']);
 					
 					for(key in suggestions[provider+'_workex'])
 					{
 						var suggestion = suggestions[provider+'_workex'][key];
 						//console.log('suggestion: '+suggestions[provider+'_workex'][key]['job-title']);
 						//console.log('key: '+key);
 						list+='<li class="'+field+'Suggestion" data-ref-no="'+key.toString()+'" data-provider="'+provider+'">'+suggestion[field]+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';
 					}
 					
 				}

 			});

	 		if(list != '')
	 		{
	 			list='<ul class="suggestion-list">'+list+'</ul>';
	 			return list;
	 		}
	 		else
	 			return 'No sugestions available';
 	}

 }
};

function attachPopOvers()
{

	/* checking if social data exists */
	if(typeof social_data === 'undefined'){
	   social_data = {};
	 };



	 /* declaring suggestions for each fiels */

	 var suggestions = {};

	 suggestions['facebook_name'] = '';
	 suggestions['linkedin_name'] = '';
	 suggestions['github_name'] = '';
	 
	 suggestions['facebook_email'] = '';
	 suggestions['linkedin_email'] = '';
	 suggestions['github_email'] = '';
	 
	 suggestions['github_website'] = '';

	 suggestions['facebook_workex'] = [];
	 suggestions['linkedin_workex'] = [];

	 suggestions['facebook_location'] = '';
	 suggestions['github_location'] = '';
	 


	 if(social_data['facebook'])
	 {
	 	if(social_data['facebook']['first_name'] && social_data['facebook']['last_name'])
		 	suggestions['facebook_name']= social_data['facebook']['first_name'] + ' ' + social_data['facebook']['last_name'];
	 
	 	if(social_data['facebook']['email'])
	 		suggestions['facebook_email']= social_data['facebook']['email'];

	 	if(social_data['facebook']['location']['name'])
	 		suggestions['facebook_location']= social_data['facebook']['location']['name'];


		if(social_data['facebook']['work'])
		{
				var d = '';
		 		for (var key in social_data['facebook']['work']) {

			 		var workex = social_data['facebook']['work'][key];
			 		var work_info = {};
			 		
			 		work_info['job-description'] = workex['description'] || '';
			 		work_info['company-name'] = workex['employer']['name'] || '';
			 		work_info['job-title'] = workex['position']['name'] || '';
			 		d = new Date(workex['start_date']);
			 		work_info['start-date'] = month[d.getMonth()]+', '+d.getFullYear();
			 		
			 		if(typeof workex['end_date'] === 'undefined')
			 			work_info['end-date'] = 'present';
			 		else 
			 		{
			 			d = new Date(workex['end_date']);
				 		work_info['end-date'] = month[d.getMonth()]+', '+d.getFullYear();	
				 		suggestions['facebook_workex'].push(work_info);
			 		}   		  		
				}
	 	}
	 	console.log(suggestions['facebook_workex']);


	 

	 }


	if(social_data['linkedin'])
	{

		if(social_data['linkedin']['firstName'] && social_data['linkedin']['lastName'])
			suggestions['linkedin_name'] = social_data['linkedin']['firstName']+' '+social_data['linkedin']['lastName'];

		if(social_data['linkedin']['emailAddress'])
	 		suggestions['linkedin_email'] = social_data['linkedin']['emailAddress'];

	 	if(social_data['linkedin']['positions'] && (social_data['linkedin']['positions']['_total']>0))
		{

		 		for (var key in social_data['linkedin']['positions']['values']) {

			 		var workex = social_data['linkedin']['positions']['values'][key];
			 		var work_info = {};
			 		
			 		work_info['job-description'] = workex['summary'] || '';
			 		work_info['company-name'] = workex['company']['name'] || '';
			 		work_info['job-title'] = workex['title'] || '';
			 		work_info['start-date'] = month[parseInt(workex['startDate']['month'])-1]+', '+workex['startDate']['year'];
			 		
			 		if(workex['isCurrent']==true)
			 			work_info['end-date'] = 'present';

			 		else
			 			work_info['end-date'] = month[parseInt(workex['endDate']['month'])-1]+', '+workex['endDate']['year'];
			 		
			 		suggestions['linkedin_workex'].push(work_info);   		  		
				}
	 	}
	 	console.log(suggestions['linkedin_workex']);
		
		
	}

	if(social_data['github'])
	{
		
		if(social_data['github']['name'])
			suggestions['github_name'] = social_data['github']['name'];

		if(social_data['github']['email'])
			suggestions['github_email'] = social_data['github']['email'];

		if(social_data['github']['blog'])
			suggestions['github_website'] = social_data['github']['blog'];

		if(social_data['github']['location'])
			suggestions['github_location'] = social_data['github']['location'];


	}

	window.suggestions = suggestions ; // assigning local to global vriable


	/* attaching popovers to single fields */
	single_fields.forEach(function(field){

		$('#'+field).popover('destroy'); 
		$('#'+field).popover({
	 	placement : 'auto',
	 	title :field+' suggestions',
	 	html : true,
	 	trigger : 'focus',
	 	content : function(){
	 		
	 		
	 			var list = '';
	 			providers.forEach(function(provider)
	 			{
	 				
	 				// if suggestion is availbale from social provider
	 				if (suggestions[provider+'_'+field] && (suggestions[provider+'_'+field] != ''))
	 				{	
	 					list+='<li class="'+field+'Suggestion"><span class="suggestion-item">'+suggestions[provider+'_'+field]+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';

	 				}

	 			});
	 		if(list != '')
	 		{
	 			list='<ul class="suggestion-list">'+list+'</ul>';
	 			return list;
	 		}
	 		else
	 			return 'No sugestions available';
	 	}

	 });

	});


	
	dynamicWorkexPopoverBinder();
	

}

function dynamicWorkexPopoverBinder()
{
	/* suggestion for job experience */

	workex_popoverFields.forEach(function(field){

		$('.'+field).popover('destroy'); 
		$('.'+field).popover(workex_popoverSettings(field));

	});


}







