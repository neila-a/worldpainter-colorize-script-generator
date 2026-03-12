/**
 * squared distance between two color values.  
 * #### TODO 
 * - change to better color format.
 */
export default function distanceBetween(r: number, g: number, b: number, rr: number, gg: number, bb: number) {
    return (rr - r) * (rr - r) + (gg - g) * (gg - g) + (bb - b) * (bb - b);
}
