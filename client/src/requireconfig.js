require.config({
        // app entry point
        baseURL: ["../build"],
        deps: ["../build/client/src/app/main"],
        paths: {
                "jquery": "../../node_modules/jquery/dist/jquery",
                "kbpgp": "lib/kbpgp/kbpgp-2.0.8",
                "react": "../../node_modules/react/dist/react",
                "react-dom": "../../node_modules/react-dom/dist/react-dom"
        }
});
