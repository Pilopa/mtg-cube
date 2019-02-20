import { from } from 'rxjs';

export function blob2ImageUrl(image: Blob) {
  return from(new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
       resolve(reader.result as string);
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
  }));
}
