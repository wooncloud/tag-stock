'use client';

import { Button } from '@/components/ui/button';

export function BackButton() {
  const handleBack = () => {
    // 이전 페이지 기록이 있으면 뒤로 가고, 없으면 홈으로 이동
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Button variant="ghost" className="cursor-pointer" onClick={handleBack}>
      이전 페이지로 돌아가기
    </Button>
  );
}
