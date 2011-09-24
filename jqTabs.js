(function ()
{
	'use strict';
	var jqTabs;
	jqTabs = (function ()
	{
		var $tabs,
			$tabContent,
			activeTab = 0,
			numTabs,
			seek,
			settings = {};

		function jqTabs($tabsContainer, options)
		{
			var settings, tabcontentSelector;

			settings = {
				contentSelector: 'tabcontent'
			};
			$.extend(settings, options);
			tabcontentSelector = '.' + settings.contentSelector;
			$tabs = $('ul.tab-headers li', $tabsContainer);
			$tabContent = $(tabcontentSelector, $tabsContainer);
			numTabs = $tabContent.length;

			$($tabs[0]).addClass('activeTab');
			$tabContent.addClass('hidden');

			$($tabContent[0]).removeClass('hidden');

			$tabs.each(function (index)
			{
				$(this).attr('data-tabnr', index);
			});
			$tabs.click(function (e)
			{
				var $goToTab, toTab;
				e.preventDefault();

				$goToTab = $(this);
				if (!$goToTab.hasClass('activeTab'))
				{
					toTab = parseInt($goToTab.attr('data-tabnr'), 10);
					seek(toTab);
				}
			});

			seek = function (whereTo)
			{
				$tabs.removeClass('activeTab');
				$($tabs[whereTo]).addClass('activeTab');
				$tabContent.addClass('hidden');
				$($tabContent[whereTo]).removeClass('hidden');
				activeTab = whereTo;
			};
		}
		jqTabs.prototype.seek = function (whereTo)
		{
			seek(whereTo);	
		};
		jqTabs.prototype.next = function ()
		{
			if (activeTab + 1 < this.numTabs)
			{
				return seek(activeTab + 1);
			}
		};
		return jqTabs;
	})();
	window.jqTabs = jqTabs;
})();