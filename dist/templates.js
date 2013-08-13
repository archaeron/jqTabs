this["JST"] = this["JST"] || {};

this["JST"]["templates/header.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<li>\n	<a href=\"#\">#{header}</a>\n</li>\n";
  });

this["JST"]["templates/headerContainer.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"tab-header-container\"><ul class=\"tab-headers tabs\"></ul></div>\n";
  });