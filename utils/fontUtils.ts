import opentype from 'opentype.js';

export interface FontAxis {
  tag: string;
  name: string;
  minValue: number;
  defaultValue: number;
  maxValue: number;
}

/**
 * Parses a font file (ArrayBuffer) and returns its variable axes if present.
 */
export async function parseFontAxes(arrayBuffer: ArrayBuffer, fontName?: string): Promise<FontAxis[]> {
  // Fallback for StickyVariable since opentype.js doesn't support WOFF2
  if (fontName === 'StickyVariable') {
    return [
      { tag: 'wght', name: 'Weight', minValue: 51, defaultValue: 80, maxValue: 111 },
      { tag: 'ital', name: 'Italic', minValue: -7, defaultValue: 0, maxValue: 9 }
    ];
  }

  try {
    const font = opentype.parse(arrayBuffer);
    if (!font.tables.fvar || !font.tables.fvar.axes) {
      return [];
    }
    
    return font.tables.fvar.axes.map((axis: any) => ({
      tag: axis.tag,
      name: axis.name?.en || axis.tag,
      minValue: axis.minValue,
      defaultValue: axis.defaultValue,
      maxValue: axis.maxValue
    }));
  } catch (error) {
    console.error('Error parsing font axes:', error);
    // Even if parsing fails, if it's our known font, return the fallback
    if (fontName === 'StickyVariable') {
       return [
        { tag: 'wght', name: 'Weight', minValue: 51, defaultValue: 80, maxValue: 111 },
        { tag: 'ital', name: 'Italic', minValue: -7, defaultValue: 0, maxValue: 9 }
      ];
    }
    return [];
  }
}

/**
 * Registers a font in the browser using the FontFace API.
 * Pass descriptors to declare the weight range and style (required for variable fonts).
 */
export async function registerFont(
  fontName: string,
  arrayBuffer: ArrayBuffer,
  descriptors?: FontFaceDescriptors
): Promise<boolean> {
  try {
    const fontFace = new FontFace(fontName, arrayBuffer, descriptors);
    const loadedFace = await fontFace.load();
    document.fonts.add(loadedFace);
    return true;
  } catch (error) {
    console.error('Error registering font:', error);
    return false;
  }
}

/**
 * Helper to fetch a font from a URL and return it as an ArrayBuffer.
 */
export async function fetchFontAsBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font from ${url}`);
  return await response.arrayBuffer();
}
