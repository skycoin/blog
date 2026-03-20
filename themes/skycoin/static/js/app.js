// Add copy buttons to code blocks (skip output-only blocks marked as language-text)
// Command tab switcher: replaces "skycoin" command in bash blocks with selected variant
(function() {
  var pres = document.querySelectorAll('pre');
  var bashBlocks = [];

  for (var i = 0; i < pres.length; i++) {
    var pre = pres[i];
    var code = pre.querySelector('code');
    var isOutput = code && code.classList.contains('language-text');
    var isBash = code && code.classList.contains('language-bash');

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    if (isBash) {
      bashBlocks.push({ code: code, original: code.textContent });
    }

    if (isOutput) continue;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.type = 'button';
    wrapper.appendChild(btn);

    btn.addEventListener('click', (function(targetPre, targetBtn) {
      return function() {
        var c = targetPre.querySelector('code');
        var text = (c || targetPre).textContent;
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

  // Command tab switching
  var tabs = document.querySelectorAll('.cmd-tab');
  var sourceNote = document.getElementById('cmd-tab-note-source');

  if (tabs.length > 0) {
    // Regex: match "skycoin" used as a command (followed by subcommand),
    // but not inside URLs like github.com/skycoin/...
    var cmdPattern = /(^|[ \t])skycoin(?= +(cli|daemon|newcoin|web|explorer)\b)/gm;

    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', (function(clickedTab) {
        return function() {
          var cmd = clickedTab.getAttribute('data-cmd');

          // Update active tab
          for (var j = 0; j < tabs.length; j++) {
            tabs[j].classList.remove('active');
          }
          clickedTab.classList.add('active');

          // Show/hide source note
          if (sourceNote) {
            sourceNote.style.display = (cmd === 'go run .') ? '' : 'none';
          }

          // Replace commands in all bash blocks
          for (var k = 0; k < bashBlocks.length; k++) {
            var block = bashBlocks[k];
            var replaced = block.original.replace(cmdPattern, '$1' + cmd);
            block.code.textContent = replaced;
          }
        };
      })(tabs[t]));
    }
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
