(function() {
  var createTopHeaders, dasherize, getTabContents, getTabHeaders, jqTabs, slugify, trim, urlifyTabHeaders,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jqTabs = (function() {
    jqTabs.prototype.events = {};

    function jqTabs(el, options) {
      var callback, event, topHeaders, _ref;
      this.el = el;
      this.seek = __bind(this.seek, this);
      this.changeTab = __bind(this.changeTab, this);
      this.settings = {
        initialTab: 0,
        activeClass: 'active',
        inactiveClass: 'inactive',
        tabsClickable: true
      };
      $.extend(this.settings, options);
      this.tabHeaders = getTabHeaders(this.el);
      this.tabContents = getTabContents(this.el);
      this.urlTabHeaders = urlifyTabHeaders(this.tabHeaders);
      topHeaders = createTopHeaders(this.tabHeaders);
      this.el.prepend(topHeaders);
      if (this.settings.events != null) {
        _ref = options.events;
        for (event in _ref) {
          callback = _ref[event];
          this.on(event, callback);
        }
      }
      this.activeTab = this.getInitialTab(options, this.urlTabHeaders);
      this.seek(this.activeTab);
      this.attachEventsToHeaders(this.tabHeaders);
      this.changeHashOnChangeTab(this.urlTabHeaders);
    }

    jqTabs.prototype.attachEventsToHeaders = function(headers) {
      var _this = this;
      return headers.each(function(i, header) {
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
        return false;
      } else {
        goOn = this.trigger("beforeChange:" + whereTo, whereTo) && this.trigger('beforeChange', whereTo);
        if (goOn) {
          currentTab = this.changeTab(whereTo);
          this.trigger("change:" + whereTo);
          this.trigger('change', whereTo);
          return true;
        } else {
          return false;
        }
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

    jqTabs.prototype.getInitialTab = function(options, headers) {
      var initialTab;
      initialTab = this.getInitialTabSettings(options, headers);
      if (initialTab < 0) {
        return this.settings.initialTab;
      } else {
        return initialTab;
      }
    };

    jqTabs.prototype.getInitialTabSettings = function(options, headers) {
      var hash;
      if ((options != null ? options.initialTab : void 0) != null) {
        return options.initialTab;
      } else if (location.hash != null) {
        hash = location.hash.slice(1);
        return headers.indexOf(hash);
      } else {
        return -1;
      }
    };

    jqTabs.prototype.changeHashOnChangeTab = function(headers) {
      return this.on('change', function(tabNr) {
        return location.replace("#" + headers[tabNr]);
      });
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

  urlifyTabHeaders = function(headers) {
    return Array.prototype.map.call(headers, function(header) {
      var headerElement;
      headerElement = $(header);
      if (headerElement.data('title')) {
        return headerElement.data('title');
      } else {
        return slugify(headerElement.text());
      }
    });
  };

  createTopHeaders = function(tabHeaders) {
    var headerContainer, headerList;
    headerContainer = $($.parseHTML('<div class="tab-header-container"></div>'));
    headerList = $($.parseHTML('<ul class="tab-headers tabs"></ul>'));
    return headerList.append(tabHeaders);
  };

  trim = function(str) {
    if (str != null) {
      if (String.prototype.trim) {
        return String.prototype.trim.call(str);
      } else {
        return String(str).replace(new RegExp('\^\\s+|\\s+$', 'g'), '');
      }
    } else {
      return '';
    }
  };

  dasherize = function(str) {
    return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
  };

  slugify = function(str) {
    var from, regex, to;
    if (str != null) {
      from = 'ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź';
      to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz";
      regex = new RegExp("[" + from + "]", 'g');
      str = String(str).toLowerCase().replace(regex, function(c) {
        var index;
        index = from.indexOf(c);
        return to.charAt(index) || '-';
      });
      return dasherize(str.replace(/[^\w\s-]/g, ''));
    } else {
      return '';
    }
  };

  window.jqTabs = jqTabs;

}).call(this);

/*
//@ sourceMappingURL=jqTabs.js.map
*/