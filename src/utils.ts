import { ValueTransformer } from 'typeorm';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null || obj === '';
}

export class ColumnNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }

    return null;
  }

  from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);

      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }

    return null;
  }
}

export class ColumnDateTransformer implements ValueTransformer {
  from(data?: Date | null): string | null {
    console.log('from: ', data);
    if (!isNullOrUndefined(data)) {
      return typeof data === 'string' ? data : data.toISOString();
    }

    return null;
  }

  to(data?: string | null): Date | null {
    console.log('to: ', data);
    if (!isNullOrUndefined(data)) {
      console.log('NotNullOrUndefined: ', data);
      return new Date(data);
    }

    return null;
  }
}
