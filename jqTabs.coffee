class jqTabs
	@VERSION : "0.4"

	activeTab : 0
	#default settings
	settings :
		activeClass: 'active'
		useHistory: true
		hiddenClass: 'hidden'
		tabsClickable: true
		callbacksBefore: {}
		callbacksAfter: {}

	#initial Setup
	#-------------
	constructor: (@$tabsContainer, options) ->
		#reference to seek, so that we can use it later
		self = @

		#extending the options with a jquery function
		$.extend @settings, options
		# if the `hasher` library isn't loaded, set useHistory to false regardles of previous setting
		if @settings.useHistory and not hasher?
			@settings.useHistory = false
			
		if not @settings.tabsClickable
			@settings.useHistory = false

		#creating a `jQuery` object for the tabHeaders, tabContents
		@updateElements()
		#saving the number of tabs
		@numTabs = @$tabContent.length

		#giving the fist tab the 'activeClass' (it is possible to change the name of this class by #passing an optional settings object as the second parameter to the constructor)
		$(@$tabs[0]).addClass @settings.activeClass
		#hide all tabs
		@$tabContent.addClass @settings.hiddenClass
		#and show only the first
		$(@$tabContent[0]).removeClass @settings.hiddenClass

		$('ul.tab-headers', $tabsContainer).on 'click', 'li', (e) ->
			e.preventDefault()
			if self.settings.tabsClickable
				$goToTab = $ this

				unless $goToTab.hasClass self.settings.activeClass
					toTab = $goToTab.index @$tabs
					self.seek toTab

		if @settings.useHistory

			historyChangeTab = (newHash) =>

				changeTo = -1
				@$tabs.each (index, elem) ->
					href = $(elem).children('a').attr('href')
					href = href.replace(/\#/, '')

					if href == newHash
						changeTo = index
						return false
				
				if changeTo isnt -1
					@seek changeTo

			hasher.initialized.add historyChangeTab

			hasher.changed.add historyChangeTab

			hasher.init()


	changeTab : (whereTo) =>
		#save reference to current tab
		$currentTab = $(@$tabs[whereTo])

		#set the active tab, to the tab we seek to
		@activeTab = whereTo

		#remove the `settings.activeClass` from all tabs
		@$tabs.removeClass @settings.activeClass
		#and ad it only to the current tab
		$currentTab.addClass @settings.activeClass

		@$tabContent.addClass @settings.hiddenClass
		$(@$tabContent[whereTo]).removeClass @settings.hiddenClass
			
		
	seek : (whereTo) =>
		#only proceed, if the tab you want to seek to exists
		if 0 > whereTo or whereTo >= @numTabs
			return

		go_on = true
		if @settings.callbacksBefore[whereTo]?
			go_on = @settings.callbacksBefore[whereTo]()

		if go_on isnt false
			if @settings.useHistory
				$currentTab = $(@$tabs[whereTo])
				hash = $currentTab.find('a').attr('href').replace(/\#/, '')
				hasher.setHash hash
			
			@changeTab whereTo
			if @settings.callbacksAfter[whereTo]?
				@settings.callbacksAfter[whereTo]()
		return
	
	next : ->
		@seek (@activeTab + 1)
		return

	previous : ->
		@seek (@activeTab - 1)
		return
		
	on : (index, position, callback) ->
		switch position
			when 'before'
				@settings.callbacksBefore[index] = callback
			when 'after'
				@settings.callbacksAfter[index] = callback

	insertAfter: (index, tabHeader, tabContent, select) ->
		select = if select != undefined then select else true

		$tabHeader = $(@$tabs[index])
		$newTabHeader = @makeHeader(tabHeader)
		$tabHeader.after($newTabHeader)

		$tabContent = $(@$tabContent[index])
		$newTabContent = @makeContent(tabContent)
		$tabContent.after($newTabContent)

		@numTabs++
		@updateElements()
		@seek(index + 1) if select

		$newTabContent

	insertBefore: (index, tabHeader, tabContent, select) ->
		select = if select != undefined then select else true
		$tabHeader = $(@$tabs[index])
		$newTabHeader = @makeHeader tabHeader
		$tabHeader.before($newTabHeader)

		$tabContent = $(@$tabContent[index])
		$newTabContent = @makeContent tabContent
		$tabContent.before($newTabContent)

		@numTabs++
		@updateElements()
		@seek(index + 1) if select

		$newTabContent

	addTab: (tabHeader, tabContent, select) ->
		if @numTabs is 0
			headerContainer = @$tabsContainer.find('.tab-headers')
			$newTabHeader = @makeHeader tabHeader
			$newTabHeader.addClass @settings.activeClass
			headerContainer.append($newTabHeader)
			
			$newTabContent = @makeContent tabContent
			$newTabContent.removeClass @settings.hiddenClass
			@$tabsContainer.append $newTabContent

			@updateElements()
			@numTabs++

			$newTabContent
		else
			@insertAfter @numTabs - 1, tabHeader, tabContent, select

	removeTab: (index) ->
		$(@$tabs[index]).remove()
		$(@$tabContent[index]).remove()

		@numTabs--

		@updateElements()

	removeLast: () ->

	updateElements: () ->
		@$tabs = $('ul.tab-headers li:not(.ignore-tab)', @$tabsContainer)
		@$tabContent = @$tabsContainer.children('div')

	makeHeader: (header) ->
		$('<li/>').append(header)

	makeContent: (content) =>
		$('<div/>', { 'class': 'tabcontent ' + @settings.hiddenClass}).append(content)
		

window.jqTabs = jqTabs