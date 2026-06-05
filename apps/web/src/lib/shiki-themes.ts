import type { ThemeRegistration } from 'shiki'

// Portfolio light theme (Plantation)
// Uses exact values from :root in globals.css
// --background: #fdf9ed  --foreground: #11221f
// --plantation: #366B5E  --muted-foreground: #71717a  --border: #e4dfcf
// --muted: #f3eedf
export const portfolioLight: ThemeRegistration = {
  name: 'portfolio-light',
  type: 'light',
  colors: {
    'editor.background': '#fdf9ed',
    'editor.foreground': '#11221f',
    'editorLineNumber.foreground': '#71717a',
  },
  settings: [
    { settings: { foreground: '#11221f' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#71717a', fontStyle: 'italic' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#366B5E' } },
    { scope: ['keyword', 'storage.type', 'storage.modifier'], settings: { foreground: '#11221f', fontStyle: 'bold' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#366B5E' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: '#11221f' } },
    { scope: ['variable', 'variable.parameter', 'variable.other'], settings: { foreground: '#11221f' } },
    { scope: ['constant.numeric'], settings: { foreground: '#366B5E' } },
    { scope: ['constant.language', 'constant.other'], settings: { foreground: '#366B5E', fontStyle: 'italic' } },
    { scope: ['keyword.operator'], settings: { foreground: '#71717a' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#71717a' } },
    { scope: ['entity.name.tag'], settings: { foreground: '#366B5E' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#11221f', fontStyle: 'italic' } },
    { scope: ['support.type.property-name'], settings: { foreground: '#11221f' } },
    { scope: ['support.constant.property-value', 'meta.property-value'], settings: { foreground: '#366B5E' } },
    { scope: ['keyword.control.import', 'keyword.control.from', 'keyword.control.export'], settings: { foreground: '#71717a' } },
  ],
}

// Portfolio dark theme (Night)
// Uses exact values from .dark in globals.css
// --background: #0c0e0a  --foreground: #ECDFCC
// --plantation: #5FA28F  --muted-foreground: #697565  --border: #1e201b
// --muted: #161814
export const portfolioDark: ThemeRegistration = {
  name: 'portfolio-dark',
  type: 'dark',
  colors: {
    'editor.background': '#0c0e0a',
    'editor.foreground': '#ECDFCC',
    'editorLineNumber.foreground': '#697565',
  },
  settings: [
    { settings: { foreground: '#ECDFCC' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#697565', fontStyle: 'italic' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#5FA28F' } },
    { scope: ['keyword', 'storage.type', 'storage.modifier'], settings: { foreground: '#ECDFCC', fontStyle: 'bold' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#5FA28F' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: '#ECDFCC' } },
    { scope: ['variable', 'variable.parameter', 'variable.other'], settings: { foreground: '#ECDFCC' } },
    { scope: ['constant.numeric'], settings: { foreground: '#5FA28F' } },
    { scope: ['constant.language', 'constant.other'], settings: { foreground: '#5FA28F', fontStyle: 'italic' } },
    { scope: ['keyword.operator'], settings: { foreground: '#697565' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#697565' } },
    { scope: ['entity.name.tag'], settings: { foreground: '#5FA28F' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#ECDFCC', fontStyle: 'italic' } },
    { scope: ['support.type.property-name'], settings: { foreground: '#ECDFCC' } },
    { scope: ['support.constant.property-value', 'meta.property-value'], settings: { foreground: '#5FA28F' } },
    { scope: ['keyword.control.import', 'keyword.control.from', 'keyword.control.export'], settings: { foreground: '#697565' } },
  ],
}
