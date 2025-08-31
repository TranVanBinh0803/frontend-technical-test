import type { SortingState } from '@tanstack/react-table'

export type Person = {
  id: string
  name: string
  language: string
  bio: string
  version: number
}


let cacheData: Person[] ;

const apiEnp = async (): Promise<Person[]> => {
  if (cacheData) return cacheData; 
  const res = await fetch("https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json");
  if (!res.ok) throw new Error("Failed to fetch data");
  cacheData = await res.json();
  return cacheData;
};

export const fetchData = async (
  start: number,
  size: number,
  sorting: SortingState
) => {
  const dbData = await apiEnp();

  if (sorting.length) {
    const { id, desc } = sorting[0] as { id: keyof Person; desc: boolean };
    dbData.sort((a, b) => (a[id] > b[id] ? 1 : -1) * (desc ? -1 : 1));
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  };
};