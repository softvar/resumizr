
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

	var globalSectionId = 10; // please see it carefully @psych0der
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
      "color": true //Button to change color of font
    });
    $('#preview').click(function () {
    	var formClientData = {};

    	$('.sortable-tab--field').each(function () {
    		var data='', object = {},
    		    id = $(this).attr('href'),
    			emptySection = true,
    			heading = $(id).find('.label--text.heading').text();
    		//console.log(id);
            if(id == '#2') {
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
                    formClientData[heading] = workExArray;
                }
            }
            else if(id == '#3') {
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
                    formClientData[heading] = eduArray;
                }
            }
            else if(id == '#4') {
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
                    formClientData[heading] = projArray;
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
                    formClientData[heading] = object;
                }
            }

    	});
    	console.log(formClientData);
    	//formClientData = JSON.stringify(formClientData);
    	buildoPreviewCv(formClientData);

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

    $(document).on('click', '.save-section-title' ,function () {
    	console.log($('.tab-pane.active').attr('id'));
    	var text = $('.prompt-section-title').val();
    	$('.tab-pane.active .label--text.heading').text(text);
    	// change sortable li's
    	text = '<i style="color:gray;" class="fa fa-th-list"></i>  ' + text;
    	$('#sortable li[href="#'+$('.tab-pane.active').attr('id')+'"').html(text);
    	$('#myModal').modal('hide');
    });
    $(document).on('click', '.save-font-size' ,function () {
    	var text = $('.prompt-section-title').val() + 'px';
    	$('.tab-pane.active .label--text.heading').css({'font-size':text});
    });

    $(document).on('click', '.fa.fa-pencil' ,function () {
    	$('.modal-footer button:nth-child(2)').attr('class', 'btn btn-primary save-section-title');
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
    $(document).on('click', '.fa.fa-times' ,function () {
    	var id = $('.tab-pane.active').attr('id');
    	console.log($('#sortable section li[href="#'+id+'"').parent().prev().html());
        console.log($('#sortable li[href="#2"]'));
        $('#sortable li[href="#2"]').click();
        if($('#sortable li[href="#'+id+']"').prev()) {
	    	$('#sortable li[href="#'+id+']"').prev().click();
	    }
	    else
	    	$('#sortable li[href="#1"]').click();

        $('#'+ $('.tab-pane.active').attr('id')).remove();
	    $('#sortable li[href="#'+id+']"').parent().remove();
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

function buildoPreviewCv(f) {
	// view cv in modal view container
	var renderFormData = '<div class="build-resume-service">';

    $('#myModalPreview').modal('show');


    for (var key in f) {
    	//console.log(key);

	    if(key == 'Basic information') {
	    	renderFormData = '<div class="about-self-details">'+
    			'<div class="client--name">';
	    	if(f[key]['cv__fullname'])
		    	renderFormData = renderFormData + String(f['Basic information']['cv__fullname']);
	   		renderFormData = renderFormData +'</div>'+
	   		'<div class="client-personal-details">';
	    	if(f[key]['cv__address'])
		        renderFormData = renderFormData + '<p>Address: '+f['Basic information']['cv__address']+'</p>';
		    if(f[key]['cv__contact'])
		        renderFormData = renderFormData + '<p>Contact: '+f['Basic information']['cv__contact']+'</p>';
		    if(f[key]['cv__email'])
		        renderFormData = renderFormData + '<p>Email: <a href="#">'+f['Basic information']['cv__email']+'</a></p>';
		    if(f[key]['cv__website'])
		        renderFormData = renderFormData + '<p>Website: <a href="#">'+f['Basic information']['cv__website']+'</a></p>';
	    	renderFormData = renderFormData + '</div>'+
				'</div><hr>';
	    }

	    else if(key == 'Work Experience') {
	    	renderFormData = renderFormData + '<div class="section--area">' +
    			'<div class="grey-box rectangle">'+
        		'<span>'+ key +'</span>' +
			    '</div>';

            for (var work in f[key]) {
    			renderFormData = renderFormData + '<div class="data--info">'+
    			    '<div class="row">'+
    			       '<div class="col-md-4" >';
                /*console.log(f[key][work]);
                console.log(f[key][work]['cv__jobtitle']);
    			*/if(f[key][work]['cv__jobtitle'])
    				renderFormData = renderFormData + '<span class="cv__jobtitle">'+f[key][work]['cv__jobtitle']+'</span>';
    			renderFormData = renderFormData + '</div>'+
                '<div class="col-md-4" style="text-align:center;">';
                if(f[key][work]['cv__companyname'])
                	renderFormData = renderFormData + '<span class="cv__companyname">'+f[key][work]['cv__companyname']+'</span>';
                renderFormData = renderFormData +'</div>'+
              		'<div class="col-md-4" style="text-align:right;padding-right:50px;" >';
                if(f[key][work]['cv__companystart'] && f[key][work]['cv__companyend']){
                    renderFormData = renderFormData + '<span class="cv__companystart">'+f[key][work]['cv__companystart'] +'</span>' +
                    '<span class="cv__companyend">'+f[key][work]['cv__companyend'] +'</span>';
                }
                renderFormData = renderFormData + '</div>' + '</div>';
            	if(f[key][work]['cv__companydesc'])
            		renderFormData = renderFormData + '<p>'+f[key][work]['cv__companydesc']+'</p>';

        		renderFormData = renderFormData + '</div>'+
    				'</div>';
            }
	    }
	    else if(key == 'Education') {
	    	renderFormData = renderFormData + '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
        	if(f[key])
        		renderFormData = renderFormData +'<span>'+key+'</span></div>';

            for (var edu in f[key]) {
        		renderFormData = renderFormData + '<div class="data--info">';
            	if(f[key][edu]['cv__coursename'])
            		renderFormData = renderFormData +'<span style="font-weight:bold;">'+f[key][edu]['cv__coursename'];
        		if(f[key][edu]['cv__eduperiod'])
        			renderFormData = renderFormData + ',' +f[key][edu]['cv__eduperiod'];
        		renderFormData = renderFormData + '</span>';

        		if(f[key][edu]['cv__instiname'])
        			renderFormData = renderFormData + '<br/><span>'+f[key][edu]['cv__instiname']+'</span>';
        		if(f[key][edu]['cv__instidescription'])
        			renderFormData = renderFormData + '<p>'+f[key][edu]['cv__instidescription']+'</p>';

        		renderFormData = renderFormData + '</div>';
    				'</div>';
            }
	    }
        else if(key == 'Projects') {
            renderFormData = renderFormData + '<div class="section--area">'+
                '<div class="grey-box rectangle">';
            if(f[key])
                renderFormData = renderFormData +'<span>'+key+'</span></div>';

            for (var proj in f[key]) {
                renderFormData = renderFormData + '<div class="data--info">';
                if(f[key][proj]['cv__projecttitle'])
                    renderFormData = renderFormData +'<span style="font-weight:bold;">'+f[key][proj]['cv__projecttitle'];
                if(f[key][proj]['cv__projecturl'])
                    renderFormData = renderFormData + ',' +f[key][proj]['cv__projecturl'];
                renderFormData = renderFormData + '</span>';

                if(f[key][proj]['cv__projectstart'])
                    renderFormData = renderFormData + '<br/><span>'+f[key][proj]['cv__projectstart']+'</span>';
                if(f[key][proj]['cv__projectend'])
                    renderFormData = renderFormData + '<p>'+f[key][proj]['cv__projectend']+'</p>';
                if(f[key][proj]['cv__projectdesc'])
                    renderFormData = renderFormData + '<p>'+f[key][proj]['cv__projectdesc']+'</p>';

                renderFormData = renderFormData + '</div>';
                    '</div>';
            }
        }
	    else if(key == 'Achievements') {
	    	renderFormData = renderFormData + '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
        	if(f[key])
        		renderFormData = renderFormData +'<span>'+key+'</span>';

    		renderFormData = renderFormData + '</div>'+
    			'<div class="data--info">';
        	if(f[key]['cv__achievemnet'])
        		renderFormData = renderFormData +'<p>'+f[key]['cv__achievemnet']+'</p>';
    		renderFormData = renderFormData + '</div>'+
				'</div>';
	    }
	    else {
	    	renderFormData = renderFormData + '<div class="section--area">'+
    			'<div class="grey-box rectangle">';
        	if(f[key])
        		renderFormData = renderFormData +'<span>'+key+'</span>';

    		renderFormData = renderFormData + '</div>'+
    			'<div class="data--info">';
        	if(f[key]['cv__fielddata'])
        		renderFormData = renderFormData +'<p>'+f[key]['cv__fielddata']+'</p>';
    		renderFormData = renderFormData + '</div>'+
				'</div>';
	    }

	}
	renderFormData = renderFormData + '</div>'
    $('.preview-generated-cv').html(renderFormData);

}
	function addSectionDetail(globalId) {
		var sectionAddData = ''+
			'<div class="tab-pane" id="'+globalId+'">'+
				'<label class="label--text heading">New Section</label>'+
				'<span style="margin-left: 20px; color:#9accea">'+
					'<a><i class="fa fa-pencil fa-2x" data-toggle="modal" data-target="#myModal" title="Edit"></i>&nbsp;</a>'+
					'<a><i style="color:#c0392b; margin-right:5px; position:right;" class="fa fa-times fa-2x" title="Delete"></i></a>'+
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
		var newSection = '<section class="card"><li style="display:inline-block;" class="sortable-tab--field" href="#'+ globalSectionId +'" data-toggle="tab"><i style="color:gray;" class="fa fa-th-list"></i> New Section</li></section>';
		$('#sortable').append(newSection);
		addSectionDetail(globalSectionId);
		$('li.sortable-tab--field').last().click();
		globalSectionId++;
	});

});
