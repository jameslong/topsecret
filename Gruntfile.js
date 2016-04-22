module.exports = function (grunt)
{
        var compilerPath = './node_modules/typescript/bin/tsc';

        grunt.initConfig({
                clean: {
                        browser: ['browser/build'],
                        desktop: ['desktop/build'],
                        editor: ['editor/build'],
                        server: ['server/build'],
                        test: ['test/build']
                },
                ts: {
                        browser: {
                                tsconfig: './browser/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        desktop: {
                                tsconfig: './desktop/tsconfig.json',
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
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-ts');

        grunt.registerTask('browser', ['clean:browser', 'ts:browser']);
        grunt.registerTask('desktop', ['clean:desktop', 'ts:desktop']);
        grunt.registerTask('editor', ['clean:editor', 'ts:editor']);
        grunt.registerTask('server', ['clean:server', 'ts:server']);
        grunt.registerTask('test', ['clean:test', 'ts:test', 'mochaTest:test']);
        grunt.registerTask('default', ['browser', 'desktop', 'editor', 'server']);
}
