export function getObjectPathValue<T>(obj: any, path: string, pathSeparator: string = '.'): T | undefined {
  const parts = path.split(pathSeparator);
  let result = obj;

  while (parts.length > 0 && typeof result === 'object') {
    const part = parts.shift();
    if (part !== undefined) {
      result = result[part];
    } else {
      return undefined;
    }
  }

  return result === obj ? undefined : result;
}
