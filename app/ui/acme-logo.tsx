import { BeakerIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <div>
        <BeakerIcon className="mr-8 h-14 w-14 rotate-[15deg]" />
      </div>
      <p className="text-[44px]">Cat Lab</p>
    </div>
  );
}
