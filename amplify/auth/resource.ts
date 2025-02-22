import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    birthdate: {
      mutable: true,
      required: false,
    },
    nickname: {
      mutable: true,
      required: false,
    },
    address: {
      mutable: true,
      required: false,
    },
    "custom:layout_rows": {
      dataType: "Number",
      mutable: true,
      min: 1,
      max: 10000,
    },
    "custom:layout_cols": {
      dataType: "Number",
      mutable: true,
      min: 1,
      max: 10000,
    },
    "custom:supermarket_name": {
      dataType: "String",
      mutable: true,
    },
  },
});
