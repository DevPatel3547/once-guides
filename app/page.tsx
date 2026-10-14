import Workspace from '@/components/workspace';
import {env} from 'cloudflare:workers';
export default function Page(){return <Workspace sharingEnabled={!!env.DB&&!!env.BUCKET}/>;}
