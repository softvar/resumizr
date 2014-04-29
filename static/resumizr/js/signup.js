$(document).ready(function(){

		$("#username").keyup(function (e) { //user types username on inputfiled
            
            if($(this).val() != '')
            {	

            $('#available').html('checking');
            var username = $(this).val(); //get the string typed by user
            $.get('/usernames/'+encodeURIComponent(username)+'/',  function(data) { 
            $("#available").html(data.available.toString()); 
         	 });
        	}

        	});

			

});
