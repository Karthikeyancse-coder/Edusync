const fs = require('fs');

let content = fs.readFileSync('app/(main)/messages/page.tsx', 'utf8');

const badLine = `  const { messages: realMessages, send: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role as any, department)`;
const correctLine = `  const { messages: realMessages, send: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role as any, (activeContact?.raw?.role || activeContact?.role?.toLowerCase() || null) as any)`;

content = content.replace(badLine, correctLine);

fs.writeFileSync('app/(main)/messages/page.tsx', content, 'utf8');
console.log('Fixed receiverRole passing');
