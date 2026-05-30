import html2canvas from 'html2canvas';

export async function captureAndShare(elementId: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fff9f0',
  });

  const dataUrl = canvas.toDataURL('image/png');

  if (navigator.share && navigator.canShare) {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'zoo-bingo.png', { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'どうぶつえんビンゴ' });
      return;
    }
  }

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'zoo-bingo.png';
  a.click();
}
