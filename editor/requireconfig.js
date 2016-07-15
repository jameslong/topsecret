require.config({
        // app entry point
        baseURL: ["../build"],
        deps: ["../build/editor/src/main"],
        paths: {
                "jquery": "../../node_modules/jquery/dist/jquery",
                "react": "../../node_modules/react/dist/react",
                "react-dom": "../../node_modules/react-dom/dist/react-dom"
        }
});
