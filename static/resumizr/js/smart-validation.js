/* BETA  validation automated routine */

function Validatr(config)
{
	this.config = config;  // storing validation configuration
	this.errors = {};
	this.warnings = {};

}


Validatr.prototype.validate = function() {

	console.log('validating');
	/* returning errors and warnings in global namespace */
	window.Resumizrerrors = this.errors;
	window.Resumizrwarnings = this.warnings;

	for (key in this.config)
	{
		
		/* creating list of errors and warnings */
		if(! (key in this.errors))
			this.errors[key] = [];
		else 
			console.log('unable to created');
		if(! (key in this.warnings))
			this.warnings[key] = [];
		else
			console.log('unable .. warning');

		var selector = ''; // used to select element using jquery selector

		if('id' in this.config[key])
			selector = '#'+this.config[key]['id'];
		else	
			selector = '.'+this.config[key]['class'];

		var that = this; // creating alias of this (Validatr) object


		$(document).on('keyup , blur',selector,(function(key){

			

		return function(event)
		{
			
			selector = event.target; // assigning target of event to selector , to make it function for multiple elements
			name = key;

			if('name' in that.config[key])
				name = that.config[key]['name'];

			/* determining index of the container */
			var container = $(selector).parents().eq(3);
			var children = container.parent().children('div');
			var index = 0;

		    for (var i= 0; i<children.length; i++) {
		        var child= children[i];
		        if (child != container[0])
		            index+=1;
		        else
		        	break;
		    }

		  

		  	that.errors[key][index] = []; // deleting errors
			that.warnings[key][index] = []; // deleting warnings

			/* removing previous errors */
	        $(selector).siblings('.resume-form-error ,.resume-form-warning').remove();

	        $(selector).removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error');
			$(selector).siblings('.status').children('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');


	        if($(selector).val()==='')
			{
				
				var optional = false;
				
				if('optional' in that.config[key])
					optional = that.config[key]['optional'];
								

				if(optional == true)
				{
					if('warnings' in that.config[key])
					{
						if('unavailable' in that.config[key]['warnings'])
							that.warnings[key][index].push(that.config[key]['warnings']['unavailable']);

						else
							that.warnings[key][index].push('consider entering '+name);
					}

					else
						that.warnings[key][index].push('consider entering '+name);
				}

				else
				{

					if('errors' in that.config[key])
					{
						if('unavailable' in that.config[key]['errors'])
							that.errors[key][index].push(that.config[key]['errors']);

						else
							that.errors[key][index].push(name+' field is empty');
					}

					else
						that.errors[key][index].push(name+' field is empty');

					

				}

			}

			else
			{

				if('regex' in that.config[key])
				{

					if( !(new RegExp(that.config[key]['regex']).test($(selector).val())))
					{
							
							if('errors' in that.config[key])
							{
								if('incorrect' in that.config[key]['errors'])
									that.errors[key][index].push(that.config[key]['errors']['incorrect']);
								
								else 
									that.errors[key][index].push('Please provide correct '+name);

							}

							else 
								that.errors[key][index].push('Incorrect value of '+name);							
							
					}

					

				}

				if('custom_validator' in that.config[key] && typeof that.config[key]['custom_validator'] ==='function')
				{

					// calling custom validation function; passing errors and warnings array of target element
					that.config[key]['custom_validator'](selector,that.errors[key][index],that.warnings[key][index])

				}

			}

			//console.log(that.errors);

			/* check for error */
			if(that.errors[key][index].length > 0)
			{
	
				$(selector).addClass('mod-form-error');
				$(selector).siblings('.status').children('.status-icon').addClass('fa-times-circle').css('color','#c40a15');
				
			 		
				var list = '';
				that.errors[key][index].forEach(function(error)
				{
					
					list+='<li class="error">'+error+'</li>';

				});
				if(list != '')
				{
					list='<ul class="resume-form-error">'+list+'</ul>';
					$(selector).before(list);
					
				}

			}

			/* check for warnings */
			else if(that.warnings[key][index].length > 0)
			{
			
				$(selector).addClass('mod-form-warning');
				$(selector).siblings('.status').children('.status-icon').addClass('fa-exclamation-circle').css('color','#b49a00');
				
			 		
				var list = '';
				that.warnings[key][index].forEach(function(warning)
				{
					
					list+='<li class="warning">'+warning+'</li>';

				});
				if(list != '')
				{
					list='<ul class="resume-form-warning">'+list+'</ul>';
					$(selector).before(list);
					
				}

			}

			else {
				
				$(selector).addClass('mod-form-correct');
				$(selector).siblings('.status').children('.status-icon').addClass('fa-check-circle').css('color','#539d00');

			}
		

		}

	})(key));  // end of callback
				
	}

	// validation for tagsinput
	if(! ('skill-tags' in this.errors))
			this.errors['skill-tags'] = [];
	var that = this;

	$(document).on('itemRemoved , itemAdded','.skill-tags',function(){
	
	that.errors['skill-tags'][0] = [];

	var totalSkills = 0;
	var selector = '#6'; // selector for status of skills
	$(selector).find('.resume-form-error ,.resume-form-warning').remove();

	$(selector).find('.status').children('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');


	$( ".skill-tags" ).each(function( index ) {
  		
  		totalSkills+= $(this).tagsinput('items').length;
	});

	if (totalSkills >= 5)
	{
		$(selector).find('.status').children('.status-icon').addClass('fa-check-circle').css('color','#539d00');
		that.errors['skill-tags'][0] = [];
	}

	else
	{
		that.errors['skill-tags'][0].push('Please enter atleast 5 skills');
		$(selector).find('.status').children('.status-icon').addClass('fa-times-circle').css('color','#c40a15');
		list='<ul class="resume-form-error"><li class="error"> Please enter atleast 5 skills </li></ul>';
		$(selector).find('.skill-errors').append(list);
					
	}


	});
}




