// Colorize help/output text blocks to match terminal ANSI colors
// Terminal uses: \e[94;1m (bold bright blue) for headings/commands/ASCII art
//               \e[94m (bright blue) for descriptions
function colorizeHelpBlock(codeEl) {
  var text = codeEl.textContent;
  var lines = text.split('\n');
  var html = [];
  // Box-drawing chars used in ASCII art banners
  var boxChars = /[┌┐└┘├┤┬┴┼─│╭╮╯╰┊┈┅╌╍┉╎╏┃┇┆┋╵╷╶╴╸╺╻╹┍┎┑┒┕┖┙┚┝┞┟┠┡┢┥┦┧┨┩┪┭┮┯┰┱┲┵┶┷┸┹┺┽┾┿╀╁╂╃╄╅╆╇╈╉╊]/;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmed = line.trim();

    if (trimmed === '') {
      // Empty line
      html.push('');
    } else if (boxChars.test(trimmed)) {
      // ASCII art banner line
      html.push(span('hb', line));
    } else if (/^\$\s/.test(trimmed)) {
      // Prompt line: $ command args
      var afterDollar = line.indexOf('$');
      var prefix = line.substring(0, afterDollar);
      var rest = line.substring(afterDollar + 1);
      html.push(prefix + span('hd', '$') + span('hb', rest));
    } else if (/^(Usage|Available Commands|Flags|Environment variables|Commands|Options|Aliases|Examples|Global Flags)\s*:/.test(trimmed)) {
      // Section heading
      html.push(span('hb', line));
    } else if (/^\s+-\w|^\s+--\w/.test(line)) {
      // Flag line: "  -x, --flag    description"
      var flagMatch = line.match(/^(\s+-\S+(?:,\s+--\S+)?(?:\s+\S+)?)\s{2,}(.+)$/);
      if (flagMatch) {
        html.push(span('hb', flagMatch[1]) + '  ' + span('hd', flagMatch[2]));
      } else {
        html.push(span('hb', line));
      }
    } else if (/^\s{2,}\S/.test(line) && /\s{2,}/.test(trimmed)) {
      // Command listing line: "  name    description" (indented, with gap)
      var cmdMatch = line.match(/^(\s+\S+)\s{2,}(.+)$/);
      if (cmdMatch) {
        var gap = line.substring(cmdMatch[1].length, line.indexOf(cmdMatch[2].trim(), cmdMatch[1].length));
        html.push(span('hb', cmdMatch[1]) + gap + span('hd', cmdMatch[2]));
      } else {
        html.push(span('hd', line));
      }
    } else if (/^\s{2,}\S/.test(line)) {
      // Indented line without gap (usage example, continuation)
      html.push(span('hb', line));
    } else {
      // Regular text (descriptions, etc.)
      html.push(span('hd', line));
    }
  }

  codeEl.innerHTML = html.join('\n');
}

function span(cls, text) {
  var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<span class="' + cls + '">' + escaped + '</span>';
}

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

    // Colorize help output blocks to match terminal colors
    if (isOutput) {
      colorizeHelpBlock(code);
      continue;
    }

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
  var gorunNote = document.getElementById('cmd-tab-note-gorun');

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

          // Show/hide context notes
          var isGoRunSource = (cmd === 'go run .');
          var isGoRunRemote = (cmd.indexOf('github.com/') !== -1);
          if (sourceNote) sourceNote.style.display = isGoRunSource ? '' : 'none';
          if (gorunNote) gorunNote.style.display = isGoRunRemote ? '' : 'none';

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
