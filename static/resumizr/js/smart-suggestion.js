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


/* array of fields attached with each suggestion */
var complex_fields = {};
complex_fields['workex'] = ['job-description','company-name','job-title','end-date','start-date'];  
complex_fields['education'] = ['education-type','institution-name','education-period' ,'education-description'];
complex_fields['projects'] = ['project-title','project-url','project-start-date','project-end-date','project-description'];

/* fields for which popovers will be defined */
var popoverFields = {};
popoverFields['workex'] = ['job-title','company-name'];  
popoverFields['education'] = ['education-type','institution-name'];
popoverFields['projects'] = ['project-title','project-url'];




/* adding event listeners */

$(document).ready(function(){

/* attaching click event listerners for single suggestion fields */
single_fields.forEach(function(field){

	$("body").on("click", '.'+field+'Suggestion', function(){  
	     $('#'+field).val($(this).children('span:first').text()); // setting value of name input
	     $('#'+field).keyup(); // for calling validation
	});

});

var categories = ['workex','education','projects'];

/* attaching event listeners for categories */
categories.forEach(function(category){

	popoverFields[category].forEach(function(field){


	$("body").on("click", '.'+field+'Suggestion', function(event){  

		/* toggling wysiwyg editor */
		var numWysiEditor = $('.html5-editor-toggle');
		for(var i=0;i<numWysiEditor.length;i++) {
			numWysiEditor[i].click();
		}  
	    
		var provider = $(this).data('provider');
		var key = $(this).data('ref-no');
		
		var target = $(event.target).parents().eq(3).children('.'+field); // target input box
		
		container = target.parents().eq(3); // getting 4th level parent of target element
    	

    	complex_fields[category].forEach(function(sibling){

    		container.find('.'+sibling+':first').val(suggestions[provider+'_'+category][key][sibling]).keyup(); // seting text of sibbling fields in div; keyup called for triggering validation
    	

		});

		// retoggling wysiwyg editors
		for(var i=0;i<numWysiEditor.length;i++) {
			numWysiEditor[i].click();
		}  

	});

});


});






});


/* popover settings for complex segment */



