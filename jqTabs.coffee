"use strict"

class jqTabs
	activeTab = 0
	settings =
		contentSelector: "tabcontent"
		activeClass: 'activeTab'

	constructor: ($tabsContainer, options) ->
		seek = @seek

		$.extend settings, options
		tabcontentSelector = "." + settings.contentSelector
		@$tabs = $("ul.tab-headers li", $tabsContainer)
		@$tabContent = $(tabcontentSelector, $tabsContainer)
		@numTabs = @$tabContent.length
		$(@$tabs[0]).addClass settings.activeClass
		@$tabContent.addClass "hidden"
		$(@$tabContent[0]).removeClass "hidden"

		@$tabs.each (index) ->
			$(this).attr "data-tabnr", index

		@$tabs.click (e) ->
			e.preventDefault()
			$goToTab = $ this
			unless $goToTab.hasClass settings.activeClass
				toTab = parseInt($goToTab.attr("data-tabnr"), 10)
				seek toTab
		
	seek : (whereTo) =>
		@$tabs.removeClass settings.activeClass
		$(@$tabs[whereTo]).addClass settings.activeClass
		@$tabContent.addClass "hidden"
		$(@$tabContent[whereTo]).removeClass "hidden"
		activeTab = whereTo
		return
	
	next : ->
		@seek (activeTab + 1)  if activeTab + 1 < @numTabs
		return

	previous : ->
		@seek (activeTab - 1) if activeTab - 1 >= 0
		return

window.jqTabs = jqTabs