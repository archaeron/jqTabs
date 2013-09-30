module.exports = (grunt) ->

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json'),
		uglify:
			options:
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			build:
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
		handlebars:
			compile:
				options:
					namespace: "JST"

				files:
					"dist/templates.js": "templates/*.handlebars",
					# "path/to/another.js": ["path/to/sources/*.hbs", "path/to/more/*.hbs"]
		coffee:
			compile:
				options:
					sourceMap: true
				files:
					'dist/jqTabs.js': 'src/jqTabs.coffee', # 1:1 compile


	grunt.loadNpmTasks 'grunt-contrib-handlebars'
	grunt.loadNpmTasks 'grunt-contrib-coffee'

	grunt.registerTask 'default', ['coffee']

