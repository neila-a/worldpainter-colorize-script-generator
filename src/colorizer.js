//-- get info on delimiter here: https://github.com/Captain-Chaos/WorldPainter/blob/219f7eb1402e49d9c79fed72799c82503385d669/WorldPainter/WPGUI/src/test/resources/descriptortest.js

// It won't be TypeScript because I can't understand it.

// Arguments
// path/to/image/file.png.jpg.etc
// mask
// repeat

// Metadata - Must be comments!
// script.description=Converts RGB images to minecraft blocks. The top left corner of the image will be placed in the top left corner of the map.
// script.param.xOffset.type=integer
// script.param.xOffset.description=The top left corner of the image will be shifted to the right by that many blocks
// script.param.yOffset.type=integer
// script.param.yOffset.description=The top left corner of the image will be shifted downwards by that many blocks

var xDefault = dimension.getExtent().getX() * 128 + params['xOffset'];
var yDefault = dimension.getExtent().getY() * 128 + params['yOffset'];

print("Script by ctRy");

var terrainArr = _allPossibleBlocks_;

var palette = [];

var def = _def_ /* Array<"block r g b"> */

print("\nUsing default palette");

for (var i = 0; i < def.length; i++) {
	var val = def[i].split(" ");
	palette.push({ t: terrainArr.indexOf(val[0]), r: parseInt(val[1]), g: parseInt(val[2]), b: parseInt(val[3]) });
}

var coloringMap = wp.getHeightMap().fromFile(arguments[0]).go();
var mask = coloringMap;

if (arguments.length > 2) {
	for (var i = 2; i < arguments.length; i++) {
		if (arguments[i] == "")
			break;

		if (arguments[i].indexOf("mask: ") == 0) {
			mask = wp.getHeightMap().fromFile(arguments[i].substring(6).trim()).go();

			print("\nMask detected");
			print(arguments[i].substring(6).trim());
		}
	}
}

var extent = coloringMap.getExtent();
print("\nImage's upper left pixel will be placed in the coordinate (x: " + xDefault + ", y: " + yDefault + ").");
print("Tiles that are empty will remain empty.");

print("\nNow processing . . .");

for (var x = extent.getX(); x < extent.getWidth(); x++) {
	for (var y = extent.getY(); y < extent.getHeight(); y++) {
		if (!dimension.isTilePresent(truncate((x + xDefault) / 128.0), truncate((y + yDefault) / 128.0)))
			continue;

		if (mask !== coloringMap && mask.getHeight(x, y) < 128)
			continue;

		var color = new java.awt.Color(coloringMap.getColour(x, y), java.lang.Boolean.TRUE);

		if (color.getAlpha() < 128)
			continue;

		var distance = 999999;
		var index = -1;
		for (var i = 0; i < palette.length; i++) {
			tempDistance = distanceBetween(color.getRed(), color.getGreen(), color.getBlue(), palette[i].r, palette[i].g, palette[i].b);
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

function pad(n) {
	if (n < 10)
		return "  " + n;
	else if (n < 100)
		return " " + n;
	else
		return "" + n;
}

function truncate(number) {
	return number > 0 ? Math.floor(number) : Math.ceil(number);
}

//squared distance between two color values TODO: change to better color format
function distanceBetween(r, g, b, rr, gg, bb) {
	return (rr - r) * (rr - r) + (gg - g) * (gg - g) + (bb - b) * (bb - b);
}