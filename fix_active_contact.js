const fs = require('fs');

let content = fs.readFileSync('app/(main)/messages/page.tsx', 'utf8');

// The incorrect part:
const badPart = `  const { profile, role, department } = useAuth()
  // activeContact moved up
  const { contacts: realContacts, isLoading: isContactsLoading } = useContacts(profile?.id, role, department, false)
  const { messages: realMessages, sendMessage: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role, department)

  const [contacts, setContacts] = useState<any[]>(initialContacts)
  // activeContact moved up
  const [message, setMessage] = useState('')`;

const correctPart = `  const { profile, role, department } = useAuth()
  const [activeContact, setActiveContact] = useState<any | null>(null)
  const { contacts: realContacts, isLoading: isContactsLoading } = useContacts(profile?.id, role as any, department, false)
  const { messages: realMessages, send: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role as any, department)

  const [contacts, setContacts] = useState<any[]>(initialContacts)
  const [message, setMessage] = useState('')`;

content = content.replace(badPart, correctPart);

fs.writeFileSync('app/(main)/messages/page.tsx', content, 'utf8');
console.log('Fixed the activeContact missing error');
