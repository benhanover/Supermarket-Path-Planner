import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Supermarket: a
    .model({
      owner: a.string(),
      name: a.string(),
      address: a.string(),
      layout: a.hasOne("Layout", "supermarketID"),
      products: a.hasMany("Product", "supermarketID"),
    })
    .authorization((allow) => [allow.owner()]),

  Layout: a
    .model({
      rows: a.integer().required(),
      cols: a.integer().required(),
      squares: a.hasMany("Square", "layoutID"),
      supermarketID: a.id(),
      supermarket: a.belongsTo("Supermarket", "supermarketID"),
    })
    .authorization((allow) => [allow.owner()]),

  Square: a
    .model({
      type: a.enum(["empty", "products", "cash_register", "entrance", "exit"]),
      row: a.integer().required(),
      col: a.integer().required(),
      layoutID: a.id().required(),
      layout: a.belongsTo("Layout", "layoutID"),
      products: a.hasMany("Product", "squareID"),
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
      squareID: a.id(),
      square: a.belongsTo("Square", "squareID"),
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
