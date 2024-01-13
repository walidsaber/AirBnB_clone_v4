$( window ).on( "load", function() {
    let dict = {}
    $('input').change(function() {
	if (this.checked) {
	    dict[$(this).attr('data-name')] = $(this).attr('data-id');
	}
	else {
	    delete dict[$(this).attr('data-name')];
	}
	$('.amenities h4').text(Object.keys(dict).join(', '));
    });
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
	if (status === 'success') {
	    $('div#api_status').addClass('available');
	}
	else {
	    $('div#api_status').removeClass('available');
	}
    });
});
