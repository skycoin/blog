// Add copy buttons to code blocks
(function() {
  var pres = document.querySelectorAll('pre');
  for (var i = 0; i < pres.length; i++) {
    var pre = pres[i];
    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.type = 'button';
    wrapper.appendChild(btn);

    btn.addEventListener('click', (function(targetPre, targetBtn) {
      return function() {
        var code = targetPre.querySelector('code');
        var text = (code || targetPre).textContent;
        navigator.clipboard.writeText(text).then(function() {
          targetBtn.textContent = 'Copied';
          targetBtn.classList.add('copied');
          setTimeout(function() {
            targetBtn.textContent = 'Copy';
            targetBtn.classList.remove('copied');
          }, 2000);
        });
      };
    })(pre, btn));
  }
})();

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
