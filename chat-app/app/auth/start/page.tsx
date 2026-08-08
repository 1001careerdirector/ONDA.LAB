import AuthRedirect from "./auth-redirect";

const providers = ["google", "kakao", "naver"] as const;
const personas = ["onda", "ongyeol", "baegilmong"] as const;

type Provider = (typeof providers)[number];
type Persona = (typeof personas)[number];

export default async function AuthStartPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; persona?: string }>;
}) {
  const params = await searchParams;
  const provider = providers.includes(params.provider as Provider) ? (params.provider as Provider) : "google";
  const persona = personas.includes(params.persona as Persona) ? (params.persona as Persona) : "onda";

  return <AuthRedirect provider={provider} persona={persona} />;
}
