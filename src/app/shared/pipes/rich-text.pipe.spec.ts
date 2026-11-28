import { RichTextPipe } from './rich-text.pipe';

describe('RichTextPipe', () => {
  const pipe = new RichTextPipe();

  it('découpe le gras en segments', () => {
    expect(pipe.transform('Paghi **a servizio eseguito**.')).toEqual([
      { text: 'Paghi ', bold: false },
      { text: 'a servizio eseguito', bold: true },
      { text: '.', bold: false },
    ]);
  });

  it('gère le texte sans gras et les valeurs vides', () => {
    expect(pipe.transform('Testo semplice')).toEqual([{ text: 'Testo semplice', bold: false }]);
    expect(pipe.transform(null)).toEqual([]);
  });
});
