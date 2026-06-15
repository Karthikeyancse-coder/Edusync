const fs = require('fs');

let content = fs.readFileSync('old_messages_utf8.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { Skeleton } from '@/components/ui/Skeleton'",
  `import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/providers/AuthProvider'
import { useContacts } from '@/hooks/useContacts'
import { useMessages } from '@/hooks/useMessages'`
);

// 2. Add hook usages
content = content.replace(
  "export default function Messages() {",
  `export default function Messages() {
  const { profile, role, department } = useAuth()
  const [activeContact, setActiveContact] = useState<any | null>(null)
  const { contacts: realContacts, isLoading: isContactsLoading } = useContacts(profile?.id, role, department, false)
  const { messages: realMessages, sendMessage: sendRealMessage } = useMessages(profile?.id, activeContact?.id, role, department)
`
);

// Remove the old setActiveContact state declaration since we moved it above
content = content.replace(
  "const [activeContact, setActiveContact] = useState<any | null>(null)",
  "// activeContact moved up"
);

// 3. Add effect to sync real contacts
const contactsEffect = `
  useEffect(() => {
    if (realContacts.length > 0) {
      setContacts(realContacts.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role.charAt(0).toUpperCase() + c.role.slice(1),
        lastMessage: c.lastMessage || 'No recent messages',
        time: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread: c.unread || 0,
        avatar: c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        raw: c
      })))
    }
  }, [realContacts])
`;

// 4. Add effect to sync real messages
const messagesEffect = `
  useEffect(() => {
    if (activeContact) {
      setChatMessages(realMessages.map(m => ({
        id: m.id,
        senderId: m.sender_id === profile?.id ? 'me' : m.sender_id,
        text: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: m.sender_id === profile?.id,
        image: null,
        images: m.attachments?.map((a: any) => a.file_url) || null,
        isAudio: false,
        status: m.status,
        approvalStatus: m.status.startsWith('pending') ? m.status : null,
        raw: m
      })))
    } else {
      setChatMessages([])
    }
  }, [realMessages, profile?.id, activeContact])
`;

content = content.replace(
  "const [chatMessages, setChatMessages] = useState<any[]>(initialMessages)",
  `const [chatMessages, setChatMessages] = useState<any[]>(initialMessages)
${contactsEffect}
${messagesEffect}`
);

// 5. Replace handleSend
const handleSendReplacement = `
  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0 && !isRecording) return
    if (!activeContact) return

    if (editingMessage) {
      setChatMessages(prev => prev.map(m => 
        m.id === editingMessage.id 
          ? { ...m, text: message, isEdited: true } 
          : m
      ))
      setEditingMessage(null)
      setMessage('')
      return
    }

    const msgText = isRecording ? 'Audio Message' : message
    try {
      await sendRealMessage(msgText, activeContact.raw?.role || activeContact.role.toLowerCase(), false)
      setMessage('')
      setAttachments([])
      setIsRecording(false)
      setReplyingTo(null)
    } catch (err: any) {
      console.error("Failed to send message", err)
      alert("Failed to send message: " + err.message)
    }
  }
`;

content = content.replace(
  /const handleSend = \(\) => {[\s\S]*?setReplyingTo\(null\)\n  }/,
  handleSendReplacement.trim()
);

// 6. Fix `c.id === id` type comparisons in contacts since contacts now use UUID strings
// In original UI, contact.id was a number. We need to make sure we don't break string/number expectations where possible, but `id` is now a string from Supabase.
// Where it does `pinnedChatIds.includes(contact.id)`, `pinnedChatIds` should probably handle strings.
content = content.replace(/useState<number\[\]>\(\[\]\)/g, "useState<any[]>([])");
content = content.replace(/useState<Record<number, string>>\({}\)/g, "useState<Record<string, string>>({})");
content = content.replace(/useState<Record<number, number>>\({}\)/g, "useState<Record<string, number>>({})");
content = content.replace(/id: number/g, "id: any");

// Save to the actual page.tsx
fs.writeFileSync('app/(main)/messages/page.tsx', content, 'utf8');
console.log('Successfully injected real data into old UI');
