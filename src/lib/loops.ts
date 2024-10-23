import { LOOPS_API_KEY } from '$env/static/private';
import { LoopsClient } from 'loops';

export const loops = new LoopsClient(LOOPS_API_KEY);
