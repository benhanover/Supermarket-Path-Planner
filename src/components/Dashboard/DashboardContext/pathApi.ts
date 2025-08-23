import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";

export async function persistPathData(
  supermarketId: string,
  pathData: unknown
) {
  const client = generateClient<Schema>();
  await client.models.Supermarket.update({
    id: supermarketId,
    pathData: JSON.stringify(pathData),
  });
}
