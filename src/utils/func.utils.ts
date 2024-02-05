import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';

export function objectArrayToView<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options?: ClassTransformOptions,
): T[] {
  if (plain) {
    plain.forEach((item) => {
      Object.keys(item).forEach((keysItem) => {
        if (item[keysItem] === null || item[keysItem] === undefined)
          delete item[keysItem];
      });
    });
  }
  return plainToClass<T, V>(cls, plain, options);
}

export function objectToView<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T {
  if (plain) {
    Object.keys(plain).forEach((keysItem) => {
      if (plain[keysItem] === null || plain[keysItem] === undefined)
        delete plain[keysItem];
    });
  }
  return plainToClass<T, V>(cls, plain, options);
}

export function getAllIndexOfTerm(text: string, term: string): Array<number> {
  const a: Array<number> = [];
  let i = -1;
  while ((i = text.indexOf(term, i + 1)) >= 0) a.push(i);

  return a;
}
