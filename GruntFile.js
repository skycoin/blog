var toml = require('toml');
var S = require('string');

var CONTENT_PATH_PREFIX = 'content/posts';

module.exports = function(grunt) {
  grunt.registerTask('lunr-index', function() {
    grunt.log.writeln('Build pages index');

    var indexPages = function() {
      var pagesIndex = [];
      grunt.file.recurse(CONTENT_PATH_PREFIX, function(
        abspath,
        rootdir,
        subdir,
        filename
      ) {
        grunt.verbose.writeln('Parse file:', abspath);
        pagesIndex.push(processFile(abspath, filename));
      });

      return pagesIndex;
    };

    var processFile = function(abspath, filename) {
      var pageIndex;

      if (S(filename).endsWith('.html')) {
        pageIndex = processHTMLFile(abspath, filename);
      } else if (S(filename).endsWith('.md')) {
        pageIndex = processMDFile(abspath, filename);
      }

      return pageIndex;
    };

    var processHTMLFile = function(abspath, filename) {
      var content = grunt.file.read(abspath);
      var pageName = S(filename).chompRight('.html').s;
      var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).s;
      var filteredContent = S(content)
        .trim()
        .stripTags()
        .stripPunctuation().s;

      if (!S(filteredContent).contains('draft = true')) {
        return {
          title: pageName,
          href: S(href)
            .replaceAll(' ', '-')
            .replaceAll('---', '-')
            .s.toLowerCase(),
          content: filteredContent,
        };
      }
    };

    var processMDFile = function(abspath, filename) {
      var content = grunt.file.read(abspath);
      var pageIndex;
      // First separate the Front Matter from the content and parse it
      content = content.split('+++');
      var frontMatter;
      try {
        frontMatter = toml.parse(content[1].trim());
      } catch (e) {
        console.log(e.message);
      }

      var href = S(abspath)
        .chompLeft(CONTENT_PATH_PREFIX)
        .chompRight('.md').s;
      // href for index.md files stops at the folder name
      if (filename === 'index.md') {
        href = S(abspath)
          .chompLeft(CONTENT_PATH_PREFIX)
          .chompRight(filename).s;
      }

      // Build Lunr index for this page
      var filteredContent = S(content[2])
        .trim()
        .stripTags()
        .stripPunctuation().s;

      if (!S(content[1]).contains('draft = true')) {
        if (content[2] != undefined) {
          pageIndex = {
            title: frontMatter.title || 'No title',
            // tags: frontMatter.tags,
            href: S(href)
              .replaceAll(' ', '-')
              .replaceAll('---', '-')
              .s.toLowerCase(),
            content: filteredContent,
          };
        }
      }

      return pageIndex;
    };

    grunt.file.write(
      'static/js/lunr/PagesIndex.json',
      JSON.stringify(indexPages())
    );
    grunt.log.ok('Index built');
  });
};
