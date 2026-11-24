import { Pipe, PipeTransform } from '@angular/core';

export interface RichSegment {
  text: string;
  bold: boolean;
}

/**
 * Divide un testo con grassetti in stile Markdown (**così**) in segmenti,
 * da rendere nel template con <strong> — senza innerHTML.
 *   'Paghi solo **a servizio eseguito**.' → [{ 'Paghi solo ' }, { 'a servizio eseguito', bold }, { '.' }]
 */
@Pipe({ name: 'rich' })
export class RichTextPipe implements PipeTransform {
  transform(value: string | null | undefined): RichSegment[] {
    return (value ?? '')
      .split('**')
      .map((text, index) => ({ text, bold: index % 2 === 1 }))
      .filter((segment) => segment.text.length > 0);
  }
}
