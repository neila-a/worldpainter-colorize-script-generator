import colorizerURL from "./colorizer?worker&url";
import metadata from "./metadata.ts?raw";

export interface colorizerDefines {
    allPossibleBlocks: string[];
    /**  
     * @type Array<"block r g b">
     */
    def: string[];
}
/**
 * Can't use @vite/plugin-legacy for worker so we must process manually.
 */
const
    turnToES5 = (code: string) => code
        .replace("self.location.href", "")

        // ES5 support
        .replaceAll("let ", "var ")
        .replaceAll("\n", "\\n")
        .replaceAll("`", "\"")

        // remove IIFE for read arguments from WP
        .replace("(function(){", "")
        .replace("})();", ""),
    getColorizer = (defines: colorizerDefines) => fetch(colorizerURL)
        .then(response => response.text())
        .then(colorizer => `
        ${metadata}
        var defines = ${JSON.stringify(defines)};
        ${turnToES5(colorizer)}
    `);
export default getColorizer;