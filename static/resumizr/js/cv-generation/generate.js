
function SubmitFormField($scope, $element) {
  var loginForm = $($element);
  //console.log(loginForm);
  $scope.isInvalid = function() {
    return !loginForm.form('validate form');
  };

  $scope.checkField = function () {
    if (this.isInvalid()) {
      return false;
    }

    alert("Register was clicked!");
    return true;
  };
}

$(function () {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

	var globalSectionId = 10, // please see it carefully @psych0der
        globalSkillClassId = 1;
	$( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });

    $( "#sortable" ).disableSelection();

    var descriptions = ['career-objective','job-description','education-description','project-description', 'achievements', 'more-fields'];
    descriptions.forEach(function(desc){ 

            $('.'+desc).wysihtml5({
              "bodyClassName" : "wysihtml5-supported,wy-"+desc, // for assigning class to body
              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
              "emphasis": true, //Italics, bold, etc. Default true
              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
              "html": true, //Button which allows you to edit the generated HTML. Default false
              "link": false, //Button to insert a link. Default true
              "image": false, //Button to insert an image. Default true,
              "color": true, //Button to change color of font
              "events": {
                "load": function() { 
                    console.log("Loaded!");
                    
                }
              }
            });
});

    skillsName = defaultSkills;
 //substringMatcher(skillsName)
 setTimeout(function () {
    if(autocompleteSocial == false){
        tagAutoComplete('.tagInputs');
    }
 },2000);
    
    //$(".tagInputs").tagsManager();
    
    $('#preview').click(function () {
    	var data = generateCvJson();
    	//formClientData = JSON.stringify(formClientData);
    	buildoPreviewCv(data,'');

    });

    $('.save--form').click(function () {

    	var jsonFormData = generateCvJson(),
            loc = window.location.pathname;
            pathname = loc.split('/');
            resumeNum = pathname[pathname.length - 2];
    	// save to DB

    	// triggering validation on each form field
        $('.form-control').blur();
        $('.skill-tags:first').trigger('itemAdded');
        var totalErrors = 0;
        var totalWarnings = 0;
        var errors = window.Resumizrerrors;
        var warnings = window.Resumizrwarnings;
        for (var key in errors)
        {   
            for (var p in errors[key]) {
                if (errors[key].hasOwnProperty(p)) {
                
                    totalErrors+=errors[key][p].length;
                }
            }
                            
        }

        for (var key in warnings)
        {   
            for (var p in warnings[key]) {
                if (warnings[key].hasOwnProperty(p)) {
                
                    totalWarnings+=warnings[key][p].length;
                }
            }
                            
        }
    

        if(totalErrors > 0)
        {
        
        toastr.options = {
          "closeButton": true,
          "debug": false,
          "positionClass": "toast-top-full-width",
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

        var notif = "You have "+totalErrors+" errors";

        if(totalWarnings > 0)
            notif+=" and "+totalWarnings+" warnings";

        toastr['error'](notif+". Please fix them before subiting the resume.", "Error");
        //return;

        }
        else{
            if(totalWarnings > 0)
            {
                toastr.options = {
                  "closeButton": true,
                  "debug": false,
                  "positionClass": "toast-top-full-width",
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
    
            var notif = "You have "+totalWarnings+" warnings";  
            toastr['warning'](notif+". Consider fixing them.", "Alert");
                         

            }

        }
        $.ajax({
          url: "http://myapp.com:8000/user/get-all-cv/",
          contentType: "application/json",
          type: 'GET'
        }).done(function(data) {
            console.log(data);
            var loc = window.location.pathname;
                pathname = loc.split('/');
                resumeNum = pathname[pathname.length - 2];
            for(var key in data){
                if (key==resumeNum) {
                    console.log(data[key]);
                    var t = new Date(),
                        present =  t.getDate() + "/" + t.getMonth() + "/" + t.getFullYear() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
                    data[key].push(present);
                    console.log(data[key])
                    jsonFormData['UpdatedOn'] = data[key];
                }
            }
            console.log(jsonFormData);
            $.ajax({
              url: "http://myapp.com:8000/users/save-data/"+resumeNum+"/",
              data: JSON.stringify(jsonFormData),
              contentType: "application/json",
              type: 'POST'
            }).done(function() {
                alert('Form Saved !! :)');
                toastr.options['positionClass'] = 'toast-top-full-width';
                toastr.success('Resume Form Saved Successfully', 'Saved');
            });
        });

    	
    });

/* Load Saved form */
    $('.prefill--form').click(function () {
        loadSavedForm();
    });
    loadSavedForm();
/****/

    
    $('.cv-write').click(function () {
        $('#pdfOptions').modal('show');
        // triggering validation on each form field
        
    });

    $('.selected-pdf-option').click(function () {

        $('.form-control').blur();
        $('.skill-tags:first').trigger('itemAdded');
        var totalErrors = 0;
        var totalWarnings = 0;
        var errors = window.Resumizrerrors;
        var warnings = window.Resumizrwarnings;
        for (var key in errors)
        {   
            for (var p in errors[key]) {
                if (errors[key].hasOwnProperty(p)) {
                
                    totalErrors+=errors[key][p].length;
                }
            }
                            
        }

        for (var key in warnings)
        {   
            for (var p in warnings[key]) {
                if (warnings[key].hasOwnProperty(p)) {
                
                    totalWarnings+=warnings[key][p].length;
                }
            }
                            
        }
    

        if(totalErrors > 0)
        {
        
        toastr.options = {
          "closeButton": true,
          "debug": false,
          "positionClass": "toast-top-full-width",
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

        var notif = "You have "+totalErrors+" errors";

        if(totalWarnings > 0)
            notif+=" and "+totalWarnings+" warnings";

        toastr['error'](notif+". Please fix them before subiting the resume.", "Error");
        //return;

        }
        else{
            if(totalWarnings > 0)
            {
                toastr.options = {
                  "closeButton": true,
                  "debug": false,
                  "positionClass": "toast-top-full-width",
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
    
            var notif = "You have "+totalWarnings+" warnings";  
            toastr['warning'](notif+". Consider fixing them.", "Alert");
                         

            }

        }

        var jsonFormData = generateCvJson(), cvHtml;
        cvHtml = '<html><body class="container">';
        cvHtml += buildoPreviewCv(jsonFormData, 'no');
        cvHtml += '</body></html>';
        css = $('input[name=pdf-options]:radio:checked').val() || 'professional';
        
        var data = {'html': cvHtml, 'css': css}
        console.log(data);
        // save to DB
        $.ajax({
          url: "http://myapp.com:8000/write/cv_to_pdf/",
          type: 'POST',
          data: JSON.stringify(data),
          contentType: "application/json"
        }).done(function(data) {
            $('#pdfOptions').modal('hide');
            alert('PDF has been generated. Congrats!');
            console.log(data);
            $('#pdfOptions').modal('hide');
        })
    });

    $('.add-new-job').click(function () {
    	var newJobSection = '<div class="cv-work-experience">' + $('.cv-work-experience:first').html()+'</div>';
        newJobSection = $(newJobSection);
	
        newJobSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
        newJobSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
        newJobSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
        newJobSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
        newJobSection.find('.job-description').wysihtml5({
              "bodyClassName" : "wysihtml5-supported,wy-job-description", // for assigning class to body
              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
              "emphasis": true, //Italics, bold, etc. Default true
              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
              "html": true, //Button which allows you to edit the generated HTML. Default false
              "link": false, //Button to insert a link. Default true
              "image": false, //Button to insert an image. Default true,
              "color": true, //Button to change color of font
              "events": {
                "load": function() { 
                    newJobSection.find('.wysihtml5-sandbox').show();
                }
              }
            });

        $('.add-new-job').before(newJobSection);
        dynamicWorkexPopoverBinder(); // from smart-suggestion/js

    });

	$('.add-new-education').click(function (){
		var newEduSection = '<div class="cv-education">' + $('.cv-education').html()+'</div>';
		newEduSection = $(newEduSection);

        newEduSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
        newEduSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
        newEduSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
        newEduSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
        newEduSection.find('.education-description').wysihtml5({
              "bodyClassName" : "wysihtml5-supported,wy-education-description", // for assigning class to body
              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
              "emphasis": true, //Italics, bold, etc. Default true
              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
              "html": true, //Button which allows you to edit the generated HTML. Default false
              "link": false, //Button to insert a link. Default true
              "image": false, //Button to insert an image. Default true,
              "color": true, //Button to change color of font
              "events": {
                "load": function() { 
                    newEduSection.find('.wysihtml5-sandbox').show();
                }
              }
            });

        $('.add-new-education').before(newEduSection);
        dynamicEducationPopoverBinder(); // from smart-suggestion.js
	});

    $('.add-new-project').click(function (){
        var newProjSection = '<div class="cv-projects">' + $('.cv-projects').html()+'</div>';
        newProjSection = $(newProjSection);

        newProjSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
        newProjSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
        newProjSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
        newProjSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
        newProjSection.find('.project-description').wysihtml5({
              "bodyClassName" : "wysihtml5-supported,wy-project-description", // for assigning class to body
              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
              "emphasis": true, //Italics, bold, etc. Default true
              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
              "html": true, //Button which allows you to edit the generated HTML. Default false
              "link": false, //Button to insert a link. Default true
              "image": false, //Button to insert an image. Default true,
              "color": true, //Button to change color of font
              "events": {
                "load": function() { 
                    newProjSection.find('.wysihtml5-sandbox').show();
                }
              }
            });

        $('.add-new-project').before(newProjSection);
        dynamicProjectsPopoverBinder(); // from smart-suggestion.js
    });

    $('.add-new-skill-set').click(function (){
        if(globalSkillClassId<10) {
            var placeholderArray = ['Frameworks','Databases','Web Languages','Platforms','OS','Management','Others']
            var newSkillSet = '\
                <div class="cv-skill-set">\
                    <div class="card">\
                        <a><i style="color:#c0392b; margin-right:5px; float:right;" class="fa fa-times fa-2x skill-tag" title="Delete"></i></a>\
                        <label class="sub-section-heading">Fill out the Details</label>\
                        <hr/>\
                        <div class="row">\
                            <div class="col-md-3">\
                                <label class="sub-section-heading">Skill Type:</label>\
                                <input type="text" class="form-control skill-type" name="cv__skill_type" placeholder="Eg: '+placeholderArray[globalSkillClassId%placeholderArray.length/**/]+'"/>\
                            </div>\
                            <div class="col-md-9">\
                                <label class="sub-section-heading">Add Skills:</label>';
            newSkillSet += '<input type="text" data-role="tagsinput" name="cv__skill_tags" class="form-control skill-tags tagInputs'+globalSkillClassId+' typeahead"/>' +
                '           </div>\
                        </div>\
                    </div>\
                </div>';
            
            $('.add-new-skill-set').before(newSkillSet);
            $('.tagInputs'+globalSkillClassId).tagsinput('input');
            /*$('.tagInputs'+globalSkillClassId).tagsinput('input').typeahead({
              prefetch: '../../static/resumizr/js/cities.json'
            }).bind('typeahead:selected', $.proxy(function (obj, datum) {  
              this.tagsinput('add', datum.value);
              this.tagsinput('input').typeahead('setQuery', '');
            }, $('.tagInputs'+globalSkillClassId)));*/
            tagAutoComplete('.tagInputs'+globalSkillClassId);
            
            globalSkillClassId++;
            $('.alert.alert-warning.alert-dismissable').css('display','none');
        }
        else {
            $('.alert.alert-warning.alert-dismissable').css('display','block');
        }
        
    });

    $(document).on('click', '.save-section-title' ,function () {
    	console.log($('.tab-pane.active').attr('id'));
    	var text = $('.prompt-section-title').val();
    	
        if(text!='') {
            $('.tab-pane.active .label--text.heading').text(text);
        	// change sortable li's
        	text = '<i style="color:gray;" class="fa fa-th-list"></i>  ' + text;
        	$('#sortable li[href="#'+$('.tab-pane.active').attr('id')+'"').html(text);
        	$('#myModal').modal('hide');
        }
    });
    $(document).on('click', '.save-font-size' ,function () {
    	var text = $('.prompt-section-title').val() + 'px';
    	$('.tab-pane.active .label--text.heading').css({'font-size':text});
    });

    $(document).on('click', '.fa.fa-pencil' ,function () {
    	$('.modal-footer button:nth-child(2)').attr('class', 'btn btn-primary save-section-title');
        $('.prompt-section-title').val('');
    });

    $(document).on('click', '.fa.fa-text-height' ,function () {
    	$('.modal-footer button:nth-child(2)').attr('class', 'btn btn-primary save-font-size');
    });
    $(document).on('click', '.fa.fa-font' ,function () {
    	console.log($('#fontSel').click());
    });
    $(document).on('change', '.fontSel', function(){
    	console.log('c');
	  	$('.tab-pane.active .label--text.heading').css({'color':$(this).val()});
	});
    $(document).on('click', '.fa.fa-times.section-delete' ,function () {
    	var id = $('.tab-pane.active').attr('id');
        if($('li[href="#'+id+'"]').parent().prev()[0]) {
	    	$('li[href="#'+id+'"]').parent().prev().children()[0].click();
	    }
	    else
	       $('li[href="#1"]').click();
	    $('li[href="#'+id+'"]').parent().remove();
        $('#'+id).remove();
    });
    $(document).on('click', '.fa.fa-times.skill-tag' ,function () {
        $(this).parents().eq(2).remove();
    });
    $(document).on('click', '.fa.fa-times.parent--delete' ,function () {
        
    var container = $(this).parent();

    var children = container.parent().children('div');
            var index = 0;

            for (var i= 0; i<children.length; i++) {
                var child= children[i];
                if (child != container[0])
                    index+=1;
                else
                    break;
            }

    container.find('.form-control').each(function(){

        var key = $(this).data('key');

      if(typeof key!= 'undefined')
      {
    
        if (index in window.Resumizrerrors[key])
        {
            window.Resumizrerrors[key][index] = []; // setting errors to the corresponding errors and warning to 0
        }

        if (index in window.Resumizrwarnings[key])
        {
            window.Resumizrwarnings[key][index] = []; // setting errors to the corresponding errors and warning to 0
        }
    }
    });

    $('.skill-tags:first').trigger('itemAdded'); // triggering event to refresh validatoion status skills


        $(this).parent().remove();
    });

	var newEntry = '<div class="">'
		+
		'<i style="color:red;" class="glyphicon glyphicon-minus-sign"></i>'
			+
  '<div class="form-group">'+
	    '<label for="heading" class="col-sm-1 control-label">Heading</label>'+
	    ' <div class="col-sm-10">' +
	    	'<input type="text" class="form-control" name="heading" placeholder="Enter Heading">'+
	    '</div>'+
	  '</div>'+
	  '<div class="form-group">'+
	    '<label for="content" class="col-sm-1 control-label">Content</label>'+
	    ' <div class="col-sm-10">'+
	    	'<textarea class="form-control" name="content" placeholder="Enter Content"></textarea>'+
	    '</div>'+
	  '</div>'+

'</div>';

function loadSavedForm () {
    var jsonFormData = generateCvJson(),
        loc = window.location.pathname;
        pathname = loc.split('/');
        resumeNum = pathname[pathname.length - 2];
    // save to DB
    $.ajax({
      url: "http://myapp.com:8000/users/get-data/"+resumeNum+"/",
      contentType: "application/json",
      type: 'GET'
    }).done(function(data) {
        console.log(data);
        if(data['ERROR'] != undefined){
            toastr.options['positionClass'] = 'toast-top-full-width';
            toastr.error('No such Resume Data Available', 'Error');
            return;
        }

        for (var key in data) {
            //console.log(key);
            var i =0;
            for (var subkey in data[key]) {
                //console.log(data[key][subkey])
                if (typeof data[key][subkey] == 'object') {

                    if (data[key].length>1 && i!=0) {
                        if (key.split('|@|')[0] == '#3') {// workex
                            var newJobSection = '<div class="cv-work-experience">' + $('.cv-work-experience:first').html()+'</div>';
                            newJobSection = $(newJobSection);
                            
                            newJobSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
                            newJobSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
                            newJobSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
                            newJobSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
                            
                            newJobSection.find('.job-description').wysihtml5({
                              "bodyClassName" : "wysihtml5-supported,wy-job-description", // for assigning class to body
                              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                              "emphasis": true, //Italics, bold, etc. Default true
                              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                              "html": true, //Button which allows you to edit the generated HTML. Default false
                              "link": false, //Button to insert a link. Default true
                              "image": false, //Button to insert an image. Default true,
                              "color": true, //Button to change color of font
                              "events": {
                                "load": function() { 
                                    newJobSection.find('.wysihtml5-sandbox').show();
                                }
                              }
                            });
                            $('.add-new-job').before(newJobSection);
                            
                            
                        }
                        else if (key.split('|@|')[0] == '#4') {// education
                            var newEduSection = '<div class="cv-education">' + $('.cv-education').html()+'</div>';
                            newEduSection = $(newEduSection);
                            newEduSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
                            newEduSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
                            newEduSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
                            newEduSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
                            
                            newEduSection.find('.education-description').wysihtml5({
                              "bodyClassName" : "wysihtml5-supported,wy-job-description", // for assigning class to body
                              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                              "emphasis": true, //Italics, bold, etc. Default true
                              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                              "html": true, //Button which allows you to edit the generated HTML. Default false
                              "link": false, //Button to insert a link. Default true
                              "image": false, //Button to insert an image. Default true,
                              "color": true, //Button to change color of font
                              "events": {
                                "load": function() { 
                                    newEduSection.find('.wysihtml5-sandbox').show();
                                }
                              }
                            });
                            $('.add-new-education').before(newEduSection);
                        }
                        else if (key.split('|@|')[0] == '#5') {// projects
                            var newProjSection = '<div class="cv-projects">' + $('.cv-projects').html()+'</div>';
                            newProjSection = $(newProjSection);
                            newProjSection.find('.resume-form-error ,.resume-form-warning').remove(); // removing prior error fields
                            newProjSection.find('.status-icon').removeClass('fa-check-circle').removeClass('fa-exclamation-circle').removeClass('fa-times-circle');
                            newProjSection.find('.mod-form-error , .mod-form-correct , .mod-form-warning').removeClass('mod-form-correct').removeClass('mod-form-warning').removeClass('mod-form-error'); // removing previous error classes
                            newProjSection.find('.wysihtml5-toolbar , .wysihtml5-sandbox , input[name="_wysihtml5_mode"]').remove();
                            
                            newProjSection.find('.project-description').wysihtml5({
                              "bodyClassName" : "wysihtml5-supported,wy-job-description", // for assigning class to body
                              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                              "emphasis": true, //Italics, bold, etc. Default true
                              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                              "html": true, //Button which allows you to edit the generated HTML. Default false
                              "link": false, //Button to insert a link. Default true
                              "image": false, //Button to insert an image. Default true,
                              "color": true, //Button to change color of font
                              "events": {
                                "load": function() { 
                                    newProjSection.find('.wysihtml5-sandbox').show();
                                }
                              }
                            });
                            $('.add-new-project').before(newProjSection);
                        }
                        else if (key.split('|@|')[0] == '#6') {// skills
                            var skillSetId = 0;
                            if(skillSetId<10) {
                                var placeholderArray = ['Frameworks','Databases','Web Languages','Platforms','OS','Management','Others']
                                var newSkillSet = '\
                                    <div class="cv-skill-set">\
                                        <div class="card">\
                                            <a><i style="color:#c0392b; margin-right:5px; float:right;" class="fa fa-times fa-2x skill-tag" title="Delete"></i></a>\
                                            <label class="sub-section-heading">Fill out the Details</label>\
                                            <hr/>\
                                            <div class="row">\
                                                <div class="col-md-3">\
                                                    <label class="sub-section-heading">Skill Type:</label>\
                                                    <input type="text" class="form-control skill-type" name="cv__skill_type" placeholder="Eg: '+placeholderArray[skillSetId%placeholderArray.length/**/]+'"/>\
                                                </div>\
                                                <div class="col-md-9">\
                                                    <label class="sub-section-heading">Add Skills:</label>';
                                newSkillSet += '<input type="text" data-role="tagsinput" name="cv__skill_tags" class="form-control tagInputs'+skillSetId+' typeahead"/>' +
                                    '           </div>\
                                            </div>\
                                        </div>\
                                    </div>';
                                
                                $('.add-new-skill-set').before(newSkillSet);
                                $('.tagInputs'+skillSetId).tagsinput('input');
                                /*$('.tagInputs'+globalSkillClassId).tagsinput('input').typeahead({
                                  prefetch: '../../static/resumizr/js/cities.json'
                                }).bind('typeahead:selected', $.proxy(function (obj, datum) {  
                                  this.tagsinput('add', datum.value);
                                  this.tagsinput('input').typeahead('setQuery', '');
                                }, $('.tagInputs'+globalSkillClassId)));*/
                                tagAutoComplete('.tagInputs'+skillSetId);
                                
                                skillSetId++;
                                $('.alert.alert-warning.alert-dismissable').css('display','none');
                            }
                            else {
                                $('.alert.alert-warning.alert-dismissable').css('display','block');
                            }
                        }
                    }
                    /*var numWysiEditor = $('.html5-editor-toggle');
                    for(var i=0;i<numWysiEditor.length;i++) {
                        numWysiEditor[i].click();
                    } */
                    for (var subsubkey in data[key][subkey]) {
                        //console.log(subsubkey)
                        if (key.split('|@|')[0] == '#6') {//skills
                            if(subsubkey == 'cv__skill_tags')
                               $('input[name="'+subsubkey+'"]:eq('+i+')').tagsinput('add', data[key][subkey][subsubkey]);
                            else
                               $('input[name="'+subsubkey+'"]:eq('+i+')').val(data[key][subkey][subsubkey]); 
                        }
                        else {
                            $('input[name="'+subsubkey+'"]:eq('+i+')').val(data[key][subkey][subsubkey]);
                            //console.log(subsubkey)
                            if (subsubkey == 'cv__companydesc') {
                                $('.cv-work-experience .html5-editor-toggle:eq('+i+')')[0].click();
                                $('.job-description:eq('+i+')').val(data[key][subkey][subsubkey]);
                                $('.cv-work-experience .html5-editor-toggle:eq('+i+')')[0].click();
                            }
                            else if (subsubkey == 'cv__instidescription') {
                                $('.cv-education .html5-editor-toggle:eq('+i+')')[0].click();
                                $('.education-description:eq('+i+')').val(data[key][subkey][subsubkey]);
                                $('.cv-education .html5-editor-toggle:eq('+i+')')[0].click();
                            }
                            else if (subsubkey == 'cv__projectdesc') {
                                $('.cv-projects .html5-editor-toggle:eq('+i+')')[0].click();
                                $('.project-description:eq('+i+')').val(data[key][subkey][subsubkey]);
                                $('.cv-projects .html5-editor-toggle:eq('+i+')')[0].click();
                            }
                            
                            $('input[name="'+subsubkey+'"]:eq('+i+')').blur();
                        }
                    }  

                }
                else if(key!='UpdatedOn') {
                    if (subkey == 'cv__achievement') {
                        $('.cv-achievement .html5-editor-toggle:eq('+i+')')[0].click();
                        $('.achievements').val(data[key][subkey]);
                        $('.cv-achievement .html5-editor-toggle:eq('+i+')')[0].click();
                    }
                    else if (subkey == 'cv__careerobj') {
                        $('.cv-careerobj .html5-editor-toggle:eq('+i+')')[0].click();
                        $('.career-objective').val(data[key][subkey]);
                        $('.cv-careerobj .html5-editor-toggle:eq('+i+')')[0].click();
                    }
                    $('input[name="'+subkey+'"]').val(data[key][subkey]);
                    $('input[name="'+subkey+'"]').blur();
                }
                i++;
            }
        }
    //alert('Automatically Saved Form Loaded!');
    toastr.options['positionClass'] = 'toast-top-full-width';
    toastr.success('Resume Form Loaded Successfully', 'Load');
    });
}

function tagAutoComplete (selector) {
    var tag ;
    $(selector).tagsinput('input',{tagClass: 'label label-warning'});

    /*if(skillsName.length>0) 
        tag = $(selector).tagsinput('input').typeahead({
                  local: skillsName 
                });
    else
        tag = $(selector).tagsinput('input').typeahead({
                  prefetch: '../../static/resumizr/js/cities.json' 
                });
    tag.bind('typeahead:selected', $.proxy(function (obj, datum) {  
      this.tagsinput('add', datum.value);
      this.tagsinput('input').typeahead('setQuery', '');
    }, $(selector)));*/
}
function generateCvJson () {
    var formClientData = {};

    $('.sortable-tab--field').each(function () {
        var data='', object = {},
            id = $(this).attr('href'),
            emptySection = true,
            heading = $(id).find('.label--text.heading').text();
            headId = id + '|@|' + heading;
        //console.log(id);
        if(id == '#3') {
            var workExObject = {},
                workExArray = [];
            $(id).find('.cv-work-experience').each(function (i) {
                $('.cv-work-experience:eq('+i+') .form-control').each(function (i) {
                    if($(this).val()!=null && $(this).val()!=''){
                        //alert(i + $(this).val());
                        workExObject[$(this).attr('name')] = $(this).val();
                        emptySection = false;
                    }
                });
                var jobDesc = $('.cv-work-experience:eq('+i+') .job-description');
                if (jobDesc.val()!=null && jobDesc.val()!='') {
                    workExObject[$(jobDesc).attr('name')] = jobDesc.val()
                }
                if(!emptySection){
                    //alert('lol');
                    workExArray.push(workExObject);
                    workExObject = {};
                }
            });
            if(workExArray.length>0){
                formClientData[headId] = workExArray;
            }
        }
        else if(id == '#4') {
            var eduObject = {},
                eduArray = [];
            $(id).find('.cv-education').each(function (i) {
                $('.cv-education:eq('+i+') .form-control').each(function (i) {
                    if($(this).val()!=null && $(this).val()!=''){
                        eduObject[$(this).attr('name')] = $(this).val();
                        emptySection = false;
                    }
                });
                var eduDesc = $('.cv-education-experience:eq('+i+') .education-description');
                if (eduDesc.val()!=null && eduDesc.val()!='') {
                    eduObject[$(eduDesc).attr('name')] = eduDesc.val()
                }
                if(!emptySection){
                    eduArray.push(eduObject);
                    eduObject = {};
                }
            });
            if(eduArray.length>0){
                formClientData[headId] = eduArray;
            }
        }
        else if(id == '#5') {
            var projObject = {},
                projArray = [];
            $(id).find('.cv-projects').each(function (i) {
                $('.cv-projects:eq('+i+') .form-control').each(function (i) {
                    if($(this).val()!=null && $(this).val()!=''){
                        projObject[$(this).attr('name')] = $(this).val();
                        emptySection = false;
                    }
                });
                if(!emptySection){
                    projArray.push(projObject);
                    projObject = {};
                }
            });
            if(projArray.length>0){
                formClientData[headId] = projArray;
            }
        }
        else if(id == '#6') {
            var skillObject = {},
                skillArray = [];
            $(id).find('.cv-skill-set').each(function (i) {
                $('.cv-skill-set:eq('+i+') .form-control').each(function (i) {
                    if($(this).val()!=null && $(this).val()!=''){
                        skillObject[$(this).attr('name')] = $(this).val();
                        emptySection = false;
                    }
                });
                if(!emptySection){
                    skillArray.push(skillObject);
                    skillObject = {};
                }
            });
            if(skillArray.length>0){
                formClientData[headId] = skillArray;
            }
        }
        else {
            $(id).find('.form-control').each(function () {
                if($(this).val()!=null && $(this).val()!=''){
                    object[$(this).attr('name')] = $(this).val();
                    emptySection = false;
                }
            });
            if(!emptySection){
                formClientData[headId] = object;
            }
        }

    });

    return formClientData;


}

function buildoPreviewCv(f,status) {
	// view cv in modal view container
	var renderFormData = '<div class="build-resume-service">';

    if(status != 'no')
        $('#myModalPreview').modal('show');


    for (var key in f) {
    	//console.log(key);

	    if(key.split('|@|')[0] == '#1') { // Basic Information
	    	renderFormData = '<div class="about-self-details">'+
    			'<div class="client--name">';
	    	if(f[key]['cv__fullname'])
		    	renderFormData += f[key]['cv__fullname'].capitalize();
	   		renderFormData +='</div>'+
	   		'<div class="client-personal-details">';
	    	if(f[key]['cv__address'])
		        renderFormData += '<p>Address: '+f[key]['cv__address'].capitalize()+'</p>';
		    if(f[key]['cv__contact'])
		        renderFormData += '<p>Contact: '+f[key]['cv__contact']+'</p>';
		    if(f[key]['cv__email'])
		        renderFormData += '<p>Email: <a href="#">'+f[key]['cv__email']+'</a></p>';
		    if(f[key]['cv__website'])
		        renderFormData += '<p>Website: <a href="#">'+f[key]['cv__website']+'</a></p>';
	    	renderFormData += '</div>'+
				'</div><hr>';
	    }
        else if(key.split('|@|')[0] == '#2') { // career obj
            renderFormData += '<div class="section--area">'+
                '<div class="grey-box rectangle">';
            if(f[key])
                renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span>';

            renderFormData += '</div>'+
                '<div class="data--info">';
            if(f[key]['cv__careerobj'])
                renderFormData +='<p>'+f[key]['cv__careerobj']+'</p>';
            renderFormData += '</div>'+
                '</div>';
        }
	    else if(key.split('|@|')[0] == '#3') { // Work Ex
	    	renderFormData += '<div class="section--area">' +
    			'<div class="grey-box rectangle">';
        	if(f[key])
                    renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span></div>';

            for (var work in f[key]) {
    			renderFormData += '<div class="data--info">';
    			    
                /*console.log(f[key][work]);
                console.log(f[key][work]['cv__jobtitle']);
    			*/
                if(f[key][work]['cv__jobtitle'])
    				renderFormData += '<span class="cv__jobtitle">'+f[key][work]['cv__jobtitle'].capitalize()+'</span>';
    			
                if(f[key][work]['cv__companystart'] && f[key][work]['cv__companyend']){
                    renderFormData += '<span class="cv__companystart">, '+f[key][work]['cv__companystart'] +'</span>' +
                    '<span class="cv__companyend"> - '+f[key][work]['cv__companyend'] +'</span>';
                }
                
                if(f[key][work]['cv__companyname'])
                	renderFormData += '<br/><span class="cv__companyname">'+f[key][work]['cv__companyname'].capitalize()+'</span>';
                
                
            	if(f[key][work]['cv__companydesc'])
            		renderFormData += '<p><ul><li>'+f[key][work]['cv__companydesc'].capitalize()+'</li></ul></p>';

        		renderFormData += '</div>'+
    				'</div>';
            }
	    }
	    else if(key.split('|@|')[0] == '#4') { // Education
	    	renderFormData += '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
        	if(f[key])
        		renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span></div>';

            for (var edu in f[key]) {
        		renderFormData += '<div class="data--info">';
            	if(f[key][edu]['cv__coursename'])
            		renderFormData +='<span style="font-weight:bold;">'+f[key][edu]['cv__coursename'].capitalize() + '</span>';
        		if(f[key][edu]['cv__eduperiod'])
        			renderFormData += ', ' +f[key][edu]['cv__eduperiod'];

        		if(f[key][edu]['cv__instiname'])
        			renderFormData += '<br/><span>'+f[key][edu]['cv__instiname'].capitalize()+'</span>';
        		if(f[key][edu]['cv__instidescription'])
        			renderFormData += '<p>'+f[key][edu]['cv__instidescription'].capitalize()+'</p>';

        		renderFormData += '<br/><br/></div>';

            }
            renderFormData += '</div>'

	    }
        else if(key.split('|@|')[0] == '#5') { // Projects
            renderFormData += '<div class="section--area">'+
                '<div class="grey-box rectangle">';
            if(f[key])
                renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span></div><ul>';

            for (var proj in f[key]) {
                renderFormData += '<div class="data--info"><li>';
                if(f[key][proj]['cv__projecttitle'])
                    renderFormData +='<span style="font-weight:bold;">'+f[key][proj]['cv__projecttitle'].capitalize() + '</span>';
                
                renderFormData += '<span class="pull-right project-date">';
                if(f[key][proj]['cv__projectstart'])
                    renderFormData += '<span>'+f[key][proj]['cv__projectstart']+'</span>';
                if(f[key][proj]['cv__projectend'])
                    renderFormData += '<span> - '+f[key][proj]['cv__projectend']+'</span>';
                renderFormData += '</span>';

                if(f[key][proj]['cv__projectdesc'])
                    renderFormData += '<p>'+f[key][proj]['cv__projectdesc'].capitalize()+'</p>';
                if(f[key][proj]['cv__projecturl'])
                    renderFormData += '<p><b>URL: </b>' +f[key][proj]['cv__projecturl'] + '</p>';
                

                renderFormData += '</li></div>';
                    
            }
            renderFormData += '</ul></div>';
        }
        else if(key.split('|@|')[0] == '#6') { // Skills
            renderFormData += '<div class="section--area">'+
                '<div class="grey-box rectangle">';
            if(f[key])
                renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span>';

            for(var skill in f[key]) {
                renderFormData += '<div class="data--info">';
                if(f[key][skill]['cv__skill_type'])
                    renderFormData += '<span style="font-weight:bold;">'+ f[key][skill]['cv__skill_type'].capitalize() +': </span>';
                if(f[key][skill]['cv__skill_tags'])
                    renderFormData += '<span>'+ f[key][skill]['cv__skill_tags'] +'</span>';

                renderFormData += '</div>';
                    '</div>';
            }
        }
	    else if(key.split('|@|')[0] == '#7') { // Achievements
	    	renderFormData += '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
        	if(f[key])
        		renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span>';

    		renderFormData += '</div>'+
    			'<div class="data--info">';
        	if(f[key]['cv__achievement'])
        		renderFormData +='<p>'+f[key]['cv__achievement']+'</p>';
    		renderFormData += '</div>'+
				'</div>';
	    }
	    else if(key!='UpdatedOn'){
	    	renderFormData += '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
            console.log('lol'+key);
        	if(f[key])
        		renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span>';

    		renderFormData += '</div>'+
    			'<div class="data--info">';
        	if(f[key]['cv__fielddata'])
        		renderFormData +='<p>'+f[key]['cv__fielddata']+'</p>';
    		renderFormData += '</div>'+
				'</div>';
	    }

	}
	renderFormData += '</div>'
    $('.preview-generated-cv').html(renderFormData);
    return renderFormData;

}
	function addSectionDetail(globalId) {
		var sectionAddData = ''+
			'<div class="tab-pane" id="'+globalId+'">'+
				'<label class="label--text heading">New Section</label>'+
				'<span style="margin-left: 20px; color:#9accea">'+
					'<a><i class="fa fa-pencil fa-2x" data-toggle="modal" data-target="#myModal" title="Edit"></i>&nbsp;</a>'+
					'<a><i style="color:#c0392b; margin-right:5px; position:right;" class="fa fa-times section-delete fa-2x" title="Delete"></i></a>'+
				'</span>'+
				'<hr/>'+
				'<div class="card">\
					<label class="label--text sub-heading">Detail</label>\
					<textarea class="form-control mod-text-box more-fields" rows="3" name="cv__fielddata"></textarea>\
				</div>'+
				'<br />'+
			'</div>';


				$('.tab-content').append(sectionAddData);
                $('.more-fields').wysihtml5({
              "bodyClassName" : "wysihtml5-supported,wy-more-fields", // for assigning class to body
              "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
              "emphasis": true, //Italics, bold, etc. Default true
              "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
              "html": true, //Button which allows you to edit the generated HTML. Default false
              "link": false, //Button to insert a link. Default true
              "image": false, //Button to insert an image. Default true,
              "color": true, //Button to change color of font
              "events": {
                "load": function() { 
                    console.log("Loaded!");
                }
              }
            });


	}

	$('.add--new').click(function () {
		$('.btn-success.submit-form').before(newSection);
	});
	$(document).on('click', '.btn.add--entry', function () {

	});
	$('.add--section').click(function () {
		var newSection = '<section class="field-card"><li style="display:inline-block;" class="sortable-tab--field" href="#'+ globalSectionId +'" data-toggle="tab"><i style="color:gray;" class="fa fa-th-list"></i> New Section</li></section>';
		$('#sortable').append(newSection);
		addSectionDetail(globalSectionId);
		$('li.sortable-tab--field').last().click();
		globalSectionId++;
	});

});
