(function() {
  var createTopHeaders, getTabContents, getTabHeaders, jqTabs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jqTabs = (function() {
    jqTabs.prototype.events = {};

    function jqTabs($tabsContainer, options) {
      var callback, event, tabContents, tabHeaders, zippedHeadersAndContents, _ref,
        _this = this;
      this.$tabsContainer = $tabsContainer;
      this.makeContent = __bind(this.makeContent, this);
      this.seek = __bind(this.seek, this);
      this.changeTab = __bind(this.changeTab, this);
      this.activeTab = 0;
      this.settings = {
        activeClass: 'active',
        useHistory: true,
        hiddenClass: 'hidden',
        tabsClickable: true
      };
      $.extend(this.settings, options);
      tabHeaders = getTabHeaders(this.$tabsContainer);
      tabContents = getTabContents(this.$tabsContainer);
      zippedHeadersAndContents = _.zip(tabHeaders, tabContents);
      console.log(zippedHeadersAndContents);
      console.log(createTopHeaders(zippedHeadersAndContents));
      if (this.settings.events != null) {
        _ref = options.events;
        for (event in _ref) {
          callback = _ref[event];
          this.on(event, callback);
        }
      }
      if (this.settings.useHistory && (typeof hasher === "undefined" || hasher === null)) {
        this.settings.useHistory = false;
      }
      if (!this.settings.tabsClickable) {
        this.settings.useHistory = false;
      }
      this.updateElements();
      this.numTabs = this.$tabContent.length;
      $(this.$tabs[0]).addClass(this.settings.activeClass);
      this.$tabContent.addClass(this.settings.hiddenClass);
      $(this.$tabContent[0]).removeClass(this.settings.hiddenClass);
      $('ul.tab-headers', this.$tabsContainer).on('click', 'li', function(e) {
        var target, toTab;
        e.preventDefault();
        if (_this.settings.tabsClickable) {
          target = $(e.currentTarget);
          if (!target.hasClass(_this.settings.activeClass)) {
            toTab = _this.$tabs.index(target);
            return _this.seek(toTab);
          }
        }
      });
      if (this.settings.useHistory) {
        this.setHashChange();
      }
    }

    jqTabs.prototype.changeTab = function(whereTo) {
      var $currentTab;
      $currentTab = $(this.$tabs[whereTo]);
      this.activeTab = whereTo;
      this.$tabs.removeClass(this.settings.activeClass);
      $currentTab.addClass(this.settings.activeClass);
      this.$tabContent.addClass(this.settings.hiddenClass);
      return $(this.$tabContent[whereTo]).removeClass(this.settings.hiddenClass);
    };

    jqTabs.prototype.seek = function(whereTo) {
      var $currentTab, goOn, hash;
      if (0 > whereTo || whereTo >= this.numTabs) {
        return;
      }
      goOn = this.trigger("beforeChange:" + whereTo, whereTo) || this.trigger('beforeChange', whereTo);
      if (goOn !== false) {
        if (this.settings.useHistory) {
          $currentTab = $(this.$tabs[whereTo]);
          hash = $currentTab.find('a').attr('href').replace(/\#/, '');
          hasher.changed.active = false;
          hasher.setHash(hash);
          hasher.changed.active = true;
        }
        this.changeTab(whereTo);
        this.trigger("change:" + whereTo);
        this.trigger('change', whereTo);
      }
    };

    jqTabs.prototype.next = function() {
      this.seek(this.activeTab + 1);
    };

    jqTabs.prototype.previous = function() {
      this.seek(this.activeTab - 1);
    };

    jqTabs.prototype.on = function(event, callback) {
      this.events[event] = this.events[event] || [];
      return this.events[event].push(callback);
    };

    jqTabs.prototype.off = function(event, callback) {
      if (!this.events[event]) {
        return;
      }
      if (callback) {
        return this.events[event].splice(this.events[event].indexOf(callback), 1);
      } else {
        return delete this.events[event];
      }
    };

    jqTabs.prototype.trigger = function() {
      var args, event, eventCallback, returnValues;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!this.events[event]) {
        return;
      }
      returnValues = (function() {
        var _i, _len, _ref, _results;
        _ref = this.events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          eventCallback = _ref[_i];
          _results.push(eventCallback.apply(this, args));
        }
        return _results;
      }).call(this);
      return !(__indexOf.call(returnValues, false) >= 0);
    };

    jqTabs.prototype.insertAfter = function(index, tabHeader, tabContent, select) {
      var $newTabContent, $newTabHeader, $tabContent, $tabHeader;
      select = select !== void 0 ? select : true;
      $tabHeader = $(this.$tabs[index]);
      $newTabHeader = this.makeHeader(tabHeader);
      $tabHeader.after($newTabHeader);
      $tabContent = $(this.$tabContent[index]);
      $newTabContent = this.makeContent(tabContent);
      $tabContent.after($newTabContent);
      this.numTabs++;
      this.updateElements();
      if (select) {
        this.seek(index + 1);
      }
      return $newTabContent;
    };

    jqTabs.prototype.insertBefore = function(index, tabHeader, tabContent, select) {
      var $newTabContent, $newTabHeader, $tabContent, $tabHeader;
      select = select !== void 0 ? select : true;
      $tabHeader = $(this.$tabs[index]);
      $newTabHeader = this.makeHeader(tabHeader);
      $tabHeader.before($newTabHeader);
      $tabContent = $(this.$tabContent[index]);
      $newTabContent = this.makeContent(tabContent);
      $tabContent.before($newTabContent);
      this.numTabs++;
      this.updateElements();
      if (select) {
        this.seek(index + 1);
      }
      return $newTabContent;
    };

    jqTabs.prototype.addTab = function(tabHeader, tabContent, select) {
      var $newTabContent, $newTabHeader, headerContainer;
      if (this.numTabs === 0) {
        headerContainer = this.$tabsContainer.find('.tab-headers');
        $newTabHeader = this.makeHeader(tabHeader);
        $newTabHeader.addClass(this.settings.activeClass);
        headerContainer.append($newTabHeader);
        $newTabContent = this.makeContent(tabContent);
        $newTabContent.removeClass(this.settings.hiddenClass);
        this.$tabsContainer.append($newTabContent);
        this.updateElements();
        this.numTabs++;
        return $newTabContent;
      } else {
        return this.insertAfter(this.numTabs - 1, tabHeader, tabContent, select);
      }
    };

    jqTabs.prototype.removeTab = function(index) {
      $(this.$tabs[index]).remove();
      $(this.$tabContent[index]).remove();
      this.numTabs--;
      return this.updateElements();
    };

    jqTabs.prototype.removeLast = function() {};

    jqTabs.prototype.updateElements = function() {
      this.$tabs = $('ul.tab-headers li:not(.ignore-tab)', this.$tabsContainer);
      return this.$tabContent = this.$tabsContainer.children('div');
    };

    jqTabs.prototype.makeHeader = function(header) {
      return $('<li/>').append(header);
    };

    jqTabs.prototype.makeContent = function(content) {
      return $('<div/>', {
        'class': 'tabcontent ' + this.settings.hiddenClass
      }).append(content);
    };

    jqTabs.prototype.setHashChange = function() {
      var historyChangeTab,
        _this = this;
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
        if (changeTo !== -1) {
          return _this.seek(changeTo);
        }
      };
      hasher.initialized.add(historyChangeTab);
      hasher.changed.add(historyChangeTab);
      hasher.init();
    };

    return jqTabs;

  })();

  getTabHeaders = function(container) {
    var headerContainers, headers;
    headerContainers = container.find('.tab-header');
    return headers = _.map(headerContainers, function(headerContainer) {
      return $(headerContainer).text();
    });
  };

  getTabContents = function(container) {
    return container.find('.tab-content');
  };

  createTopHeaders = function(headersAndContents) {
    var headerContainer, headers;
    headerContainer = $.parseHTML('<div class="tab-header-container"><ul class="tab-headers tabs"></ul></div>');
    console.log(headerContainer);
    headers = _.map(headersAndContents, function(_arg) {
      var content, header;
      header = _arg[0], content = _arg[1];
      console.log(header);
      console.log(content);
      return "<li><a href='#tab1'>" + header + "</a></li>";
    });
    return $('.tab-headers', headerContainer).append(headers);
  };

  window.jqTabs = jqTabs;

}).call(this);
