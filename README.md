# reForm

The only form validation library you will ever need!

# Getting started

```shell
npm i @code-is-key/reform
```

# Guide

reForm uses a `yup` object to validate the input of a form element.
Pass in a FormState type to the hook that matches the inputs you want to connect.

reform uses the html `name` tag to automatically bind the input to the typecheck

```tsx
interface FormState {
  email: string;
}

const Component: FC = () => {
  const { errors, values, onChange } = useForm<FormState>({ schema });

  return (
    <FormControl isInvalid={!!errors.email}>
      <FormLabel>Email</FormLabel>
      <Input name="email" type="email" onChange={onChange} value={values.email} />
      <FormErrorMessage>{errors.email}</FormErrorMessage>
    </FormControl>
  );
};
```
