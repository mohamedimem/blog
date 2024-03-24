var previousScroll = 0,
    headerOrgOffset = $('#header').offset().top;

$('#header-container').height($('#header').height());

$(window).scroll(function() {
    var currentScroll = $(this).scrollTop();
    console.log(currentScroll + " and " + previousScroll + " and " + headerOrgOffset);
    if (currentScroll > headerOrgOffset) {
        if (currentScroll > previousScroll) {
            $('#header').fadeOut();
        } else {
            $('#header').fadeIn();
            $('#header').addClass('fixed');
        }
    } else {
        $('#header').removeClass('fixed');
    }
    previousScroll = currentScroll;
});
