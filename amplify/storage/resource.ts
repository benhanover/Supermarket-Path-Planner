import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'productImages',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read'])
    ],
  })
});