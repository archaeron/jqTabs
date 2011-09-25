"use strict"

class jqTabs
	activeTab = 0
	#default settings
	settings =
		activeClass: 'activeTab'

	#initial Setup
	#-------------
	constructor: ($tabsContainer, options) ->
		#reference to seek, so that we can use it later
		seek = @seek

		#extending the options with a jquery function
		$.extend settings, options

		#creating a jQuery object for the tabHeaders, tabContents
		@$tabs = $('ul.tab-headers li', $tabsContainer)
		@$tabContent = $('> div > div', $tabsContainer)
		#saving the number of tabs
		@numTabs = @$tabContent.length

		#giving the fist tab the 'activeClass' (it is possible to change the name of this class by #passing an optional settings object as the second parameter to the constructor)
		$(@$tabs[0]).addClass settings.activeClass
		#hide all tabs
		@$tabContent.addClass "hidden"
		#and show only the first
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