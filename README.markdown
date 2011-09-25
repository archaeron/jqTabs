jQuery Tabs
===========

Tabs, that are printable and usable with [bootstrap](https://github.com/twitter/bootstrap).

Methods
-------


* `jqTabs::seek(index)` - seeks to a tab, index 0-based
* `jqTabs::next()` - go to next tab
* `jqTabs::previous()` - go to previous tab



Barebone example
----------------

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