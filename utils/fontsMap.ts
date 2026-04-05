export interface FontStyle {
  name: string;
  url: string;
}

export interface FontFamily {
  family: string;
  styles: FontStyle[];
}

export const FONTS_MAP: FontFamily[] = [
  {
    family: 'Dafna',
    styles: [
      { name: 'Regular', url: '/assets/fonts/Dafna-Regular.otf' },
      { name: 'Italic', url: '/assets/fonts/Dafna-Italic.otf' },
      { name: 'Light', url: '/assets/fonts/Dafna-Light.otf' },
      { name: 'Light Italic', url: '/assets/fonts/Dafna-LightItalic.otf' },
      { name: 'Medium', url: '/assets/fonts/Dafna-Medium.otf' },
      { name: 'Medium Italic', url: '/assets/fonts/Dafna-MediumItalic.otf' },
      { name: 'Bold', url: '/assets/fonts/Dafna-Bold.otf' },
      { name: 'Bold Italic', url: '/assets/fonts/Dafna-BoldItalic.otf' },
      { name: 'Black', url: '/assets/fonts/Dafna-Black.otf' },
      { name: 'Black Italic', url: '/assets/fonts/Dafna-BlackItalic.otf' },
    ]
  },
  {
    family: 'Monoklass',
    styles: [
      { name: 'Regular', url: '/assets/fonts/Monoklass-Regular.otf' },
      { name: 'Italic', url: '/assets/fonts/Monoklass-Italic.otf' },
      { name: 'Light', url: '/assets/fonts/Monoklass-Light.otf' },
      { name: 'Light Italic', url: '/assets/fonts/Monoklass-LightItalic.otf' },
      { name: 'Medium', url: '/assets/fonts/Monoklass-Medium.otf' },
      { name: 'Medium Italic', url: '/assets/fonts/Monoklass-MediumItalic.otf' },
      { name: 'Bold', url: '/assets/fonts/Monoklass-Bold.otf' },
      { name: 'Bold Italic', url: '/assets/fonts/Monoklass-BoldItalic.otf' },
    ]
  },
  {
    family: 'Neoklass',
    styles: [
      { name: 'Regular', url: '/assets/fonts/Neoklass-Regular.woff2' },
      { name: 'Italic', url: '/assets/fonts/Neoklass-Italic.woff2' },
      { name: 'Thin', url: '/assets/fonts/Neoklass-Thin.woff2' },
      { name: 'Thin Italic', url: '/assets/fonts/Neoklass-ThinItalic.woff2' },
      { name: 'Light', url: '/assets/fonts/Neoklass-Light.woff2' },
      { name: 'Light Italic', url: '/assets/fonts/Neoklass-LightItalic.woff2' },
      { name: 'Medium', url: '/assets/fonts/Neoklass-Medium.woff2' },
      { name: 'Medium Italic', url: '/assets/fonts/Neoklass-MediumItalic.woff2' },
      { name: 'Bold', url: '/assets/fonts/Neoklass-Bold.woff2' },
      { name: 'Bold Italic', url: '/assets/fonts/Neoklass-BoldItalic.woff2' },
      { name: 'Black', url: '/assets/fonts/Neoklass-Black.woff2' },
      { name: 'Black Italic', url: '/assets/fonts/Neoklass-BlackItalic.woff2' },
    ]
  },

  {
    family: 'Sticky',
    styles: [
      { name: 'Regular', url: '/assets/fonts/Sticky-Regular.otf' },
      { name: 'Italic', url: '/assets/fonts/Sticky-Italic.otf' },
      { name: 'Backslant', url: '/assets/fonts/Sticky-Backslant.otf' },
      { name: 'Medium', url: '/assets/fonts/Sticky-Medium.otf' },
      { name: 'Medium Italic', url: '/assets/fonts/Sticky-MediumItalic.otf' },
      { name: 'Medium Backslant', url: '/assets/fonts/Sticky-MediumBackslant.otf' },
      { name: 'Bold', url: '/assets/fonts/Sticky-Bold.otf' },
      { name: 'Bold Italic', url: '/assets/fonts/Sticky-BoldItalic.otf' },
      { name: 'Bold Backslant', url: '/assets/fonts/Sticky-BoldBackslant.otf' },
      { name: 'Variable', url: '/assets/fonts/Sticky-Variable.woff2' },
    ]
  },
  {
    family: 'Wilson',
    styles: [
      { name: 'Regular', url: '/assets/fonts/Wilson-Regular.otf' }
    ]
  },
  {
    family: 'Olivia Display',
    styles: [
      { name: 'Regular', url: '/assets/fonts/olivia-display-regular.woff2' },
      { name: 'Thin', url: '/assets/fonts/olivia-display-thin.woff2' },
      { name: 'Light', url: '/assets/fonts/olivia-display-light.woff2' },
      { name: 'Medium', url: '/assets/fonts/olivia-display-medium.woff2' },
      { name: 'Demibold', url: '/assets/fonts/olivia-display-demibold.woff2' },
      { name: 'Bold', url: '/assets/fonts/olivia-display-bold.woff2' },
      { name: 'Ultrabold', url: '/assets/fonts/olivia-display-ultrabold.woff2' },
    ]
  },
  {
    family: 'Olivia Text',
    styles: [
      { name: 'Regular', url: '/assets/fonts/olivia-text-regular.woff2' },
      { name: 'Light', url: '/assets/fonts/olivia-text-light.woff2' },
      { name: 'Medium', url: '/assets/fonts/olivia-text-medium.woff2' },
      { name: 'Demibold', url: '/assets/fonts/olivia-text-demibold.woff2' },
      { name: 'Bold', url: '/assets/fonts/olivia-text-bold.woff2' },
    ]
  }
];
