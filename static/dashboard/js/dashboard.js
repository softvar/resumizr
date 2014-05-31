$(function () {

    function get_all_cv() {
        $.ajax({
          url: "http://myapp.com:8000/user/get-all-cv/",
          contentType: "application/json",
          type: 'GET'
        }).done(function(data) {
            console.log(data);
            $('.show-all-cvs').html('');
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
    }
    get_all_cv();

    $('.create--new--cv').click(function () {
        $.ajax({
            url: "http://myapp.com:8000/user/create-new-cv/",
            contentType: "application/json",
            type: 'GET'
        }).done(function(data) {
            console.log(data);
            get_all_cv();
        });
    });
})