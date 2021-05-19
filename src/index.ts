import { ChangeEvent, useState } from 'react';
import { ValidationError, ObjectSchema } from 'yup';

type SchemaShape<T> = {
  [key in keyof T]: any;
};

export type ErrorObject<T> = {
  [key in keyof T]: string[];
};

interface FormProperties<T> {
  schema: ObjectSchema<SchemaShape<T>>;
}

/**
 * Form controller
 *
 * @example
 *  const { errors, values, onChange } = useForm<FormState>({ schema });
 *
 *  <FormControl isInvalid={!!errors.email} value={values.email} onChange={onChange}>
 *     <FormLabel>Email</FormLabel>
 *       <Input name="email" type="email" />
 *     <FormErrorMessage>{errors.email}</FormErrorMessage>
 *   </FormControl>
 *
 * the onChange function uses the name property on the input to bind the correct value
 * @param object
 * @returns
 */
export const useForm = <T>(properties?: FormProperties<T>) => {
  const [values, setFormValues] = useState<T>({} as T);
  const [errors, setFormErrors] = useState<T>({} as T);
  const [messages, setMessages] = useState<string>('');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.getAttribute('name') as keyof T;

    setFormValues({ ...values, [name]: event.target.value });
    setFormErrors({ ...errors, [name]: '' });
    setMessages('');
  };

  const onSubmit = (callback: () => void) => () => {
    try {
      properties?.schema.validateSync(values, { abortEarly: false });
    } catch (error) {
      const errors = yupErrorToErrorObject<T>(error);
      setFormErrors(errors as any);
      return;
    }

    // handle errors throw here from messages - figure out a good pattern
    callback();
  };

  return {
    errors,
    values,
    messages,
    onChange,
    onSubmit,
    setMessages,
  };
};

/**
 * Convert yup error into an error object where the keys are the fields and the values are the errors for that field
 * @param {ValidationError} err The yup error to convert
 * @returns {ErrorObject} The error object
 */
export function yupErrorToErrorObject<T>(err: ValidationError): ErrorObject<T> {
  const object = {} as ErrorObject<T>;

  err.inner.forEach((x: any) => {
    if (x.path !== undefined) {
      object[x.path as keyof T] = x.errors;
    }
  });

  return object as ErrorObject<T>;
}
