(function() {
  "use strict";
  var jqTabs;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jqTabs = (function() {
    var activeTab, settings;
    activeTab = 0;
    settings = {
      activeClass: 'activeTab'
    };
    function jqTabs($tabsContainer, options) {
      this.seek = __bind(this.seek, this);
      var seek;
      seek = this.seek;
      $.extend(settings, options);
      this.$tabs = $('ul.tab-headers li', $tabsContainer);
      this.$tabContent = $('> div > div', $tabsContainer);
      this.numTabs = this.$tabContent.length;
      $(this.$tabs[0]).addClass(settings.activeClass);
      this.$tabContent.addClass("hidden");
      $(this.$tabContent[0]).removeClass("hidden");
      this.$tabs.each(function(index) {
        return $(this).attr("data-tabnr", index);
      });
      this.$tabs.click(function(e) {
        var $goToTab, toTab;
        e.preventDefault();
        $goToTab = $(this);
        if (!$goToTab.hasClass(settings.activeClass)) {
          toTab = parseInt($goToTab.attr("data-tabnr"), 10);
          return seek(toTab);
        }
      });
    }
    jqTabs.prototype.seek = function(whereTo) {
      this.$tabs.removeClass(settings.activeClass);
      $(this.$tabs[whereTo]).addClass(settings.activeClass);
      this.$tabContent.addClass("hidden");
      $(this.$tabContent[whereTo]).removeClass("hidden");
      activeTab = whereTo;
    };
    jqTabs.prototype.next = function() {
      if (activeTab + 1 < this.numTabs) {
        this.seek(activeTab + 1);
      }
    };
    jqTabs.prototype.previous = function() {
      if (activeTab - 1 >= 0) {
        this.seek(activeTab - 1);
      }
    };
    return jqTabs;
  })();
  window.jqTabs = jqTabs;
}).call(this);
