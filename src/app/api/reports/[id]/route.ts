import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const report = await db.select()
      .from(reports)
      .where(eq(reports.id, parseInt(id)))
      .limit(1);
    
    if (report.length === 0) {
      return NextResponse.json({ 
        error: "Report not found",
        code: "NOT_FOUND" 
      }, { status: 404 });
    }
    
    return NextResponse.json(report[0]);
  } catch (error) {
    console.error('GET report error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const deleted = await db.delete(reports)
      .where(eq(reports.id, parseInt(id)))
      .returning();
    
    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: "Report not found",
        code: "NOT_FOUND" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE report error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}