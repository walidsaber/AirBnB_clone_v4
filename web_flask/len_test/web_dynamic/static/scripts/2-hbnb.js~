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
});
