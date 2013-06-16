module.exports = function(grunt) {
	grunt.initConfig({
		peg: {
			struct : {
				grammar: "grammar/struct.peg",
				outputFile: "struct.js",
				exportVar: "module.exports"
			}
		},
		watch: {
			peg: {
				files: ["grammar/**/*"],
				tasks: ["peg"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-peg');

	grunt.registerTask("default", ["peg"]);
	grunt.registerTask("dev", ["peg", "watch"]);
};
