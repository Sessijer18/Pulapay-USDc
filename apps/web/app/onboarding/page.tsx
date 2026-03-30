'use client';

import { useRouter } from 'next/navigation';
import { OnboardingCarousel } from '../../components/carousel';

export default function OnboardingPage() {
  const router = useRouter();

  function handleComplete() {
    // Mark onboarding as seen, then redirect to auth
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulapay_onboarded', '1');
    }
    router.push('/auth');
  }

  return <OnboardingCarousel onComplete={handleComplete} />;
}
