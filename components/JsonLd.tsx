import React from 'react';

// JsonLd: injects a JSON-LD script tag with static, hardcoded schema payloads.
// All content passed here must be pre-serialized developer-controlled strings only.
export function JsonLd({ schema }: { schema: string }) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}
