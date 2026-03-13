import {
    readFileSync,
    writeFileSync
} from "node:fs";
import {
    build
} from "tsup";

await build({
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    target: "es5",
    // We need to keep metadata so do not minify.
    minify: false,
    treeshake: true,
    clean: true,
    esbuildOptions(options) {
        options.banner = {
            js: readFileSync(import.meta.dirname + "/src/metadata.ts").toString()
        };
    }
});
const builtFilePath = import.meta.dirname + "/dist/index.cjs";
writeFileSync(builtFilePath, [
    import.meta.dirname + "/src/metadata.ts", 
    builtFilePath
].map(path => readFileSync(path).toString()).join("\n"));