function popoverSettings(category,field)
{
	return {
 	placement : 'bottom',
 	title :field+' suggestions',
 	html : true,
 	trigger : 'focus',
 	content : function(){
 		
 		
 			var list = '';
 			providers.forEach(function(provider)
 			{
 				
 				// if suggestion is availbale from social provider
 				if (suggestions[provider+'_'+category] && (suggestions[provider+'_'+category] != ''))
 				{	
 					//console.log(suggestions[provider+'_workex']);
 					
 					for(key in suggestions[provider+'_'+category])
 					{
 						var suggestion = suggestions[provider+'_'+category][key];
 						
 						if(suggestion[field]!='')
 						{						
 							if((field =='company-name') || category !='workex')
 						 		list+='<li class="'+field+'Suggestion" data-ref-no="'+key.toString()+'" data-provider="'+provider+'">'+suggestion[field]+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';
 						 	else 
 						 		list+='<li class="'+field+'Suggestion" data-ref-no="'+key.toString()+'" data-provider="'+provider+'">'+suggestion[field]+' ('+suggestion['company-name']+')'+'</span><span class="provider"><i>&nbsp;-'+provider+'</i></span></li>';
 						 }

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

	 suggestions['facebook_education'] = [];
	 suggestions['linkedin_education'] = [];

	 suggestions['linkedin_projects'] =[];
	 suggestions['github_projects'] = [];
	 


	 if(social_data['facebook'])
	 {
	 	if(social_data['facebook']['first_name'] && social_data['facebook']['last_name'])
		 	suggestions['facebook_name']= social_data['facebook']['first_name'] + ' ' + social_data['facebook']['last_name'];
	 
	 	if(social_data['facebook']['email'])
	 		suggestions['facebook_email']= social_data['facebook']['email'];

	 	if(social_data['facebook']['location']) {
		 	if(social_data['facebook']['location']['name'])
		 		suggestions['facebook_location']= social_data['facebook']['location']['name'];
	 	}

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
			 		}   	
			 		suggestions['facebook_workex'].push(work_info);	  		
				}
	 	}

	 	if(social_data['facebook']['education'])
		{
				var d = '';
		 		for (var key in social_data['facebook']['education']) {

			 		var education = social_data['facebook']['education'][key];
			 		var education_info = {};
			 		
			 		education_info['education-type'] = education['type'] || '';
			 		education_info['institution-name'] = education['school']['name'] || '';
			 		if('year' in education)
			 			education_info['education-period'] = ' -'+(education['year']['name'] || '');
			 		else
			 			education_info['education-period'] = '';
			 		
			 		education_info['education-description'] = '';
			 		
			 		
				 	suggestions['facebook_education'].push(education_info);
			 		   		  		
				}
				console.log(suggestions['facebook_education']);
	 	}
	 	


	 

	 }


	if(social_data['linkedin'])
	{
		if(social_data['linkedin']['skills'] && (social_data['linkedin']['skills']['_total']>0)) {
			var skillSetArray = [];
			for(var i=0; i<social_data['linkedin']['skills']['_total']; i++) {
				skillSetArray.push(social_data['linkedin']['skills']['values'][i]['skill']['name']);	
			}
			suggestions['linkedin_skills'] = skillSetArray;

        skillsName = skillsName.concat(skillSetArray);
        $('[class^="form-control  tagInputs"]').tagsinput('destroy');
	    $('[class^="form-control  tagInputs"]').tagsinput('input');
        $('[class^="form-control skill-tags tagInputs"]').tagsinput('input').typeahead({
		  local: skillsName
		}).bind('typeahead:selected', $.proxy(function (obj, datum) {  
		  this.tagsinput('add', datum.value);
		  //this.tagsinput('input').typeahead('setQuery', '');
		}, $('[class^="form-control tagInputs"]')));
        autocompleteSocial = true;
		}
		else {
	        skillsName = defaultSkills;
	    }

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

	 	if(social_data['linkedin']['educations'] && (social_data['linkedin']['educations']['_total']>0))
		{

		 		for (var key in social_data['linkedin']['educations']['values']) {

			 		var education = social_data['linkedin']['educations']['values'][key];
			 		var education_info = {};
			 		
			 		education_info['education-type'] = education['degree'] || '';
			 		education_info['institution-name'] = education['schoolName'] || '';

			 		if(('startDate' in education) && ('endDate' in education))
			 			education_info['education-period'] = (education['startDate']['year'] || '') +'-'+(education['endDate']['year'] || '');
			 		
			 		else
			 			education_info['education-period'] = '';

			 		
			 		education_info['education-description'] = education['activities'] || '';
			 		
			 		
			 		
			 		suggestions['linkedin_education'].push(education_info);   		  		
				}
	 	
				console.log(suggestions['linkedin_education']);
	 	} 

	 	if(social_data['linkedin']['projects'] && (social_data['linkedin']['projects']['_total']>0))
	 	{
	 		
	 		for (var key in social_data['linkedin']['projects']['values']) 
	 		{

			 		var projects = social_data['linkedin']['projects']['values'][key];
			 		var projects_info = {};
			 		
			 		projects_info['project-title'] = projects['name'] || '';
			 		projects_info['project-url'] = projects['url'] || '';

			 		projects_info['project-start-date'] = '';
			 		projects_info['project-end-date'] = '';
			 		projects_info['project-description'] = projects['description'] || '';
			 		
			 		suggestions['linkedin_projects'].push(projects_info);   		  		
			}
	 	
				
	 	}
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

		if(social_data['github']['repos'])
		{

			for (var key in social_data['github']['repos']) 
	 		{

			 		var projects = social_data['github']['repos'][key];
			 		
			 		if( projects['fork'] == false)
			 		{					
			 			var projects_info = {};
			 					 		
				 		projects_info['project-title'] = projects['name'] || '';
				 		projects_info['project-url'] = projects['html_url'] || ''; //not url
				 		projects_info['project-description'] = projects['description'] || '';

				 		var start_d = new Date(projects['created_at']);
				 		var end_d = new Date(projects['pushed_at']);

				 		projects_info['project-start-date'] = month[start_d.getMonth()]+', '+start_d.getFullYear();
				 		projects_info['project-end-date'] = month[end_d.getMonth()]+', '+end_d.getFullYear();


				 		
				 		suggestions['github_projects'].push(projects_info);  
			 					 	

			 		}



			}




		}
	}

	window.suggestions = suggestions ; // assigning local data to global variable


	/* attaching popovers to single fields */
	single_fields.forEach(function(field){

		$('#'+field).popover('destroy'); 
		$('#'+field).popover({
	 	placement : 'bottom',
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
	dynamicEducationPopoverBinder();
	dynamicProjectsPopoverBinder();
	

}

function dynamicWorkexPopoverBinder()
{
	/* suggestion for job experience */

	popoverFields['workex'].forEach(function(field){

		$('.'+field).popover('destroy'); 
		$('.'+field).popover(popoverSettings('workex',field));

	});


}

function dynamicEducationPopoverBinder()
{

	/* suggestion for education */

	popoverFields['education'].forEach(function(field){
		$('.'+field).popover('destroy'); 
		$('.'+field).popover(popoverSettings('education',field));

	});



}

function dynamicProjectsPopoverBinder()
{
	
	/* suggestion for projects */

	popoverFields['projects'].forEach(function(field){
		$('.'+field).popover('destroy'); 
		$('.'+field).popover(popoverSettings('projects',field));

	});


}







