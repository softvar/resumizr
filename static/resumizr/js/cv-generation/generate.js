
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
    $('textarea.form-control').wysihtml5({
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

    skillsName = defaultSkills;
 //substringMatcher(skillsName)
    tagAutoComplete('.tagInputs');
    //$(".tagInputs").tagsManager();
    
    $('#preview').click(function () {
    	var data = generateCvJson();
    	//formClientData = JSON.stringify(formClientData);
    	buildoPreviewCv(data);

    });

    $('.save--form').click(function () {
    	//var jsonFormData = buildoPreviewCv();
    	// save to DB
    	$.ajax({
		  url: "http://myapp.com:8000s/users/save-data",
		  context: document.body
		}).done(function() {
		  $( this ).addClass( "done" );
		});
    });

    $('.add-new-job').click(function () {
    	var newJobSection = '<hr/> <div class="cv-work-experience">' + $('.cv-work-experience').html()+'</div>';
		$('.add-new-job').before(newJobSection);
        dynamicWorkexPopoverBinder(); // from smart-suggestion/js

    });

	$('.add-new-education').click(function (){
		var newEduSection = '<hr/> <div class="cv-education">' + $('.cv-education').html()+'</div>';
		$('.add-new-education').before(newEduSection);
        dynamicEducationPopoverBinder(); // from smart-suggestion.js
	});

    $('.add-new-project').click(function (){
        var newEduSection = '<hr/> <div class="cv-projects">' + $('.cv-projects').html()+'</div>';
        $('.add-new-project').before(newEduSection);
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
            newSkillSet += '<input type="text" data-role="tagsinput" name="cv__skill_tags" class="form-control tagInputs'+globalSkillClassId+' typeahead"/>' +
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

function tagAutoComplete (selector) {
    var tag ;
    $(selector).tagsinput('input',{tagClass: 'label label-warning'});

    if(skillsName.length>0) 
        tag = $(selector).tagsinput('input').typeahead({
                  local: skillsName 
                });
/*    else
        tag = $(selector).tagsinput('input').typeahead({
                  prefetch: '../../static/resumizr/js/cities.json' 
                });*/
    tag.bind('typeahead:selected', $.proxy(function (obj, datum) {  
      this.tagsinput('add', datum.value);
      this.tagsinput('input').typeahead('setQuery', '');
    }, $(selector)));
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
    console.log(formClientData);
    return formClientData;
}

function buildoPreviewCv(f) {
	// view cv in modal view container
	var renderFormData = '<div class="build-resume-service">';

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
        else if(key.split('|@|')[0] == '#2') { // Achievements
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
    			renderFormData += '<div class="data--info">'+
    			    '<div class="row">'+
    			       '<div class="col-md-4" >';
                /*console.log(f[key][work]);
                console.log(f[key][work]['cv__jobtitle']);
    			*/if(f[key][work]['cv__jobtitle'])
    				renderFormData += '<span class="cv__jobtitle">'+f[key][work]['cv__jobtitle'].capitalize()+'</span>';
    			renderFormData += '</div>'+
                '<div class="col-md-4" style="text-align:center;">';
                if(f[key][work]['cv__companyname'])
                	renderFormData += '<span class="cv__companyname">'+f[key][work]['cv__companyname'].capitalize()+'</span>';
                renderFormData +='</div>'+
              		'<div class="col-md-4" style="text-align:right;padding-right:50px;" >';
                if(f[key][work]['cv__companystart'] && f[key][work]['cv__companyend']){
                    renderFormData += '<span class="cv__companystart">'+f[key][work]['cv__companystart'] +'</span>' +
                    '<span class="cv__companyend">'+f[key][work]['cv__companyend'] +'</span>';
                }
                renderFormData += '</div>' + '</div>';
            	if(f[key][work]['cv__companydesc'])
            		renderFormData += '<p>'+f[key][work]['cv__companydesc'].capitalize()+'</p>';

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
            		renderFormData +='<span style="font-weight:bold;">'+f[key][edu]['cv__coursename'].capitalize();
        		if(f[key][edu]['cv__eduperiod'])
        			renderFormData += ',' +f[key][edu]['cv__eduperiod'];
        		renderFormData += '</span>';

        		if(f[key][edu]['cv__instiname'])
        			renderFormData += '<br/><span>'+f[key][edu]['cv__instiname'].capitalize()+'</span>';
        		if(f[key][edu]['cv__instidescription'])
        			renderFormData += '<p>'+f[key][edu]['cv__instidescription'].capitalize()+'</p>';

        		renderFormData += '</div>';
    				'</div>';
            }
	    }
        else if(key.split('|@|')[0] == '#5') { // Projects
            renderFormData += '<div class="section--area">'+
                '<div class="grey-box rectangle">';
            if(f[key])
                renderFormData +='<span>'+key.split('|@|')[1].capitalize()+'</span></div>';

            for (var proj in f[key]) {
                renderFormData += '<div class="data--info">';
                if(f[key][proj]['cv__projecttitle'])
                    renderFormData +='<span style="font-weight:bold;">'+f[key][proj]['cv__projecttitle'].capitalize();
                if(f[key][proj]['cv__projecturl'])
                    renderFormData += ',' +f[key][proj]['cv__projecturl'];
                renderFormData += '</span>';

                if(f[key][proj]['cv__projectstart'])
                    renderFormData += '<br/><span>'+f[key][proj]['cv__projectstart']+'</span>';
                if(f[key][proj]['cv__projectend'])
                    renderFormData += '<p>'+f[key][proj]['cv__projectend']+'</p>';
                if(f[key][proj]['cv__projectdesc'])
                    renderFormData += '<p>'+f[key][proj]['cv__projectdesc'].capitalize()+'</p>';

                renderFormData += '</div>';
                    '</div>';
            }
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
        	if(f[key]['cv__achievemnet'])
        		renderFormData +='<p>'+f[key]['cv__achievemnet']+'</p>';
    		renderFormData += '</div>'+
				'</div>';
	    }
	    else {
	    	renderFormData += '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
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
					<textarea class="form-control mod-text-box" rows="3" name="cv__fielddata"></textarea>\
				</div>'+
				'<br />'+
				'<button class="btn btn-primary add--entry">Add Entry</button>'+
			'</div>';


				$('.tab-content').append(sectionAddData);


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
