Tabs
===========

* Usable with jQuery or Zepto
* usable with [bootstrap](https://github.com/twitter/bootstrap)
* printable

Building
--------

```sh
npm install
make build
```

Methods
-------

* `jqTabs::seek(index)` - seeks to a tab, index 0-based
* `jqTabs::next()` - go to next tab
* `jqTabs::previous()` - go to previous tab
* `jqTabs::on(event, callback)` - add a callback to a tab.
	* `event` : event in the form of:
		* `'beforeChange:#{id}'` : before the tab changes to tab #id
		* `'beforeChange'` : before jqTabs changes to any tab
		* `'change:#{id}'` : after the tab changes to tab #id
		* `'change'` : after jqTabs changes to any tab
	* `callback` : the callback function, if a `'beforeChange'` callback returns `false`, the tab won't change
* `jqTabs::off(event, [callback])` - remove callback from tab. if `callback` is omitted, all callbacks will be removed

Options
-------

* `activeClass` - class to be added to the active Tab, default: `'active'`
* `inactiveClass` - class to be added to an inactive Tab, default: `'inactive'`
* `tabsClickable` - set to `false`, if you don't want the tabs in the tabbar to be clickable
* `events` - object of form `{ 'change': function(){} }`. Used to set callbacks, that will be executed as soon as the page is loaded
* ìnitialTab` - The tab that should be selectet at the beginning

Dependencies
------------

* [jQuery (1.7)](http://jquery.com/) or [Zepto (0.8)](http://zeptojs.com/)

Simple example
--------------

```html
<div id="the-id">
	<div class="content">
		<h1 class="tab-header" data-title="optional-tab-title"><a href="#tab1">Tab 1</a></h1>
		<div id="tab1" class="tab-content">
			Content 1
		</div>
		<h1 class="tab-header"><a href="#tab2">Tab 2</a></h1>
		<div id="tab2" class="tab-content">
			Content 2
		</div>
		<h1 class="tab-header"><a href="#tab3">Tab 3</a></h1>
		<div id="tab3" class="tab-content">
			Content 3
		</div>
	</div>
</div>
<script src="jquery.js"></script>
<script src="jqTabs.js"></script>
```

```javascript
var tabs = new jqTabs($("#the-id"));
```

```css
.tab-content.inactive
{
	display: none;
}
```
