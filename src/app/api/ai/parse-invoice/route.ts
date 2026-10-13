import { NextRequest, NextResponse } from 'next/server';
import { parseChatLogToInvoice } from '@/lib/ai-parser';
import { z } from 'zod';

const RequestSchema = z.object({
  text: z.string().min(5, 'Chat log text must be at least 5 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedRequest = RequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: ' + parsedRequest.error.issues.map((i) => i.message).join(', '),
        },
        { status: 400 }
      );
    }

    const result = parseChatLogToInvoice(parsedRequest.data.text);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        timestamp: new Date().toISOString(),
        zodSchemaValidated: true,
        version: '1.0.0',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error while parsing invoice items',
      },
      { status: 500 }
    );
  }
}
