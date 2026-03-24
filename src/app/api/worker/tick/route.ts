import { NextResponse } from 'next/server';
import { runExecutionTick } from '@/lib/worker/engine';

export async function GET() {
  const result = await runExecutionTick();
  return NextResponse.json(result);
}

// Allow POST as well for manual triggers from UI
export async function POST() {
  const result = await runExecutionTick();
  return NextResponse.json(result);
}
