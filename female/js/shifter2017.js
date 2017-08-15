//GLOBAL STATE VARS
var frontPageVisible = true;
var currentSection = false;


//CHANGING BETWEEN FRONT PAGE AND CONTENT:

function hideFrontPage(sectionId) {
	$('#rightContent').animate({'top':'0%'}, 900).css('display', 'block');
		//sort out position of content on RHS
	var elToScrollTo = $('#'+sectionId+'Section > .title');
	$('#rightContent').scrollTop(elToScrollTo.position().top);

	$('#leftBar').animate({'left':'0px'});
	$('#frontPage').fadeOut(600); 
	frontPageVisible = false;
}

function showFrontPage() {
	$('#rightContent').animate({'top' : '100%'}, 900, function(){$(this).css({'display':'none'})}); 
	//	.animate({'top':'100%'});
	$('#leftBar').animate({'left':'-200px'}, 600, function() {
		$('#leftBar .girlContainer > img').css('display', 'none');
	});
	$('#frontPage').fadeIn(900); 
	frontPageVisible = true;
}

//MOVE TO CORRECT CONTENT SECTION
function goToLink(event) {
	var sectionId = $(event.currentTarget).attr('data-link');

	if (frontPageVisible) { // move left bar version of girl over to front page position, then animate back again!
		//work out position of girl we clicked
		clickedGirl = $('#frontPage .girlContainer[data-link='+sectionId+']').children('img');
		var posStart = clickedGirl.offset();
		posStart.position = 'fixed';
		posStart.width = '200px';
		//find appropriate girl in the left bar
		var girlToMove = $('.girlContainer > .' + sectionId);
		// make her visible so we can...
		girlToMove.css({'display': 'initial'});
		// get her position
		var posEnd = girlToMove.offset();
		//hide the front page version
		clickedGirl.css('display', 'none');
		// send her over to the middle of the page
		girlToMove.css(posStart);
		//animate her back over to her starting place
		girlToMove.animate({position:'absolute', 'left': 30, 'top':posEnd.top, 'width':'130px'}, 900, function() {
			//restore original properties.
			girlToMove.css({'position': 'initial'});
			clickedGirl.css('display', 'initial');
		});
		hideFrontPage(sectionId);
	} else if (currentSection != sectionId) {
		// swap the ladies
		$('.girlContainer > .' + currentSection).fadeOut(600, function(){
			$('.girlContainer > .' + sectionId).fadeIn(600);
		});
		// work out what we need to show
		var elToScrollTo = $('#'+sectionId+'Section > .title');
		$('#rightContent').animate({
				scrollTop: elToScrollTo.position().top
		}, 600);
	}
	currentSection = sectionId;
}

//SET UP IMAGES ETC
$(document).ready(function() {
	$('#frontPage .girlContainer, #frontPage .linkTextContainer').click(goToLink);
	$('#mainGirlLogoContainer').click(showFrontPage)
	$('.leftLink').click(goToLink);
	
	for (var x=0; x<15; x++) {
		var html = `
					<div class='mediaPhotoContainer'>
						<div class='photoCenterer'>
							<img src='img/photo/`;
				html += x;
				html+= `
							.jpg'>
						</div>
					</div>
					`;
		$('#mediaSection').append(html);
	}
});
