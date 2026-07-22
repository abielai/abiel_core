import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/validate');
  return null;
}
