/*
	Basic Hangman game
	Player can press the buttons on screen or use keyboard input to play
	Made by Jordan Maurice
*/

//Intialize variables
var link = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=1652956318bc664a0c50602b9930097d536bc669d02e039d3"
var definition = "generic definition here";
var alphacharacters = 'abcdefghijklmnopqrstuvwxyz';
var alphabet = alphacharacters.split('');
var hangmanWord = '';
var definition = "";
var source = "";
var hangmanWordLetterContainers = [];
var previouslyChosen = '';
var totalIncorrectLetters = 0;
var totalRemainingBlanks = 0;
var hangmanparts = 6;

//Execute this code as soon as page loads
$(document).ready(function(){

	addLetterTiles();
	getWord();

	//Add on click function to the hangman tiles
	$('.hangman-tiles div').click(function(){
		submitLetter(this.innerHTML, this);
	});

	//Start a new game when player clicks the button
	$('#game-over-replay').click(function(){
		getWord();
	});

	//Listen for key press to submit letters
	$(window).keypress(function(e){
		var thisKey = String.fromCharCode(e.which);
		thisKey.toLowerCase();
		//Key can be pressed, even if caps lock is on
		if(alphacharacters.indexOf(thisKey) > -1) {
			submitLetter(thisKey, document.getElementById(`letter-${thisKey}`));
		}
	})
});

//Add alphabet tiles to the page
function addLetterTiles(){
		alphabet.forEach((i) => {
		$('.hangman-tiles').append(`<div class="letter-tile" id="letter-${i}">${i}</div>`);
		});
}

//Callled when game is reset
function newHangmanWord(){
	setUp();
}

//Retrieve word from Wordnik API
function getWord(){
	var jQueryRequest = $.getJSON(link, function(json) {
  		hangmanWord = json['word']
  		hangmanWord = hangmanWord.toLowerCase();
  		//console.log(hangmanWord);
	})
  	.done(function(){})
  	.fail(function(){console.log("error");})
  	.always(function() {});
  
  	jQueryRequest.complete(function() {
  		newHangmanWord();
	});
}

//Retrieves definition from Wordnik API
function getDefinition(){
	var newdefLink = 'https://api.wordnik.com/v4/word.json/'+hangmanWord+'/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=1652956318bc664a0c50602b9930097d536bc669d02e039d3'
	var definitionRequest = $.getJSON(newdefLink, function(json) {
  		//console.log( "Successfully retrieved definition" );
  		if(json.length > 0){
	  		definition = json[0]['text'];
	  		source = json[0]['sourceDictionary'];
	  	}
	  	else{
	  		definition = "null";
	  		source = "null";
	  	}

	})

  	.done(function(){})
  	.fail(function(){console.log("Error retrieving definition" );})
  	.always(function(){});

	definitionRequest.complete(function() {
	});
}

//Called when key is pressed
function submitLetter(pressedLetter,letterButton){
	var isIncluded = letterChosen(pressedLetter);
	if(isIncluded){
		$(letterButton).addClass('disabled correct');
	}
	else{
		$(letterButton).addClass("disabled incorrect")
	}

	if(totalRemainingBlanks < 1){
		gameOver(true);
	}
	if (totalIncorrectLetters >= hangmanparts){
		gameOver(false);
	}

}

//Creates a game 
function setUp(){
	$('.game-over').hide();
	$('.hangman-tiles').show();

	//Reset variables so we can start a new game
	hangmanWordLetterContainers = [];
	previouslyChosen = '';
	totalIncorrectLetters = 0;
	totalRemainingBlanks = hangmanWord.length;

	//Reset all hangman tiles
	$('.hangman-tiles div').each(function(){
		this.classList = '';
	})
	
	//Reset the word blanks space
	$('.hangman-word').html('');

	//Reset Hangman Image
	$('#hangman').attr("src","images/hangman0.png");
	
	hangmanWord.split('').forEach((i) => {
	var thisClass = "hangman-word-letters",
			placeholder = "&nbsp;";
		if(i == ' ' || i == '-') {
			thisClass += ' space';
			totalRemainingBlanks--;
			placeholder = i;
		}
		$('.hangman-word').append(`<div class="${thisClass}">${placeholder}</div>`);
	});

	hangmanWordLetterContainers = document.getElementsByClassName('hangman-word-letters');

	//Gets defintion from Wordnik API
	getDefinition();
}

//check if the letter is correct, then add it to the board
function letterChosen(letter) {
	if(previouslyChosen.indexOf(letter) < 0) {
		previouslyChosen+=letter;
		var checkResults = checkLetter(hangmanWord, letter);
		if(checkResults) {
			checkResults.forEach(function(item) {
				hangmanWordLetterContainers[item].innerHTML = letter;
				totalRemainingBlanks--;
			});
			return true;
		}
		else {
			incorrectGuess(letter);
			return false;
		} 
	}
}

//Check the hangman word for the submitted letter, return false or all instances of the letter
function checkLetter(hangmanAnswer, thisLetter) {
	var indexes = [];
	hangmanAnswer.split('').forEach(function(item, index){
		if(item == thisLetter) {
			indexes.push(index);
		}
	});
	return indexes.length > 0 ? indexes : false;
}

//If guess is incorrect, add to the hangman
function incorrectGuess(letter) {
	totalIncorrectLetters++;
	//Makes sure we don't go out of range of our images
	if(totalIncorrectLetters >= 0 && totalIncorrectLetters <7){
			$('#hangman').attr("src","images/hangman" + totalIncorrectLetters + ".png");
	}

}

//Called when game ends (either by too many guesses, or by completing the word)
function gameOver(result){
	$(".hangman-tiles").hide();

	if(result){
		//Hide the lost div and show they won
		$('.game-over-lost').hide();
		$('.game-over-won').show();

		//Set the word text and color
		$('#word-won').text(hangmanWord);
		$('.game-over').css('background',"rgba(175, 210, 117, 0.9)");
		
		//If definition exists, display it
		if(definition!="null"){
			//console.log("appending text" + hangmanWord + definition);
			var strippedDef = definition.replace(/(<([^>]+)>)/gi, "");
			$('#def-text-won').text(strippedDef);
		}
	}

	if(!result){
		//Fill puzzle at the bottom
		$('.hangman-word-letters').each(function(index) {
			//console.log($(this).html());
			if($(this).html() == "&nbsp;" && !$(this).hasClass("space")) {
				$(this).html(hangmanWord.charAt(index));
				$(this).addClass('game-lost');
			}
		});

		//Hide the won div and show they lost
		$('.game-over-lost').show();
		$('.game-over-won').hide();

		//Set the color and the word
		$(".game-over").css('background',"rgba(231, 113, 125, 0.9)");
		$('#word-lost').text(hangmanWord);

		//If a definition is available, show it
		if(definition!="null"){
			var strippedDef = definition.replace(/(<([^>]+)>)/gi, "");
			$('#def-text-lost').text(strippedDef);
		}
	}

	//Show the  game over div and set its focus to the button so player can just hit enter to start again
	$('.game-over').show();
	$('#game-over-replay').focus();
}
