import {
    readFileSync
} from "node:fs";
import {
    defineConfig
} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    target: "es5",
    // We need to keep metadata so do not minify.
    minify: false,
    clean: true,
    esbuildOptions(options) {
        console.log(readFileSync(import.meta.dirname + "/src/metadata.ts").toString());
        options.banner = {
            js: readFileSync(import.meta.dirname + "/src/metadata.ts").toString()
        };
    }
});