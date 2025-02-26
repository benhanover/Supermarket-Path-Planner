import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Supermarket: a
    .model({
      owner: a.string(), // user.sub
      name: a.string(),
      address: a.string(),
      layout: a.json().required(), // Stores layout with product IDs
      products: a.hasMany("Product", "supermarketID"),
    })
    .authorization((allow) => [allow.owner()]),

  Product: a
    .model({
      title: a.string(),
      price: a.float(),
      category: a.string(),
      description: a.string(),
      image: a.string(),
      rating: a.json(),
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
