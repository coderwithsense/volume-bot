import { useRouter } from 'next/router';

const BotSlug = () => {
  const router = useRouter();
  return (
    <div>{router.query.slug}</div>
  )
}

export default BotSlug