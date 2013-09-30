class jqTabs
	events : {}

	#initial Setup
	#-------------
	constructor: (@el, options) ->
		@activeTab = 0

		#default settings
		@settings =
			activeClass: 'active'
			inactiveClass: 'inactive'
			useHistory: true
			tabsClickable: true

		# extending the options with a jquery function
		$.extend @settings, options

		# find Headers and Content in the element
		@tabHeaders = getTabHeaders(@el)
		@tabContents = getTabContents(@el)

		# create a new element and add the headers to it
		topHeaders = createTopHeaders(@tabHeaders)

		# prepend the headers to the main element
		@el.prepend topHeaders


		# if there are events in the options object, attach them
		if @settings.events?
			for event, callback of options.events
				@on event, callback

		# # if the `hasher` library isn't loaded, set useHistory to false regardles of previous setting
		# if @settings.useHistory and not hasher?
		# 	@settings.useHistory = false

		# if not @settings.tabsClickable
		# 	@settings.useHistory = false


		# giving the fist tab the 'activeClass' (it is possible to change the name of this class by
		# passing an optional settings object as the second parameter to the constructor)
		@setActiveHeader 0
		@setActiveContent 0

		#hide all tabs
		@tabContents.addClass @settings.hiddenClass
		#and show only the first
		$(@tabContents[0]).removeClass @settings.hiddenClass

		@attachEventsToHeaders @tabHeaders

	attachEventsToHeaders: (headers) ->
		headers.each (i, header) =>
			console.log header
			$(header).click (e) =>
				e.preventDefault()

				if @settings.tabsClickable

					target = $ e.currentTarget

					unless target.hasClass @settings.activeClass
						@seek i

				# if @settings.useHistory
				# 	@setHashChange()


	changeTab : (whereTo) =>
		# save reference to current tab
		currentTab = $(@tabHeaders[whereTo])

		# set the active tab, to the tab we seek to
		@activeTab = whereTo

		@setActiveHeader whereTo
		@setActiveContent whereTo
		# @$tabContent.addClass @settings.hiddenClass
		# $(@$tabContent[whereTo]).removeClass @settings.hiddenClass

		currentTab

	seek : (whereTo) =>
		#only proceed, if the tab you want to seek to exists
		if 0 > whereTo or whereTo >= @tabHeaders.length
			return

		goOn = @trigger("beforeChange:#{whereTo}", whereTo) and @trigger('beforeChange', whereTo)

		if goOn isnt false
			currentTab = @changeTab whereTo

			# if @settings.useHistory
			# 	hash = $currentTab.find('a').attr('href').replace(/\#/, '')
			# 	hasher.changed.active = false
			# 	hasher.setHash hash
			# 	hasher.changed.active = true

			@trigger "change:#{whereTo}"
			@trigger 'change', whereTo

		return

	next: ->
		@seek (@activeTab + 1)
		return

	previous: ->
		@seek (@activeTab - 1)
		return

	on: (event, callback) ->
		@events[event] = @events[event] or []
		@events[event].push callback

	off: (event, callback) ->
		if not @events[event]
			return

		if callback
			@events[event].splice @events[event].indexOf(callback), 1
		else
			delete @events[event]

	trigger: (event, args...) ->
		if not @events[event]
			true
		else
			returnValues = for eventCallback in @events[event]
				eventCallback.apply this, args

			not (false in returnValues)


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
			headerContainer = @el.find('.tab-headers')
			$newTabHeader = @makeHeader tabHeader
			$newTabHeader.addClass @settings.activeClass
			headerContainer.append($newTabHeader)

			$newTabContent = @makeContent tabContent
			$newTabContent.removeClass @settings.hiddenClass
			@el.append $newTabContent

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

	removeLast: ->

	makeContent: (content) =>
		$('<div/>', { 'class': 'tabcontent ' + @settings.hiddenClass}).append(content)

	setHashChange : ->
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

		return

	setActiveHeader: (whereTo) ->
		@setActiveElement @tabHeaders, whereTo

	setActiveContent: (whereTo) ->
		@setActiveElement @tabContents, whereTo

	setActiveElement: (element, whereTo) ->
		# remove the `activeClass` from all tabs
		element.removeClass @settings.activeClass
		element.addClass @settings.inactiveClass
		# and ad it only to the current tab
		$(element[whereTo]).addClass(@settings.activeClass).removeClass(@settings.inactiveClass)



getTabHeaders = (container) ->
	headerContainers = container.find('.tab-header').detach()
	headerContainers.wrap '<li />'

getTabContents = (container) ->
	container.find '.tab-content'

makeHeader = (header) ->
		$('<li/>').append(header)

createTopHeaders = (tabHeaders) ->
	headerContainer = $($.parseHTML '<div class="tab-header-container"></div>')
	headerList = $($.parseHTML '<ul class="tab-headers tabs"></ul>')
	headerList.append tabHeaders

window.jqTabs = jqTabs
