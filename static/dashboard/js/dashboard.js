$(function () {
    $.ajax({
      url: "http://myapp.com:8000/user/get-all-cv/",
      contentType: "application/json",
      type: 'GET'
    }).done(function(data) {
        console.log(data);
        var fetchedCvData = ''+
                '<div class="table-responsive">'+
                    '<table class="table table-bordered table-striped">'+
                        '<tr>'+
                            '<th>#</th>'+
                            '<th>Last Updated On</th>'+
                            '<th>Edit Link</th>'+
                        '</tr>';
        for( var key in data) {
            
            fetchedCvData += ''+
                '<tr>'+
                    '<td>'+key+'</td>'+
                    '<td>'+data[key]+'</td>'+
                    '<td>'+'<a class="btn btn-warning" href = "../../generate/cvform/' + key + '" target="_blank">Edit</a>'+'</td>'+
                '</tr>';
            
        }
        fetchedCvData += '</table></div>';
        $('.show-all-cvs').append(fetchedCvData);
    });
})