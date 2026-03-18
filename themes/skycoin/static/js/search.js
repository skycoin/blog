var lunrIndex, $results, pagesIndex;

// Initialize lunrjs using our generated index file
function initLunr() {
  var request = new XMLHttpRequest();
  request.open(
    'GET',
    window.location.origin + '/blog/js/lunr/PagesIndex.json',
    true
  );

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      pagesIndex = JSON.parse(request.responseText);
      
      // Set up lunrjs by declaring the fields we use
      // Also provide their boost level for the ranking
      lunrIndex = lunr(function() {
        this.field('title', {
          boost: 10,
        });
        this.field('content', {
          boost: 5
        });
        // ref is the result item identifier (I chose the page URL)
        this.ref('href');
        for (var i = 0; i < pagesIndex.length; ++i) {
          if (pagesIndex[i] != null || pagesIndex[i] != undefined) {
            this.add(pagesIndex[i]);
          }
        }
      });
      getSearchValueFromQueryParamsURL();
    } else {
      console.error('Error getting Hugo index flie:');
    }
  };
  request.send();
}

// Nothing crazy here, just hook up a event handler on the input field
function initUI() {
  $results = document.getElementById('results');
  $searchForm = document.getElementById('searchForm');
  $search = document.getElementById('search-input');
  $searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var $resultsLength = document.getElementById('results-length');

    $resultsLength.style.display = 'block';
    while ($results.firstChild) {
      $results.removeChild($results.firstChild);
    }

    // Only trigger a search when 2 chars. at least have been provided
    var query = $search.value;
    if (query.length < 2) {
      $resultsLength.innerHTML = 'No post found';
      return;
    }

    //add some fuzzyness to the string matching to help with spelling mistakes.
    // var fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
    // var fuzzyQuery = query + '~' + fuzzLength;

    var results = search(query);
    if (results.length > 1) {
      $resultsLength.innerHTML = results.length + ' posts found for ' + '"'+query+'"';
    } else if (results.length === 1) {
      $resultsLength.innerHTML = results.length + ' post found for ' + '"'+query+'"';
    } else {
      $resultsLength.innerHTML = 'No post found for ' + '"'+query+'"';
    }

    window.history.replaceState({}, query, '?q='+query);

    renderResults(results);
  })
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
  // Find the item in our index corresponding to the lunr one to have more info
  // Lunr result:
  //  {ref: "/section/page1", score: 0.2725657778206127}
  // Our result:
  //  {title:"Page1", href:"/section/page1", ...}
  return lunrIndex.search(query).map(function(result) {
    return pagesIndex.filter(function(page) {
      if(page != null || page != undefined) {
        return page.href === result.ref;
      }
    })[0];
  });
}

/**
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
  if (!results.length) {
    return;
  }

  $results = document.getElementById('results');
  // to show 10 items only
  // results.slice(0, 10).forEach(function(result) {
  results.forEach(function(result) {
    var li = document.createElement('li');
    var ahref = document.createElement('a');
    ahref.href = window.location.origin + `/blog/posts${result.href}`;
    ahref.text = result.title;
    li.append(ahref);
    $results.appendChild(li);
  });
}

function getSearchValueFromQueryParamsURL() {
  var query = decodeURIComponent(window.location.search.slice(3));
  var $searchInputField = document.getElementById('search-input');
  var $resultsLength = document.getElementById('results-length');
  // check if value doesn't exist
  if (!query) {
    $resultsLength.innerHTML = 'No post found';
    return;
  }

  // populate the value to search box
  $searchInputField.value = query;

  // do the search
  //add some fuzzyness to the string matching to help with spelling mistakes.
  // var fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
  // var fuzzyQuery = query + '~' + fuzzLength;
  var fuzzyQuery = query;

  var results = search(fuzzyQuery);

  if (results.length > 1) {
    $resultsLength.innerHTML = results.length + ' posts found for ' + '"'+query+'"';
  } else if (results.length === 1) {
    $resultsLength.innerHTML = results.length + ' post found for ' + '"'+query+'"';
  } else {
    $resultsLength.innerHTML = 'No post found for ' + '"'+query+'"';
  }
  renderResults(results);
}



// Let's get started
initLunr();

document.addEventListener('DOMContentLoaded', function() {
  initUI();
});


// $search.onkeyup = function() {
//   var $resultsLength = document.getElementById('results-length');

//   $resultsLength.style.display = 'block';
//   while ($results.firstChild) {
//     $results.removeChild($results.firstChild);
//   }

//   // Only trigger a search when 2 chars. at least have been provided
//   var query = $search.value;
//   if (query.length < 2) {
//     $resultsLength.innerHTML = 'No post found';
//     return;
//   }

//   //add some fuzzyness to the string matching to help with spelling mistakes.
//   // var fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
//   // var fuzzyQuery = query + '~' + fuzzLength;
//   var fuzzyQuery = query;

//   var results = search(fuzzyQuery);
//   if (results.length > 1) {
//     $resultsLength.innerHTML = results.length + ' posts found for ' + '"'+query+'"';
//   } else if (results.length === 1) {
//     $resultsLength.innerHTML = results.length + ' post found for ' + '"'+query+'"';
//   } else {
//     $resultsLength.innerHTML = 'No post found for ' + '"'+query+'"';
//   }

//   renderResults(results);
// };
