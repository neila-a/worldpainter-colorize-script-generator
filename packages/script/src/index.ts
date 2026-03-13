/* eslint-disable no-shadow-restricted-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
//-- get info on delimiter here: https://github.com/Captain-Chaos/WorldPainter/blob/219f7eb1402e49d9c79fed72799c82503385d669/WorldPainter/WPGUI/src/test/resources/descriptortest.js

// Arguments
// path/to/image/file.png.jpg.etc
// mask
// repeat

import {
    type colorizerDefines
} from "@worldpainter-colorize-script-generator/app/src/App";
import distanceBetween from "./distanceBetween";
import truncate from "./truncate";
import "core-js/actual/object/entries";

declare const dimension: any,
    params: Record<string, any>,
    print: (info: string) => void,
    defines: colorizerDefines,
    // @ts-expect-error WP environment
    arguments: string[],
    java: any,
    org: any,
    wp: any;

const xDefault = dimension.getExtent().getX() * 128 + params["xOffset"];
const yDefault = dimension.getExtent().getY() * 128 + params["yOffset"];

print("Script by ctRy");

const {
    palette
} = defines;

const coloringMap = wp.getHeightMap().fromFile(arguments[0]).go();
let mask = coloringMap;

if (arguments.length > 2) {
    for (let i = 2; i < arguments.length; i++) {
        if (arguments[i] == "")
            break;

        if (arguments[i].indexOf("mask: ") == 0) {
            mask = wp.getHeightMap().fromFile(arguments[i].substring(6).trim()).go();

            print("\nMask detected");
            print(arguments[i].substring(6).trim());
        }
    }
}

const extent = coloringMap.getExtent();
print("\nImage's upper left pixel will be placed in the coordinate (x: " + xDefault + ", y: " + yDefault + ").");
print("Tiles that are empty will remain empty.");

print("\nNow processing . . .");

for (let x = extent.getX(); x < extent.getWidth(); x++) {
    for (let y = extent.getY(); y < extent.getHeight(); y++) {
        if (!dimension.isTilePresent(truncate((x + xDefault) / 128.0), truncate((y + yDefault) / 128.0)))
            continue;

        if (mask !== coloringMap && mask.getHeight(x, y) < 128)
            continue;

        const color = new java.awt.Color(coloringMap.getColour(x, y), java.lang.Boolean.TRUE);

        if (color.getAlpha() < 128)
            continue;

        type distanceCalculationResult = [id: string, distance: number];
        const calculateDistance = (index: string) => distanceBetween(color.getRed(), color.getGreen(), color.getBlue(), palette[index].r, palette[index].g, palette[index].b),
            {
                0: index
            } = Object.entries(palette).reduce((previous, current) => {
                const id = current[0];
                const currentDistance = calculateDistance(id);
                if (currentDistance < previous[1]) {
                    return [id, currentDistance] as distanceCalculationResult;
                }
                return previous;
            }, ["1" /* BareGrass */, calculateDistance("1")] as distanceCalculationResult);

        dimension.setTerrainAt(x + xDefault, y + yDefault, org.pepsoft.worldpainter.Terrain.VALUES[parseInt(index)]);
    }
}

print("\nDone! :D");
