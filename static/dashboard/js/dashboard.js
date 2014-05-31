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
                                '<th>No. of Edits</th>'+
                                '<th>Edit Link</th>'+
                            '</tr>';
            for( var key in data) {
                totalUpdates = data[key].length-1;
                lastUpdate = data[key][totalUpdates]
                lastUpdate = lastUpdate.split(' ');

                fetchedCvData += ''+
                    '<tr>'+
                        '<td>'+key+'</td>'+
                        '<td><em>Date: </em>'+lastUpdate[0]+'<em> Time: </em>'+lastUpdate[1]+', <em>IST</em></td>'+
                        '<td>'+totalUpdates+'</td>'+
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