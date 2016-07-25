module.exports = function (grunt)
{
        var compilerPath = './node_modules/typescript/bin/tsc';

        grunt.initConfig({
                clean: {
                        app: ['app/build', 'app/packaged_apps'],
                        browser: ['browser/build'],
                        editor: ['editor/build'],
                        server: ['server/build'],
                        test: ['test/build']
                },
                copy: {
                        app_css: {
                                expand: true,
                                flatten: true,
                                cwd: './browser/src',
                                src: ['**/*.css'],
                                dest: './app/build/css',
                                filter: 'isFile'
                        },
                        app_assets: {
                                expand: true,
                                cwd: './browser/assets',
                                src: ['**'],
                                dest: './app/build/assets',
                                filter: 'isFile'
                        },
                        app_content: {
                                expand: true,
                                cwd: '../topsecret-content/game',
                                src: ['**'],
                                dest: './app/build/content',
                                filter: function (filepath) {
                                        return grunt.file.isFile(filepath) ||
                                                grunt.file.isDir(filepath);
                                }
                        },
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
                                cwd: './browser/lib',
                                src: ['**/*.js'],
                                dest: './browser/build/lib',
                                filter: 'isFile'
                        },
                        browser_assets: {
                                expand: true,
                                cwd: './browser/assets',
                                src: ['**'],
                                dest: './browser/build/assets'
                        },
                        browser_files: {
                                expand: true,
                                cwd: './browser',
                                src: ['requireconfig.js', 'index.html'],
                                dest: './browser/build',
                                filter: 'isFile'
                        },
                        browser_node_modules: {
                                expand: true,
                                cwd: './browser',
                                src: ['./node_modules/**'],
                                dest: './browser/build/'
                        },
                        editor_css: {
                                expand: true,
                                flatten: true,
                                cwd: './editor/src',
                                src: ['**/*.css'],
                                dest: './editor/build/css',
                                filter: 'isFile'
                        },
                        editor_lib: {
                                expand: true,
                                cwd: './editor/lib',
                                src: ['**/*.js'],
                                dest: './editor/build/lib',
                                filter: 'isFile'
                        },
                        editor_assets: {
                                expand: true,
                                cwd: './editor/assets',
                                src: ['**.*'],
                                dest: './editor/build/assets',
                                filter: 'isFile'
                        },
                        editor_files: {
                                expand: true,
                                cwd: './editor',
                                src: ['requireconfig.js', 'index.html'],
                                dest: './editor/build',
                                filter: 'isFile'
                        }
                },
                shell: {
                        app: {
                                command: './app/node_modules/.bin/electron-packager ./app "top-secret" --all --out="./app/packaged_apps"'
                        }
                },
                ts: {
                        app: {
                                tsconfig: './app/tsconfig.json',
                                options: {
                                        compiler: compilerPath
                                }
                        },
                        browser: {
                                tsconfig: './browser/tsconfig.json',
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
        grunt.loadNpmTasks('grunt-shell');
        grunt.loadNpmTasks('grunt-ts');

        grunt.registerTask('app', [
                'clean:app',
                'ts:app',
                'copy:app_css',
                'copy:app_assets',
                'copy:app_content',
                'shell:app'
        ]);
        grunt.registerTask('browser', [
                'clean:browser',
                'ts:browser',
                'copy:browser_css',
                'copy:browser_lib',
                'copy:browser_assets',
                'copy:browser_files',
                'copy:browser_node_modules'
        ]);
        grunt.registerTask('editor', [
                'clean:editor',
                'ts:editor',
                'copy:editor_css',
                'copy:editor_lib',
                'copy:editor_assets',
                'copy:editor_files'
        ]);
        grunt.registerTask('server', ['clean:server', 'ts:server']);
        grunt.registerTask('test', ['clean:test', 'ts:test', 'mochaTest:test']);
        grunt.registerTask('default', ['app', 'browser', 'editor', 'server']);
}
