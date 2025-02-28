import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Supermarket: a
    .model({
      owner: a.string().required(), // user.sub
      name: a.string().required(),
      address: a.string().required(),
      layout: a.json().required(),
      products: a.hasMany("Product", "supermarketID"),
    })
    .authorization((allow) => [allow.owner()]),

  Product: a
    .model({
      title: a.string().required(),
      price: a.float().required(),
      category: a.string().required(),
      description: a.string().required(),
      image: a.string().required(),
      supermarketID: a.id().required(),
      supermarket: a.belongsTo("Supermarket", "supermarketID"),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
