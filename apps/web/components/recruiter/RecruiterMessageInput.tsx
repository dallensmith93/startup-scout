export default function RecruiterMessageInput({ message, onChange }: { message: string; onChange: (v: string) => void }) {
  return (
    <label>Recruiter message
      <textarea rows={9} value={message} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
