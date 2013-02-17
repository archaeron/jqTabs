NODE_MODULES = node_modules/
NPM_BIN = $(NODE_MODULES).bin/

build:
	$(NPM_BIN)coffee -j -i jqTabs.coffee > jqTabs.js
	echo "//@ sourceMappingURL=jqTabs.js.map" >> jqTabs.js
	$(NPM_BIN)coffee --source-map -i jqTabs.coffee > jqTabs.js.map