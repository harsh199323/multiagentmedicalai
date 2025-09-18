import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { gt, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const cursor = searchParams.get('cursor');
    
    let query = db.select().from(reports).orderBy(desc(reports.id));
    
    if (cursor) {
      const cursorId = parseInt(cursor);
      if (isNaN(cursorId)) {
        return NextResponse.json({ 
          error: "Invalid cursor format",
          code: "INVALID_CURSOR" 
        }, { status: 400 });
      }
      query = query.where(gt(reports.id, cursorId));
    }
    
    const items = await query.limit(limit);
    
    const response: { items: any[], nextCursor?: number } = { items };
    
    if (items.length === limit) {
      response.nextCursor = items[items.length - 1].id;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'DATABASE_ERROR' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_info, agent_results, summary, title } = body;
    
    if (!patient_info || typeof patient_info !== 'string' || patient_info.trim() === '') {
      return NextResponse.json({ 
        error: "Patient info is required and must be a non-empty string",
        code: "MISSING_PATIENT_INFO" 
      }, { status: 400 });
    }
    
    if (!agent_results || !Array.isArray(agent_results)) {
      return NextResponse.json({ 
        error: "Agent results is required and must be an array",
        code: "MISSING_AGENT_RESULTS" 
      }, { status: 400 });
    }
    
    if (!summary || typeof summary !== 'string' || summary.trim() === '') {
      return NextResponse.json({ 
        error: "Summary is required and must be a non-empty string",
        code: "MISSING_SUMMARY" 
      }, { status: 400 });
    }
    
    const currentTime = Date.now();
    const newReport = await db.insert(reports)
      .values({
        patientInfo: patient_info.trim(),
        agentResults: JSON.stringify(agent_results),
        summary: summary.trim(),
        title: title ? title.trim() : null,
        createdAt: currentTime,
        updatedAt: currentTime
      })
      .returning();
    
    return NextResponse.json(newReport[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'DATABASE_ERROR' 
    }, { status: 500 });
  }
}