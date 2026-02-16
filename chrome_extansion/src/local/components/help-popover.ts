const helpIcon = document.getElementById('helpIcon')!;
const helpPopover = document.getElementById('helpPopover')!;

export function initHelpPopover(): void {
  helpIcon.addEventListener('mouseenter', () => {
    helpPopover.classList.remove('hidden');
  });

  helpIcon.addEventListener('mouseleave', () => {
    helpPopover.classList.add('hidden');
  });

  // Keep popover open when hovering over it
  helpPopover.addEventListener('mouseenter', () => {
    helpPopover.classList.remove('hidden');
  });

  helpPopover.addEventListener('mouseleave', () => {
    helpPopover.classList.add('hidden');
  });
}
