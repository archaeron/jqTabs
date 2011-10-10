class jqTabs
	activeTab = 0
	#default settings
	settings =
		activeClass: 'activeTab'
		useHistory: true
		hiddenClass: 'hidden'
		tabsClickable: true
		
	callbacksBefore = {}
	callbacksAfter = {}

	#initial Setup
	#-------------
	constructor: ($tabsContainer, options) ->
		#reference to seek, so that we can use it later
		seek = @seek

		#extending the options with a jquery function
		$.extend settings, options
		
		if settings.useHistory and not hasher?
			settings.useHistory = false
			
		if not settings.tabsClickable$
			settings.useHistory = false

		#creating a jQuery object for the tabHeaders, tabContents
		@$tabs = $('ul.tab-headers li', $tabsContainer)
		@$tabContent = $tabsContainer.children('div').children('div')
		#saving the number of tabs
		@numTabs = @$tabContent.length

		#giving the fist tab the 'activeClass' (it is possible to change the name of this class by #passing an optional settings object as the second parameter to the constructor)
		$(@$tabs[0]).addClass settings.activeClass
		#hide all tabs
		@$tabContent.addClass settings.hiddenClass
		#and show only the first
		$(@$tabContent[0]).removeClass settings.hiddenClass

		@$tabs.each (index) ->
			tab = $(this)
			tab.attr "data-tabnr", index
			if not settings.tabsClickable
				tab.children('a').css 'cursor', 'default'

		@$tabs.click (e) ->
			if not settings.tabsClickable
				e.preventDefault()
			else
				$goToTab = $ this
				unless $goToTab.hasClass settings.activeClass
					toTab = parseInt($goToTab.attr("data-tabnr"), 10)
					seek toTab

		if settings.useHistory

			historyChangeTab = (newHash) =>

				changeTo = -1
				@$tabs.each (index, elem) ->
					href = $(elem).children('a').attr('href')
					href = href.replace(/\#/, '')

					if href == newHash
						changeTo = index
						return false
				
				if changeTo isnt -1
					@changeTab changeTo

			hasher.initialized.add historyChangeTab

			hasher.changed.add historyChangeTab

			hasher.init()


	changeTab : (whereTo) =>
		#save reference to current tab
		$currentTab = $(@$tabs[whereTo])

		#set the active tab, to the tab we seek to
		activeTab = whereTo

		#remove the `settings.activeClass` from all tabs
		@$tabs.removeClass settings.activeClass
		#and ad it only to the current tab
		$currentTab.addClass settings.activeClass

		@$tabContent.addClass settings.hiddenClass
		$(@$tabContent[whereTo]).removeClass settings.hiddenClass
			
		
	seek : (whereTo) =>
		#only proceed, if the tab you want to seek to exists
		if not (0 <= whereTo < @numTabs)
			return

		if settings.useHistory
			$currentTab = $(@$tabs[whereTo])
			hash = $currentTab.find('a').attr('href').replace(/\#/, '')
			hasher.setHash hash

		go_on = true
		if callbacksBefore[whereTo]?
			go_on = callbacksBefore[whereTo]()

		if go_on isnt false
			@changeTab whereTo
			if callbacksAfter[whereTo]?
				callbacksAfter[whereTo]()
		
		return
	
	next : ->
		@seek (activeTab + 1)
		return

	previous : ->
		@seek (activeTab - 1)
		return
		
	on : (index, position, callback) ->
		switch position
			when 'before'
				callbacksBefore[index] = callback
			when 'after'
				callbacksAfter[index] = callback
		

window.jqTabs = jqTabs