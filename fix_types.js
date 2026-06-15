const fs = require('fs');

let content = fs.readFileSync('app/(main)/messages/page.tsx', 'utf8');

// Fix `activeContact` used before declaration
content = content.replace(
  "  const { profile, role, department } = useAuth()\n  const [activeContact, setActiveContact] = useState<any | null>(null)\n  const { contacts: realContacts, isLoading: isContactsLoading } = useContacts(profile?.id, role, department, false)\n  const { messages: realMessages, sendMessage: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role, department)",
  `  const { profile, role, department } = useAuth()
  const [activeContact, setActiveContact] = useState<any | null>(null)
  const { contacts: realContacts, isLoading: isContactsLoading } = useContacts(profile?.id, role as any, department, false)
  const { messages: realMessages, send: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role as any, department)`
);

// We need to remove the duplicate `activeContact` declaration that might still exist if my previous replace failed
content = content.replace(
  "  const [activeContact, setActiveContact] = useState<any | null>(null)\n  const [message, setMessage] = useState('')",
  "  // activeContact moved up\n  const [message, setMessage] = useState('')"
);

// Fix sending message to use `sendRealMessage(msgText, false)` instead of `sendRealMessage(msgText, activeContact.raw?.role || activeContact.role.toLowerCase(), false)`
// useMessages `send` signature: `(content: string, isCrossDept?: boolean)`
content = content.replace(
  "await sendRealMessage(msgText, activeContact.raw?.role || activeContact.role.toLowerCase(), false)",
  "await sendRealMessage(msgText, false)"
);

fs.writeFileSync('app/(main)/messages/page.tsx', content, 'utf8');
console.log('Fixed typings in page.tsx');
