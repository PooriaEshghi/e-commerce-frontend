import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shopImage'
})
export class ShopImagePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (value == null || value.trim() === '') {
      return 'assets/images/products/placeholder.png';
    }

    const slashed = value.trim().replace(/\\/g, '/');
    const lower = slashed.toLowerCase();
    const remote = lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:');
    if (!remote) {
      const assetsAt = lower.indexOf('assets/');
      if (assetsAt >= 0) {
        return slashed.substring(assetsAt);
      }
      if (lower.startsWith('file:') || /^[a-z]:\//.test(lower)) {
        return 'assets/images/products/placeholder.png';
      }
    }
    return slashed;
  }
}
