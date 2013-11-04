class jqTabs
	events : {}

	#initial Setup
	#-------------
	constructor: (@el, options) ->
		#default settings
		@settings =
			initialTab: 0
			activeClass: 'active'
			inactiveClass: 'inactive'
			tabsClickable: true

		# extending the options with a jquery function
		$.extend @settings, options

		# find Headers and Content in the element
		@tabHeaders = getTabHeaders @el
		@tabContents = getTabContents @el
		@urlTabHeaders = urlifyTabHeaders @tabHeaders

		# create a new element and add the headers to it
		topHeaders = createTopHeaders @tabHeaders, @urlTabHeaders

		# prepend the headers to the main element
		@el.prepend topHeaders


		# if there are events in the options object, attach them
		if @settings.events?
			for event, callback of options.events
				@on event, callback

		@activeTab = @getInitialTab options, @urlTabHeaders

		@seek @activeTab

		@attachEventsToHeaders @tabHeaders
		@changeHashOnChangeTab @urlTabHeaders


	attachEventsToHeaders: (headers) ->
		headers.each (i, header) =>
			$(header).click (e) =>
				e.preventDefault()

				if @settings.tabsClickable

					target = $ e.currentTarget

					unless target.hasClass @settings.activeClass
						@seek i


	changeTab : (whereTo) =>
		# save reference to current tab
		currentTab = $(@tabHeaders[whereTo])

		# set the active tab, to the tab we seek to
		@activeTab = whereTo

		@setActiveHeader whereTo
		@setActiveContent whereTo

		currentTab

	seek : (whereTo) =>
		#only proceed, if the tab you want to seek to exists
		if 0 > whereTo or whereTo >= @tabHeaders.length
			false
		else
			goOn = @trigger("beforeChange:#{whereTo}", whereTo) and @trigger('beforeChange', whereTo)

			if goOn
				currentTab = @changeTab whereTo

				@trigger "change:#{whereTo}"
				@trigger 'change', whereTo
				true
			else
				false

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


	# insertAfter: (index, tabHeader, tabContent, select) ->
	# 	select = if select != undefined then select else true

	# 	$tabHeader = $(@$tabs[index])
	# 	$newTabHeader = @makeHeader(tabHeader)
	# 	$tabHeader.after($newTabHeader)

	# 	$tabContent = $(@$tabContent[index])
	# 	$newTabContent = @makeContent(tabContent)
	# 	$tabContent.after($newTabContent)

	# 	@numTabs++
	# 	@updateElements()
	# 	@seek(index + 1) if select

	# 	$newTabContent

	# insertBefore: (index, tabHeader, tabContent, select) ->
	# 	select = if select != undefined then select else true
	# 	$tabHeader = $(@$tabs[index])
	# 	$newTabHeader = @makeHeader tabHeader
	# 	$tabHeader.before($newTabHeader)

	# 	$tabContent = $(@$tabContent[index])
	# 	$newTabContent = @makeContent tabContent
	# 	$tabContent.before($newTabContent)

	# 	@numTabs++
	# 	@updateElements()
	# 	@seek(index + 1) if select

	# 	$newTabContent

	# addTab: (tabHeader, tabContent, select) ->
	# 	if @numTabs is 0
	# 		headerContainer = @el.find('.tab-headers')
	# 		$newTabHeader = @makeHeader tabHeader
	# 		$newTabHeader.addClass @settings.activeClass
	# 		headerContainer.append($newTabHeader)

	# 		$newTabContent = @makeContent tabContent
	# 		$newTabContent.removeClass @settings.hiddenClass
	# 		@el.append $newTabContent

	# 		@updateElements()
	# 		@numTabs++

	# 		$newTabContent
	# 	else
	# 		@insertAfter @numTabs - 1, tabHeader, tabContent, select

	# removeTab: (index) ->
	# 	$(@$tabs[index]).remove()
	# 	$(@$tabContent[index]).remove()

	# 	@numTabs--

	# 	@updateElements()

	# removeLast: ->

	getInitialTab: (options, headers) ->
		initialTab = @getInitialTabSettings(options, headers)

		if initialTab < 0
			@settings.initialTab
		else
			initialTab

	getInitialTabSettings: (options, headers) ->
		if options?.initialTab?
			options.initialTab
		else if location.hash?
			hash = location.hash.slice 1
			headers.indexOf hash
		else
			-1

	changeHashOnChangeTab: (headers) ->
		@on 'change', (tabNr) ->
			location.replace "##{headers[tabNr]}"

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

urlifyTabHeaders = (headers) ->
	Array.prototype.map.call headers, (header) ->
		headerElement = $ header
		a = headerElement.find 'a'
		if headerElement.data 'title'
			headerElement.data 'title'
		else if a.length
			a.attr('href').replace '#', ''
		else
			slugify headerElement.text()

createTopHeaders = (tabHeaders, urlTabHeaders) ->
	tabHeaders.each (i, header) ->
		a = $(header).find 'a'
		if a.length
			a.attr 'href', "##{urlTabHeaders[i]}"

	headerContainer = $($.parseHTML '<div class="tab-header-container"></div>')
	headerList = $($.parseHTML '<ul class="tab-headers tabs"></ul>')
	headerList.append tabHeaders

# from https://github.com/epeli/underscore.string/blob/master/lib/underscore.string.js
trim = (str) ->
	if str?
		if String.prototype.trim
			String.prototype.trim.call str
		else
			String(str).replace(new RegExp('\\^\\s+|\\s+$', 'g'), '')
	else
		''

dasherize = (str) ->
	trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase()

slugify = (str) ->
	if str?
		from  = 'ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź'
		to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz"
		regex = new RegExp("[#{from}]", 'g')

		str = String(str).toLowerCase().replace regex, (c) ->
			index = from.indexOf(c);
			to.charAt(index) || '-'

		dasherize str.replace(/[^\w\s-]/g, '')
	else
		''


window.jqTabs = jqTabs
