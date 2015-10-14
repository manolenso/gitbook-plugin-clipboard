var clipboard = require(clipboard);
var cherio = require('cherio');


module.exports = {
    // Extend website resources and html
    website: {
        assets: "./assets",
        js: [
            "embed-clipboard.js"
        ],
        css: [
            "test.css"
        ],
        html: {
            "html:start": function() {
                return "<!-- Start book "+this.options.title+" -->"
            },
            "html:end": function() {
                return "<!-- End of book "+this.options.title+" -->"
            },

            "head:start": "<!-- head:start -->",
            "head:end": "<!-- head:end -->",

            "body:start": "<!-- body:start -->",
            "body:end": "<!-- body:end -->"
        }
    },

    // Extend ebook resources and html
    website: {
        assets: "./book",
        js: [
            "test.js"
        ],
        css: [
            "test.css"
        ],
        html: {
            "html:start": function() {
                return "<!-- Start book "+this.options.title+" -->"
            },
            "html:end": function() {
                return "<!-- End of book "+this.options.title+" -->"
            },

            "head:start": "<!-- head:start -->",
            "head:end": "<!-- head:end -->",

            "body:start": "<!-- body:start -->",
            "body:end": "<!-- body:end -->"
        }
    },

    // Extend templating blocks
    blocks: {
        // Author will be able to write "{% myTag %}World{% endMyTag %}"
        myTag: {
            process: function(blk) {
                return "Hello "+blk.body;
            }
        }
    },

    // Extend templating filters
    filters: {
        // Author will be able to write "{{ 'test'|myFilter }}"
        myFilter: function(s) {
            return "Hello "+s;
        }
    },

    // Hook process during build
    hooks: {
      // This is called before the book is generated
      "init": function() {
          console.log("init!");
      },
      page: function(page) {
        var config = _.defaults(this.options.pluginsConfig
          .codepen, defaultConfig);
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
