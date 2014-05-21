/* BETA  validation automated routine */

function Validatr(config)
{
	this.config = config;  // storing validation configuration
	this.errors = {};
	this.warnings = {};

}


Validatr.prototype.validate = function() {

	console.log('validating');
	for (key in this.config)
	{
		
		/* creating list of errors and warnings */
		this.errors[key] = [];
		this.warnings[key] = [];

		var selector = ''; // used to select element using jquery selector

		if('id' in this.config[key])
			selector = '#'+this.config[key]['id'];
		else	
			selector = '.'+this.config[key]['class'];

		var that = this; // creating alias of this (Validatr) object


		$(selector).on('keyup , blur',(function(key,selector){

			

		return function()
		{
			
			/* removing previous errors */
	        $(selector).siblings('.resume-form-error ,.resume-form-warning').remove();

	        $(selector).removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error');
			$(selector).siblings('.status').children('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-cirlce');

			// resetting errors and warnings
			that.errors[key] = [];
			that.warnings[key] = [];

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
							that.warnings[key].push(that.config[key]['warnings']['unavailable']);

						else
							that.warnings[key].push('consider entering '+key);
					}

					else
						that.warnings[key].push('consider entering '+key);
				}

				else
				{

					if('errors' in that.config[key])
					{
						if('unavailable' in that.config[key]['errors'])
							that.errors[key].push(that.config[key]['errors']);

						else
							that.errors[key].push(key+' field is empty');
					}

					else
						that.errors[key].push(key+' field is empty');

					

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
									that.errors[key].push(that.config[key]['errors']['incorrect']);
								
								else 
									that.errors[key].push('Please provide correct '+key);

							}

							else 
								that.errors[key].push('Incorrect value of '+key);							
							
					}

				}

				if('custom_validator' in that.config[key] && typeof that.config[key]['custom_validator'] ==='function')
				{

					// calling custom validation function; passing errors and warnings array of target element
					that.config[key]['custom_validator'](selector,that.errors[key],that.warnings[key])

				}

			}


			/* check for error */
			if(that.errors[key].length > 0)
			{
	
				$(selector).addClass('mod-form-error');
				$(selector).siblings('.status').children('.status-icon').addClass('fa-times-circle').css('color','#c40a15');
				
			 		
				var list = '';
				that.errors[key].forEach(function(error)
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
			else if(that.warnings[key].length > 0)
			{
			
				$(selector).addClass('mod-form-warning');
				$(selector).siblings('.status').children('.status-icon').addClass('fa-exclamation-circle').css('color','#b49a00');
				
			 		
				var list = '';
				that.warnings[key].forEach(function(error)
				{
					
					list+='<li class="warning">'+error+'</li>';

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

	})(key,selector));  // end of callback
				
	}

}




$(document).ready(function(){

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


};


var v = new Validatr(validatr_seed);
v.validate();



});






