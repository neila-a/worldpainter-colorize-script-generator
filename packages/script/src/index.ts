/* eslint-disable no-shadow-restricted-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
//-- get info on delimiter here: https://github.com/Captain-Chaos/WorldPainter/blob/219f7eb1402e49d9c79fed72799c82503385d669/WorldPainter/WPGUI/src/test/resources/descriptortest.js

// Arguments
// path/to/image/file.png.jpg.etc
// mask
// repeat

// APIs higher than ES3 cannot be used, but new syntax can be employed.

import {
    type colorizerDefines
} from "@worldpainter-colorize-script-generator/app/src/App";
import distanceBetween from "./distanceBetween";
import truncate from "./truncate";

declare const dimension: any,
    params: {
        xOffset: number;
        yOffset: number;
        colorizeImage: string;
        mask: string | undefined;
    },
    print: (info: string) => void,
    defines: colorizerDefines,
    java: any,
    org: any,
    wp: any;

const xDefault = dimension.getExtent().getX() * 128 + params.xOffset;
const yDefault = dimension.getExtent().getY() * 128 + params.yOffset;

print("Script by ctRy");

const terrainArr = defines.allPossibleBlocks;

const palette = [];

const def = defines.def;

for (let i = 0; i < def.length; i++) {
    const val = def[i].split(" ");
    palette.push({
        t: terrainArr.indexOf(val[0]), r: parseInt(val[1]), g: parseInt(val[2]), b: parseInt(val[3])
    });
}

const coloringMap = wp.getHeightMap().fromFile(params.colorizeImage).go(),
    mask = params["mask"] === null ? undefined : wp.getHeightMap().fromFile(params.mask).go();

const extent = coloringMap.getExtent();
print("\nImage's upper left pixel will be placed in the coordinate (x: " + xDefault + ", y: " + yDefault + ").");
print("Tiles that are empty will remain empty.");

print("\nNow processing . . .");

for (let x = extent.getX(); x < extent.getWidth(); x++) {
    for (let y = extent.getY(); y < extent.getHeight(); y++) {
        if (!dimension.isTilePresent(truncate((x + xDefault) / 128.0), truncate((y + yDefault) / 128.0)))
            continue;

        if (mask !== false && mask.getHeight(x, y) < 128)
            continue;

        const color = new java.awt.Color(coloringMap.getColour(x, y), java.lang.Boolean.TRUE);

        if (color.getAlpha() < 128)
            continue;

        let distance = 999999;
        let index = -1;
        for (let i = 0; i < palette.length; i++) {
            const tempDistance = distanceBetween(color.getRed(), color.getGreen(), color.getBlue(), palette[i].r, palette[i].g, palette[i].b);
            if (tempDistance < distance) {
                distance = tempDistance;
                index = i;
            }

            if (distance == 0)
                break;
        }

        dimension.setTerrainAt(x + xDefault, y + yDefault, org.pepsoft.worldpainter.Terrain.VALUES[palette[index].t]);
    }
}

print("\nDone! :D");
