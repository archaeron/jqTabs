Tabs
===========

* Usable with jQuery or Zepto
* Support for history
* usable with [bootstrap](https://github.com/twitter/bootstrap)
* printable

Methods
-------

* `jqTabs::seek(index)` - seeks to a tab, index 0-based
* `jqTabs::next()` - go to next tab
* `jqTabs::previous()` - go to previous tab
* `jqTabs::on(index, position, callback)` - add a callback to a tab.
	* `index` : index of the tab you want to add the callback to
	* `position` : `'before'` or `'after'`, sets if the callback function should be called before or after the tab has been displayed
	* `callback` : the callback function, if a `'before'` callback returns false, the tab won't change

Options
-------

* `activeClass` - class to be added to the active Tab, default: `'active'`
* `hiddenClass` - class to be added to a hidden tab
* `useHistory` - use the history, needs hasher and js-signals, default: `true`, if hasher isn't included it is set to `false` regardless of what was set in the options
* `tabsClickable` - set to `false`, if you don't want the tabs in the tabbar to be clickable

Dependencies
------------

* [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/)
* [hasher](http://github.com/millermedeiros/hasher) (and therefore [js-signals](http://millermedeiros.github.com/js-signals/)) for history support

Simple example
--------------

```html
<div id="the_id">
	<ul class="tab-headers">
		<li><a href="#tab1">Tab 1</a></li>
		<li><a href="#tab2">Tab 2</a></li>
		<li><a href="#tab3">Tab 3</a></li>
	</ul>
	<div>
		<div id="tab1">
			Content 1
		</div>
		<div id="tab2">
			Content 2
		</div>
		<div id="tab3">
			Content 3
		</div>
	</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="jqTabs.js"></script>
```

```javascript
var tabs = new jqTabs($("#the_id"));
```

```css
.hidden
{
	display: none;
}
```