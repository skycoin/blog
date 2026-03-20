// Colorize help/output text blocks to match terminal ANSI colors
// Terminal uses: \e[94;1m (bold bright blue) for section headings, command names, flag names
//               \e[94m (bright blue) for descriptions
//               No color for: ASCII art, version lines, prompt lines, plain text, flag types
function colorizeHelpBlock(codeEl) {
  // Get all line content spans (Chroma wraps each line in <span class="line"><span class="cl">)
  var clSpans = codeEl.querySelectorAll('.cl');
  // If no Chroma structure, fall back to operating on the code element directly
  var lines;
  if (clSpans.length > 0) {
    lines = [];
    for (var s = 0; s < clSpans.length; s++) {
      lines.push({ el: clSpans[s], text: clSpans[s].textContent });
    }
  } else {
    // Plain code block, split by newlines
    var allText = codeEl.textContent;
    var splitLines = allText.split('\n');
    codeEl.textContent = '';
    lines = [];
    for (var s = 0; s < splitLines.length; s++) {
      var ln = document.createElement('span');
      ln.textContent = splitLines[s];
      codeEl.appendChild(ln);
      if (s < splitLines.length - 1) codeEl.appendChild(document.createTextNode('\n'));
      lines.push({ el: ln, text: splitLines[s] });
    }
  }

  var headingRe = /^(Usage|Available Commands|Flags|Environment variables|Commands|Options|Aliases|Examples|Global Flags)\s*:/;
  var allTexts = [];
  for (var k = 0; k < lines.length; k++) allTexts.push(lines[k].text);

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].text;
    var el = lines[i].el;
    var trimmed = line.trim();

    if (trimmed === '') {
      continue; // empty line, no coloring
    } else if (headingRe.test(trimmed)) {
      // Section heading — bold bright blue
      el.innerHTML = span('hb', line);
    } else if (/^\s+-\w|^\s+--\w/.test(line)) {
      // Flag line: "  -c, --coin string    Description text"
      var flagMatch = line.match(/^(\s+)(-\S+(?:,\s+--\S+)?)(\s+\S+)?\s{2,}(.+)$/);
      if (flagMatch) {
        var indent = esc(flagMatch[1]);
        var flags = span('hb', flagMatch[2]);
        var typeKw = flagMatch[3] ? esc(flagMatch[3]) : '';
        var beforeDesc = flagMatch[1] + flagMatch[2] + (flagMatch[3] || '');
        var descStart = line.indexOf(flagMatch[4], beforeDesc.length);
        var gap = esc(line.substring(beforeDesc.length, descStart));
        el.innerHTML = indent + flags + typeKw + gap + span('hd', flagMatch[4]);
      } else {
        el.innerHTML = span('hb', line);
      }
    } else if (/^\s{2,}\S/.test(line) && /\S\s{2,}\S/.test(line)) {
      // Command listing: "  name    description"
      var cmdMatch = line.match(/^(\s+)(\S+)(\s{2,})(.+)$/);
      if (cmdMatch) {
        el.innerHTML = esc(cmdMatch[1]) + span('hb', cmdMatch[2]) + esc(cmdMatch[3]) + span('hd', cmdMatch[4]);
      }
    } else if (/^\s{2,}\S/.test(line)) {
      var prev = findPrevNonEmpty(allTexts, i);
      if (headingRe.test(allTexts[prev].trim())) {
        // Usage line right after "Usage:" — bold blue the first word (command), rest plain
        var usageMatch = line.match(/^(\s+)(\S+)(.*)$/);
        if (usageMatch) {
          el.innerHTML = esc(usageMatch[1]) + span('hb', usageMatch[2]) + esc(usageMatch[3]);
        }
      }
      // else: plain indented text, no coloring
    }
    // Everything else: no coloring (ASCII art, version, prompt, description text stay default)
  }
}

function findPrevNonEmpty(lines, idx) {
  for (var j = idx - 1; j >= 0; j--) {
    if (lines[j].trim() !== '') return j;
  }
  return 0;
}

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function span(cls, text) {
  return '<span class="' + cls + '">' + esc(text) + '</span>';
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
