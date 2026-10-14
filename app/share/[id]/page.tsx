import SharedGuide from '@/components/shared-guide';
export const metadata={title:'Shared guide — Once',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <SharedGuide id={id}/>;}
