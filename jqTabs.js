(function() {
  "use strict";
  var jqTabs;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jqTabs = (function() {
    var activeTab, settings;
    activeTab = 0;
    settings = {
      activeClass: 'activeTab',
      useHistory: true
    };
    function jqTabs($tabsContainer, options) {
      this.seek = __bind(this.seek, this);
      this.changeTab = __bind(this.changeTab, this);
      var historyChangeTab, seek;
      seek = this.seek;
      if (settings.useHistory && !(typeof hasher !== "undefined" && hasher !== null)) {
        settings.useHistory = false;
      }
      $.extend(settings, options);
      this.$tabs = $('ul.tab-headers li', $tabsContainer);
      this.$tabContent = $tabsContainer.children('div').children('div');
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
      if (settings.useHistory) {
        historyChangeTab = __bind(function(newHash) {
          var changeTo;
          changeTo = -1;
          this.$tabs.each(function(index, elem) {
            var href;
            href = $(elem).children('a').attr('href');
            href = href.replace(/\#/, '');
            if (href === newHash) {
              changeTo = index;
              return false;
            }
          });
          if (changeTo !== -1) {
            return this.changeTab(changeTo);
          }
        }, this);
        hasher.initialized.add(historyChangeTab);
        hasher.changed.add(historyChangeTab);
        hasher.init();
      }
    }
    jqTabs.prototype.changeTab = function(whereTo) {
      var $currentTab;
      $currentTab = $(this.$tabs[whereTo]);
      activeTab = whereTo;
      this.$tabs.removeClass(settings.activeClass);
      $currentTab.addClass(settings.activeClass);
      this.$tabContent.addClass("hidden");
      return $(this.$tabContent[whereTo]).removeClass("hidden");
    };
    jqTabs.prototype.seek = function(whereTo) {
      var $currentTab, hash;
      if (!((0 <= whereTo && whereTo < this.numTabs))) {
        return;
      }
      if (settings.useHistory) {
        $currentTab = $(this.$tabs[whereTo]);
        hash = $currentTab.find('a').attr('href').replace(/\#/, '');
        hasher.setHash(hash);
      }
      this.changeTab(whereTo);
    };
    jqTabs.prototype.next = function() {
      this.seek(activeTab + 1);
    };
    jqTabs.prototype.previous = function() {
      this.seek(activeTab - 1);
    };
    return jqTabs;
  })();
  window.jqTabs = jqTabs;
}).call(this);