$(document).ready(function(){


var date_regex = "^((\\d{1,3}(st|th|nd)? )?(Jan|January|Feb|February|Mar|March|Apr|April|May|June|July|Aug|August|Sept|September|Sep|Oct|October|Nov|November|Dec|December),? ?(19|20)\\d{2})|(p|P)resent$";




/* key of this object is used as name of the field. However , it will be identified by either class or id given in object */
var validatr_seed = {

	name : {    

		/* validation settings for name */
		id : 'name',
		regex : "^([a-zA-Z]+ [a-zA-Z]+)$",
		errors : {
			/* for custom error messages */
			incorrect : "Please enter your first name and last name"
		}
	},

	email : {

		id : 'email',
		regex : "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",				
		errors : {
			incorrect : 'Please provide correct email-id'
		}
	},

	website : {
		id : 'website',
		optional : true,
		regex : "((http|https|ftp):\\/\\/)?[\\w-]+\\.[\\w-]+([\\w-\\. \\\\?%&=]*)?",
		errors : {
			incorrect : 'Please provide correct website url'
		}
	},

	location : {

		id : 'location',
		regex : "^[A-Za-z0-9\\-\\,\\. ]+$"
	},

	phone : {

		id : 'phone',
		optional : true ,
		regex : "^(\\+[1-9]{1,3}-)?[0-9]{10}$"
	},

	job_title : {
		name : 'job title',
		class : 'job-title',
		custom_validator : function(selector,errors,warnings){

			if( !(new RegExp("^[a-zA-Z0-9\\-, ]+$").test($(selector).val())))
					errors.push('This doesn\'t look like valid job title  ');							
							
			else {
				
				if ($(selector).val().split(' ').length > 3) {
					warnings.push('This job title seems too long! Double check !!');
				}

			}

		}
	},

	company_name : {
		name : 'company name',
		class : 'company-name',
		regex : "^[a-zA-Z\\-, \\w\\.\\(\\)]+$"
	},

	start_date : {
		name : 'start date',
		class : 'start-date',
		regex : date_regex,
		errors : {
			'incorrect' : 'Please enter date in format : 14th May,2014.\n Day is optional. Or enter present'
		}
	},

	end_date : {
		name : 'end date',
		class : 'end-date',
		regex : date_regex,
		errors : {
			'incorrect' : 'Please enter date in format : 14th May,2014. \n Day is optional. or enter present'
		}
	},

	education_type : {
		name : 'education type',
		class : 'education-type',
		regex : "^[a-zA-Z\\.\\- \\(\\)]+$",
		errors : {
			'incorrect' : 'Please enter valid education type. Ex High School or B.Tech'
		}

	},

	institution_name : {
		name : 'institution name',
		class : 'institution-name',
		regex : "^[a-zA-Z\\.\\- \\(\\)]+$",
		errors : {
			'incorrect' : 'Please enter valid institution name'
		}
	},

	education_period : {
		name : 'education period',
		class : 'education-period',
		regex : "^(19|20)\\d{2}\\-(19|20)\\d{2}",
		errors : {
			'incorrect' : 'Please enter period in correct format. \n For example 1992-2009'
		}
	},

	project_title : {
		name : 'project title',
		class : 'project-title',
		custom_validator : function(selector,errors,warnings){

			if( !(new RegExp("^[a-zA-Z0-9\\-, ]+$").test($(selector).val())))
					errors.push('This doesn\'t look like valid job title  ');							
							
			else {
				
				if ($(selector).val().split(' ').length > 5) 
					warnings.push('This project title seems too long! Double check !!');

				
				
			}

		}
	},

	project_url : {
		name : 'project url',
		class : 'project-url',
		optional : true,
		regex : "((http|https|ftp):\\/\\/)?[\\w-]+\\.[\\w-]+([\\w-\\. \\\\?%&=]*)?",
		errors : {
			'incorrect' : 'Please provide correct  url'
		},
		warnings :{
			'unavailable' : 'Consider entering prject url. It may add to your credibility and increase the impact'
		}
	},

	project_start_date : {
		name : 'project start date',
		class : 'project-start-date',
		regex : date_regex,
		errors : {
			'incorrect' : 'Please enter date in format : 14th May,2014.\n Day is optional. Or enter "present"'
		}
	},

	project_end_date : {
		name : 'project end date',
		class : 'project-end-date',
		regex : date_regex,
		errors : {
			'incorrect' : 'Please enter date in format : 14th May,2014. \n Day is optional. Or enter "present"'
		}
	},

	career_objective : {

		name : 'career-objective',
		class : 'career-objective.wysihtml5-editor'
	}



};


var v = new Validatr(validatr_seed);
v.validate();



});






