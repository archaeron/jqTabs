(function() {
  var jqTabs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jqTabs = (function() {
    var activeTab, settings;

    activeTab = 0;

    settings = {
      activeClass: 'active',
      useHistory: true,
      hiddenClass: 'hidden',
      tabsClickable: true,
      callbacksBefore: {},
      callbacksAfter: {}
    };

    function jqTabs($tabsContainer, options) {
      this.seek = __bind(this.seek, this);
      this.changeTab = __bind(this.changeTab, this);
      var historyChangeTab, seek,
        _this = this;
      seek = this.seek;
      $.extend(settings, options);
      if (settings.useHistory && !(typeof hasher !== "undefined" && hasher !== null)) {
        settings.useHistory = false;
      }
      if (!settings.tabsClickable) settings.useHistory = false;
      this.$tabs = $('ul.tab-headers li', $tabsContainer);
      this.$tabContent = $tabsContainer.children('div').children('div');
      this.numTabs = this.$tabContent.length;
      $(this.$tabs[0]).addClass(settings.activeClass);
      this.$tabContent.addClass(settings.hiddenClass);
      $(this.$tabContent[0]).removeClass(settings.hiddenClass);
      this.$tabs.each(function(index) {
        var tab;
        tab = $(this);
        tab.attr("data-tabnr", index);
        if (!settings.tabsClickable) {
          return tab.children('a').css('cursor', 'default');
        }
      });
      this.$tabs.click(function(e) {
        var $goToTab, toTab;
        e.preventDefault();
        if (settings.tabsClickable) {
          $goToTab = $(this);
          if (!$goToTab.hasClass(settings.activeClass)) {
            toTab = parseInt($goToTab.attr("data-tabnr"), 10);
            return seek(toTab);
          }
        }
      });
      if (settings.useHistory) {
        historyChangeTab = function(newHash) {
          var changeTo;
          changeTo = -1;
          _this.$tabs.each(function(index, elem) {
            var href;
            href = $(elem).children('a').attr('href');
            href = href.replace(/\#/, '');
            if (href === newHash) {
              changeTo = index;
              return false;
            }
          });
          if (changeTo !== -1) return _this.seek(changeTo);
        };
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
      this.$tabContent.addClass(settings.hiddenClass);
      return $(this.$tabContent[whereTo]).removeClass(settings.hiddenClass);
    };

    jqTabs.prototype.seek = function(whereTo) {
      var $currentTab, go_on, hash;
      if (0 > whereTo || whereTo >= this.numTabs) return;
      go_on = true;
      if (settings.callbacksBefore[whereTo] != null) {
        go_on = settings.callbacksBefore[whereTo]();
      }
      if (go_on !== false) {
        if (settings.useHistory) {
          $currentTab = $(this.$tabs[whereTo]);
          hash = $currentTab.find('a').attr('href').replace(/\#/, '');
          hasher.setHash(hash);
        }
        this.changeTab(whereTo);
        if (settings.callbacksAfter[whereTo] != null) {
          settings.callbacksAfter[whereTo]();
        }
      }
    };

    jqTabs.prototype.next = function() {
      this.seek(activeTab + 1);
    };

    jqTabs.prototype.previous = function() {
      this.seek(activeTab - 1);
    };

    jqTabs.prototype.on = function(index, position, callback) {
      switch (position) {
        case 'before':
          return settings.callbacksBefore[index] = callback;
        case 'after':
          return settings.callbacksAfter[index] = callback;
      }
    };

    return jqTabs;

  })();

  window.jqTabs = jqTabs;

}).call(this);
