module.exports = function (grunt)
{
        var compilerPath = './node_modules/typescript/bin/tsc';

        grunt.initConfig({
                clean: {
                        client: ['client/build'],
                        desktop: ['desktop/build', 'desktop/src/app/core', 'desktop/src/css', 'desktop/assets'],
                        editor: ['editor/build'],
                        server: ['server/build'],
                        test: ['test/build']
                },
                copy: {
                        desktop: {
                                files: [
                                        {expand: true, cwd: 'client/src/app/core', src: ['**'], dest: 'desktop/src/app/core', filter: 'isFile'},
                                        {expand: true, cwd: 'client/src/css', src: ['**'], dest: 'desktop/src/css', filter: 'isFile'},
                                        {expand: true, cwd: 'client/assets', src: ['**'], dest: 'desktop/assets', filter: 'isFile'}
                                ],
                        },
                },
                ts: {
                        client: {
                                tsconfig: './client/tsconfig.json',
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
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-mocha-test');
        grunt.loadNpmTasks('grunt-ts');

        grunt.registerTask('client', ['clean:client', 'ts:client']);
        grunt.registerTask('desktop', ['clean:desktop', 'copy:desktop', 'ts:desktop']);
        grunt.registerTask('editor', ['clean:editor', 'ts:editor']);
        grunt.registerTask('server', ['clean:server', 'ts:server']);
        grunt.registerTask('test', ['clean:test', 'ts:test', 'mochaTest:test']);
        grunt.registerTask('default', ['client', 'desktop', 'editor', 'server']);
}
