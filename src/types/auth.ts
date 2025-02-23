export type FormField = {
  label: string;
  placeholder: string;
  required: boolean;
};

export type FormFields = {
  signUp: {
    address: FormField;
    [key: `custom:${string}`]: FormField;
  };
};
