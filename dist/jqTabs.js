(function() {
  var createTopHeaders, getTabContents, getTabHeaders, jqTabs, makeHeader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jqTabs = (function() {
    jqTabs.prototype.events = {};

    function jqTabs(el, options) {
      var callback, event, topHeaders, _ref;
      this.el = el;
      this.makeContent = __bind(this.makeContent, this);
      this.seek = __bind(this.seek, this);
      this.changeTab = __bind(this.changeTab, this);
      this.activeTab = 0;
      this.settings = {
        activeClass: 'active',
        inactiveClass: 'inactive',
        useHistory: true,
        tabsClickable: true
      };
      $.extend(this.settings, options);
      this.tabHeaders = getTabHeaders(this.el);
      this.tabContents = getTabContents(this.el);
      topHeaders = createTopHeaders(this.tabHeaders);
      this.el.prepend(topHeaders);
      if (this.settings.events != null) {
        _ref = options.events;
        for (event in _ref) {
          callback = _ref[event];
          this.on(event, callback);
        }
      }
      this.setActiveHeader(0);
      this.setActiveContent(0);
      this.tabContents.addClass(this.settings.hiddenClass);
      $(this.tabContents[0]).removeClass(this.settings.hiddenClass);
      this.attachEventsToHeaders(this.tabHeaders);
    }

    jqTabs.prototype.attachEventsToHeaders = function(headers) {
      var _this = this;
      return headers.each(function(i, header) {
        console.log(header);
        return $(header).click(function(e) {
          var target;
          e.preventDefault();
          if (_this.settings.tabsClickable) {
            target = $(e.currentTarget);
            if (!target.hasClass(_this.settings.activeClass)) {
              return _this.seek(i);
            }
          }
        });
      });
    };

    jqTabs.prototype.changeTab = function(whereTo) {
      var currentTab;
      currentTab = $(this.tabHeaders[whereTo]);
      this.activeTab = whereTo;
      this.setActiveHeader(whereTo);
      this.setActiveContent(whereTo);
      return currentTab;
    };

    jqTabs.prototype.seek = function(whereTo) {
      var currentTab, goOn;
      if (0 > whereTo || whereTo >= this.tabHeaders.length) {
        return;
      }
      goOn = this.trigger("beforeChange:" + whereTo, whereTo) && this.trigger('beforeChange', whereTo);
      console.log(goOn);
      if (goOn !== false) {
        currentTab = this.changeTab(whereTo);
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
      console.log(event, this.events[event]);
      if (!this.events[event]) {
        return true;
      } else {
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
      }
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
        headerContainer = this.el.find('.tab-headers');
        $newTabHeader = this.makeHeader(tabHeader);
        $newTabHeader.addClass(this.settings.activeClass);
        headerContainer.append($newTabHeader);
        $newTabContent = this.makeContent(tabContent);
        $newTabContent.removeClass(this.settings.hiddenClass);
        this.el.append($newTabContent);
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

    jqTabs.prototype.setActiveHeader = function(whereTo) {
      return this.setActiveElement(this.tabHeaders, whereTo);
    };

    jqTabs.prototype.setActiveContent = function(whereTo) {
      return this.setActiveElement(this.tabContents, whereTo);
    };

    jqTabs.prototype.setActiveElement = function(element, whereTo) {
      element.removeClass(this.settings.activeClass);
      element.addClass(this.settings.inactiveClass);
      return $(element[whereTo]).addClass(this.settings.activeClass).removeClass(this.settings.inactiveClass);
    };

    return jqTabs;

  })();

  getTabHeaders = function(container) {
    var headerContainers;
    headerContainers = container.find('.tab-header').detach();
    return headerContainers.wrap('<li />');
  };

  getTabContents = function(container) {
    return container.find('.tab-content');
  };

  makeHeader = function(header) {
    return $('<li/>').append(header);
  };

  createTopHeaders = function(tabHeaders) {
    var headerContainer, headerList;
    headerContainer = $($.parseHTML('<div class="tab-header-container"></div>'));
    headerList = $($.parseHTML('<ul class="tab-headers tabs"></ul>'));
    return headerList.append(tabHeaders);
  };

  window.jqTabs = jqTabs;

}).call(this);

/*
//@ sourceMappingURL=jqTabs.js.map
*/