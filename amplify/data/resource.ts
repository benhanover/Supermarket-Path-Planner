import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Supermarket: a
    .model({
      owner: a.string().required(), // user.sub
      name: a.string().required(),
      address: a.string().required(),
      layout: a.json().required(),
      products: a.hasMany("Product", "supermarketID"),
      shoppingLists: a.hasMany("ShoppingList", "supermarketID"),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(["read"])]),

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
    .authorization((allow) => [allow.owner(), allow.authenticated().to(["read"])]),

  ShoppingList: a
    .model({
      name: a.string().required(),
      owner: a.string().required(), // user.sub
      productIDs: a.json().required(), // Array of product IDs as JSON string
      supermarketID: a.id().required(),
      supermarket: a.belongsTo("Supermarket", "supermarketID"),
      createdAt: a.datetime(),
      completedAt: a.datetime(),
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