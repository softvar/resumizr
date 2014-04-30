
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
		
	var globalSectionId = 5;
	$( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
    
    $('#lol').click(function () {
    	var formClientData = {};

    	$('.uis').each(function () {
    		var data='', id = $(this).attr('href'),
    			emptySection = true,
    			heading = $(id).find('.label--text.heading').text();
    		$(id).find('.form-control').each(function () {
    			if($(this).val()!=null && $(this).val()!=''){
		        	if (data=='')
		        		data = $(id +' .form-control').index(this) + $(this).val();
		        	else
			        	data = data + '|&|' + $(id +' .form-control').index(this) + $(this).val();
    				emptySection = false; 
    			}  
		    });
		    if(!emptySection){
		    	formClientData[heading] = data;
		    }
    	});
    	console.log(formClientData);
    	buildoPreviewCv(formClientData);

    });

    $('.save--form').click(function () {
    	var jsonFormData = buildoPreviewCv();
    	// save to DB
    	$.ajax({
		  url: "api.bhola.db",
		  context: document.body
		}).done(function() {
		  $( this ).addClass( "done" );
		});
    });
    
    $('.add-new-job').click(function () {
    	var newJobSection = '\
    	<hr>\
    	<div class="row">\
			<div class="col-md-6">\
				<label class="label--text sub-heading">Job Title</label>\
			    <input type="text" class="form-control" placeholder="Eg: Frontend Designer"/>\
			</div>\
			<div class="col-md-6">\
				<label class="label--text sub-heading">Comapny Name</label>\
				<input type="email" class="form-control" placeholder="Eg: Resumizr"/>\
			</div>\
		</div>\
		<br/>\
		<div class="row">\
			<div class="col-md-6">\
				<label class="label--text sub-heading">Start Date</label>\
			    <input type="text" class="form-control" placeholder="Eg: 14th May, 20xx"/>\
			</div>\
			<div class="col-md-6">\
				<label class="label--text sub-heading">End date</label>\
				<input type="email" class="form-control" placeholder="Eg: 2nd July, 20xx"/>\
			</div>\
		</div>\
		<br/>\
		<div class="row">\
			<div class="col-md-12">\
				<label class="label--text sub-heading">Description</label>\
				<textarea class="form-control" rows="2"></textarea>\
			</div>\
		</div>\
		<br />';
		$('.add-new-job').before(newJobSection);
    });

	$('.add-new-education').click(function () {
		var newEduSection = '\
		<hr>\
		<div class="row">\
			<div class="col-md-6">\
				<label class="label--text sub-heading">Course Name</label>\
			    <input type="text" class="form-control" placeholder="Eg: B.Tech"/>\
			</div>\
			<div class="col-md-6">\
				<label class="label--text submit-form-heading">Institution Name</label>\
				<input type="email" class="form-control" placeholder="Eg: JIIT"/>\
			</div>\
		</div>\
		<br/>\
		<div class="row">\
			<div class="col-md-6">\
				<label class="label--text sub-heading">Start Date</label>\
			    <input type="text" class="form-control" placeholder="Eg: 14th June, 20xx"/>\
			</div>\
			<div class="col-md-6">\
				<label class="label--text sub-heading">End date</label>\
				<input type="email" class="form-control" placeholder="Eg: 2nd may, 20xx"/>\
			</div>\
		</div>\
		<div class="row">\
			<div class="col-md-12">\
				<label class="label--text sub-heading">Description</label>\
				<textarea class="form-control" rows="2"></textarea>\
			</div>\
		</div>\
		<br />';
		$('.add-new-education').before(newEduSection);
	});

    $(document).on('click', '.save-section-title' ,function () {
    	console.log($('.tab-pane.active').attr('id'));
    	var text = $('.prompt-section-title').val();
    	$('.tab-pane.active .label--text.heading').text(text);
    	// change sortable li's
    	text = '<i style="color:#777" class="fa fa-arrows-v"></i>  ' + text;
    	$('#sortable li[href="#'+$('.tab-pane.active').attr('id')+'"').html(text);
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
    	$('#sortable li[href="#'+id+'"').remove();
    	$('#'+ $('.tab-pane.active').attr('id')).remove();
    	if($('#sortable li[href="#'+id+'"').prev()) {
	    	$('#sortable li[href="#'+id+'"').prev().click();
	    }
	    else
	    	$('#sortable li[href="#1"]').click();
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
	
function buildoPreviewCv(formClientData) {
	// view cv in modal view container
	formClientData = typeof formClientData !== 'undefined' ? formClientData : null;

	for (var k in formClientData) {
    	console.log(formClientData[k]);
    }
    $('#myModalPreview').modal('show');

}
	function addSectionDetail(globalId) {
		var sectionAddData = ''+
			'<div class="tab-pane" id="'+globalId+'">'+
				'<label class="label--text heading">New Section</label>'+
				'<span style="margin-left: 20px; color:#9accea">'+
					'<a><i class="fa fa-pencil" data-toggle="modal" data-target="#myModal" title="Edit"></i>&nbsp;</a>'+
					'<a><i class="fa fa-text-height" title="Font-size"></i>&nbsp;</a>'+
					'<a><i class="fa fa-font" title="Color"></i></a>'+
					'<input type="color" class="fontSel" />'+
					'<a><i style="color:#ed7b7b;float:right" class="fa fa-times fa-2x" title="Delete"></i></a>'+
				'</span>'+
				'<hr/>'+
				'<textarea name="content" class="form-control" rows="6"></textarea>'+
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
		var newSection = '<li style="display:inline-block;" class="uis" href="#'+ globalSectionId +'" data-toggle="tab"><i style="color:#777;display:inline-block;" class="fa fa-arrows-v"></i> New Section</li>';
		$('#sortable').append(newSection);
		addSectionDetail(globalSectionId);
		$('li.uis').last().click();
		globalSectionId++;
	});

});
