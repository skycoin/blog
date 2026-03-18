var tagsItem = document.getElementsByClassName("tags__item");
for(var i = 0; i < tagsItem.length; i++) {
  tagsItem[i].innerHTML = tagsItem[i].innerHTML.split("-").join(" ");
}


var $searchFormTags = document.getElementById('search-form-tags');
var $searchFormList = document.getElementById('search-form-list');

var onSubmit = function(event, formName) {
  event.preventDefault();

  // get search input value
  var $searchInput = document.querySelector(`#${formName} .search .search__field #input`);

  if (!$searchInput.value) {
    return;
  }

  // window.localStorage.setItem('searchValue', $searchInput.value);

  // go to search page
  window.location.href = window.location.origin + "/blog/search/?q="+$searchInput.value;
};

$searchFormTags.addEventListener(
  'submit',
  function(event) {
    onSubmit(event, 'search-form-tags');
  },
  false
);
$searchFormList.addEventListener(
  'submit',
  function(event) {
    onSubmit(event, 'search-form-list');
  },
  false
);
