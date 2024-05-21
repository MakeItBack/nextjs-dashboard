'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); //
  const pathname = usePathname();
  const { replace } = useRouter();

  // Function to process changes to the input field (search box)
  // Wrap the function in useDebouncedCallback to implement Debouncing with a wait timer of 750ms
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    // create a new URLSearchParams instance using searchParams
    const params = new URLSearchParams(searchParams);

    // Now update the params based on the search term
    if (term) {
      // if the search term exists (not empty) then update the varaps variable with the value
      params.set('query', term);
    } else {
      // If the search term is falsy (empty string) delete what's in params
      params.delete('query');
    }
    // Update the URL with the updated params
    replace(`${pathname}?${params.toString()}`);
  }, 750);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          // Fire and event whenever the input changes and send the new value to the handleSearch function
          handleSearch(e.target.value);
        }}
        // Keep the search field in sync with the URL
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
