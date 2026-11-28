import { Pipe, PipeTransform } from '@angular/core';

export interface RichSegment {
  text: string;
  bold: boolean;
}

/**
 * Découpe un texte contenant du gras façon Markdown (**ainsi**) en segments,
 * rendus dans le template avec <strong> — sans innerHTML.
 *   'Paghi **a servizio eseguito**.' → [{ 'Paghi ' }, { 'a servizio eseguito', bold }, { '.' }]
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
