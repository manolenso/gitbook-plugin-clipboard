  'use strict';
var clipboard = require(clipboard);
var cherio = require('cherio');
var parse = require('url-parse')
module.exports = {
    // Extend website resources and html
    book: {
        assets: "./assets",
        js: [
            "embed-clipboard.js"
        ]
    },
    // Hook process during build
    hooks: {
      // This is called before the book is generated
      "init": function() {
          console.log("init!");
      },
      page: function(page) {
        var config = _.defaults(this.options.pluginsConfig
          .clipboard, defaultConfig);
        _.each(page.sections, function(section) {
          var $ = cheerio.load(section.content);
          $('a').filter(function() {
            var href = $(this).attr('href');
            return parse(href).protocol ===
              'clipboard';
          }).each(function(index, a) {
            a = $(a);
            var rst = parse(a.attr('href'), true);
            a.replaceWith(template(_.extend({},
              config, rst.query, {
                user: rst.host,
                pen: rst.pathname.slice(1)
              })));
          });
          section.content = $.html();
        });
        return page;
      }
    }
  };
