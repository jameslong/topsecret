module.exports = function (grunt)
{
        var compilerPath = './node_modules/typescript/bin/tsc';

        grunt.initConfig({
                clean: {
                        browser: ['browser/build'],
                        app: ['app/build'],
                        editor: ['editor/build'],
                        server: ['server/build'],
                        test: ['test/build']
                },
                copy: {
                        browser_css: {
                                expand: true,
                                flatten: true,
                                cwd: './browser/src',
                                src: ['**/*.css'],
                                dest: './browser/build/css',
                                filter: 'isFile'
                        },
                        browser_lib: {
                                expand: true,
                                cwd: './browser/src/lib',
                                src: ['**/*.js'],
                                dest: './browser/build/lib',
                                filter: 'isFile'
                        },
                        browser_files: {
                                expand: true,
                                cwd: './browser',
                                src: ['requireconfig.js', 'index.html'],
                                dest: './browser/build',
                                filter: 'isFile'
                        },
                },
                ts: {
                        browser: {
                                tsconfig: './browser/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        app: {
                                tsconfig: './app/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        editor: {
                                tsconfig: './editor/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        server: {
                                tsconfig: './server/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        test: {
                                tsconfig: './test/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        }
                },
                mochaTest: {
                        test: {
                                src: ['test/**/*.js'],
                                options: {
                                        timeout: 80000
                                }
                        }
                }
        });

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-ts');

        grunt.registerTask('browser', [
                'clean:browser',
                'ts:browser',
                'copy:browser_css',
                'copy:browser_lib',
                'copy:browser_files'
        ]);
        grunt.registerTask('app', ['clean:app', 'ts:app']);
        grunt.registerTask('editor', ['clean:editor', 'ts:editor']);
        grunt.registerTask('server', ['clean:server', 'ts:server']);
        grunt.registerTask('test', ['clean:test', 'ts:test', 'mochaTest:test']);
        grunt.registerTask('default', ['browser', 'app', 'editor', 'server']);
}
