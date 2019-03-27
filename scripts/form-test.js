$(document).ready(function(){
    $("#update").click(function(e) {
  e.preventDefault();
  alert('wahattips');
  var author_name = $("#author_name").val(); 
  var bulletin_text = $("#bulletinText").val();
  var dataString = 'bulletinText='+bulletin_text+'&author_name='+author_name;
  $.ajax({
    type:'POST',
    data:dataString,
    url:'/mildly-infuriating-hangman/insert.php',
    success:function(data) {
      alert(data);
    }
  });
});
});

